import React, { Component, Fragment } from "react";
import "../../App.css";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";

class SearchPoolDataDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.data);
        return (
            <Fragment>
                <td>{this.props.data.poolId}</td>
                <td>{this.props.data.name}</td>
                <td>{this.props.data.neighbourhood}</td>
                <td>{this.props.data.zipcode}</td>
                <td><Link to={`/joinpool/${this.props.data.poolId}`} ><button style={{ marginLeft: "2%" }} className="btn btn-info">Join Pool</button></Link></td>
            </Fragment>
        )
    }
}

export default SearchPoolDataDetails;