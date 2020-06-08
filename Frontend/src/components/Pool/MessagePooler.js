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
import * as UTIL from '../utils/Utils'


// Define a Login Component
class MessagePooler extends Component {
    // call the constructor method
    constructor(props) {
        // Call the constrictor of Super class i.e The Component
        super(props) // maintain the state required for this component
        this.state = {
            poolers: [],
            value: ''
        }
    }

    componentDidMount() {
        axios.defaults.withCredentials = true
        axios
            .get(`${ROOT_URL}/api/poolerslist/` + UTIL.getUserScreenName())
            .then(response => {
                console.log("Received poolers list " + response.data);
                this.setState({
                    poolers: response.data
                })
            })
    }

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    renderDropdownList = ({ input, ...rest }) =>
        <DropdownList {...input} {...rest} />


    onSubmit = formValues => {
        console.log("Inside Pool Creation" + formValues);
        let data = {
            sender: UTIL.getUserScreenName(),
            receiver: formValues.receiver,
            msg: formValues.msg
        }
        axios.defaults.withCredentials = true;
        axios.post(`${ROOT_URL}/api/sendmessage`, data).then(response => {
            this.setState({
                failed: false,
                success: true
            })
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
        const { handleSubmit, pristine, submitting } = this.props
        let redirectVar = null
        let invalidtag = null
        if (this.state.failed) {
            invalidtag = (
                <label style={{ color: 'red' }}>Error in sending message!</label>
            )
        }

        if (this.state.success) {
            invalidtag = (
                <label style={{ color: 'green' }}>Message has been sent Successfully!</label>
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
                                    <h2 style={{ marginLeft: '20px' }}>Cartshare Messaging!</h2>
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

                                                <label style={{ color: "rgb(107, 107, 131)" }}>Receiver</label>

                                                <Field
                                                    name="receiver"
                                                    component={this.renderDropdownList}
                                                    data={this.state.poolers}
                                                    style={{
                                                        width: "100%",
                                                        border: "solid #ffffff",
                                                        borderRadius: "4px",
                                                        fontSize: "14px",
                                                        fontFamily: "graphik"
                                                    }}
                                                    valueField="receiver"
                                                    textField="receiver"
                                                />

                                                <Field
                                                    name='msg'
                                                    type='text'
                                                    component={this.renderInput}
                                                    label='Message Text'
                                                />


                                                <br />
                                                {invalidtag}
                                                <br />
                                                <button type='submit' class='btn btn-info'
                                                >
                                                    Send Message!
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
    if (!formValues.msg) {
        error.value = 'Enter a valid text'
    }
    return error
}


MessagePooler
    = reduxForm({
        form: 'reactWidgets'  // a unique identifier for this form
    })(MessagePooler)

export default MessagePooler

