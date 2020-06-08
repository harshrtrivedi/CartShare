import React, { Component } from 'react'
import '../../App.css'
// import './AddStore.css'
import axios from 'axios'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import { Field, reduxForm } from 'redux-form'
import ROOT_URL from '../../constants.js'

import * as UTIL from '../utils/Utils'
// import { Button, Card, Image } from 'semantic-ui-react'

class ContributionCredit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contributionCredit: '',
            status: '',
            authFlag: false,
            failed: false,
            success: false
        }
    }

    componentWillMount() {

        axios.defaults.withCredentials = true
        axios
            .get(`${ROOT_URL}/api/users/` + UTIL.getUserDetails())
            .then(response => {
                // console.log(response)
                console.log("Inside Contribution Credit " + JSON.stringify(response.data));
                this.setState({                    
                    contributionCredit: response.data.contributionCredit,                    
                })
            })
    }

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
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
        let status = <label style={{ color: 'Green' }}>Green</label>
        if(this.state.contributionCredit <= -4 && this.state.contributionCredit > -6)
        {
            status = <label style={{ color: 'Yellow' }}>Yellow</label>
        }
        else if(this.state.contributionCredit <= -6)
        {
            status = <label style={{ color: 'red' }}>Red</label>
        }
        noPoolMember = (
            <div style={{ position: "relative", marginTop: "25%", marginLeft: "27%" }}>
                <h3 style={{ fontWeight: "bold", color: "A9A9A9" }}>
                    Your Current Contribution Credit is {this.state.contributionCredit}!!
                    </h3>

                <h4>
                    Your Contribution Status is  {status}
                </h4>
            </div>)        

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
                                    <h2 style={{ marginLeft: '20px' }}>Contribution Credit</h2>
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
                                

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default reduxForm({
    form: 'streamMenu',

})(ContributionCredit)
