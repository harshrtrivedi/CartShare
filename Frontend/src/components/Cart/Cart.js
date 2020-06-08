import React from 'react'
import '../../App.css'
// import './RestaurantMenu.css'
import { Route, withRouter } from 'react-router-dom';
import axios from 'axios'
import ROOT_URL from '../../constants.js'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
// import { userOrder } from '../../actions'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import * as UTIL from '../utils/Utils'


class Cart extends React.Component {
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props)
    // maintain the state required for this component
    // alert(this.props);
    this.state = {
      checkout: '',
      failed: '',
      success: '',
      count: 0,
      pickupOption: false,
      selectedOption: "self",
      redirect: false,
      contributioncredit: '',
      poolSize:''
    }


    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.removeFromCart = this.removeFromCart.bind(this)
  }
  componentWillMount() {

    if (JSON.parse(localStorage.getItem("role")) == "User") {
      this.setState({ disableCheckout: true })

    } else {
      this.setState({ disableCheckout: false })
    }

    let useremail = JSON.parse(sessionStorage.getItem('email'))
    // axios.defaults.withCredentials = true
    axios
      .get(`${ROOT_URL}/api/users/${useremail}`, { params: '' })
      .then(response => {
        console.log(JSON.stringify(response.data))
        localStorage.setItem("role", JSON.stringify(response.data.role))
        // alert(JSON.stringify(response.data.contributionCredit));
        this.setState({ contributionCredit: response.data.contributionCredit })
        sessionStorage.setItem("cc", response.data.contributionCredit)

      }).catch(e => {
        console.log("error occured");
      })


        axios
            .get(`${ROOT_URL}/api/getpool/` + UTIL.getUserDetails())
            .then(response => {
                // console.log(response)
                console.log("Inside Fetch user role" + JSON.stringify(response.data));
                this.setState({
                    role: response.data[0],
                    poolname: response.data[1],
                    poolId :response.data[2],
                    poolSize:response.data[3]
                })
                // alert(JSON.parse(this.state.poolSize))
            })

  }
  onSubmit = (e) => {
    e.preventDefault();

    if (e.target.getAttribute('price') > 0) {

      if (this.state.count == 0) {
        this.setState({
          pickupOption: true
        })
        this.state.count++
      }
      else {
        let order_items = JSON.parse(sessionStorage.getItem("order_items"))
        let order = []
        order_items.map(item => {
          let temp = {
            product: {
              id: item.id
            },
            quantity: item.quantity,
            price: item.quantity * item.price
          }

          order.push(temp)
        })

        let data = {
          price: e.target.getAttribute('price'),
          status: "PENDING",
          store: {
            id: sessionStorage.getItem("store")
          },
          pickupOption: this.state.selectedOption,
          order_items: order,
        }

        sessionStorage.setItem("order", JSON.stringify(data))

        if (this.state.selectedOption == "self") {
          this.setState({
            redirect: true
          })
        }
        else {
          axios.post(`${ROOT_URL}/addorder`, data, {
            params:
            {
              userId: localStorage.getItem("ID")
            }
          }).then(response => {
            // update the state with the response data
            this.setState({
              failed: false,
              success: true,
              redirect: true
            })
            alert("Order succesfully placed")
            sessionStorage.removeItem("order_items")
            sessionStorage.removeItem("order")
            // window.location.reload()
            console.log('Axios post:', response.data);
          }).catch(error => {
            console.log(error);
            this.setState({
              failed: true,
              success: false
            })
          });

        }


        // axios.defaults.withCredentials = true
        // let userId = localStorage.getItem("ID")
        // axios.post(`${ROOT_URL}/addorder`, data, { params: { userId } }).then(response => {
        //   // update the state with the response data
        //   this.setState({
        //     failed: false,
        //     success: true,
        //     redirect:true
        //   })
        //   alert("Order succesfully placed")
        //   sessionStorage.removeItem("order_items")
        //   sessionStorage.removeItem("order")
        //   window.location.reload()
        //   console.log('Axios post:', response.data);
        // }).catch(error => {
        //   console.log(error);
        //   this.setState({
        //     failed: true,
        //     success: false
        //   })
        // });
      }
    }
    else {
      alert('Add atleast one product to the cart before checkouts!')
    }
  }

  handleOptionChange = (e) => {
    this.setState({
      selectedOption: e.target.value
    });
  }

  removeFromCart(e, obj) {
    console.log("Inside add to cart", obj);

    var oldOrderItems = []

    if (sessionStorage.getItem("order_items")) {
      oldOrderItems = JSON.parse(sessionStorage.getItem("order_items"))
    }

    if (oldOrderItems.length > 0) {
      for (let i = 0; i < oldOrderItems.length; i++) {
        if (oldOrderItems[i].id.sku == obj.id.sku) {
          console.log("i ", i)
          oldOrderItems.splice(i, 1)
        }
      }
    }

    sessionStorage.setItem("order_items", JSON.stringify(oldOrderItems))

    window.location.reload()
  }

  render() {
    let itemslist = null
    let pickupField = null
    let redirectVar = null
    let notAPooler = null
    let noPool = null;
    if(2 > this.state.poolSize){
      noPool = (
        <label>
                <input disabled type="radio" onChange={this.handleOptionChange} value="others" checked={this.state.selectedOption === 'others'} />
                  Other Pool Members (No Other poolers Present)
              </label>

      )
    }else{
      noPool = (
        <label>
                <input type="radio" onChange={this.handleOptionChange} value="others" checked={this.state.selectedOption === 'others'} />
                  Other Pool Members
              </label>

      )
    }
    if (this.state.disableCheckout) {
      notAPooler = (
        <label style={{ color: 'red', textAlign: 'center' }}>Join a pool to place an order</label>
      )
    }
    if (this.state.redirect) {
      if (this.state.selectedOption == "self") {
        redirectVar = <Redirect to='/checkout' />
      }
      else
      {
        redirectVar = <Redirect to='/orders' />
      }

    }
    else {
      redirectVar = null
    }
    let finalcc = null;
    let cc = sessionStorage.getItem("cc");
    // alert(this.state.contributioncredit)
    if (cc <= -4 && cc >= -5) {
      finalcc = (<button disabled className="btn btn-warning" ><span>contributionCredit:{this.state.contributionCredit}<span></span><br></br>Your contribution credit is low.<br /> Just a reminder.</span></button>)
    } else if (cc <= -6) {
      finalcc = (<button disabled className="btn btn-danger" >contributionCredit:   {this.state.contributionCredit} <span><br></br>Your contribution credit is very low.<br /> still want to continue?</span></button>)
    } else {
      finalcc = (<button disabled className="btn btn-success" >contributionCredit:   {this.state.contributionCredit}</button>)
    }

    if (this.state.pickupOption) {
      pickupField =
        <div>
          <div className="row" style={{ textAlign: "center" }}>
            <label>
              How do you want to pick up your order?
          </label>
          </div>
          <div className="row" style={{ textAlign: "center" }}>
            <div className="radio">
              <label>
                <input type="radio" value="self" onChange={this.handleOptionChange} checked={this.state.selectedOption === 'self'} />
                  Self
              </label>
            </div>
          </div>
          <div className="row" style={{ textAlign: "center" }}>
            <div className="radio">
              {noPool}

            </div>

            {finalcc}
            <br></br>
            <br></br>
          </div>
        </div>
    }
    let items = []
    if (sessionStorage.getItem("order_items")) {
      items = JSON.parse(sessionStorage.getItem("order_items"))
    }

    let total = 0;

    itemslist = (items).map(item => {
      console.log("Item ", item)
      // console.log('List',list)
      total = total + (item.price * item.quantity)
      return (
        <div className="row">
          <div style={{ textAlign: "left" }} className='col-sm-3'>
            <div>{item.name}</div>
          </div>
          <div style={{ textAlign: "center" }} className='col-sm-3'>
            {/* <div>*{items[item][0]}</div> */}
            <div>{item.quantity}</div>
          </div>
          <div style={{ textAlign: "center" }} className='col-sm-3'>
            <div>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: "left" }} className='col-sm-3'>
            <div>
              {/* <button type="submit" class="btn btn-link" id={JSON.stringify(item)}   > */}
              <i style={{ color: "red" }} onClick={(e) => { this.removeFromCart(e, item) }} id={JSON.stringify(item)} class="far fa-trash-alt fa-sm"></i>
              {/* </button> */}
              &nbsp;&nbsp;
              {/* <button type="submit" class="btn btn-link" id={JSON.stringify(item)}   > */}
              {/* <i onClick={(e) => { this.addToCart(e, item) }} class="fas fa-plus-circle fa-sm"></i> */}
              {/* </button> */}

            </div>
          </div>
          <br></br>
        </div>

      )
    })

    let grossTotal = total + total * 0.0975

    return (
      <div>
        {redirectVar}
        <br></br>
        <div >{itemslist}</div>

        {/* <br />   */}
        <hr></hr>
        <div className="row">
          <div style={{ textAlign: "left" }} className='col-sm-7'>
            <label>Tax</label>
          </div>
          <div style={{ textAlign: "left" }} className='col-sm-5'>
            <label>$ {(0.0925 * total).toFixed(2)}</label>
          </div>
        </div>
        <div className="row">
          <div style={{ textAlign: "left" }} className='col-sm-7'>
            <label>Convenience fee</label>
          </div>

          <div style={{ textAlign: "left" }} className='col-sm-5'>
            <label>$ {(0.005 * total).toFixed(2)}</label>
          </div>
        </div>
        <div className="row">
          <div style={{ textAlign: "left" }} className='col-sm-7'>
            <label>Total</label>
          </div>
          <div style={{ textAlign: "left" }} className='col-sm-5'>
            <label>$ {grossTotal.toFixed(2)}</label>
          </div>
        </div>
        <br />
        <div style={{ textAlign: "left" }} className="row">
          {pickupField}
        </div>

        <div className='row'>
          <button
            style={{ marginLeft: '35%' }}
            id="Button"
            className='btn btn-primary'
            type='submit'
            price={grossTotal}
            onClick={this.onSubmit}
            disabled={this.state.disableCheckout}
          >
            Checkout
          </button>
        </div>

        {notAPooler}
      </div>
    )
  }
}
// console.log("Inside search: ",this.props);

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(withRouter(Cart));
