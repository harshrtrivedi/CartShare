import React, { Component } from 'react'
import '../../App.css'
import './Order.css'
import axios from 'axios'
import { Route, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router'
import { loginuser } from '../../actions'
import { reduxForm } from 'redux-form'
import { getProfile } from '../../actions'
import { connect } from 'react-redux'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import ROOT_URL from '../../constants'
import UserBanner from '../Banner/UserBanner'
import { interpolateMagma } from 'd3-scale-chromatic';
import { history } from "../utils/Utils"

// Define a Login Component
class Checkout extends Component {
    // call the constructor method
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            authFlag: false,
            authFailed: false,
            toggle: false,
            index: "",
            tweets: [],
            orderDetails: [],
            value: '',
            contributioncredit:''
        }
        this.itemslist = this.itemslist.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentWillMount() {
        this.setState({
            authFlag: false,
            authFailed: false
        })
    }

    componentDidMount() {
        let data = {
            store: {
                id: sessionStorage.getItem("store")
            },
            userid: localStorage.getItem("ID")
        }
        let id =  localStorage.getItem("ID")
        axios.get(`${ROOT_URL}/users/${id}`)
            .then((response) => {
                this.setState({
                    // orderDetails: response.data
                    contributioncredit:response.data
                });
                console.log("Order Details are ", response.data)

            });


        axios.get(ROOT_URL + '/getpoolorders', {
            params: {
                storeid: sessionStorage.getItem("store"),
                userid: localStorage.getItem("ID")
            }
        })
            .then((response) => {
                this.setState({
                    orderDetails: response.data
                });
                console.log("Order Details are ", response.data)
            });


    }

    inputHandler = (e) => {
        e.preventDefault
        this.setState({
            value: e.target.value
        })
    }


    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    itemslist = (index) => {
        console.log("index", index)
        this.setState({
            toggle: !this.state.toggle,
            index: index
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        // if (document.getElementById('selectNumber').value != "Choose a number") {

            axios.defaults.withCredentials = true
            console.log("Number of Orders to pickup ", document.getElementById('selectNumber').value)
            let data = JSON.parse(sessionStorage.getItem("order"))
            let userId = localStorage.getItem("ID")
            
            axios.post(`${ROOT_URL}/addorder`, data, {
                params:
                {
                    userId: userId,
                    pickupOrder: document.getElementById('selectNumber').value
                }
            }).then(response => {
                // update the state with the response data
                this.setState({
                    failed: false,
                    success: true,

                })
                alert("Order succesfully placed")
                sessionStorage.removeItem("order_items")
                sessionStorage.removeItem("order")
                // window.location.reload()
                history.push('/orders')

                window.location.reload()
                console.log('Axios post:', response.data);

            }).catch(error => {
                console.log(error);
                this.setState({
                    failed: true,
                    success: false
                })
            });


        // }
        // else {
        //     alert('Add atleast one product to the cart before checkouts!')
        // }
    }
    

    render() {
        let singleOrder = null
        let redirectVar = null
        let index = 0
        if (sessionStorage.getItem('email')) {
            redirectVar = <Redirect to='/home' />
        } else {
            redirectVar = <Redirect to='/login' />
        }

        // var select = [];
        // //var rows = [];
        // for (var i = 1; i <= this.state.orderDetails.length; i++) {
        //     select.push(i);

        // }

        
        var select = document.getElementById("selectNumber");

        // while (select.hasChildNodes()) {
        //     select.removeChild()
        // }

        //       var select = document.getElementById("DropList");
        if (select != null) {
            var length = select.options.length;
            for (i = length - 1; i > 0; i--) {
                select.options[i] = null;
            }
         }

        //  var el = document.createElement("option");
        //  el.textContent = "Choose any number";
        //  el.value = "Choose any number";
        //  select.appendChild(el);

        for (var i = 1; i <= this.state.orderDetails.length; i++) {

            var el = document.createElement("option");
            el.textContent = i;
            el.value = i;
            select.appendChild(el);
        }



        // let invalidtag = null
        // if (this.state.authFailed) {
        //     invalidtag = (
        //         <label style={{ color: 'red' }}>*Invalid user name password!</label>
        //     )
        // }        



        let orderRecords = null



        let list = this.state.orderDetails
        console.log(list[0])
        if (list !== null) {
            orderRecords = Object.keys(list).map(row => {
                if (this.state.toggle && list.indexOf(list[row]) === this.state.index) {
                    singleOrder = list[row].order_items.map(item => {
                        return (
                            <div className="row card" style={{ marginRight: "2%" }}>
                                <div className="card-body">
                                    <div className="col-sm-3">
                                        <img src={item.product.imageurl} width="80" height="80"></img>
                                    </div>
                                    <div className="col-sm-9">
                                        <div className="row">
                                            <div className="col-sm-7" style={{ float: "left" }}>
                                                <h6>Name : {item.product.name}</h6>
                                            </div>
                                            <div className="col-sm-5" style={{ float: "right" }}>
                                                Sub-total : ${item.price}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <h6>Quantity : {item.quantity}</h6>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <h6>Price : {item.product.price}</h6>
                                            </div>

                                        </div>
                                       
                                    </div>
                                </div>


                            </div>
                        )
                    })
                }
                else {
                    singleOrder = null
                }

                return (
                    <a href='#' onClick={(e) => { this.itemslist(list.indexOf(list[row])) }} style={{ marginTop: '20px' }} class='list-group-item'>
                        <div>
                            <div>
                                <div className='row'>
                                    <div className='col-sm-4'>
                                        <label
                                            style={{
                                                marginLeft: '10px',
                                                fontSize: '17px',
                                                color: 'black'
                                            }}
                                        >
                                            {list[row].store.name}
                                        </label>
                                    </div>
                                    <div className='col-sm-4'>
                                        <label
                                            style={{
                                                fontSize: '13px',
                                                color: 'black'
                                            }}
                                        >
                                            {list[row].status}
                                        </label>
                                    </div>
                                    <div className='col-sm-4'>
                                        <label
                                            style={{
                                                fontSize: '13px',
                                                color: 'black',
                                                marginLeft: "25px"
                                            }}

                                        >
                                            $ {list[row].price}
                                        </label>
                                        <label
                                            style={{
                                                fontSize: '13px',
                                                color: 'black',
                                                marginLeft: "25px"
                                            }}

                                        >
                                            {list[row].orderTime}
                                        </label>
                                    </div>

                                </div>
                                {/* <br /> */}

                                <div style={{ marginLeft: '10px' }} className='row'>
                                    
                                    {singleOrder}
                                    
                                    {/* {itemslist( */}
                                    {/* {list[row].order_items.map(item => {
                                       
                                    })}, */}
                                    {/* list[row].status
                                    )} */}
                                </div>
                                
                            </div>
                        </div>
                    </a>
                )
            })
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
                            <div style={{ textAlign: "center", marginTop: "30px" }}>
                                {/* <h2>Checkout</h2> */}
                                <h5>Would you like to pick up other Pool member's orders at the store.</h5>
                                <h5>If yes, Please select number of orders you would like to pick </h5>
                                <form id="myForm" onSubmit={this.onSubmit} >
                                    <div style={{ marginBottom: "10px" }}>
                                        <label>Choose number of orders to pick</label>
                                        <select id="selectNumber" >

                                            <option>0</option>

                                        </select>
                                    </div>
                                    <div >
                                        <button type='submit' class='btn btn-info'>
                                            Place Order
                                        </button>
                                    </div>
                                </form>

                            </div>
                            <hr>
                            </hr>

                            <div style={{ paddingLeft: "20px" }} className="row">

                                <div className="col-sm-4">
                                    <b>Store Name</b>
                                </div>
                                <div className="col-sm-4">
                                    <b>Order Status</b>
                                </div>
                                <div className="col-sm-4" style={{ textAlign: "left" }}>
                                    <b>Total Price</b>
                                </div>
                            </div>
                            <hr></hr>
                            <div>
                                <ul class='list-group'>
                                    {orderRecords}
                                </ul>
                                <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                            </div>

                        </div>
                        <div className='col-sm-1' />
                    </div>
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return { user: state.user }
}

export default connect(mapStateToProps)(withRouter(Checkout));