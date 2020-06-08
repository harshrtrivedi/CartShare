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

// Define a Login Component
class Orders extends Component {
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
            orderDetails: []
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
        axios.get(ROOT_URL + '/getorders', {
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
        if (list !== null) {
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

                                    <label
                                        style={{
                                            fontSize: '13px',
                                            color: 'black'
                                        }}
                                        className='col-sm-3'
                                    >
                                        $ {list[row].price}
                                    </label>
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
                            <div style={{ textAlign: "center" }}>
                                <h2>Upcoming Orders</h2>
                            </div>
                            <hr>
                            </hr>
                            <div style={{paddingLeft:"20px"}} className="row">
                                <div  className="col-sm-5">
                                   <b>Store Name</b> 
                                </div>
                                <div className="col-sm-4">
                                   <b>Order Status</b> 
                                </div>
                                <div className="col-sm-3">
                                   <b>Total Price</b> 
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

export default connect(mapStateToProps)(withRouter(Orders));