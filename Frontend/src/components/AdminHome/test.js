var getNewStoreArray = bannerDetails =>{
    let count =bannerDetails.length
    let bannerNew=[]
    while(count>0){
        // console.log(count);
      let bannerrow=[];
      if(count-4>=0){
        for(let i=0;i<4;i++){
          bannerrow.push(bannerDetails[count-1])
          count--;
        }
        
      }else{
          console.log(count);
        for(let j=count;j>0;j--){
            console.log(j);
          bannerrow.push(bannerDetails[j-1])
          count--;
        }
      }
      bannerNew.push(bannerrow)
    //   console.log(bannerrow)
      // alert(bannerrow)
    }
    return bannerNew;
  }

  bannerNew = getNewStoreArray([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
  console.log(bannerNew);



  // import React, { Component } from 'react'
// import '../../App.css'
// import './AddProduct.css'
// import axios from 'axios'
// import AdminNavbar from '../LeftNavbar/AdminNavbar'
// import { Field, reduxForm } from 'redux-form'
// import ROOT_URL from '../../constants.js'

// import cookie from 'react-cookies'
// import { Redirect } from 'react-router'
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import DropdownList from 'react-widgets/lib/DropdownList'
// import 'react-widgets/dist/css/react-widgets.css'
// import Multiselect from 'react-widgets/lib/Multiselect'

// // Define a Login Component
// class AddProduct extends Component {
//   // call the constructor method
//   constructor(props) {
//     // Call the constrictor of Super class i.e The Component
//     super(props) // maintain the state required for this component
//     this.state = {
//       name: '',
//       storeId: '',
//       sku: 0,
//       name: '',
//       description: '',
//       imageurl: '',
//       brand: '',
//       units: ['Piece', 'Pound', 'Oz'],
//       price: '',
//       store: [],
//       storeDetails: [],
//       authFlag: false,
//       failed: false,
//       success: false,
//       file: '',
//       data:''
//     } // Bind the handlers to this class // this.usernameChangeHandler = this.usernameChangeHandler.bind(this) // this.passwordChangeHandler = this.passwordChangeHandler.bind(this) // this.submitLogin = this.submitLogin.bind(this)
//   } // Call the Will Mount to set the auth Flag to false

//   async componentWillMount() {

//     axios
//       .get(`${ROOT_URL}/getmaxsku`, { params: '' })
//       .then(response => {
//         // console.log(response)
//         // console.log("Inside Product Creation" + JSON.stringify(response.data));
//         let newSku = response.data;
//         // alert("Sku: "+newSku);
//         this.setState({ sku: newSku });
//       }).catch(error => {
//         console.log(error);
//       })

//       axios.defaults.withCredentials = true
//       axios
//         .get(`${ROOT_URL}/getstores`, { params: '' })
//         .then(response => {
//           // console.log(response)
//           // console.log("Inside Product Creation" + JSON.stringify(response.data));
//           this.setState({ storeDetails: response.data });
//           console.log(response.data);
//           let data1 = (response.data).map(store => {
//             return store.name;
//           })
//           console.log(data1);
//           this.setState({
//             store: data1
//           })
//         })

//   }

//   inputChangeHandler = e => {
//     this.setState({
//       [e.target.name]: e.target.value
//     })
//   }

//   renderDropdownList = ({ input, ...rest }) =>
//     <DropdownList {...input} {...rest} />

//   renderMultiselect = ({ input, ...rest }) =>
//     <Multiselect {...input}
//       onBlur={() => input.onBlur()}
//       value={input.value || []} // requires value to be an array
//       {...rest} />

//   // renderSelectList = ({ input, ...rest }) =>
//   //   <SelectList {...input} onBlur={() => input.onBlur()} {...rest} />

//   async imageChangeHandler(e)  {
//     alert(JSON.stringify(e.target.file))
//     this.setState({
//       file: e.target.files[0]
//     },()=>alert(JSON.stringify(this.state.file)))
//     // alert(JSON.stringify(e.target.files[0]))
//   }


//   onSubmit = formValues => {

//     console.log("Inside Product Creation" + JSON.stringify(formValues));
//     let storeNameList = formValues.stores;
//     console.log("storeNameList: " + storeNameList);
//     let storesSelected = (this.state.storeDetails).filter(storeName => {
//       return storeNameList.includes(storeName.name);
//     })
//     console.log("storesSelected: " + JSON.stringify(storesSelected));
//     let store_id = storesSelected.map((store) => { return store.id });
//     // var bodyFormData = new FormData();
//     // bodyFormData.set('name', formValues.name);
//     // bodyFormData.set('description', formValues.description);
//     // bodyFormData.set('brand', formValues.brand);
//     // bodyFormData.set('price', formValues.price);
//     // bodyFormData.set('unit', formValues.unit);
//     // bodyFormData.set('storeId', formValues.store);
//     // bodyFormData.set('store', formValues.store);
//     // alert("Store length: "+store_id.length);
//     for(let i=0; i<store_id.length;i++){
//       let data = {
//         id: {
//           storeId: store_id[i],
//           sku: this.state.sku
//         },
//         name: formValues.name,
//         description: formValues.description,
//         brand: formValues.brand,
//         imageurl: formValues.imageUrl,
//         price: formValues.price,
//         unit: formValues.unit,
//         // storeId: 1,
//         // store: 1
//         // storeId: formValues.store,
//         // store: formValues.store
//       }
//       // console.log(data)
//       alert(JSON.stringify(data));
//       axios.defaults.withCredentials = true;
//       axios.post(`${ROOT_URL}/addproduct`, data).then(response => {

//         // update the state with the response data
//         this.setState({
//           failed: false,
//           success: true
//         })
//         console.log('Axios post:', response.data);
//         window.location.reload(true)
//       }).catch(error => {
//         console.log(error);
//         this.setState({
//           failed: true,
//           success: false
//         })
//       });
//     }

//   }

//   // async addFormData(formData,data ) {
//   //   // alert(JSON.stringify(this.state.storeDetails));
//   //   formData.append('data', data);
//   //   console.log(`Appended form data ${formData}`);
//   //   return formData;
//   // }

//   // async addFiles(formData,data) {
//   //   const data = Object.assign({}, JSON.stringify(data));
//   //   for (var key in data.files) {
//   //     console.log(`Appending photos to form data ${key}`);
//   //     formData.append('files', data.files[key]);
//   //   }
//   //   return formData;
//   // }


//   //  async getstores(e){
//   //    storeDetails = await estoreDetails;
//   //  }


//   // async submit(e) {
//   //   alert("inside: "+ this.state.file)
//   //   let formData = new FormData();
//   //   // console.log(this.state.storeDetails);

//   //   console.log(this.state.storeDetails)
//   //   console.log("Inside Product Creation" + JSON.stringify(e));
//   //     let storeNameList = e.stores;
//   //     // alert(JSON.stringify(this.state.storeDetails))
//   //     // console.log("storeNameList: " + storeNameList);

//   //     let storedetails = sessionStorage.getItem("Allstores")

//   //     // alert(resultnew);
//   //     let storesSelected = (storedetails).filter(storeName => {
//   //       return storeNameList.includes(storeName.name);
//   //     })
//   //     console.log("storesSelected: " + JSON.stringify(storesSelected));
//   //     let store_id = storesSelected.map((store) => { return store.id });
//   //     for(let i=0; i<store_id.length;i++){
//   //       let data = {
//   //         id: {
//   //           storeId: store_id[i],
//   //           sku: this.state.sku
//   //         },
//   //         name: e.name,
//   //         description: e.description,
//   //         brand: e.brand,
//   //         // imageurl: formData.imageUrl,
//   //         file:e.file,
//   //         price: e.price,
//   //         unit: e.unit,
//   //         // storeId: 1,
//   //         // store: 1
//   //         // storeId: formValues.store,
//   //         // store: formValues.store
//   //       }
//   //       console.log(JSON.stringify(data));
//   //       formData.append(data);
//   //       let test1 = await this.addFormData(formData,data);
//   //   console.log(test1)
//   //   let test2 = await this.addFiles(test1,data);

//   //   axios.post(`${ROOT_URL}/addproduct`, test2)
//   //     .then((result) => {
//   //       // alert("Sending property");
//   //       if (result.status === 200) {
//   //         alert('Product Uploaded Successfully');
//   //         // this.setState({uploaded : true});
//   //       }
//   //       else {
//   //         // alert('Error while uploading product');
//   //       }
//   //     });

//   //     }


//   // }

//   renderError = ({ error, touched }) => {
//     if (touched && error) {
//       return (
//         <div>
//           <label style={{ color: 'red' }}>{error}</label>
//         </div>
//       )
//     }
//   }

//   renderInput = ({ input, label, meta, className = { className } }) => {
//     return (
//       <div>
//         <div htmlFor='email' style={{ color: '#6b6b83' }}>
//           {label}
//         </div>
//         <input
//           className='form-control'
//           style={{ marginRight: '10px' }}
//           {...input}
//         />
//         {this.renderError(meta)}
//       </div>
//     )
//   }
//   render() {
//     const { handleSubmit, pristine, submitting } = this.props
//     let redirectVar = null
//     let invalidtag = null
//     // console.log(this.state)
//     if (this.state.failed) {
//       invalidtag = (
//         <label style={{ color: 'red' }}>*Product already exists!</label>
//       )
//     }

//     if (this.state.success) {
//       invalidtag = (
//         <label style={{ color: 'green' }}>Successfully created new Product</label>
//       )
//     }

//     const units = ['Piece', 'Pound', 'Oz']

//     let image_new = null;
//     if (this.state.profilepic) {
//       image_new = (
//         <img
//           class="plus-image img-circle "
//           style={{ backgroundColor: "black", border: "black" }}
//           src={this.state.profilepic}
//           width='200'
//           height='200'

//         />
//       )
//     }

//     return (

//       < div >
//         {/* {redirectVar} */}
//         <div>
//           <div className='row'>
//             <div className='col-sm-2'>
//               <AdminNavbar />
//             </div>
//             <div class='split-center_home'>
//               <div class='login-form'>
//                 <div class='panel'>
//                   <br></br>
//                   <h2 style={{ marginLeft: '20px' }}>Add new Product</h2>
//                   <hr></hr>
//                 </div>
//                 <div className='row'>

//                   {/* <form onSubmit={this.uploadImage} enctype='multipart/form-data'>
//                         <div class='preview text-center' >
//                             <div>
//                                 <img class="product-holder "
//                                     style={{ backgroundColo: "black" }}
//                                     src={this.state.profilepic}
//                                     width='100'
//                                     height='30'>

//                                 </img>
//                                 {image_new}

//                                 <div style={{ marginLeft: "200px" }}>
//                                     <input

//                                         type='file'
//                                         onChange={this.imageChangeHandler}
//                                         name='myImage'
//                                         id='myImage'
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                     </form> */}

//                   <div className='col-sm-6'>
//                     <form
//                       className='ui form error'
//                       onSubmit={this.props.handleSubmit(this.onSubmit)}
//                       onChange={this.inputChangeHandler}
//                     >
//                       {/* <div class='preview text-center' >
//                         <div>
//                           <img class="product-holder "
//                             style={{ backgroundColo: "black" }}
//                             src={this.state.profilepic}
//                             width='100'
//                             height='30'>

//                           </img>
//                           {image_new}

//                           <div style={{ marginLeft: "200px" }}>
//                             <input
//                               type='file'
//                               onChange={this.imageChangeHandler}
//                               name='myImage'
//                               id='myImage'
//                             />
//                           </div>
//                         </div>
//                       </div>*/}

//                       <div style={{ marginLeft: '10%' }}> 
//                         {/* <br /> */}
//                         <Field
//                           name='name'
//                           type='text'
//                           component={this.renderInput}
//                           // onChange={this.inputChangeHandler}
//                           label='Name'
//                         />
//                         <br/>

//                         <Field
//                           name='imageUrl'
//                           type='text'
//                           component={this.renderInput}
//                           // onChange={this.inputChangeHandler}
//                           label='ImageUrl'
//                         />
//                         <br />
//                         <Field
//                           name='description'
//                           type='text'
//                           component={this.renderInput}
//                           // onChange={this.inputChangeHandler}
//                           label='Description'
//                         />
//                         <br />
//                         <Field
//                           name='brand'
//                           type='text'
//                           component={this.renderInput}
//                           // onChange={this.inputChangeHandler}
//                           label='Brand'
//                         />
//                         <br />
//                         <Field
//                           name='price'
//                           type='number'
//                           component={this.renderInput}
//                           // onChange={this.inputChangeHandler}
//                           label='price'
//                         />
//                         <br />
//                         <div style={{ color: '#6b6b83' }}>
//                           Unit
//                         </div>

//                         <Field
//                           name="unit"
//                           component={this.renderDropdownList}
//                           // onChange={this.inputChangeHandler}
//                           data={units}
//                           style={{
//                             width: "100%",
//                             border: "solid #ffffff",
//                             borderRadius: "4px",
//                             fontSize: "14px",
//                             // height: "50px",
//                             // lineHeight: "50px",
//                             fontFamily: "graphik"
//                           }}
//                           valueField="value"
//                           textField="unit" />
//                         <br />
//                         <div style={{ color: '#6b6b83' }}>
//                           Available Stores
//                         </div>
//                         <Field
//                           name="stores"
//                           component={this.renderMultiselect}
//                           // onChange={this.inputChangeHandler}
//                           defaultValue={[]}
//                           // onBlur={() => this.props.onBlur()}
//                           style={{
//                             // width: "100%",
//                             border: "solid #ffffff",
//                             borderRadius: "4px",
//                             fontSize: "14px",
//                             // height: "50px",
//                             // lineHeight: "50px",
//                             fontFamily: "graphik"
//                           }}
//                           data={this.state.store} />
//                         <br />
//                         {invalidtag}
//                         <br />
//                         <button type='submit' class='btn btn-info'
//                         >
//                           Create Product
//                         </button>

//                         <br />
//                         <br />
//                         <br />
//                         <br />
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div >
//     )
//   }
// }
// // export Login Component
// // export default BuyerProfile

// const validate = formValues => {
//   const error = {}
//   if (!formValues.name) {
//     error.name = 'Enter a valid name'
//   }
//   if (!formValues.description) {
//     error.description = 'Enter a valid description'
//   }
//   if (!formValues.price) {
//     error.price = 'Enter a valid price'
//   }
//   if (!formValues.unit) {
//     error.unit = 'Enter a valid unit'
//   }
//   if (!formValues.brand) {
//     error.drand = 'Enter a valid brand'
//   }
//   return error
// }


// AddProduct = reduxForm({
//   form: 'reactWidgets'  // a unique identifier for this form
// })(AddProduct)

// export default AddProduct

