import React from 'react'

class AdminNavbar extends React.Component {
  render() {
    return (
      // <div class='col-sm-2'>
      <div>
        <h2>
          <span
            style={{
              marginLeft: '10px',
              color: '#0070eb',
              alighText: 'right'
            }}
          >
            Your account
          </span>
        </h2>
        <ul style={{ listStyleType: 'none', marginLeft: "-2px" }}>
          <li className='li-profile'>
            <a href='/stores' className='navLink active'>
              <i class='fas fa-home' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Home</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/productsearch' className='navLink'>
              <i class='fas fa-hashtag' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Search</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/stores' className='navLink'>
              <i class="fas fa-history"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Stores</span>
            </a>
          </li>
          {/* <li className='li-profile'>
            <a href='/poolerProfile' className='navLink'>
              <i class='far fa-user' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Profile</span>
            </a>
          </li> */}
        </ul>
      </div>
      // </div>
    )
  }
}

export default AdminNavbar
