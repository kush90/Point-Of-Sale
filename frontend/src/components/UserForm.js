import React, { useEffect } from 'react'
import {
    MDBInput,
    MDBBtn,
    MDBTypography, MDBIcon
} from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';

const UserForm = ({ create, data, passwordData, update }) => {

    const [name, setName] = React.useState('');
    const [passwordRule, setPasswordRule] = React.useState(false);

    useEffect(() => {
        if (data) setName(data.name);
    }, [data])

    const register = (e) => {
        e.preventDefault();
        let password = e.target[1].value;
        let confirmPassword = e.target[2].value;
        if (password !== confirmPassword) {
            toast.error("Password & Confirm Password doesn't match!")
        }
        else {
            let value = {
                "name": e.target[0].value,
                "password": e.target[1].value,
                "type": 'Admin'
            };
            create(value);
            e.target.reset();
        }
    }

    const changeName = (e) => {
        e.preventDefault();
        console.log('name');
        let obj = { ...data, "name": name }
        update(obj)
    }

    const changePassword = (e) => {
        e.preventDefault();
        console.log('password')
        let password = e.target[0].value;
        let confirmPassword = e.target[1].value;
        if (password !== confirmPassword) {
            toast.error("Password & Confirm Password doesn't match!")
        }
        else {
            let obj = { ...passwordData, "password": e.target[0].value }
            update(obj)
        }
    }

    const handleClick = () => {
        setPasswordRule(!passwordRule)
    }
    return (
        <div>


            {
                (data === '' && passwordData === '') &&
                (
                    <form onSubmit={register}>
                        <MDBInput className='mb-4' required id='form8Example2' label='Username' />
                        <MDBInput className='mb-4' required type='password' id='form8Example4' label='Password' />

                        <MDBInput className='mb-4' required type='password' id='form8Example5' label='Repeat password' />

                        <span className='mb-0 pointer' onClick={handleClick}>

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


                        <MDBBtn type='submit' className='mb-4 register-btn' block='true'>
                            Create
                        </MDBBtn>
                    </form>
                )

            }
            {
                (data && passwordData === '') &&
                (
                    <form onSubmit={changeName}>
                        <MDBInput className='mb-4' value={name} onChange={(e) => setName(e.target.value)} required id='form8Example2' label='Username' />

                        <MDBBtn type='submit' className='mb-4 register-btn' block='true'>
                            Update
                        </MDBBtn>
                    </form>
                )

            }
            {
                (data === '' && passwordData) &&
                (
                    <form onSubmit={changePassword}>
                        <MDBInput className='mb-4' required type='password' id='form8Example4' label='Password' />
                        <MDBInput className='mb-4' required type='password' id='form8Example5' label='Repeat password' />


                        <MDBBtn type='submit' className='mb-4 register-btn' block='true'>
                            Change Password
                        </MDBBtn>
                    </form>
                )

            }

        </div>
    )
}

export default UserForm