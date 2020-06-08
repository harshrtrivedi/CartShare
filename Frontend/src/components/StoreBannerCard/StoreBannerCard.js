import React from "react";
import "./BannerCard-styles.css";
import image from "../../images/stores.png"
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container
} from 'reactstrap';
// import Button from 'react-bootstrap/Button'
import axios from 'axios'
import ROOT_URL from '../../constants.js'
import { Link } from 'react-router-dom'

let deleteStore = e => {
  e.preventDefault()
  // alert("Inside Delete")
  // prevent page from refresh
  let data = JSON.parse(e.target.id)
  // alert(JSON.stringify(data.id));
  axios.defaults.withCredentials = true
  axios.delete(`${ROOT_URL}/deletestore/${data.id}`, { params: '' }).then(response => {
    console.log('Axios post:', response.data);
    window.location.reload(true)
  }).catch(error => {
    console.log(error);
    alert("There are Unfulfilled Orders")
  });


}


const StoreBannerCard = (bannerDetails) => {

  var deletebutton = null;
  // var editbutton = null;
let editbutton = null;
  if (JSON.parse(localStorage.getItem('role')) == "Admin") {
    deletebutton = (<button type="submit" class="btn btn-link" id={JSON.stringify(bannerDetails)} onClick={deleteStore} style={{ float: "right" }} >
      <i id={JSON.stringify(bannerDetails)} style={{ color: 'red' }} class="far fa-trash-alt"></i>
    </button>
    )
    editbutton = (
      <a className="btn btn-link" href={`/editstore/`+bannerDetails.id}>Edit Store</a>
    )
    
  }


  var adminlink = null;
  if (sessionStorage.getItem('storedetails') != null) {
    adminlink = (`/products/` + bannerDetails.id)
    

  } else {
    adminlink = (`/searchproducts/` + bannerDetails.id)
  }



  return (
    // <Link to = {`/searchproducts/` + bannerDetails.id}>
    // <div class="col-sm-3" >
    //   <div class="card" style={{width:"13rem",backgroundColor:"#F8F8F8"}}>
    //     <img class="card-img-top" style={{width:"12rem", height:'9rem'}} src={image} alt="Card image cap"/>
    //     <hr/>
    //     <div class="card-body">
    //     <h5 class="card-title">&nbsp;&nbsp;&nbsp;&nbsp;{bannerDetails.name}<span class="card-text" style={{fontSize:"15px", float:"right"}}>{deletebutton}
    //           <br></br></span></h5>
    //       {/* <p class="card-text" style={{fontSize:"15px", margin:"20px"}}> */}

    //           {/* <a href="#" class="btn btn-link" style={{color:"red"}}> &nbsp;Delete</a> */}

    //       {/* </p> */}
    //     </div>
    //   </div>
    // </div>
    // </Link>

    <div>
      {/* {adminlink} */}
    
        <div class="col-sm-3" >
        <Link to={adminlink} style={{ color: "black" }}>
          <div class="card" style={{ width: "13rem", backgroundColor: "#F8F8F8" }}>
            <img class="card-img-top" style={{ width: "13rem", height: '12rem' }} src={image} alt="Card image cap" />
            <br></br>
            <br />
            <div class="card-body">
              <h5 class="card-title">
                &nbsp;&nbsp;&nbsp;&nbsp;{bannerDetails.name}
                <span class="card-text" style={{ fontSize: "15px", float: "right" }}>
                    {deletebutton}
                    <br></br>
                </span>
              </h5>
              {/* <p class="card-text" style={{fontSize:"15px", margin:"20px"}}> */}

              {/* <a href="#" class="btn btn-link" style={{color:"red"}}> &nbsp;Delete</a> */}

              {/* </p> */}
            </div>
          </div>
          </Link>
          {editbutton}
        </div>
      </div>
  );
};

export default StoreBannerCard;