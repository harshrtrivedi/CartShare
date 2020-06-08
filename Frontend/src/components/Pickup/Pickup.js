import React, { Component } from 'react'
import '../../App.css'
// import './Order.css'
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
import QRCode from 'qrcode';

// Define a Login Component
class Pickup extends Component {
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
            qrcode: [],

        }
        this.itemslist = this.itemslist.bind(this)
    }

    componentWillMount() {
        this.setState({
            authFlag: false,
            authFailed: false
        })
        // let useremail = sessionStorage.getItem('email')
        // axios.defaults.withCredentials = true
        // axios
        // .get(`${ROOT_URL}/users/${useremail}`, { params: '' })
        // .then(response => {
        //     alert(JSON.stringify(response.data))
        //     localStorage.setItem("role",JSON.stringify(response.data.role))
        // })
    }

    componentDidMount() {
        var userId = localStorage.getItem("ID")
        // console.log("Order Details are ", userId)
        axios.get(ROOT_URL + '/pickupmenu', {
            params: {
                id: userId
            }
        })
            .then((response) => {
                this.setState({
                    orderDetails: response.data
                });
                console.log("Order Details are ", response.data)
            });


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


    onCheckout = (e) => {
        e.preventDefault();
        var id = [e.target.id]
        // id = JSON.stringify(id)
        console.log(id);

        axios.get(`${ROOT_URL}/qrcode/${id}`, {
            // params: {
            //     id: this.state.orderDetails.id
            // }
        })
            .then((response) => {
                this.setState({
                    qrcode: 'data:image/png;base64,' + response.data,
                    qrSuccess: true
                    // base64Image: 
                });

                console.log("QR code ", response.data)
                // alert("Order successfully  Picked up")
            });


    }


    render() {
        let singleOrder = null
        let redirectVar = null
        let newOrder = null;
        // var QRCode;
        if (sessionStorage.getItem('email')) {
            redirectVar = <Redirect to='/home' />
        } else {
            redirectVar = <Redirect to='/login' />
        }


        let orderRecords = null


        let list = this.state.orderDetails
        console.log(list)
        if (list !== null) {
            orderRecords = Object.keys(list).map(row => {
                console.log(list[row].orders);
                if (this.state.toggle && list.indexOf(list[row]) === this.state.index) {
                    let xz = null;
                    singleOrder = list[row].orders.map(order => {
                        xz = list[row].orders
                        console.log(xz);
                        newOrder = order.order_items.map(item => {
                            return (
                            <div>
                                <div className="row">
                                <div className="col-sm-6">
                                    <h6>Product Name : {item.product.name}</h6>
                                </div>

                                <div className="col-sm-3">
                                    <h6>Price : {item.product.price}</h6>
                                </div>

                                <div className="col-sm-3">
                                    <h6>Quantity : {item.quantity}</h6>
                                </div>
                                <br></br>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                            <img src={item.product.imageurl} width="100" height="80"></img>
                                        </div>
                            </div>
                            </div>
                            )
                        })
                        return (
                            <div  className="row card" style={{ marginRight: "2%", padding: '1%' }}>
                                <div className="card-body">
                                    {/* <div className="col-sm-3">
                                            <img src={item.product.imageurl} width="80" height="80"></img>
                                        </div> */}
                                    <div className="col-sm-9">
                                        <div className="row">
                                            <div className="col-sm-7" style={{ float: "left" }}>
                                                <h6>Orderid : {order.orderid}</h6>
                                            </div>
                                            <div className="col-sm-5" style={{ float: "right" }}>
                                                Pickup : {order.pickupOption}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <h6>status : {order.status}</h6>
                                            </div>
                                            <div className="col-sm-5">
                                                <h6>Price : {order.price}</h6>
                                            </div>
                                        </div>
                                        <br></br>
                                        <label style={{ color: "red" }}>Order _Items:</label>
                                        {newOrder}

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
                                    <div className='col-sm-3'>
                                        <label
                                            style={{
                                                marginLeft: '10px',
                                                fontSize: '17px',
                                                color: 'black'
                                            }}
                                        >
                                            {list[row].id}
                                        </label>
                                    </div>
                                    <div className='col-sm-3'>
                                        <label
                                            style={{
                                                fontSize: '13px',
                                                color: 'black',
                                                float:"center"
                                            }}
                                        >
                                            {list[row].status}
                                        </label>
                                    </div>

                                    <label
                                        style={{
                                            fontSize: '13px',
                                            color: 'black',
                                            textAlign:"center"
                                        }}
                                        className='col-sm-3'
                                    >
                                        {list[row].orders.length}
                                    </label>

                                    <div className='col-sm-3'>
                                        {/* <button className='btn btn-success' >Checkout</button> */}

                                        <button id={list[row].id} type="button" onClick={this.onCheckout} class="btn btn-success" data-toggle="modal" data-target="#myModal">Checkout</button>



                                    </div>



                                </div>
                                {/* <br /> */}
                                <div style={{ marginLeft: '10px' }} className='row'>
                                    {singleOrder}

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
                        <div class='split-center_cart'>
                            <div style={{ textAlign: "center" }}>
                                <h2>Pickup Menu</h2>
                            </div>
                            <hr>
                            </hr>
                            <div style={{ paddingLeft: "10px" }} className="row">
                                <div style={{textAlign:"left"}} className="col-sm-3">
                                    <b>PickUp Id</b>
                                </div>
                                <div style={{textAlign:"left"}} className="col-sm-3">
                                    <b>Pickup Status</b>
                                </div>
                                <div style={{textAlign:"left"}} className="col-sm-3">
                                    <b>Orders to Pickup</b>
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

                            </div>
                        </div>
                        {/* <div class='row'> */}
                        <img src={this.state.qrcode} style={{ float: 'right', marginRight: '8%' }}></img>
                        {/* </div>

                        <br></br>
                        
                        <div class='row'>
                            {qrcodesuccess}
                        </div> */}


                    </div>

                </div>
            </div >

        )
    }
}

const mapStateToProps = state => {
    return { user: state.user }
}

export default connect(mapStateToProps)(withRouter(Pickup));