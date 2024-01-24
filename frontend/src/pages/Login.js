import React, { useRef } from 'react';
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
  MDBTypography, MDBIcon
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { createStorage, API_URL } from "../Helper";


const Login = () => {
  const navigate = useNavigate();
  const loginRef = useRef(null);
  const forgotRef = useRef(null);
  const [loginRegisterActive, setLoginRegisterActive] = React.useState('login');
  const [loading, setLoading] = React.useState(false);
  const [isForgot, setIsForgot] = React.useState(false);
  const [passwordRule, setPasswordRule] = React.useState(false);


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
        if (response.status === 200) {
          createStorage('user', response.data);
          setLoading(false)
          navigate('/dashboard');
          resetForm(loginRef)
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

  const forgot = async (event) => {
    setLoading(true)
    event.preventDefault();
    let password = event.target[1].value;
    let confirmPassword = event.target[2].value;
    if (password !== confirmPassword) {
      toast.error("Password & Confirm Password doesn't match!");
      setLoading(false)
    }
    else {
      let value = {
        "name": event.target[0].value,
        "password": event.target[1].value,
      };
      await axios.post(
        `${API_URL}/api/user/forgot`, value
      )
        .then((response) => {
          if (response.status === 200) {
            setLoading(false)
            toast.success(response.data.message);
            setIsForgot(false);
            setLoginRegisterActive('login');
            console.log(event.target);
            resetForm(forgotRef)
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

  const resetForm = (formRef) => {
    if (formRef && formRef.current) {
      formRef.current.reset();
    }
  }

  const handleClick = () => {
    setPasswordRule(!passwordRule)
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

          <MDBTabs pills justify className='login mb-2'>

            {
              (isForgot === true) ? (<MDBTabsItem> <MDBTabsLink className='forgot-tab'


                active={loginRegisterActive === 'forgot'}
              >
                Forgot Password
              </MDBTabsLink> </MDBTabsItem>) : (<MDBTabsItem>
                <MDBTabsLink


                  active={loginRegisterActive === 'login'}
                >
                  Login
                </MDBTabsLink>
              </MDBTabsItem>)
            }

          </MDBTabs>

          <MDBTabsContent>


            {
              (isForgot === true) ?
                <MDBTabsPane open={(loginRegisterActive === 'forgot')}>
                  <form onSubmit={forgot} ref={forgotRef}>
                    <MDBInput className='mb-4' type='text' id='usernamef' label='User name' required />
                    <MDBInput className='mb-4' type='password' id='passwordf' label='Password' />
                    <MDBInput className='mb-4' type='password' id='confirmf' label='Repeat password' />
                    <span className='pointer' onClick={handleClick}>

                      <MDBIcon icon='question-circle' className='me-2 text-warning' />Password Rule!
                    </span>
                    {
                      (passwordRule) &&

                      <MDBTypography listUnStyled className='mb-0 rule'>
                        <li >
                          <MDBIcon icon='check-circle' className='me-2 text-success' />Must have 8 characters
                        </li>
                        <li >
                          <MDBIcon icon='check-circle' className='me-2 text-success' />Must have 1 Special Character [-@#$%^&]
                        </li>
                        <li >
                          <MDBIcon icon='check-circle' className='me-2 text-success' />Must have 1 Upper Case Alphabet
                        </li>
                        <li >
                          <MDBIcon icon='check-circle' className='me-2 text-success' />Must have 1 Numeric Number
                        </li>
                      </MDBTypography>

                    }
                    <MDBRow className='mb-4 mt-2'>
                      <MDBCol>
                        <a href='#!' onClick={() => { setIsForgot(false); setLoginRegisterActive('login'); resetForm(forgotRef) }}>Login?</a>
                      </MDBCol>
                    </MDBRow>
                    {loading === false ? (
                      <MDBBtn type='submit' className='mb-4 register-btn' block='true'>
                        Submit
                      </MDBBtn>
                    ) : (<MDBBtn disabled className='mb-4 register-btn' block='true'>
                      <MDBSpinner size='sm' role='status' tag='span' className='me-2 loader-position' block='true' />
                      Submitting ...
                    </MDBBtn>)

                    }
                  </form>

                </MDBTabsPane> : <MDBTabsPane open={loginRegisterActive === 'login'}>
                  <form onSubmit={signIn} ref={loginRef}>

                    <MDBInput className='mb-4' type='text' id='usernamel' label='User name' required />
                    <MDBInput className='mb-4' type='password' id='passwordl' label='Password' required />

                    <MDBRow className='mb-4'>
                      <MDBCol>
                        <a href='#!' onClick={() => { setIsForgot(true); setLoginRegisterActive('forgot'); resetForm(loginRef) }}>Forgot password?</a>
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
                </MDBTabsPane>
            }

          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  )
}

export default Login