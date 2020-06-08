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


class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            screenname: "",
            nickname: "",
            email: ""
        }
    }

    componentWillMount() {
        this.setState({
            screenname: UTIL.getUserScreenName(),
            nickname: UTIL.getUserNickName(),
            email: UTIL.getUserDetails()
        })
    }
    componentDidMount() {
        this.props.initialize({ screenname: this.state.screenname, nickname: this.state.nickname, email: this.state.email })
    }

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onSubmit = formValues => {
        console.log("Inside Pool Creation" + formValues);
        let data = {
            screenName: this.state.screenname,
            nickName: formValues.nickname,
            email: this.state.email
        }
        axios.defaults.withCredentials = true;
        axios.put(`${ROOT_URL}/api/updateuser`, data).then(response => {
            this.setState({
                failed: false,
                success: true
            })
            console.log('Axios post:', response.data);
            UTIL.saveUserDetails(response.data);
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
                <label style={{ color: 'red' }}>Error Occured, please try with other Nickname!</label>
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
                                    <h2 style={{ marginLeft: '20px' }}>Your Profile</h2>
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
                                                    name='screenname'
                                                    type='text'
                                                    component={this.renderDisabledInput}
                                                    label='Screen Name'
                                                />
                                                <br />
                                                <Field
                                                    name='nickname'
                                                    type='text'
                                                    value="nvm"
                                                    component={this.renderInput}
                                                    label='Nick Name'
                                                    
                                                />
                                                <br />
                                                <Field
                                                    name='email'
                                                    type='text'
                                                    component={this.renderDisabledInput}
                                                    label='Email'
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
    if (!formValues.nickname || formValues.nickname.trim() == "") {
        error.nickname = 'Enter a valid Nickname'
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
        form: 'UserProfile',
        validate: validate
    })(UserProfile)
)
