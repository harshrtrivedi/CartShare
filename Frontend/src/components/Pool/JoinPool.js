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
import * as UTIL from '../utils/Utils'

// Define a Login Component
class JoinPool extends Component {
    // call the constructor method
    constructor(props) {
        // Call the constrictor of Super class i.e The Component
        super(props) // maintain the state required for this component
        this.state = {
            units: ['Pool Leader', 'Pooler'],
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



    onSubmit = formValues => {
        // var sname = localStorage.getItem("screenname")
        var sname = UTIL.getUserScreenName()
        console.log(sname)
        // sname = sname.replace(/['"]+/g, '')
        const data = {
            poolId: this.props.match.params.poolId,
            initiater: sname,
            approver: formValues.screenname
        }
        console.log(data)

        axios.defaults.withCredentials = true;
        axios.post(`${ROOT_URL}/api/joinpool`, data).then(response => {

            // update the state with the response data
            this.setState({
                failed: false,
                success: true
            })
            console.log('Axios post:', response.data);
            // window.location.reload(true)
        }).catch(error => {
            console.log(error);
            console.log(error.status);
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
                <label style={{ color: 'red' }}>Error in sending the request, one request at a time!</label>
            )
        }

        if (this.state.success) {
            invalidtag = (
                <label style={{ color: 'green' }}>Join request has been sent successfully</label>
            )
        }

        const units = ['Pool Leader', 'Pooler']


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

                                                <label style={{ color: "rgb(107, 107, 131)" }}>Your Reference</label>

                                                <Field
                                                    name="reference"
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
                                                    textField="reference"
                                                />

                                                <Field
                                                    name='screenname'
                                                    type='text'
                                                    component={this.renderInput}
                                                    // onChange={this.inputChangeHandler}
                                                    label='Screenname of Reference'
                                                />


                                                <br />
                                                {invalidtag}
                                                <br />
                                                <button type='submit' class='btn btn-info'
                                                >
                                                    Send Request
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
    if (!formValues.screenname) {
        error.value = 'Enter a valid screenname'
    }
    return error
}


JoinPool
    = reduxForm({
        form: 'reactWidgets'  // a unique identifier for this form
    })(JoinPool)

export default JoinPool

// import React, { Component } from 'react'
// import '../../App.css'
// import '../AddProduct/AddProduct.css'
// import axios from 'axios'
// import LeftNavbar from '../LeftNavbar/LeftNavbar'
// import { Field, reduxForm } from 'redux-form'
// import ROOT_URL from '../../constants.js'

// import cookie from 'react-cookies'
// import { Redirect } from 'react-router'
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import DropdownList from 'react-widgets/lib/DropdownList'
// import 'react-widgets/dist/css/react-widgets.css'
// import Multiselect from 'react-widgets/lib/Multiselect'
// import * as UTIL from '../utils/Utils'

// // Define a Login Component
// class JoinPool extends Component {
//     // call the constructor method
//     constructor(props) {
//         // Call the constrictor of Super class i.e The Component
//         super(props) // maintain the state required for this component
//         this.state = {
//             units: ['Pool Leader', 'Pooler'],
//             value: ''
//         }
//     }


//     inputChangeHandler = e => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }

//     renderDropdownList = ({ input, ...rest }) =>
//         <DropdownList {...input} {...rest} />



//     onSubmit = formValues => {
//         // var sname = localStorage.getItem("screenname")
//         var sname = UTIL.getUserScreenName()
//         console.log(sname)
//         // sname = sname.replace(/['"]+/g, '')
//         const data = {
//             poolId: this.props.match.params.poolId,
//             initiater: sname,
//             approver: formValues.screenname
//         }
//         console.log(data)

//         axios.defaults.withCredentials = true;
//         axios.post(`${ROOT_URL}/api/joinpool`, data).then(response => {

//             // update the state with the response data
//             this.setState({
//                 failed: false,
//                 success: true
//             })
//             console.log('Axios post:', response.data);
//             // window.location.reload(true)
//         }).catch(error => {
//             console.log(error);
//             this.setState({
//                 failed: true,
//                 success: false
//             })
//         });
//     }


//     renderError = ({ error, touched }) => {
//         if (touched && error) {
//             return (
//                 <div>
//                     <label style={{ color: 'red' }}>{error}</label>
//                 </div>
//             )
//         }
//     }

//     renderInput = ({ input, label, meta, className = { className } }) => {
//         return (
//             <div>
//                 <div htmlFor='email' style={{ color: '#6b6b83' }}>
//                     {label}
//                 </div>
//                 <input
//                     className='form-control'
//                     style={{ marginRight: '10px' }}
//                     {...input}
//                 />
//                 {this.renderError(meta)}
//             </div>
//         )
//     }
//     render() {
//         const { handleSubmit, pristine, submitting } = this.props
//         let redirectVar = null
//         let invalidtag = null
//         if (this.state.failed) {
//             invalidtag = (
//                 <label style={{ color: 'red' }}>Error in sending the request</label>
//             )
//         }

//         if (this.state.success) {
//             invalidtag = (
//                 <label style={{ color: 'green' }}>Join request has been sent successfully</label>
//             )
//         }

//         const units = ['Pool Leader', 'Pooler']


//         return (

//             < div >
//                 {/* {redirectVar} */}
//                 <div>
//                     <div className='row'>
//                         <div className='col-sm-2'>
//                             <LeftNavbar />
//                         </div>
//                         <div class='split-center_home'>
//                             <div class='login-form'>
//                                 <div class='panel'>
//                                     <br></br>
//                                     <h2 style={{ marginLeft: '20px' }}>Search Pool</h2>
//                                     <hr></hr>
//                                 </div>
//                                 <div className='row'>
//                                     <div className='col-sm-6'>
//                                         <form
//                                             className='ui form error'
//                                             onSubmit={this.props.handleSubmit(this.onSubmit)}
//                                             onChange={this.inputChangeHandler}
//                                         >

//                                             <div style={{ marginLeft: '10%' }}>
//                                                 {/* <br /> */}

//                                                 <label style={{ color: "rgb(107, 107, 131)" }}>Your Reference</label>

//                                                 <Field
//                                                     name="reference"
//                                                     component={this.renderDropdownList}
//                                                     // onChange={this.inputChangeHandler}
//                                                     data={units}
//                                                     style={{
//                                                         width: "100%",
//                                                         border: "solid #ffffff",
//                                                         borderRadius: "4px",
//                                                         fontSize: "14px",
//                                                         // height: "80px",
//                                                         // lineHeight: "50px",
//                                                         fontFamily: "graphik"
//                                                     }}
//                                                     valueField="value"
//                                                     textField="reference"
//                                                 />

//                                                 <Field
//                                                     name='screenname'
//                                                     type='text'
//                                                     component={this.renderInput}
//                                                     // onChange={this.inputChangeHandler}
//                                                     label='Screenname of Reference'
//                                                 />


//                                                 <br />
//                                                 {invalidtag}
//                                                 <br />
//                                                 <button type='submit' class='btn btn-info'
//                                                 >
//                                                     Send Request
//                         </button>

//                                                 <br />
//                                                 <br />
//                                                 <br />
//                                                 <br />
//                                             </div>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div >
//         )
//     }
// }

// const validate = formValues => {
//     const error = {}
//     if (!formValues.screenname) {
//         error.value = 'Enter a valid screenname'
//     }
//     return error
// }


// JoinPool
//     = reduxForm({
//         form: 'reactWidgets'  // a unique identifier for this form
//     })(JoinPool)

// export default JoinPool



