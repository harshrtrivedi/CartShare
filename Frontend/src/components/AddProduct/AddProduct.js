import React, { Component } from 'react'
import '../../App.css'
import './AddProduct.css'
import axios from 'axios'
import AdminNavbar from '../LeftNavbar/AdminNavbar'
import { Field, reduxForm } from 'redux-form'
import ROOT_URL from '../../constants.js'
import image from '../../images/product.png';
import cookie from 'react-cookies'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
import Multiselect from 'react-widgets/lib/Multiselect'

// Define a Login Component

class AddProduct extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props) // maintain the state required for this component
    this.state = {
      name: '',
      storeId: '',
      sku: 0,
      name: '',
      description: '',
      imageurl: '',
      brand: '',
      units: ['Piece', 'Pound', 'Oz'],
      price: '',
      store: [],
      storeDetails: [],
      authFlag: false,
      failed: false,
      success: false,
      file: '',
      data: '',
      profilepic: ''
    } // Bind the handlers to this class // this.usernameChangeHandler = this.usernameChangeHandler.bind(this) // this.passwordChangeHandler = this.passwordChangeHandler.bind(this) // this.submitLogin = this.submitLogin.bind(this)
  } // Call the Will Mount to set the auth Flag to false

  componentWillMount() {
    if (this.state.profilepic == '') {
      this.setState({ profilepic: image });

    }

    axios
      .get(`${ROOT_URL}/getmaxsku`, { params: '' })
      .then(response => {
        // console.log(response)
        // console.log("Inside Product Creation" + JSON.stringify(response.data));
        let newSku = response.data;
        // alert("Sku: "+newSku);
        this.setState({ sku: newSku });
      }).catch(error => {
        console.log(error);
      })

    axios.defaults.withCredentials = true
    axios
      .get(`${ROOT_URL}/getstores`, { params: '' })
      .then(response => {
        // console.log(response)
        // console.log("Inside Product Creation" + JSON.stringify(response.data));
        this.setState({ storeDetails: response.data });
        console.log(response.data);
        let data1 = (response.data).map(store => {
          return store.name;
        })
        console.log(data1);
        this.setState({
          store: data1
        })
      })

  }

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  renderDropdownList = ({ input, ...rest ,meta}) =>
  <div>
    <DropdownList {...input} {...rest} />
    {this.renderError(meta)}
    </div>

  renderMultiselect = ({ input, ...rest,meta }) =>
  <div>
    <Multiselect {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []} // requires value to be an array
      {...rest} />
      {this.renderError(meta)}
      </div>

  // renderSelectList = ({ input, ...rest }) =>
  //   <SelectList {...input} onBlur={() => input.onBlur()} {...rest} />


  imageChangeHandler = e => {
    if(e.target.files){
    this.setState({
      file: e.target.files[0],
      profilepic: URL.createObjectURL(e.target.files[0])
    })
  }else{
    this.setState({file:image})
  }
    console.log(e.target.files[0])
  }



  onSubmit = e => {
    console.log(this.state.storeDetails)

    // console.log("Inside Product Creation" + JSON.stringify(formData));
    let storeNameList = e.stores;
    console.log("storeNameList: " + storeNameList);
    let storesSelected = (this.state.storeDetails).filter(storeName => {
      return storeNameList.includes(storeName.name);
    })
    console.log("storesSelected: " + JSON.stringify(storesSelected));
    let store_id = storesSelected.map((store) => { return store.id });
    for (let i = 0; i < store_id.length; i++) {
      let formData = new FormData();

      formData.append('files', this.state.file)

      for (var value of formData.values()) {
        console.log(value);
      }
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      
      let data = {
        id: {
          storeId: store_id[i],
          sku: this.state.sku
        },
        name: e.name,
        description: e.description,
        brand: e.brand,
        file: e.file,
        price: e.price,
        unit: e.unit,
      }
      console.log(JSON.stringify(data));
      formData.append('data', JSON.stringify(data));
      axios.defaults.withCredentials = true;
      axios.post(`${ROOT_URL}/addproduct`, formData, config)
        .then(response => {
          this.setState({
            failed: false,
            success: true,
            // profilepic: response.data.imageurl
          })
          console.log(response.data);
          window.location.reload(true)
        }).catch(error => {
          console.log(error);
          this.setState({
            failed: true,
            success: false
          })
        });
    }
  }



   required = value => value ? undefined : 'Required'

  number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined
   
  renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div>
          <label style={{ color: 'red' }}>{error}</label>
        </div>
      )
    }
  }

  // renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  //   <div>
  //     <label>{label}</label>
  //     <div>
  //       <input {...input} placeholder={label} type={type}/>
  //       {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  //     </div>
  //   </div>
  // )

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

    const { handleSubmit, pristine, submitting } = this.props
    let redirectVar = null
    let invalidtag = null
    // console.log(this.state)
    if (this.state.failed) {
      invalidtag = (
        <label style={{ color: 'red' }}>Error in creating product!</label>
      )
    }

    if (this.state.success) {
      invalidtag = (
        <label style={{ color: 'green' }}>Successfully created new Product</label>
      )
    }

    const units = ['Piece', 'Pound', 'Oz']

    



    return (

      < div >
        {/* {redirectVar} */}
        <div>
          <div className='row'>
            <div className='col-sm-2'>
              <AdminNavbar />
            </div>
            <div class='split-center_home'>
              <div class='login-form'>
                <div class='panel'>
                  <br></br>
                  <h2 style={{ marginLeft: '20px' }}>Add new Product</h2>
                  <hr></hr>
                </div>
                <div className='row'>
                  <div className='col-sm-6'>
                    <form
                      className='ui form error'
                      onSubmit={this.props.handleSubmit(this.onSubmit)}
                      onChange={this.inputChangeHandler}
                    >
                      <div style={{ marginLeft: '10%' }}>
                        {/* <br /> */}
                        <Field
                          name='name'
                          type='text'
                          component={this.renderInput}
                          // onChange={this.inputChangeHandler}
                          label='Name'
                        validate={this.required}
                        />
                        <br />
                        <Field
                          name='description'
                          type='text'
                          component={this.renderInput}
                          // onChange={this.inputChangeHandler}
                          label='Description'
                          validate={this.required}
                        />
                        <br />
                        <Field
                          name='brand'
                          type='text'
                          component={this.renderInput}
                          // onChange={this.inputChangeHandler}
                          label='Brand'
                          validate={this.required}
                        />
                        <br />

                        <Field
                          name='price'
                          type='number'
                          min="0"
                          component={this.renderInput}
                          // onChange={this.inputChangeHandler}
                          label='Price'
                          validate={this.required,this.number}
                        />
                        <br />
                        {/* <label style={{color:"rgb(107, 107, 131)"}}>Price </label><br></br>
                        <input
                        style={{width:"100%",borderRadius: "4px",
                        border: "1px solid #ccc",height:"40px"}}
                          name='price'
                          type='number'
                          min="0"
                          component={this.renderInput}
                          // validate={this.required}
                          required
                          // onChange={this.inputChangeHandler}
                          // label='price'
                        />
                        <br />
                        <br/> */}
                        <div style={{ color: '#6b6b83' }}>
                          Unit
                        </div>

                        <Field
                          name="unit"
                          component={this.renderDropdownList}
                          // onChange={this.inputChangeHandler}
                          data={units}
                          validate={this.required}
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
                        <div style={{ color: '#6b6b83' }}>
                          Available Stores
                        </div>
                        <Field
                          name="stores"
                          component={this.renderMultiselect}
                          // onChange={this.inputChangeHandler}
                          defaultValue={[]}
                          validate={this.required}
                          // onBlur={() => this.props.onBlur()}
                          style={{
                            // width: "100%",
                            border: "solid #ffffff",
                            borderRadius: "4px",
                            fontSize: "14px",
                            // height: "50px",
                            // lineHeight: "50px",
                            fontFamily: "graphik"
                          }}
                          data={this.state.store} />
                        <br />
                        {invalidtag}
                        <br />
                        <button type='submit' disabled={pristine || submitting} class='btn btn-info'
                        >
                          Create Product
                        </button>

                        <br />
                        <br />
                        <br />
                        <br />
                      </div>
                    </form>
                  </div>
                  <div className="col-sm-6">
                    <form onSubmit={this.onSubmit} onChange={this.imageChangeHandler} enctype='multipart/form-data'>
                      {/* <div className="col-sm-6"> */}
                      {/* <img style={{ marginLeft: "100px", marginTop: "100px" }}
                        // src={this.state.profilepic}
                        width='300'
                        height='300'
                      /> */}
                      <img
                        class='preview-img-box'
                        // src='http://simpleicon.com/wp-content/uploads/account.png'
                        src={this.state.profilepic}
                        style={{ marginLeft: "30%", marginTop: "30%",backgroundColor:'white' }}
                        alt='Preview Image'
                        width='200'
                        height='200'
                      />
                      <div style={{ marginLeft: "42%" }}>
                      <br></br>
                        <input
                          type='file'
                          name='myImage'
                          id='myImage'
                        />
                      </div>
                    </form>
                  </div>
                </div>
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
  if (!formValues.name) {
    error.name = 'Enter a valid name'
  }
  if (!formValues.description) {
    error.description = 'Enter a valid description'
  }

  if (!formValues.brand) {
    error.brand = 'Enter a valid brand'
  }

  if (!formValues.price) {
    error.price = 'Enter a valid price'
  }
  if (!formValues.unit) {
    error.unit = 'Enter a valid unit'
  }
  if (!formValues.file) {
    error.unit = 'Upload a valid image'
  }

  return error
}


AddProduct = reduxForm({
  form: 'reactWidgets',
    // a unique identifier for this form
})(AddProduct)

export default AddProduct


















