import React, { Component } from "react";
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import ROOT_URL from '../../constants.js'
import SearchPoolDataDetails from "./SerachPoolDataDetails"
import LeftNavbar from "../LeftNavbar/LeftNavbar"

class BuyerHome extends Component {

    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            itemname: "",
            search: "",
            items: [],
            // description: "",
            // price: "",
            // sectionid: this.props.match.params.sectionid,
            // imagePath: "http://localhost:3001/profilepics/d.jpeg",
            // itemimage: "",
            authFlag: false
        };
        //Bind the handlers to this class
        this.itemnameChangeHandler = this.itemnameChangeHandler.bind(this);
        // this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.selectChangeHandler = this.selectChangeHandler.bind(this);
        //this.submitSearch = this.submitSearch.bind(this);
    }

    selectChangeHandler = e => {
        this.setState({
            search: e.target.value.substr(0, 20)

        });
        console.log(" change 0]" + this.state.cuisine)
    };


    itemnameChangeHandler = e => {
        this.setState({
            itemname: e.target.value
        });
    };

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


        let unit = this.props.match.params.unit;
        let value = this.props.match.params.value;

        axios.defaults.withCredentials = true;
        axios.get(`${ROOT_URL}/api/searchpools/${unit}/${value}`).then(response => {

            // update the state with the response data
            this.setState({
                items: this.state.items.concat(response.data)
            })
            console.log('Axios post:', this.state.items);
            // window.location.reload(true)
        }).catch(error => {
            console.log(error);
            // this.setState({
            //     failed: true,
            //     success: false
            // })
        });


    }


    submitFilter = e => {
        window.location.reload();
    };

    render() {

        let details = this.state.items.map(item => {
            return (
                <tr>
                    <SearchPoolDataDetails key={Math.random} data={item}></SearchPoolDataDetails>
                </tr>
                // <tr key="index">
                //     <td>{book.BookID}</td>
                //     <td>{book.Title}</td>
                //     <td>{book.Author}</td>
                //     <td>{book.Status}</td>
                //     <input type="button" onClick={this.viewButton(index)} value="view details"></input>
                // </tr>
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
                                    <th>Pool Id</th>
                                    <th>Pool Name</th>
                                    <th>Neighbourhood</th>
                                    <th>Zipcode</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*Display the Tbale row based on data recieved*/}
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


export default BuyerHome;