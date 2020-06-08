import React, { Component } from 'react'
import '../../App.css'
// import './Addproducts.css'
import axios from 'axios'
import AdminNavbar from '../LeftNavbar/AdminNavbar'
import { Field, reduxForm } from 'redux-form'
import ROOT_URL from '../../constants.js'
import image from '../../images/Avatar.png'
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Cart from '../Cart/Cart'
import UserBanner from '../Banner/UserBanner'
// import {
//   Card, CardImg, CardText, CardBody,
//   CardTitle, CardSubtitle, Button
// } from 'reactstrap';
import Card from 'react-bootstrap/Card'
import Banner from '../Banner/Banner'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
// import { Button, Card, Image } from 'semantic-ui-react'

// Define a Login Component
class SearchProducts extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props) // maintain the state required for this component
    this.state = {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      store:'',
      products: [],
      productsDetails: [],
      authFlag: false,
      failed: false,
      success: false
    } // Bind the handlers to this class // this.usernameChangeHandler = this.usernameChangeHandler.bind(this) // this.passwordChangeHandler = this.passwordChangeHandler.bind(this) // this.submitLogin = this.submitLogin.bind(this)
  } // Call the Will Mount to set the auth Flag to false

  componentWillMount() {

    axios.defaults.withCredentials = true
    sessionStorage.setItem('items', []);
    sessionStorage.setItem('checkout', 'new');
    let { id } = this.props.match.params
    sessionStorage.setItem('store',id)
    axios
      .get(`${ROOT_URL}/getproducts/` + id, { params: '' })
      .then(response => {
        // console.log(response)
        sessionStorage.setItem("Allproductss", JSON.stringify(response.data[0]));
        this.setState({ productsDetails: response.data })
        // console.log(response.data);
        let data1 = (response.data).map(products => {
          return products.name;
        })
        console.log(data1);
        this.setState({
          products: data1
        })
      })
      let useremail = JSON.parse(sessionStorage.getItem('email'))
        // axios.defaults.withCredentials = true
        axios
        .get(`${ROOT_URL}/api/users/${useremail}`, { params: '' })
        .then(response => {
            localStorage.setItem("role",JSON.stringify(response.data.role))
            // alert(JSON.stringify(response.data.contributionCredit));
            this.setState({contributionCredit: response.data.contributionCredit})
            
        }).catch(e=>{ 
          console.log("error occured");
        })
  }

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = formValues => {
    console.log("Inside products Creation" + formValues);
    let data = {
      name: formValues.name,
      address: {
        street: formValues.street,
        city: formValues.city,
        state: formValues.state,
        zip: formValues.zip
      }
    }
    axios.defaults.withCredentials = true;
  }

  renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div>
          <label style={{ color: 'red' }}>{error}</label>
        </div>
      )
    }
  }

  renderInput = ({ input, label, meta, className = { className } }) => {
    return (
      <div>
        <div htmlFor='email' style={{ color: '#6b6b83' }}>
          {label}
        </div>
        <input
          className='form-control'
          style={{ marginRight: '10px' }}
          {...input}
        />
        {this.renderError(meta)}
      </div>
    )
  }

  render() {

    let redirectVar = null
    let invalidtag = null
    let displayCart = null

    if(sessionStorage.getItem("order_items"))
    {
      if(sessionStorage.getItem("order_items"))
      {
        sessionStorage.setItem('checkout',"new")
      }
      
    }
    

    if (sessionStorage.getItem('checkout') === 'new') {
      displayCart = (
        <Cart />
      )
    } else {
      displayCart = <div>Add items to your cart</div>
    }

    if (this.state.failed) {
      invalidtag = (
        <label style={{ color: 'red' }}>*products already exists!</label>
      )
    }

    if (this.state.success) {
      invalidtag = (
        <label style={{ color: 'green' }}>Successfully created new products</label>
      )
    }

    let bannerDetails = this.state.productsDetails;
    let bannerNew = []

    console.log(bannerDetails);
    var getNewproductsArray = (bannerDetails, countperrow) => {
      let count = bannerDetails.length
      let bannerNew = []

      while (count > 0) {
        let bannerrow = [];
        if (count - countperrow >= 0) {
          for (let i = 0; i < 4; i++) {
            bannerrow.push(bannerDetails[count - 1])
            count--;
          }

        } else {
          console.log(count);
          for (let j = count; j > 0; j--) {
            console.log(j);
            bannerrow.push(bannerDetails[j - 1])
            count--;
          }
        }
        bannerNew.push(bannerrow)
      }
      return bannerNew;
    }
    bannerNew = getNewproductsArray(bannerDetails, 3);
    let bannerFinal = bannerNew.map((data) => {
      return <UserBanner bannerDetails={data}></UserBanner>
    })

    return (

      < div >
        {/* {redirectVar} */}
        <div>
          <div className='row'>
            <div className='col-sm-2'>
              <LeftNavbar />
            </div>
            <div class='split-center_cart '>
              <div class='login-form'>
                <div class='panel'>
                  <br></br>
                  <h2 style={{ marginLeft: '20px' }}>List of products</h2>
                  <hr></hr>
                  <br></br>
                  
                </div>

                {/* <div className='row'>
                  <div className='col-sm-6'> */}
                {/* <form
                      className='ui form error'
                      onSubmit={this.props.handleSubmit(this.onSubmit)}
                    > */}
                {/* <div > */}
                <div>
                  {bannerFinal}
                  {/* <Banner bannerDetails={this.state.productsDetails}></Banner> */}
                </div>
                <br />
                {invalidtag}
                <br />
                {/* </div> */}
                {/* </form> */}
              </div>
            </div>
          </div>
        </div>
        <div className="split-right-list">
          <div style={{fontWeight:'bold', fontSize:'20px', marginLeft:'5%',marginTop:'15px'}}>Cart</div>
          <hr></hr>
          <div class='cart-form'>
            
            <div class='cart'>
              <div class='panel-cart'>
                <div className='row'>
                  <div style={{textAlign:"left"}} className='col-sm-3'>
                    <h2>Item</h2>
                  </div>
                  <div style={{textAlign:"center"}} className='col-sm-3'>
                    <h2>Quantity</h2>
                  </div>
                  <div style={{textAlign:"center"}} className='col-sm-3'>
                    <h2>Price</h2>
                  </div>
                </div>
              </div>
              {displayCart}
            </div>
          </div>
        </div>
      </div>

    )
  }
}




const validate = formValues => {
  const error = {}
  if (!formValues.name) {
    error.name = 'Enter a valid name'
  }
  if (!formValues.street) {
    error.street = 'Enter a valid street'
  }
  if (!formValues.city) {
    error.city = 'Enter a valid city'
  }
  if (!formValues.state) {
    error.state = 'Enter a valid state'
  }

  if (!formValues.zip) {
    error.zip = 'Enter a valid zip'
  }
  return error
}

const mapStateToProps = state => {
  return { owner: state.owner }
}

export default connect(
  mapStateToProps
)(
  reduxForm({
    form: 'streamMenu',
    validate: validate
  })(SearchProducts)
)