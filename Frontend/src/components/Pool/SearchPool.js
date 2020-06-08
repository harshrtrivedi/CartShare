import React, { Component } from 'react'
import '../../App.css'
import '../AddProduct/AddProduct.css'
import axios from 'axios'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import { Field, reduxForm } from 'redux-form'
import ROOT_URL from '../../constants.js'

import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
import Multiselect from 'react-widgets/lib/Multiselect'

// Define a Login Component
class SearchPool extends Component {
    // call the constructor method
    constructor(props) {
        // Call the constrictor of Super class i.e The Component
        super(props) // maintain the state required for this component
        this.state = {
            units: ['Name', 'Neighbourhood', 'Zipcode'],
            value: ''
        }
    }


    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    renderDropdownList = ({ input, ...rest }) =>
        <DropdownList {...input} {...rest} />

    renderMultiselect = ({ input, ...rest }) =>
        <Multiselect {...input}
            onBlur={() => input.onBlur()}
            value={input.value || []} // requires value to be an array
            {...rest} />



    onSubmit = formValues => {
        window.location.replace(`/searchpooldata/${formValues.unit}/${formValues.value}`)
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
        const { handleSubmit, pristine, submitting } = this.props
        let redirectVar = null
        let invalidtag = null
        if (this.state.failed) {
            invalidtag = (
                <label style={{ color: 'red' }}>*Product already exists!</label>
            )
        }

        if (this.state.success) {
            invalidtag = (
                <label style={{ color: 'green' }}>Successfully created new Product</label>
            )
        }

        const units = ['Name', 'Neighbourhood', 'Zipcode']


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
                                    <h2 style={{ marginLeft: '20px' }}>Search Pool</h2>
                                    <hr></hr>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <form
                                            className='ui form error'
                                            onSubmit={this.props.handleSubmit(this.onSubmit)}
                                            onChange={this.inputChangeHandler}
                                        >

                                            <div style={{ marginLeft: '10%' }}>
                                                {/* <br /> */}

                                                <label style={{ color: "rgb(107, 107, 131)" }}>Option</label>

                                                <Field
                                                    name="unit"
                                                    component={this.renderDropdownList}
                                                    // onChange={this.inputChangeHandler}
                                                    data={units}
                                                    style={{
                                                        width: "100%",
                                                        border: "solid #ffffff",
                                                        borderRadius: "4px",
                                                        fontSize: "14px",
                                                        // height: "80px",
                                                        // lineHeight: "50px",
                                                        fontFamily: "graphik"
                                                    }}
                                                    valueField="value"
                                                    textField="unit"
                                                />

                                                <Field
                                                    name='value'
                                                    type='text'
                                                    component={this.renderInput}
                                                    // onChange={this.inputChangeHandler}
                                                    label='Value'
                                                />


                                                <br />
                                                {invalidtag}
                                                <br />
                                                <button type='submit' class='btn btn-info'
                                                >
                                                    Search Pool
                        </button>

                                                <br />
                                                <br />
                                                <br />
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
    if (!formValues.value) {
        error.value = 'Enter a valid value'
    }
    return error
}


SearchPool
    = reduxForm({
        form: 'reactWidgets'  // a unique identifier for this form
    })(SearchPool)

export default SearchPool

