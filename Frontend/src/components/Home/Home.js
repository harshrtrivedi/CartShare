import React, { Component } from 'react'
import '../../App.css'
import './Home.css'
import axios from 'axios'
import { Redirect } from 'react-router'
import { loginuser } from '../../actions'
import { reduxForm } from 'redux-form'
import { getProfile } from '../../actions'
import { connect } from 'react-redux'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import ROOT_URL from '../../constants'

// Define a Login Component
class Home extends Component {
  // call the constructor method
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      authFlag: false,
      authFailed: false,
      tweets: []
    }
  }

  componentWillMount() {
    this.setState({
      authFlag: false,
      authFailed: false
    })

    let email = sessionStorage.getItem('email');
    let data = { email: email }
    // alert(data.email)
    this.props.getProfile({ params: data }, (response) => {
      // console.log(this.props.user)
      // alert(response.data);
      // console.log('Response user' + response.data)
      sessionStorage.setItem('userDtls', JSON.stringify(response.data))
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

  componentDidMount() {
    var email = sessionStorage.getItem("email")
    axios.get(ROOT_URL + '/fetchtweets', {
      params: {
        email: email
      }
    })
      .then((response) => {
        // console.log("Received response")
        // console.log(response)
        //update the state with the response data
        this.setState({

          tweets: this.state.tweets.concat(response.data)
        });
      });
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

  render() {
    let redirectVar = null
    if (sessionStorage.getItem('email')) {
      redirectVar = <Redirect to='/home' />
    } else {
      redirectVar = <Redirect to='/login' />
    }

    let invalidtag = null
    if (this.state.authFailed) {
      invalidtag = (
        <label style={{ color: 'red' }}>*Invalid user name password!</label>
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
              <div>Header</div>
              <hr></hr>
            </div>
            <div className='col-sm-1' />
          </div>
        </div>
      </div >
    )
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
const mapStateToProps = state => {
  return { user: state.user }
}

export default connect(
  mapStateToProps,
  { loginuser, getProfile }
)(
  reduxForm({
    form: 'streamLogin',
    validate: validate
  })(Home)
)
