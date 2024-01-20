import React from 'react';
import '../styles/login.css'
import logo from '../assets/pos.png';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBSpinner,
  MDBRadio
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { createStorage, API_URL } from "../Helper";


const Login = () => {
  const navigate = useNavigate();
  const [loginRegisterActive, setLoginRegisterActive] = React.useState('login');
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState('');

  const signIn = async (event) => {
    setLoading(true)
    event.preventDefault();
    let value = {
      "name": event.target[0].value,
      "password": event.target[1].value
    }
    await axios.post(
      `${API_URL}/api/user/login`, value
    )
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          createStorage('user', response.data);
          setLoading(false)
          navigate('/dashboard');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error)
        }
        else {
          toast.error(error.message)
        }
        setLoading(false);

      })
  }

  const register = async (event) => {
    setLoading(true)
    event.preventDefault();
    let password = event.target[1].value;
    let confirmPassword = event.target[2].value;
    if (password !== confirmPassword) {
      toast.error("Password & Confirm Password doesn't match!")
    }
    else {
      let value = {
        "name": event.target[0].value,
        "password": event.target[1].value,
        "type": type
      };
      console.log(value);
      await axios.post(
        `${API_URL}/api/user/signup`, value
      )
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
            createStorage('user', response.data);
            setLoading(false)
            navigate('/dashboard');
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.error)
          }
          else {
            toast.error(error.message)
          }
          setLoading(false);
  
        })
    }
    
  }
  return (
    <MDBContainer className='container-position-center'>

      <MDBRow className='bg-body-tertiary'>
        <MDBCol md='6' offsetMd='3'>

          <MDBNavbar light bgColor='primary'>
            <MDBContainer>
              <MDBNavbarBrand href='#'>
                <img
                  src={logo}
                  height='100'
                  alt=''
                  loading='lazy'
                />
              </MDBNavbarBrand>
              <p className='header-text fw-bold'> POS System </p>
            </MDBContainer>
          </MDBNavbar>

          <MDBTabs pills justify>
            <MDBTabsItem>
              <MDBTabsLink
               
                onClick={() => !loading && setLoginRegisterActive('login')}
                active={loginRegisterActive === 'login'}
              >
                Login
              </MDBTabsLink>
            </MDBTabsItem>
            {/* <MDBTabsItem>
              <MDBTabsLink className='register-tab'
               
                onClick={() => !loading && setLoginRegisterActive('register')}
                active={loginRegisterActive === 'register'}
              >
                Register
              </MDBTabsLink>
            </MDBTabsItem> */}
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane open={loginRegisterActive === 'login'}>
              <form onSubmit={signIn}>

                <MDBInput className='mb-4' type='text' id='username' label='User name' required />
                <MDBInput className='mb-4' type='password' id='password' label='Password' required />

                <MDBRow className='mb-4'>
                  <MDBCol>
                    <a href='#!'>Forgot password?</a>
                  </MDBCol>
                </MDBRow>

                {loading === false ? (
                  <MDBBtn type='submit' className='mb-4' block='true'>
                    Sign in
                  </MDBBtn>
                ) : (<MDBBtn disabled className='mb-4' block='true'>
                  <MDBSpinner size='sm' role='status' tag='span' className='me-2 loader-position' block='true' />
                  Signing in...
                </MDBBtn>)

                }
              </form>
              {/* <div className='text-center'>
                <span className='custom-text'>
                  Not a member ?
                </span>
                <MDBBtn disabled={loading === true} className='login-register-btn' color="primary" onClick={() => setLoginRegisterActive('register')} size="sm">Register</MDBBtn>
              </div> */}

            </MDBTabsPane>

            {/* <MDBTabsPane open={(loginRegisterActive === 'register')}>
              <form onSubmit={register}>

                <MDBInput className='mb-4' id='form8Example2' label='Username' />
                <MDBInput className='mb-4' type='password' id='form8Example4' label='Password' />
                <MDBInput className='mb-4' type='password' id='form8Example5' label='Repeat password' />
                <MDBRadio name='type' id='inlineRadio1' value='Super Admin' label='Super Admin' inline onClick={() => setType('Super Admin')} />
                <MDBRadio name='type' id='inlineRadio2' value='Admin' label='Admin' inline onClick={() => setType('Admin')} />

                {loading === false ? (
                  <MDBBtn type='submit' className='mb-4 register-btn' block='true'>
                    Register
                  </MDBBtn>
                ) : (<MDBBtn disabled className='mb-4 register-btn' block='true'>
                  <MDBSpinner size='sm' role='status' tag='span' className='me-2 loader-position' block='true' />
                  Register ...
                </MDBBtn>)

                }
              </form>
              <div className='text-center'>
                <span className='custom-text'>
                  Already a member ?
                </span>
                <MDBBtn disabled={loading === true} className='login-register-btn' color="primary" onClick={() => setLoginRegisterActive('login')} size="sm">Login</MDBBtn>
              </div>

            </MDBTabsPane> */}
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  )
}

export default Login