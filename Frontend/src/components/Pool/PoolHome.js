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
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col, Row, Util
} from 'reactstrap';
import Banner from '../Banner/Banner'
import StoreBanner from '../StoreBanner/StoreBanner'
import * as UTIL from '../utils/Utils'
// import { Button, Card, Image } from 'semantic-ui-react'

class PoolHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: "",
            poolname: "",
            authFlag: false,
            failed: false,
            success: false,
            poolId:''
        }
    }

    componentWillMount() {

        axios.defaults.withCredentials = true
        // alert(JSON.parse(localStorage.getItem('role')))
        axios
            .get(`${ROOT_URL}/api/getpool/` + UTIL.getUserDetails())
            .then(response => {
                // console.log(response)
                console.log("Inside Fetch user role" + JSON.stringify(response.data));
                this.setState({
                    role: response.data[0],
                    poolname: response.data[1],
                    poolId :response.data[2]
                })
            })
        
    }

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    deletePool = e => {
        e.preventDefault()
        let screenname = JSON.parse(localStorage.getItem('screenname'))
        // alert(JSON.stringify(data.id));
        axios.defaults.withCredentials = true
        axios.delete(`${ROOT_URL}/api/pool/${this.state.poolId}/${screenname}`, { params: '' }).then(response => {
            console.log('Axios post:', response.data);
            localStorage.setItem('role',JSON.stringify("User"))
            alert("Pool Deleted");
            window.location.reload(true)
        }).catch(error => {
            console.log(error);
            alert("There are Poolers in this pool | There are some Unfulfilled orders")
        });

    }


    // onSubmit = formValues => {
    //     console.log("Inside Store Creation" + formValues);
    //     let data = {
    //         name: formValues.name,
    //         address: {
    //             street: formValues.street,
    //             city: formValues.city,
    //             state: formValues.state,
    //             zip: formValues.zip
    //         }
    //     }
    //     // console.log(data)
    //     axios.defaults.withCredentials = true;
    //     axios.post(`${ROOT_URL}/stores`, data).then(response => {
    //         // update the state with the response data
    //         this.setState({
    //             failed: false,
    //             success: true
    //         })
    //         console.log('Axios post:', response.data);
    //     }).catch(error => {
    //         console.log(error);
    //         this.setState({
    //             failed: true,
    //             success: false
    //         })
    //     });
    // }

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

        let redirectVar = null
        let invalidtag = null


        let noPoolMember = null;
        var userRole = this.state.role;
        var poolName = this.state.poolname
        if (userRole === "POOLER") {
            noPoolMember = (
                <div style={{ position: "relative", marginTop: "25%", marginLeft: "27%" }}>
                    <h3 style={{ fontWeight: "bold", color: "A9A9A9" }}>
                        Currently you're a Pooler in {poolName}!!
                    </h3>

                    <h4 style={{ color: "grey" }}>
                        <a href='/messagepooler'>Click here</a> to send a message to other pool members
                    </h4>
                </div>)

        } else if (userRole === "POOL_LEADER") {
            noPoolMember = (
                <div style={{ position: "relative", marginTop: "25%", marginLeft: "23%" }}>
                    <h3 style={{ fontWeight: "bold", color: "A9A9A9" }}>
                        Currently you're a Pool Leader in {poolName}!!
                    </h3>

                    <h4 style={{ color: "grey" }}>
                        Options : <a onClick = {this.deletePool} >Delete Pool</a> | <a href='/editpool'>Edit Pool</a> | <a href='/messagepooler'>Message Poolers</a>

                    </h4>
                    
                </div>)
        } else {
            noPoolMember = (
                <div style={{ position: "relative", marginTop: "25%", marginLeft: "32%" }}>
                    <h3 style={{ fontWeight: "bold", color: "A9A9A9" }}>
                        Currently you are not in any pool!!
                    </h3>

                    <h4 style={{ color: "grey" }}>
                        Options : <a href='/createpool'>Create Pool</a>     |     <a href='/searchpool'>Browse Pools</a>
                    </h4>
                </div>)
        }


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
                            <LeftNavbar />
                        </div>
                        <div class='split-center_home'>
                            <div class='login-form'>

                                <div class='panel'>
                                    <br></br>
                                    <h2 style={{ marginLeft: '20px' }}>Pool Options</h2>
                                    <hr></hr>
                                </div>

                                <div className="row">
                                    <div className='col-12'>
                                        {noPoolMember}
                                        {/* <div className="row">
                                            <div className="col-sm-2"></div>
                                            <div className='col-sm-2'>

                                                <Link to="createpool">
                                                    <button type="submit" className='btn btn-info'>
                                                        Create Pool
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className='col-sm-2'>
                                                <Link to="searchpool">
                                                    <button type="submit" className='btn btn-info'>
                                                        Search Pool
                                                    </button>
                                                </Link>
                                            </div>
                                            <div className='col-sm-2'>
                                                <button className='btn btn-info'>Delete Pool</button>
                                            </div>
                                            <div className='col-sm-2'>
                                                <button className='btn btn-info'>View Pool</button>
                                            </div>
                                        </div> */}

                                    </div>


                                </div>

                                <br />
                                <br />
                                <br />
                                {invalidtag}

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
    })(PoolHome)
)