import React, { Component } from 'react'
import '../../App.css'
import './SearchBar.css'
import axios from 'axios'
import { loginuser } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
// import { ReactModal } from 'react-modal';
import StoreBanner from '../StoreBanner/StoreBanner'
import ROOT_URL from '../../constants.js'
import Banner from '../Banner/Banner'
// import { Field, reduxForm } from 'redux-form'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
import Multiselect from 'react-widgets/lib/Multiselect'
import AdminNavbar from '../LeftNavbar/AdminNavbar'



// Define a Login Component
class ProductSearchBar extends Component {
  // call the constructor method
  constructor(props) {
    super(props)

    this.state = {
      storeId: "",
      text: "",
      result: "",
      units:['Name', 'Store Id','Sku'],
      toggle:'true',
      success:'true',
      storesuccess:'false',
      inputType:"text"
    }

    this.textChangeHandler = this.inputChangeHandler.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
  }


  inputChangeHandler = e => {
    this.setState({
        [e.target.name]: e.target.value,
        text : e.target.value
    })
}

 ddChangeHandler = e=>{
  // alert(e)
  
  if(e === 'Store id'){
    this.setState({
      inputType:"number"
    })
  }
  else if(e === 'Name'){
    this.setState({
      inputType:"text"
    })
  }else if(e.unit==='Sku'){
    this.setState({
      inputType:"number"
    })
  }

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

  renderDropdownList = ({ input, ...rest }) =>
    <DropdownList {...input} {...rest} />

  renderMultiselect = ({ input, ...rest }) =>
    <Multiselect {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []} // requires value to be an array
      {...rest} />


  componentWillMount() {

  }

  onSubmit = (e) => {
    // e.preventDefault();
    // alert(e.target.value)
    const data = { text:this.state.text }
    console.log(data)
    // alert(e.unit)
    console.log(e.unit === 'Store id')
    if(e.unit === 'Store id'){
    // alert("hi");
    axios.defaults.withCredentials = true;
    axios.post(`${ROOT_URL}/searchproductbystore`, data, {
      params:
      {
        storeid: this.state.text
      }
    }).then(response => {
      // update the state with the response data
      this.setState({
        inputType:"number",
        result: response.data,
        toggle:false,
        storesuccess:true,
        // success:true
      })
      console.log('Axios post:', response.data);
    }).catch(error => {
      console.log(error);
      this.setState({
        failed: true,
        storesuccess:false
      })
    });
  }else if(e.unit==='Name'){
    axios.defaults.withCredentials = true;
    const data = { text:this.state.text }
    console.log(data);
    // axios.post(`${ROOT_URL}/searchproduct`, data)
    //   .then(response => {
    //     this.setState({
    //       result: response.data,
    //       toggle:true,
    //       success:true
    //     })
    //     console.log('Axios post:', response.data);
    //   }).catch((error) => {
    //     this.setState({
    //       success:false
    //     })
    //   });
    axios.post(`${ROOT_URL}/searchproduct`, data, {
      params:
      {
        name: this.state.text
      }
    }).then(response => {
      // update the state with the response data
      this.setState({
        inputType:"text",
        result: response.data,
        toggle:true,
        storesuccess:true,
        // storesuccess:false
      })
      console.log('Axios post:', response.data);
    }).catch(error => {
      console.log(error);
      this.setState({
        failed: true,
        storesuccess:false
      })
    });
  }else if(e.unit==='Sku'){
    const data = { text:this.state.text }
    console.log(data);
    axios.post(`${ROOT_URL}/searchproductbysku`, data, {
      params:
      {
        sku: this.state.text
      }
    }).then(response => {
      // update the state with the response data
      this.setState({
        inputType:"number",
        result: response.data,
        toggle:false,
        storesuccess:true
      })
      console.log('Axios post:', response.data);
    }).catch(error => {
      console.log(error);
      this.setState({
        storesuccess: false,
      })
    });
  }
}



  clearsearchlist = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('searchproducts');
    window.location.reload();
  }

