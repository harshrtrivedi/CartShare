import React, { Component } from 'react'
import '../../App.css'
// import './AddStore.css'
import axios from 'axios'
import AdminNavbar from '../LeftNavbar/AdminNavbar'
import { Field, reduxForm } from 'redux-form'
import ROOT_URL from '../../constants.js'

import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

// Define a Login Component
class AddStore extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props) // maintain the state required for this component
    this.state = {
      name: '',
      street: '',
      city: '',
      state: '',
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
    console.log("Inside Store Creation" + formValues);
    let data = {
      name: formValues.name,
      address: {
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        zip: formValues.zip
      }
    }
    console.log(data)
    axios.defaults.withCredentials = true;
    axios.post(`${ROOT_URL}/addstore`, data).then(response => {
      // update the state with the response data
      this.setState({
        failed: false,
        success: true
      })
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
    // if (!cookie.load('cookie')) {
    //   redirectVar = <Redirect to='/login' />
    // }

    if (this.state.failed) {
      invalidtag = (
        <label style={{ color: 'red' }}>*Store already exists!</label>
      )
    }

    if (this.state.success) {
      invalidtag = (
        <label style={{ color: 'green' }}>Successfully created new Store</label>
      )
    }

    return (

      < div >
        {/* {redirectVar} */}
        <div>
          <div className='row'>
            <div className='col-sm-2'>
              <AdminNavbar />
            </div>
            <div class='split-center_home'>
              <div class='login-form'>
                <div class='panel'>
                  <br></br>
                  <h2 style={{ marginLeft: '20px' }}>Create a new store</h2>
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
                          name='name'
                          type='text'
                          component={this.renderInput}
                          label='Name'
                        />
                        <br />
                        <Field
                          name='street'
                          type='text'
                          component={this.renderInput}
                          label='Street Number and Name'
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
                          type='text'
                          component={this.renderInput}
                          label='Zip code'
                        />
                        <br />
                        {invalidtag}
                        <br />
                        <button type='submit' class='btn btn-info'>
                          Create Store
                        </button>
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
  if (!formValues.name) {
    error.name = 'Enter a valid name'
  }
  if (!formValues.street) {
    error.street = 'Enter a valid street'
  }
  if (!formValues.city) {
    error.city = 'Enter a valid city'
  }
  if (!formValues.state) {
    error.state = 'Enter a valid state'
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
  })(AddStore)
)
