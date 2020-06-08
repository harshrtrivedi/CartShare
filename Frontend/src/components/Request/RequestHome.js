import React, { Component } from "react";
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import ROOT_URL from '../../constants.js'
import RequestData from './RequestData'
import LeftNavbar from "../LeftNavbar/LeftNavbar"
import * as UTIL from '../utils/Utils'

class RequestHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemname: "",
            search: "",
            items: [],
            authFlag: false
        };
    }

    componentDidMount() {
        // axios.get('http://localhost:3001/viewrestaurants', {
        //     params: {
        //         itemname: this.props.match.params.itemname,
        //         // cuisine: this.state.cuisine
        //     }
        // })
        //     .then((response) => {
        //         console.log("Received response")
        //         //update the state with the response data
        //         this.setState({

        //             items: this.state.items.concat(response.data)
        //         });
        //     });


        let screenname = UTIL.getUserScreenName();

        axios.defaults.withCredentials = true;
        axios.get(`${ROOT_URL}/api/requests/${screenname}`).then(response => {
            console.log("response " + response.data)
            this.setState({
                items: this.state.items.concat(response.data)
            })
            console.log('Axios post:', this.state.items);
            // window.location.reload(true)
        }).catch(error => {
            console.log(error);
        });


    }


    submitFilter = e => {
        window.location.reload();
    };

    render() {

        let details = this.state.items.map(item => {
            return (
                <tr>
                    <RequestData key={Math.random} data={item}></RequestData>
                </tr>
            )
        })


        return (

            <div>
                {/* {redirectVar} */}

                <div className='row'>
                    <div className='col-sm-2'>
                        <LeftNavbar />
                    </div>

                    <div class='split-center_home'>
                        <div class='panel'>
                            <br></br>
                            <h2 style={{ marginLeft: '20px' }}>List of Pools</h2>
                            <hr></hr>
                        </div>

                        <table class="table table-bordered table-hover" style={{ textAlign: "left", backgroundColor: "#fafafa" }}>
                            <thead class="thead-dark" style={{ textAlign: "center" }}>
                                <tr>
                                    <th>Request Id</th>
                                    <th>Requester Name</th>
                                    <th>Approve</th>
                                    <th>Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details}
                            </tbody>
                        </table>
                        <br />
                    </div>
                </div>
            </div>
        );
    }
}


export default RequestHome;