  render() {
    let newselect = null;
    if(this.state.inputType=="number"){
      newselect=(
        <div>
        <label style={{color:"rgb(107, 107, 131)"}}>Value </label><br></br>
                        <input
                        style={{width:"100%",borderRadius: "4px",
                        border: "1px solid #ccc",height:"40px"}}
                          name='Value'
                          type='number'
                          min="0"
                          component={this.renderInput}
                          onChange={this.inputChangeHandler}
                          // label='price'
                        />
                        </div>
      )
    }else{
      newselect=(
        <div>
        <label style={{color:"rgb(107, 107, 131)"}}>Value </label><br></br>
        <input
        style={{width:"100%",borderRadius: "4px",
        border: "1px solid #ccc",height:"40px"}}
          name='Value'
          type='text'
          component={this.renderInput}
          onChange={this.inputChangeHandler}
          // label='price'
        />
        </div>
      )
    }
    const { handleSubmit, pristine, submitting } = this.props
    let bannerDetails = this.state.result;
    console.log(bannerDetails)
    let bannerNew = []
    const units = ['Name', 'Store id', 'Sku']

    var getNewproductsArray = (bannerDetails, countperrow) => {
      let count = bannerDetails.length
      let bannerNew = []
      // let countperrow=2;
      while (count > 0) {
        let bannerrow = [];
        if (count - countperrow >= 0) {
          for (let i = 0; i < countperrow; i++) {
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
    bannerNew = getNewproductsArray(bannerDetails, 4);
    let bannerFinal = null;
    let namesuccess=null;
    
    if(this.state.toggle && this.state.success){
      bannerFinal = bannerNew.map((data) => {
        return <StoreBanner bannerDetails={data}></StoreBanner>
      })
    }
    
    // else{
    //   bannerFinal = null;
    // }
    
    // if(!this.state.success){
    //   bannerFinal=null;
    //   successtore = null;
    //   namesuccess = (<label style = {{color:"red",float:"center"}}>Product with name not found</label>)
    // }

    if(!this.state.toggle && this.state.storesuccess){
      bannerFinal = bannerNew.map((data) => {
      return <Banner bannerDetails={data}></Banner>
    })
  }

  let successtore =null;
  if(!this.state.storesuccess){
    bannerFinal = null;
    namesuccess=null;
    successtore = (<label style = {{color:"red",marginLeft:"5%"}}>Product not found</label>)
  }
    // console.log(bannerFinal);
    let Searchbutton = null;
    // if (sessionStorage.getItem('searchproducts') != null) {
    //   Searchbutton = <button id='searchbarbutton' style={{ outline: 'none' }} type='submit' class='searchButton' onClick={this.clearsearchlist} >
    //     <i class="fas fa-times-circle"></i>
    //   </button>
    // } else {
    Searchbutton = <button id='searchbarbutton' style={{ outline: 'none' }} type='submit' class='searchButton' onClick={this.submitSearch} >
      <i class='fa fa-search' />
    </button>
    // }
    return (       
      
      < div >
        <div>
          <div className='row'>
            <div className='col-sm-2'>
              <AdminNavbar />
            </div>
            <div class='split-center_home'>
              <div class='login-form'>
                <div class='panel'>
                  <br></br>
                  <h2 style={{ marginLeft: '20px' }}>Search Products</h2>
                  <hr></hr>
                </div>
                <div className='row'>
                  <div className='col-sm-6'>
                    <form
                      className='ui form error'
                      onSubmit={this.props.handleSubmit(this.onSubmit)}
                      // onChange={this.inputChangeHandler}
                    >
                      <div style={{ marginLeft: '10%' }}>
                        {/* <br /> */}
                        
                        
                        
                        <div style={{ color: '#6b6b83' }}>
                          Unit
                        </div>

                        <Field
                          name="unit"
                          component={this.renderDropdownList}
                          onChange={this.ddChangeHandler}

                          data={units}
                          style={{
                            width: "100%",
                            border: "solid #ffffff",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontFamily: "graphik"
                          }}
                          valueField="value"
                          textField="unit" />
                        <br />

                        {newselect}
                        <br />
                        {/* {invalidtag} */}
                        <br />
                        <button type='submit' disabled={pristine || submitting} class='btn btn-info'
                        >
                         Search for products
                        </button>

                        <br />
                        <br />
                        <br />
                        <br />
                      </div>
                    </form>
                  </div>
                </div>
                {/* {namesuccess} */}
                {bannerFinal}
                {successtore}
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div >
    )

  }
}
    



const validate = formValues => {
  const error = {}
  if (!formValues.email) {
    error.email = 'Enter a valid email'
  }
  if (!formValues.password) {
    error.password = 'Enter a valid Password'
  }
  return error
}
const mapStateToProps = state => {
  return { user: state.user }
}

// export default connect(
//   mapStateToProps,
//   { loginuser }
// )(
//   reduxForm({
//     form: 'streamLogin',
//     validate: validate
//   })(ProductSearchBar)
// )

ProductSearchBar = reduxForm({
  form: 'reactWidgets',  // a unique identifier for this form
})(ProductSearchBar)

export default ProductSearchBar
