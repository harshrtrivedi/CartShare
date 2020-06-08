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

// Define a Login Component
class PastOrders extends Component {
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
            success:false
        }
        this.itemslist = this.itemslist.bind(this)
    }

    componentWillMount() {
        this.setState({
            authFlag: false,
            authFailed: false
        })
    }

    componentDidMount() {
        var userId = localStorage.getItem("ID")
        console.log(userId);
        axios.get(ROOT_URL + '/getpastorders', {
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

    onCheckout = (e) => {
        e.preventDefault();
        var id = e.target.id
        // id = JSON.stringify(id)
        console.log(id);
        
        axios.get(`${ROOT_URL}/deliveryissue/${id}`, {
            // params: {
            //     id: this.state.orderDetails.id
            // }
        })
            .then((response) => {
                this.setState({
                    // base64Image: 
                    success : true
                });
                 window.location.reload();
                // alert("Notified Pooler of missing item")
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

    render() {
        let singleOrder = null
        let redirectVar = null
        if (sessionStorage.getItem('email')) {
            redirectVar = <Redirect to='/home' />
        } else {
            redirectVar = <Redirect to='/login' />
        }


        // let invalidtag = null
        // if (this.state.authFailed) {
        //     invalidtag = (
        //         <label style={{ color: 'red' }}>*Invalid user name password!</label>
        //     )
        // }        



        let orderRecords = null
        
        


        let list = this.state.orderDetails
       // console.log(list)
        // console.log(list)
        if (list !== null) {
            orderRecords = Object.keys(list).map(row => {
               // console.log(list[row])
                if (this.state.toggle && list.indexOf(list[row]) === this.state.index) {
                    singleOrder = list[row].order_items.map(item => {
                        let toggleStatus = null
                        if(item.status==='DELIVERED'){
                            if(list[row].pickupOption != "self")
                            {
                                toggleStatus = (<div className="col-sm-3" style={{ float: "center" }}>
                                        <button id={item.id} type="button" onClick={this.onCheckout} class="btn btn-danger">Notify if not delivered</button>
                                    </div>)
                            }
                            // toggleStatus = (<div className="col-sm-3" style={{ float: "center" }}>
                            //             <button id={item.id} type="button" onClick={this.onCheckout} class="btn btn-danger">Notify if not delivered</button>
                            //         </div>)
                        }else{
                            toggleStatus = (<div className="col-sm-3" style={{ float: "center" }}>
                           Notified Pooler of the issue
                        </div>)
                        }
                        return (
                            <div className="row card" style={{ marginRight: "2%", padding: '1%' }}>
                                <div className="card-body">
                                    <div className="col-sm-3">
                                        <img src={item.product.imageurl} width="80" height="80"></img>
                                    </div>
                                    <div className="col-sm-9">
                                        <div className="row">
                                            <div className="col-sm-5" style={{ float: "left" }}>
                                                <h6>Name : {item.product.name}</h6>
                                            </div>
                                            
                                            {/* <div className="col-sm-3" style={{ float: "right" }}>
                                            
                                            </div> */}
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-7" >
                                                <h6>Quantity : {item.quantity}</h6>
                                            </div>

                                            {toggleStatus}
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-7">
                                                <h6>Price : {item.product.price}</h6>
                                            </div>

                                        </div>
                                        <div className="row">
                                        <div className="col-sm-7" >
                                                Status : {item.status}
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
                                    <div className='col-sm-5'>
                                        <label
                                            style={{
                                                marginLeft: '10px',
                                                fontSize: '17px',
                                                color: 'black'
                                            }}
                                        >
                                            {list[row].store.name}
                                        </label>
                                        <br></br>
                                        <label
                                            style={{
                                                marginLeft: '10px',
                                                fontSize: '17px',
                                                color: 'black'
                                            }}
                                        >
                                            Order id : {list[row].orderid}
                                        </label>
                                    </div>

                                    <div className='col-sm-4'>
                                        <div className="row"><label
                                            style={{
                                                fontSize: '13px',
                                                color: 'black'
                                            }}
                                            className='col-sm-3'
                                        >
                                            ${list[row].price}
                                        </label>
                                        </div>
                                        <div className="row">
                                            <label
                                                style={{
                                                    fontSize: '13px',
                                                    color: 'black'
                                                }}
                                            >
                                                {list[row].status}
                                            </label>

                                            
                                        </div>
                                        <div className="row">
                                            <label
                                                style={{
                                                    fontSize: '13px',
                                                    color: 'black'
                                                }}
                                            >
                                                Pickup : {list[row].pickupOption}
                                            </label>

                                            
                                        </div>
                                        
                                    </div>                               

                                    {/* <button id={list[row].pickup.id} type="button" onClick={this.onCheckout} class="btn btn-link">Any Issue</button> */}
                                </div>
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
                            <div style={{ textAlign: "center" }}>
                                <h2>Past Orders</h2>
                            </div>
                            <hr>
                            </hr>
                            <div style={{ paddingLeft: "20px" }} className="row">
                                <div className="col-sm-5">
                                    <b>Store Name</b>
                                </div>
                                <div className="col-sm-4">
                                    <b>Order Status</b>
                                </div>
                                <div className="col-sm-3">
                                    <b>Notify if issues</b>
                                </div>
                            </div>
                            <hr></hr>
                            <div>
                                <ul class='list-group'>
                                    {orderRecords}
                                </ul>
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

export default connect(mapStateToProps)(withRouter(PastOrders));