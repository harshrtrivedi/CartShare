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
class Delivery extends Component {
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
            success:'false'

        }
        this.itemslist = this.itemslist.bind(this)
    }

    componentWillMount() {
        this.setState({
            authFlag: false,
            authFailed: false,
            success:false
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
        axios.get(ROOT_URL + '/delivery', {
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
        // console.log("index", index)
        this.setState({
            toggle: !this.state.toggle,
            index: index
        })
    }


    onCheckout = (e) => {
        e.preventDefault();
        var id = e.target.id
        console.log("OrderId:",id);
        // alert(id)
        // id = JSON.stringify(id)
        // console.log(id);
        
        axios.get(`${ROOT_URL}/delivered/${id}`, {
        })
            .then((response) => {
                alert("Order Succesfully Delivered");
                this.setState({
                    status: true,
                    success:true
                })
                window.location.reload();
                }).catch(error=>{
                    this.setState({
                        success:false
                    })
            });


    }


    render() {
        let singleOrder = null
        let redirectVar = null
        // var QRCode;
        if (sessionStorage.getItem('email')) {
            redirectVar = <Redirect to='/home' />
        } else {
            redirectVar = <Redirect to='/login' />
        }


        let orderRecords = null

        let list = this.state.orderDetails
        // console.log(list)
        if (list !== null) {
            console.log(this.state.orderDetails);
            orderRecords = Object.keys(list).map(row => {
                
                if (this.state.toggle && list.indexOf(list[row]) === this.state.index) {
                    singleOrder = list[row].order_items.map(item => {
                        return (
                            <div className="row card" style={{ marginRight: "2%",padding:'1%' }}>
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
                let deliver =null;
                if(this.state.success){
                deliver = (
                    <button class="btn btn-success" data-toggle="modal" data-target="#myModal">Delivered</button>

                )
                }else{
                    deliver = ( <button type="button" id={list[row].orderid} type="button" onClick={this.onCheckout} class="btn btn-danger" data-toggle="modal" data-target="#myModal">Deliver</button>
                    )
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
                                            {list[row].buyerId.screenName}
                                        </label>
                                    </div>
                                    <div className='col-sm-3'>
                                        <label
                                            style={{
                                                fontSize: '13px',
                                                color: 'black'
                                            }}
                                        >
                                            {list[row].orderid}
                                        </label>
                                    </div>

                                    <label
                                        style={{
                                            fontSize: '13px',
                                            color: 'black'
                                        }}
                                        className='col-sm-3'
                                    >
                                    {list[row].buyerId.address.street}
                                    <br></br>
                                    {list[row].buyerId.address.city}
                                    <br></br>
                                    {list[row].buyerId.address.state}
                                    <br></br>
                                    {list[row].buyerId.address.zip}
                                    </label>

                                    <div className='col-sm-3'>
                                        {/* <button className='btn btn-success' >Checkout</button> */}

                                        {/* <button  id={list[row].orderid} type="button" onClick={this.onCheckout} class="btn btn-danger" data-toggle="modal" data-target="#myModal">Delivered</button> */}
                                        {deliver}

                                       
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
                        <div class='split-center_home'>
                            <div style={{ textAlign: "center" }}>
                                <h2>Orders to Deliver</h2>
                            </div>
                            <hr>
                            </hr>
                            <div style={{ paddingLeft: "20px" }} className="row">
                                <div className="col-sm-3">
                                    <b>Name</b>
                                </div>
                                <div className="col-sm-3">
                                    <b>OrderId</b>
                                </div>
                                <div className="col-sm-3">
                                    <b>Address</b>
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
                            <img src={this.state.qrcode} style={{float:'right', marginRight:'8%'}}></img>
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

export default connect(mapStateToProps)(withRouter(Delivery));