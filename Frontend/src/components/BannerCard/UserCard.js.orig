import React, { Component } from "react";
import "./BannerCard-styles.css";
import image from "../../images/Avatar.png"
import NumericInput from 'react-numeric-input';
import  './UserCard.css'
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container
} from 'reactstrap';
// import Button from 'react-bootstrap/Button'
import axios from 'axios'
import ROOT_URL from '../../constants.js'

// let AddtoCart = e => {
//   e.preventDefault()
//   // alert("Inside Delete")
//   // prevent page from refresh
//   let data =  JSON.parse(e.target.id)
// //   alert(JSON.stringify(data.id));
//   axios.defaults.withCredentials = true
// //   axios.delete(`${ROOT_URL}/deleteproductbyid/${data.id.storeId}/${data.id.sku}`,  {params: ''}).then(response => {
// //     console.log('Axios post:', response.data);
// //     window.location.reload(true)
// //   }).catch(error => {
// //     console.log(error);
// //   });
// }

class UserCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      value: 1
    }

    this.addToCart = this.addToCart.bind(this);
    this.inputHandler = this.inputHandler.bind(this)
  }

  addToCart(e, obj) {
    console.log("Inside add to cart", obj);
    
    var oldOrderItems = []    

    if (localStorage.getItem("order_items")) {
      oldOrderItems = JSON.parse(localStorage.getItem("order_items"))
    }    
    
    if(oldOrderItems.length>0)
    {
      for(let i=0;i<oldOrderItems.length;i++)
      {
         if(oldOrderItems[i].id.sku == obj.id.sku)
         {
          console.log("i ",i)
          oldOrderItems.splice(i,1)          
         }         
      }
    }

    obj.quantity = this.state.value
    oldOrderItems.push(obj)
    console.log(oldOrderItems)
    localStorage.setItem("order_items", JSON.stringify(oldOrderItems))
    window.location.reload()
  }

  inputHandler=(e)=>{
      console.log("Inside input handler")
      e.preventDefault      
      this.setState({
        value: e.target.value
      })
      console.log("Value ",this.state.value)
  }

  render() {

    let bannerDetails = this.props.item
    console.log("Inside User Card ", bannerDetails)

    return (
      <div class="col-sm-4" >
        <div class="card" style={{ width: "13rem", backgroundColor: "#F8F8F8" }}>
          <img class="card-img-top" style={{ width: "12rem", height: '9rem' }} src={image} alt="Card image cap" />
          <hr />
          <div class="card-body">
            <h5 class="card-title">&nbsp;&nbsp;&nbsp;&nbsp;{bannerDetails.name}<span class="card-text" style={{ fontSize: "15px", float: "right" }}>${bannerDetails.price}&nbsp;&nbsp;&nbsp;&nbsp;</span></h5>
            <p class="card-text" style={{ fontSize: "15px", margin: "20px" }}>
             
              {bannerDetails.description}

              <div >
                <br></br>
                <label>Quantity</label>
                <div style={{float:"right"}}>
                  {/* <NumericInput min={0} size={1} id="quantity"  value={this.state.value} /> */}
                  <input type="number" id="number" onChange={e=>this.inputHandler(e)} min="1" value={this.state.value} ></input>
                </div>
              </div>
              <div style={{textAlign:"center"}}>
              <button type="submit" class="btn btn-link" id={JSON.stringify(bannerDetails)} /*  onClick={AddtoCart} */ style={{  }} >
                {/* <i id={JSON.stringify(bannerDetails)} style={{ color: 'red' }} class="far fa-trash-alt"></i> */}
                <i id={JSON.stringify(bannerDetails)} onClick={(e) => { this.addToCart(e, bannerDetails) }} style={{ color: 'green' }} class="fas fa-plus-circle fa-lg"></i>
              </button>
              </div>              
              {/* <form className="form-inline">
                                    <div className="form-group mx-sm-3 mb-2">
                                        <label className="sr-only">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            // onChange={(e) => this.updateQty(e, i)}
                                            name="ItemQuantity"
                                            placeholder="Qty"
                                            // defaultValue={elem.Quantity}
                                        />
                                    </div>
                                </form> */}
              
              {/* <a href="#" class="btn btn-link" style={{color:"red"}}> &nbsp;Delete</a> */}

            </p>
          </div>
        </div>
      </div>

    );
  }
}

export default UserCard;