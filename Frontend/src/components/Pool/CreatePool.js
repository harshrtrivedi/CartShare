import React, { Component } from 'react'
import '../../App.css'
// import './AddStore.css'
import axios from 'axios'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import { Field, reduxForm } from 'redux-form'
import ROOT_URL from '../../constants.js'

import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

// Define a Login Component
class CreatePool extends Component {
    // call the constructor method
    constructor(props) {
        // Call the constrictor of Super class i.e The Component
        super(props) // maintain the state required for this component
        this.state = {
            poolid: '',
            name: '',
            neighbourhood: '',
            description: '',
            zip: '',
            authFlag: false,
            failed: false,
            success: false
        } // Bind the handlers to this class // this.usernameChangeHandler = this.usernameChangeHandler.bind(this) // this.passwordChangeHandler = this.passwordChangeHandler.bind(this) // this.submitLogin = this.submitLogin.bind(this)
    } // Call the Will Mount to set the auth Flag to false



    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onSubmit = formValues => {
        console.log("Inside Pool Creation" + formValues);
        let data = {
            poolId: formValues.poolid,
            name: formValues.name,
            neighbourhood: formValues.neighbourhood,
            description: formValues.description,
            zipcode: Number(formValues.zip)

        }
        let email = localStorage.getItem("currentUser")
        email = email.replace(/['"]+/g, '')
        console.log(email)
        console.log(data)
        axios.defaults.withCredentials = true;
        axios.post(`${ROOT_URL}/api/createpool/${email}`, data).then(response => {
            // update the state with the response data
            this.setState({
                failed: false,
                success: true
            })
            localStorage.setItem('role',JSON.stringify("POOL_LEADER"))
            console.log('Axios post:', response.data);
        }).catch(error => {
            console.log(error);
            this.setState({
                failed: true,
                success: false
            })
        });
    }

    renderError = ({ error, touched }) => {
        if (touched && error) {
            return (
                <div>
                    <label style={{ color: 'red' }}>{error}</label>
                </div>
            )
        }
    }

    renderInput = ({ input, label, meta, className = { className } }) => {
        return (
            <div>
                <div htmlFor='email' style={{ color: '#6b6b83' }}>
                    {label}
                </div>
                <input
                    className='form-control'
                    style={{ marginRight: '10px' }}
                    {...input}
                />
                {this.renderError(meta)}
            </div>
        )
    }

    render() {
        // redirect based on successful login
        let redirectVar = null
        let invalidtag = null
        let createPool = null
        if(JSON.parse(localStorage.getItem('role')) === "User"){
            createPool=( <button type='submit' class='btn btn-info'>
                                                    Create Pool
                                                </button>)
        }else{
            createPool=( <button disabled type='submit' class='btn btn-info'>
                                                    Create Pool (Already in pool)
                                                </button>)
        }
        // if (!cookie.load('cookie')) {
        //   redirectVar = <Redirect to='/login' />
        // }

        if (this.state.failed) {
            invalidtag = (
                <label style={{ color: 'red' }}>Given Pool already exists!</label>
            )
        }

        if (this.state.success) {
            invalidtag = (
                <label style={{ color: 'green' }}>Successfully created new Pool</label>
            )
            createPool=( <button disabled type='submit' class='btn btn-info'>
                                                    Create Pool (Already in pool)
                                                </button>)
            
        }

        return (

            < div >
                {/* {redirectVar} */}
                <div>
                    <div className='row'>
                        <div className='col-sm-2'>
                            <LeftNavbar />
                        </div>
                        <div class='split-center_home'>
                            <div class='login-form'>
                                <div class='panel'>
                                    <br></br>
                                    <h2 style={{ marginLeft: '20px' }}>Create a new pool</h2>
                                    <br></br>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <form
                                            className='ui form error'
                                            onSubmit={this.props.handleSubmit(this.onSubmit)}
                                        >
                                            <div style={{ marginLeft: '10%' }}>
                                                <br />
                                                <Field
                                                    name='poolid'
                                                    type='text'
                                                    component={this.renderInput}
                                                    label='Pool ID'
                                                />
                                                <br />
                                                <Field
                                                    name='name'
                                                    type='text'
                                                    component={this.renderInput}
                                                    label='Pool Name'
                                                />
                                                <br />
                                                <Field
                                                    name='neighbourhood'
                                                    type='text'
                                                    component={this.renderInput}
                                                    label='Neighbourhood'
                                                />
                                                <br />
                                                <Field
                                                    name='description'
                                                    type='text'
                                                    component={this.renderInput}
                                                    label='Description'
                                                />
                                                <br />
                                                <Field
                                                    name='zip'
                                                    type='text'
                                                    component={this.renderInput}
                                                    label='Zip code'
                                                />
                                                <br />
                                                {invalidtag}
                                                <br />
                                                {createPool}
                                                <br />
                                                <br></br>
                                                <br></br>
                                                <br></br>

                                                <br></br>


                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
// export Login Component
// export default BuyerProfile

const validate = formValues => {
    const error = {}
    if (!formValues.poolid) {
        error.poolid = 'Enter a valid pool id'
    }
    if (!(/^([a-zA-Z0-9]+)$/.test(formValues.poolid))) {
        error.poolid = "Only Alphanumeric values allowed"
    }
    if (!formValues.name) {
        error.name = 'Enter a valid pool name'
    }
    if (!formValues.neighbourhood) {
        error.neighbourhood = 'Enter a valid city'
    }
    if (!formValues.description) {
        error.description = 'Enter a valid description'
    }
    if (!formValues.zip) {
        error.zip = 'Enter a valid zip'
    }
    if (!(/\b\d{5}\b/g.test(formValues.zip))) {
        error.zip = "Only 5 digit values are allowed"
    }
    
    return error
}

const mapStateToProps = state => {
    return { owner: state.owner }
}

export default connect(
    mapStateToProps
)(
    reduxForm({
        form: 'streamMenu',
        validate: validate
    })(CreatePool)
)
