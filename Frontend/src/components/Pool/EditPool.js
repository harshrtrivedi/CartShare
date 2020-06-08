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
import * as UTIL from '../utils/Utils'


class EditPool extends Component {
    constructor(props) {
        super(props)
        this.state = {
            poolid: "",
            name: "",
            neighbourhood: "",
            description: "",
            zipcode: ""
        }
    }

    componentDidMount() {
        axios.defaults.withCredentials = true
        axios
            .get(`${ROOT_URL}/api/getpooldetails/` + UTIL.getUserScreenName())
            .then(response => {
                // console.log("Received pool details " + response.data.poolId + response.data.name + response.data.neighbourhood + response.data.description + response.data.zipcode);
                this.setState({
                    poolid: response.data.poolId,
                    name: response.data.name,
                    neighbourhood: response.data.neighbourhood,
                    description: response.data.description,
                    zipcode: response.data.zipcode
                })
                this.props.initialize({ poolid: this.state.poolid, name: this.state.name, neighbourhood: this.state.neighbourhood, description: this.state.description, zipcode: this.state.zipcode })
            })

    }

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onSubmit = formValues => {
        console.log("Inside Pool update" + formValues);
        let data = {
            poolId: this.state.poolid,
            name: formValues.name,
            neighbourhood: formValues.neighbourhood,
            description: formValues.description,
            zipcode: this.state.zipcode
        }
        axios.defaults.withCredentials = true;
        axios.put(`${ROOT_URL}/api/updatepool`, data).then(response => {
            this.setState({
                failed: false,
                success: true
            })
            console.log('Axios post:', response.data);
            window.location.reload();
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

    renderDisabledInput = ({ input, label, meta, className = { className } }) => {
        return (
            <div>
                <div htmlFor='email' style={{ color: '#6b6b83' }}>
                    {label}
                </div>
                <input
                    className='form-control'
                    style={{ marginRight: '10px' }}
                    {...input}
                    disabled={true}
                />
                {this.renderError(meta)}
            </div>
        )
    }

    render() {
        // redirect based on successful login
        let redirectVar = null
        let invalidtag = null
        // if (!cookie.load('cookie')) {
        //   redirectVar = <Redirect to='/login' />
        // }

        if (this.state.failed) {
            invalidtag = (
                <label style={{ color: 'red' }}>Error Occured, please try with other Pool name!</label>
            )
        }

        if (this.state.success) {
            invalidtag = (
                <label style={{ color: 'green' }}>Successfully updated details</label>
            )
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
                                    <h2 style={{ marginLeft: '20px' }}>Your Pool Details</h2>
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
                                                    component={this.renderDisabledInput}
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
                                                    name='zipcode'
                                                    type='text'
                                                    component={this.renderDisabledInput}
                                                    label='Zip Code'
                                                />

                                                {invalidtag}
                                                <br />
                                                <button type='submit' class='btn btn-info'>
                                                    Update Details
                        </button>
                                                <br />

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

const validate = formValues => {
    const error = {}
    if (!formValues.name || formValues.name.trim() == "") {
        error.name = 'Enter a valid Name'
    }
    if (!formValues.description || formValues.description.trim() == "") {
        error.description = 'Enter valid Description'
    }
    if (!formValues.neighbourhood || formValues.neighbourhood.trim() == "") {
        error.neighbourhood = 'Enter valid Neighbourhood'
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
        form: 'EditPool',
        validate: validate
    })(EditPool)
)
