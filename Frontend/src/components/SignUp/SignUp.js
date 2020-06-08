import React, { Component } from 'react'
import '../../App.css'
import axios from 'axios'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { signupPooler } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import GoogleLogin from 'react-google-login'
import { GOOGLE_CLIENT_ID } from '../../config/config'
import ROOT_URL from '../../constants'
import * as UTIL from '../utils/Utils';


// Define a SignUp Component
class SignUp extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props)
    // maintain the state required for this component
    this.state = {
      screenname: '',
      nickname: '',
      email: '',
      password: '',
      authFlag: false,
      authFailed: false,
      user_role: '',
      oauth_flag: false,
      address: {
        city: '',
        street: '',
        state: '',
        zip: ''
      }
    }
  }

  componentWillMount() {
    this.setState({
      authFlag: false,
      // authFailed: false
    })
  }

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
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

  renderInput = ({ input, label, meta, type }) => {
    return (
      <div>
        <div htmlFor='email' style={{ color: '#6b6b83' }}>
          {label}
        </div>
        <input class='form-control' type={type} {...input} />
        {this.renderError(meta)}
      </div>
    )
  }

  signupHandler(data) {
    // axios.defaults.withCredentials = true
    // this.props.signupPooler(data, res => {
    //   if (res.status === 200) {
    //     console.log('Response signup pooler: ', res.data)
    //     this.setState({
    //       authFlag: true
    //     })
    //     alert("Verification mail has been sent. Please verify before login.!!")
    //     window.location.replace('/login')
    //   } else if (res.status == 302) {
    //     alert("User is already registered with same email id");
    //     window.location.reload();
    //     this.setState({
    //       authFlag: false
    //     })
    //   } else if (res.status == 405) {
    //     alert("User is already registered with same screenname");
    //     window.location.reload();
    //     this.setState({
    //       authFlag: false
    //     })
    //   } else if (res.status == 406) {
    //     alert("User is already registered with same nickname");
    //     window.location.reload();
    //     this.setState({
    //       authFlag: false
    //     })
    //   } else {
    //     console.log('Failed')
    //     this.setState({ authFailed: true })
    //     alert("User registeration failed because of sever error")
    //   }
    // })
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

  oauthLogin(response) {
    this.setState({
      // first_name: response.name.split(" ")[0],
      // last_name: response.name.split(" ")[1],
      nickName: response.name.split(" ")[0],
      screenName: response.name.split(" ")[1],
      email: response.email,
      password: ""
    });
    if (this.state.email.includes("sjsu")) {
      this.state.role = "Admin";
    }
    else {
      this.state.role = "User";
    }
    this.state.oauthFlag = true;
    console.log("val" + this.state.email)
    this.signupHandler(this.state);
  }


  onSubmit = formValues => {
    console.log('OnSubmit' + formValues.email)

    let data = {
      screenName: formValues.screenname,
      nickName: formValues.nickname,
      email: formValues.email,
      password: formValues.password,
      varified: false,
      address: {
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        zip: formValues.zip
      }
    }
    if (formValues.email.includes("sjsu")) {
      data.role = "Admin";
    }
    else {
      data.role = "User";
    }
    this.signupHandler(data);
  }

  render() {

    const responseGoogle = (response) => {
      console.log("Response received from google: " + JSON.stringify(response));
      window.location.replace(`/signupdetails/${response.profileObj.email}`)
      // this.oauthLogin(response.profileObj);
    }

    const onFailure = () => {
      console.log("inside failure");
      window.location.reload()
      // this.oauthLogin(response.profileObj);
    }

    let redirectVar = null
    let invalidtag = null
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to='/home' />
    }

    if (this.state.authFailed) {
      invalidtag = (
        <label style={{ color: 'red' }}>
          *Error occured while signing up please provide valid details!
        </label>
      )
    }

    return (

      <form
        className='ui form error'
        onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <div>
          {redirectVar}
          <div class='container'>
            <div class='login-form'>
              <div class='main-div'>
                <div class='panel'>
                  <h2>Create your account</h2>
                  {invalidtag}
                </div>
                <div class='form-group'>
                  <Field
                    name='screenname'
                    type='text'
                    component={this.renderInput}
                    label='Screen name'
                  />
                </div>
                <div class='form-group'>
                  <Field
                    name='nickname'
                    type='text'
                    required pattern="[a-zA-Z0-9]"
                    component={this.renderInput}
                    label='Nick name'
                  />
                </div>
                <div class='form-group'>
                  <Field
                    name='email'
                    type='email'
                    component={this.renderInput}
                    label='Email'
                  />
                </div>
                <div class='form-group'>
                  <Field
                    name='password'
                    type='password'
                    component={this.renderInput}
                    label='Password'
                  />
                </div>
                <div class='form-group'>
                  <Field
                    name='street'
                    type='text'
                    component={this.renderInput}
                    label='Street'
                  />

                </div>
                <div class='form-group'>
                  <Field
                    name='city'
                    type='text'
                    component={this.renderInput}
                    label='City'
                  />
                </div>

                <div class='form-group'>
                  <Field
                    name='state'
                    type='text'
                    component={this.renderInput}
                    label='State'
                  />
                </div>

                <div class='form-group'>
                  <Field
                    name='zip'
                    type='number'
                    min="1"
                    component={this.renderInput}
                    label='Zip'
                  />
                </div>

                <br />
                <div class='form-group'>
                  <button type='submit' class='btn btn-warning'>
                    Create an account
                  </button>
                </div>
                <div class='form-group'>
                  <div style={{ textAlign: 'center' }}>or</div>
                </div>

                <div class='form-group'>

                  <GoogleLogin
                    style={{ width: "max-content" }}
                    clientId={GOOGLE_CLIENT_ID}
                    // buttonText="SIGNUP WITH GOOGLE"
                    onSuccess={responseGoogle}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    className="google-button-signup"
                    render={renderProps => (
                      <button onClick={renderProps.onClick} class='btn btn-info'>Signup With Google</button>
                    )}

                  />
                  {/* <button class='btn btn-info'>Continue with Google</button> */}
                </div>

                <div style={{ textAlign: 'center' }} class='form-group'>
                  Have an account? <Link to='/login'>Sign in</Link>
                </div>

                <div
                  style={{ fontSize: '12px', textAlign: 'center' }}
                  class='form-group'
                >
                  By creating your CartShare account, you agree to the{' '}
                  <span style={{ color: '#0070eb' }}>Terms of Use</span> and{' '}
                  <span style={{ color: '#0070eb' }}> Privacy Policy.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

    )
  }
}

const validate = formValues => {
  const error = {}
  if (!formValues.email) {
    error.email = 'Enter a valid Email'
  }
  if (!formValues.password) {
    error.password = 'Enter a valid Password'
  }
  if (!formValues.screenname) {
    error.screenname = 'Enter a valid Screen name'
  }
  if (!(/^([a-zA-Z0-9]+)$/.test(formValues.screenname))) {
    error.screenname = "Only Alphanumeric values allowed"
  }
  if (!formValues.nickname) {
    error.nickname = 'Enter a valid Nick name'
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
  if (!(/\b\d{5}\b/g.test(formValues.zip))) {
    error.zip = "Only 5 digit values are allowed"
  }

  // if (!(/^([0-9])$/.test(formValues.zip))) {
  //   error.zip = "Only numeric values of 5 digits is allowed"
  // }
  return error
}
// const mapStoreToProps = state => {
//   return { user: state.user }
// }
// export default connect(
//   mapStoreToProps,
//   { signupPooler: signupPooler }
// )(
export default
  reduxForm({
    form: 'streamSignup',
    validate: validate
  })(SignUp)
// )
