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
import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from '../../config/config'
import { history } from "../utils/Utils"
import ROOT_URL from '../../constants'
import * as UTIL from '../utils/Utils';

class Login extends Component {
  constructor(props) {

    super(props)

    this.state = {
      email: '',
      password: '',
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
    var headers = new Headers();
    // formValues.preventDefault();
    const data = {
      email: formValues.email,
      password: formValues.password
    }

    fetch(`${ROOT_URL}/api/login`, {
      method: 'POST',
      mode: 'cors',
      headers: { ...UTIL.getUserHTTPHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(response => {
      console.log("Status Code : ", response);
      if (response.status == 200) {
        this.setState({
          authFlag: true
        })
        // alert("User logged in successfully");
        // history.push('/poolhome');
        // window.location.reload();

        return response.json();
      }
      else if (response.status == 404) {
        alert("User not registered, Please sign up");
        history.push('/signup');
        window.location.reload();
        this.setState({
          authFlag: false
        })
      }
      else if (response.status == 400) {
        alert("Please enter correct login credentials");
        window.location.reload();
        this.setState({
          authFlag: false
        })
      }
      else if (response.status == 406) {
        alert("Please verify the account first");
        window.location.reload();
        this.setState({
          authFlag: false
        })
      }
    }).then(result => {
      console.log("Login response " + result)
      if (result.email.includes("sjsu.edu")) {
        history.push('/stores')
      } else {
        history.push('/poolhome')
      }
      window.location.reload();
      UTIL.saveUserDetails(result);

    }).catch(error => {
      console.log("Error : " + error);
      window.location.reload();
    });

  }



  checkVerification(data) {
    var email = data.email;
    console.log("checkVerification email : " + email);
    // axios.get(ROOT_URL + '/api/oauthverified/' + email)
    fetch(`${ROOT_URL}/api/oauthverified/` + email, {
      method: 'GET',
      mode: 'cors',
      headers: { ...UTIL.getUserHTTPHeader(), 'Content-Type': 'application/json' },
      // body: JSON.stringify(data)
    })
      .then((response) => {
        console.log("response", response)

        if (response.status == 200) {
          // alert(" User logged in successfully");
          console.log("Response from server : " + response);
          // if(localStorage.getItem('role')=='Admin'){
          // history.push('/stores');
          // }
          // else{
          //   history.push('/poolhome');
          // }
          // window.location.reload();
          return response.json()
          // history.push('/home');
          // window.location.reload();
        }
        else if (response.status == 400) {
          alert("First verify the account used to login with google");
        }
        else if (response.status == 404) {
          alert("First register with google to login into it");
        }
      }).then(result => {
        console.log("Login response " + result)
        if (result.email.includes("sjsu.edu")) {
          history.push('/stores')
        } else {
          history.push('/poolhome')
        }
        window.location.reload();
        UTIL.saveUserDetails(result);
      }).catch(e => {
        console.log(e)
        alert("Inside catch response")
      })
  }

  render() {


    const responseGoogle = (response) => {
      console.log("Response received from google: " + JSON.stringify(response));
      this.checkVerification(response.profileObj);
    }

    let redirectVar = null
    let invalidtag = null
    if (!cookie.load('cookie')) {
      redirectVar = <Redirect to='/login' />
    }
    let redirecthome = null
    if (this.state.authFlag) {
      redirecthome = <Redirect to='/home' />
    }
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
            {redirectVar}
            {redirecthome}
            <div class='container'>
              <div class='login-form'>
                <div class='main-div'>
                  <div class='panel'>
                    <h2>Sign in with your CartShare account</h2>
                    {invalidtag}
                  </div>
                  <Field
                    name='email'
                    type='text'
                    component={this.renderInput}
                    label='Email'
                  />
                  <br />
                  <Field
                    name='password'
                    type='password'
                    component={this.renderInput}
                    label='Password'
                  />
                  <br />
                  <br />
                  <button type='submit' class='btn btn-info'>
                    Login
                </button>
                  <br />
                  <br />
                  <div style={{ textAlign: 'center' }} class='form-group'>
                    <span>New to CartShare? </span><Link to='/signup'>Sign up now >></Link>
                  </div>
                  <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    // buttonText="SIGN IN WITH GOOGLE"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    className="google-button-signup"
                    render={renderProps => (
                      <button onClick={renderProps.onClick} class='btn btn-info'>SignIn With Google</button>
                    )}
                  />
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
  if (!formValues.email) {
    error.email = 'Enter a valid email'
  }
  if (!formValues.password) {
    error.password = 'Enter a valid Password'
  }
  return error
}


export default
  reduxForm({
    form: 'streamLogin',
    validate: validate
  })(Login)




