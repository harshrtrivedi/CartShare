import React, { Component } from 'react';
import ROOT_URL from '../../constants';

class VerifyAccount extends Component {

    verifyAccount = ((data) => {
        const headers = {
            'Accept': 'application/json'
        };
        console.log(data);
        fetch(`${ROOT_URL}/api/verifyaccount?ID=${data}`, {
            method: 'GET',
            mode: 'cors',
            headers: { ...headers, 'Content-Type': 'application/json' }
        }).then(response => {
            console.log("Status Code : ", response);
            if (response.status == 200) {
                console.log("Status Code in if: ", response);
                alert("User account has been verified Successfully");
                this.props.history.push('/login');
            }
            else if (response.status == 400) {
                console.log("Status Code in else if: ", response);
                alert("User account has already been verified");
                this.props.history.push('/login');
            }
            else {
                console.log("Status Code in else: ", response);
                alert("User can not be verified because of server error");
                window.location.reload();
            }
        });
    });
    render() {
        console.log("I am in verify account page");
        return (
            <div>
                <div>
                    {this.verifyAccount(this.props.match.params.ID)}
                </div>
            </div>
        );
    }
}



export default VerifyAccount;
