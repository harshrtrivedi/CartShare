import React, { Component } from 'react'
import '../../App.css'
import './Search.css'
import axios from 'axios'
import { loginuser } from '../../actions'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import jwtDecode from 'jwt-decode'
import Cookies from 'universal-cookie'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
// import sampleImg from '../img/GrubhubDetails.jpg'
import ProductSearchBar from './ProductSearchBar'
import AdminNavbar from '../LeftNavbar/AdminNavbar'
// import UserList from './UserList'
// Define a Login Component
class ProductSearch extends Component {
    // call the constructor method
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            authFlag: false,
            authFailed: false
        }
    }

    componentWillMount() {
        this.setState({
            authFlag: false,
            authFailed: false
        })
        sessionStorage.removeItem("order_items")
        sessionStorage.removeItem("order")

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

    renderInput = ({ input, type, label, meta }) => {
        return (
            <div>
                <div htmlFor='email' style={{ color: '#6b6b83' }}>
                    {label}
                </div>
                <div class='form-group'>
                    <input class='form-control' type={type} {...input} />
                    {this.renderError(meta)}
                </div>
            </div>
        )
    }

    

    inputChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    clearsearchlist = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('messagesearchresult');
        window.location.reload();
    }

    render() {
        let Searchbutton = null;
        if (sessionStorage.getItem('messagesearchresult') != null) {
            Searchbutton = <button id='searchbarbutton' style={{ outline: 'none' }} type='submit' class='searchButton' onClick={this.clearsearchlist} >
                <i class="fas fa-times-circle"></i>
            </button>
        } else {
            Searchbutton = <button id='searchbarbutton' style={{ outline: 'none' }} type='submit' class='searchButton' onClick={this.submitSearch} >
                <i class='fa fa-search' />
            </button>
        }

        return (
            <div>
                <div className='row'>
                    <div className='col-sm-2'>
                        <AdminNavbar />
                    </div>
                    <div class='split-center_home'>
                        <div class='login-form'>
                            <div class='panel'>
                                <ProductSearchBar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(
    mapStateToProps,
    { loginuser }
)(
    reduxForm({
        form: 'streamLogin',
        validate: validate
    })(ProductSearch)
)