import React from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBIcon,
  MDBDropdownMenu,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBNavbarToggler
} from 'mdb-react-ui-kit';
import { useLocation } from "react-router-dom";

import logo from '../assets/pos.png';


export default function Navbar() {
  const location = useLocation();
  const [openToggle, setOpenToggle] = React.useState('');
  return (
    <div>
      <MDBNavbar fixed='top' expand='lg' color="light" bgColor='light'>
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'>
            <img
              src={logo}
              height='30'
              alt=''
              loading='lazy'
            />
            POS
          </MDBNavbarBrand>

          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenToggle(!openToggle)}
          >
            <MDBIcon icon='bars' fas color='primary' />
          </MDBNavbarToggler>
          <MDBCollapse open={openToggle} navbar>


            <MDBNavbarNav className='me-auto'>
              <MDBNavbarItem className='active'>
                <MDBNavbarLink active={location.pathname === '/dashboard'} aria-current='page' href='/dashboard'>
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active={location.pathname === '/dashboard/setting'}  href='/dashboard/setting'>Dashboard</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active={location.pathname === '/dashboard/order'}  href='/dashboard/order'>Order</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active={location.pathname === '/dashboard/user'}  href='/dashboard/user'>User</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>


            <MDBDropdown color="primary" className='d-flex float-end'>
              <MDBDropdownToggle color='link' caret="true">
                <MDBIcon icon="user" />
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link>Profile</MDBDropdownItem>
                <MDBDropdownItem link>Logout</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>

          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
}