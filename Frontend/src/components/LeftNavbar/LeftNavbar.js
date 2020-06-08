import React from 'react'

class LeftNavbar extends React.Component {
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
          {/* <li className='li-profile'>
            <a href='/home' className='navLink active'>
              <i class='fas fa-home' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Home</span>
            </a>
          </li> */}
          <li className='li-profile'>
            <a href='/search' className='navLink'>
              <i class='fas fa-hashtag' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Search</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/orders' className='navLink'>
              <i class="fas fa-calendar-week"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Upcoming orders</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/pickupmenu' className='navLink'>
              <i class="fas fa-truck-pickup"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Pickup menu</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/delivery' className='navLink'>
              <i class="fas fa-truck-pickup"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Delivery</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/pastorders' className='navLink'>
              <i class="fas fa-history"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Past orders</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/poolhome' className='navLink'>
              <i class="fas fa-car"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Pool</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/requesthome' className='navLink'>
              <i class="fas fa-car"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Requests</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/profile' className='navLink'>
              <i class='far fa-user' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Profile</span>
            </a>
          </li>
          <li className='li-profile'>
            <a href='/contributionCredit' className='navLink'>
              <i class='fas fa-chart-line' />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className='tab'>Contribution Credit</span>
            </a>
          </li>
        </ul>
      </div>
      // </div>
    )
  }
}

export default LeftNavbar
