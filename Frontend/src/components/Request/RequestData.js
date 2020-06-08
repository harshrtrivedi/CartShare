import React, { Component, Fragment } from "react";
import "../../App.css";
import axios from 'axios'
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import ROOT_URL from '../../constants.js'
import * as UTIL from '../utils/Utils'

class RequestData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqId: this.props.data.id,
            screenName: UTIL.getUserScreenName()
        }
        this.submitApprove = this.submitApprove.bind(this);
        this.submitReject = this.submitReject.bind(this);
    }

    submitReject = e => {
        const id = Number(this.state.reqId)
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.put(`${ROOT_URL}/api/rejectrequest/${id}` + `/${this.state.screenName}`).then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log(response.data)
                alert("Request has been rejected!")
                window.location.reload();

            } else {
                console.log("error")
            }
        });
    };

    submitApprove = e => {
        const id = Number(this.state.reqId)
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.put(`${ROOT_URL}/api/approverequest/${id}` + `/${this.state.screenName}`).then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log(response.data)
                alert("Request has been approved!")
                window.location.reload();

            } else {
                console.log("error")
            }
        });
    };


    render() {
        console.log(this.props.data);
        return (
            <Fragment>
                <td>{this.props.data.id}</td>
                <td>{this.props.data.initiater.screenName}</td>
                <td><button style={{ marginLeft: "2%" }} className="btn btn-success" onClick={this.submitApprove}>Approve</button></td>
                <td><button style={{ marginLeft: "2%" }} className="btn btn-danger" onClick={this.submitReject}>Reject</button></td>
            </Fragment>
        )
    }
}

export default RequestData;