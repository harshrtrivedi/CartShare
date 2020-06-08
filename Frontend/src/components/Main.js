import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Login from './Login/Login'
import Home from './Home/Home'
import SignUp from './SignUp/SignUp'
import Navbar from './LandingPage/Navbar'
import Pool from './Pool/Pool'
import ContributionCredit from './ContributionCredit/ContributionCredit'
import AddStore from './AddStore/AddStore'
import Checkout from './Orders/Checkout'
//import PrivateRoute from '../lib/PrivateRoute'
import VerifyAccount from './SignUp/VerifyAccount';
import SignupDetails from './SignUp/SignupDetails'
import AddProduct from './AddProduct/AddProduct'
import AdminHome from './AdminHome/AdminHome'
import ProductsDisplay from './AdminHome/ProductsDisplay'
import SearchProducts from './Orders/SearchProducts'
import PoolHome from './Pool/PoolHome'
import CreatePool from './Pool/CreatePool'
import JoinPool from './Pool/JoinPool'
import SearchPool from './Pool/SearchPool'
import SearchPoolData from './Pool/SearchPoolData'
import RequestHome from './Request/RequestHome'
import Orders from './Orders/Orders'
import Search from './Search/Search'
import EditProduct from './AddProduct/EditProduct'
import UserProfile from './Profile/UserProfile'
import MessagePooler from './Pool/MessagePooler'
import EditPool from './Pool/EditPool'
import PastOrders from './PastOrders/PastOrders'
import Pickup from './Pickup/Pickup'
import Delivery from './Delivery/Delivery'
import ProductSearch from './ProductSearch/ProductSearch'
import ProductSearchBar from './ProductSearch/ProductSearchBar'
import EditStore from './AddStore/EditStore'



// Create a Main Component

class Main extends Component {
  render() {
    return (
      <div>
        {/* Render Different Component based on Route */}
        <Route path='/' component={Navbar} />
        <Route path='/login' component={Login} />
        <Route path='/signup' component={SignUp} />
        <Route path='/home' component={Home} />
        <Route path="/verifyaccount/:ID" render={(match) => (<VerifyAccount {...match} />)} />
        <Route path='/signupdetails/:email' component={SignupDetails} />
        <Route path='/addstore' component={AddStore} />
        <Route path='/editstore/:id' component={EditStore} />
        <Route path='/addproduct' component={AddProduct} />
        <Route path='/stores' component={AdminHome} />
        <Route path='/products/:id' component={ProductsDisplay} />
        <Route path='/searchproducts/:id' component={SearchProducts} />
        <Route path='/search' component={Search} />
        <Route path='/poolhome' component={PoolHome} />
        <Route path='/createpool' component={CreatePool} />
        <Route path='/joinpool/:poolId' component={JoinPool} />
        <Route path='/searchpool' component={SearchPool} />
        <Route path='/searchpooldata/:unit/:value' component={SearchPoolData} />
        <Route path='/requesthome' component={RequestHome} />
        <Route path='/orders' component={Orders} />
        <Route path='/checkout' component={Checkout} />
        <Route path='/profile' component={UserProfile} />
        <Route path='/messagepooler' component={MessagePooler} />
        <Route path='/editpool' component={EditPool} />
        <Route path='/editproduct' component={EditProduct} />
        <Route path='/pastorders' component={PastOrders} />
        <Route path='/pickupmenu' component={Pickup} />
        <Route path='/delivery' component={Delivery} />
        <Route path='/productsearch' component={ProductSearchBar} />
        <Route path='/contributioncredit' component={ContributionCredit} />
      </div>
    )
  }
}
// Export The Main Component
export default Main
