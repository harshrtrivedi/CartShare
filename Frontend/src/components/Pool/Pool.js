import React, { Component } from 'react'
import '../../App.css'
import './Pool.css'
import axios from 'axios'
import { Redirect } from 'react-router'
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import ROOT_URL from '../../constants'


// Define a Pool Component
export default class Pool extends Component {
  // call the constructor method
  constructor(props) {
    super(props)
    this.state = {
        email: '',
        password: '',
        authFlag: false,
        authFailed: false,
        
      }

    
  }

  componentWillMount() {
    


  }

  componentDidMount() {
    var email = sessionStorage.getItem("email")
    // axios.get(ROOT_URL + '/fetchtweets', {
    //   params: {
    //     email: email
    //   }
    // })
    //   .then((response) => {

    //     this.setState({
    //       tweets: this.state.tweets.concat(response.data)
    //     });
    //   });
  }  

  inputChangeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    let redirectVar = null
    if (sessionStorage.getItem('email')) {
      redirectVar = <Redirect to='/home' />
    } else {
      redirectVar = <Redirect to='/login' />
    }

    // let invalidtag = null
    // if (this.state.authFailed) {
    //   invalidtag = (
    //     <label style={{ color: 'red' }}>*Invalid user name password!</label>
    //   )
    // }

    return (

      < div >
        {/* {redirectVar} */}
        <div>
          <div className='row'>
            <div className='col-sm-2'>
              <LeftNavbar />
            </div>
            <div className='split-center_home'>
              <ul>
              
              <div className="col-sm-2 card" style={{width:"18rem",}}>
                
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" className="card-link">Card link</a>
                <a href="#" className="card-link">Another link</a>
            
            </div>

              </ul>
            </div>
            <div className='col-sm-1' />
          </div>
        </div>
      </div >
    )
  }
}


