import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { loginuser, getProfile } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import Cookies from 'universal-cookie'
import { history } from "../utils/Utils"
import ROOT_URL from '../../constants'
import * as UTIL from '../utils/Utils';

class SignupDetails extends Component {
    constructor(props) {

        super(props)

        this.state = {
            nickName: '',
            screenName: '',
            role: '',
            email: '',
            password: '',
            oauthFlag: false,
            authFlag: false,
            authFailed: false
        }

    }

    componentWillMount() {
        this.setState({
            authFlag: false,
            authFailed: false
        })
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

    renderInput = ({ input, type, label, meta }) => {
        return (
            <div>
                <div htmlFor='email' style={{ color: '#6b6b83' }}>
                    {label}
                </div>
                <div class='form-group'>
                    <input class='form-control' type={type} {...input} />
                    {this.renderError(meta)}
                </div>
            </div>
        )
    }

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = (formValues) => {
        // this.setState({
        //     this.state.nickName: formValues.nickname,
        //     screenName: formValues.screenname,
        //     email: this.props.match.params.email,
        //     password: ""
        // });
        this.state.nickName = formValues.nickname
        this.state.screenName = formValues.screenname
        this.state.street = formValues.street
        this.state.city = formValues.city
        this.state.state = formValues.state
        this.state.zip = formValues.zip
        this.state.email = this.props.match.params.email
        
        if (this.state.email.includes("sjsu")) {
            this.state.role = "Admin";
        }
        else {
            this.state.role = "User";
        }
        this.state.oauthFlag = true;
        let data = {
            nickName:formValues.nickname,
            screenName:formValues.screenname,
            role:this.state.role,
            oauthFlag:this.state.oauthFlag,
            email: this.state.email,
            password: this.state.password,
            address:{
                street:formValues.street,
                city:formValues.city,
                state:formValues.state,
                zip:formValues.zip
            }
        }
        console.log("val" + this.state.email)
        this.signupHandler(data);
    }

    signupHandler(data) {
        axios.defaults.withCredentials = true
        fetch(`${ROOT_URL}/api/signup`, {
            method: 'POST',
            mode: 'cors',
            headers: { ...UTIL.getUserHTTPHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status === 200) {
                console.log('Response signup pooler: ', res.data)
                this.setState({
                    authFlag: true
                })
                alert("Verification mail has been sent. Please verify before login.!!")
                window.location.replace('/login')
            } else if (res.status == 302) {
                alert("User is already registered with same email id");
                window.location.reload();
                this.setState({
                    authFlag: false
                })
            } else if (res.status == 405) {
                alert("User is already registered with same screenname");
                window.location.reload();
                this.setState({
                    authFlag: false
                })
            } else if (res.status == 406) {
                alert("User is already registered with same nickname");
                window.location.reload();
                this.setState({
                    authFlag: false
                })
            } else {
                console.log('Failed')
                this.setState({ authFailed: true })
                alert("User registeration failed because of sever error")
            }
        })
    }

    render() {

        let invalidtag = null
        if (this.state.authFailed) {
            invalidtag = (
                <label style={{ color: 'red' }}>*Invalid user name password!</label>
            )
        }

        let loggedIn = (localStorage.getItem("name") === null);
        if (!loggedIn) {
            return (<Redirect to='/estimateprice' />);
        }
        else {
            return (
                <form
                    className='ui form error'
                    onSubmit={this.props.handleSubmit(this.onSubmit)}
                >
                    <div>
                        <div class='container'>
                            <div class='login-form'>
                                <div class='main-div'>
                                    <div class='panel'>
                                        <h2>Thank you for Google signup!</h2>
                                        <h2>Please provide below details</h2>
                                        {invalidtag}
                                    </div>
                                    <Field
                                        name='screenname'
                                        type='text'
                                        component={this.renderInput}
                                        label='Screenname'
                                    />
                                    <br />
                                    <Field
                                        name='nickname'
                                        type='text'
                                        component={this.renderInput}
                                        label='Nickname'
                                    />
                                    <br />
                                    <Field
                                        name='street'
                                        type='text'
                                        component={this.renderInput}
                                        label='Street'
                                    />
                                    <br />
                                    <Field
                                        name='city'
                                        type='text'
                                        component={this.renderInput}
                                        label='City'
                                    />
                                    <br />
                                    <Field
                                        name='state'
                                        type='text'
                                        component={this.renderInput}
                                        label='State'
                                    />
                                    <br />
                                    <Field
                                        name='zip'
                                        type='number' 
                                        min="1"
                                        component={this.renderInput}
                                        label='Zip'
                                    />
                                    <br />
                                    <br />
                                    <button type='submit' class='btn btn-info'>
                                        Signup!
                </button>
                                    <br />
                                    <br />
                                    <br></br>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )
        }
    }
}

const validate = formValues => {
    const error = {}
    if (!formValues.screenname) {
        error.screenname = 'Enter a valid ScreenName'
    }
    if (!(/^([a-zA-Z0-9]+)$/.test(formValues.screenname))) {
        error.screenname = "Only Alphanumeric values allowed"
    }
    if (!formValues.nickname) {
        error.nickname = 'Enter a valid NickName'
    }
    if (!formValues.street) {
        error.street = 'Enter a valid Street'
      }
      if (!formValues.city) {
        error.city = 'Enter a valid City'
      }
      if (!formValues.state) {
        error.state = 'Enter a valid State'
      }
      if (!formValues.zip) {
        error.zip = 'Enter a valid Zip Code'
      }
      if(!(/\b\d{5}\b/g.test(formValues.zip))){
        error.zip = "Only 5 digit values are allowed"
      }
      // if (!(/^([0-9])$/.test(formValues.zip))) {
      //   error.zip = "Only numeric values of 5 digits is allowed"
      // }
    return error
}


export default
    reduxForm({
        form: 'streamSignupDetails',
        validate: validate
    })(SignupDetails)




