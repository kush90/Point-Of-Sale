import React, { useEffect } from 'react'
import {
     MDBRow, MDBCol, MDBCard,
    MDBCardBody,
    MDBCardHeader,
} from 'mdb-react-ui-kit';
import '../styles/order.css'
import { ToastContainer, toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';


import { get, post, patch, remove } from '../Api';
import Table from '../components/Table';
import UserForm from '../components/UserForm';


const User = () => {
    const [loading, setLoading] = React.useState(true);
    const [userData, setUserData] = React.useState([]);
    const [deleteDataUserConfirm, setDeleteDataUserConfirm] = React.useState(false)
    const [tempEditData, setTempEditData] = React.useState('');
    const [tempDeleteData, setTempDeleteData] = React.useState('');
    const [tempPasswordData, setTempPasswordData] = React.useState('');
    const userHeader = ['name', 'type', 'action'];
    const [title, setTitle] = React.useState('Create New User')

    const getUserData = async () => {
        try {
            const response = await get('api/user/getAll');
            if (response.status === 200) {
                setLoading(false);
                setUserData(response.data.data);
            }
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.error)
            }
            else {
                toast.error(error.message)
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);


    const create = async (value) => {
        setLoading(true);
        await post(
            `api/user/signup`, value
        )
            .then((response) => {
                if (response.status === 200) {
                    console.log(response)
                    setLoading(false);
                    getUserData();
                    toast.success('User is successfully created!')
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

    const editUser = (value) =>{
        setTempEditData(value);
        setTempPasswordData('');
        setTitle(`Update User`)
    }

    const changePassword = (value) =>{
        setTempEditData('');
        setTempPasswordData(value);
        setTitle(`Change Password`)
    }

    const update = async(value) =>{
        try {
            setLoading(true)
            let response = await patch(`api/user/update/${value._id}?action=${title}`,value);
            if (response.status === 200) {
                toast.success(response.data.message);
                let newArr = userData.map((obj) =>
                obj._id === value._id ? { ...obj, "name": value.name } : obj
            );
            setUserData(newArr)
            setLoading(false);
            setTempEditData('');
            setTempPasswordData('');
            setTitle('Create New User')
            }
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.error)
            }
            else if (error.response && error.response.status === 404) {
                toast.error(error.response.data.error)
            }
            else {
                toast.error(error.message)
            }
            setLoading(false);
           
        }
    }

    const onCancel = () => {
        setDeleteDataUserConfirm(false);
        setTempDeleteData('')
    }

    const deleteUserConfirm = (value) => {
        setDeleteDataUserConfirm(true)
        setTempDeleteData(value);
        setTempEditData('');
        setTempPasswordData('');
        setTitle(`Create User Form`)
    }

    const deleteUser = async() =>{
        try {
            setLoading(true)
            let response = await remove(`api/user/delete/${tempDeleteData._id}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                setUserData(userData.filter((obj) => { return obj._id !== tempDeleteData._id }))
                setLoading(false);
                setTempDeleteData('');
                setDeleteDataUserConfirm(false)

            }
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.error)
            }
            else if (error.response && error.response.status === 404) {
                toast.error(error.response.data.error)
            }
            else {
                toast.error(error.message)
            }
            setLoading(false);
            setTempDeleteData('')
            setDeleteDataUserConfirm(false)
        }
    }


    return (
        <div>
            <MDBRow className='custom-height custom-margin-top'>
                <MDBCol md='5' style={{ height: 'inherit' }}>
                    <MDBCard alignment='center' style={{ height: 'inherit' }}>
                        <MDBCardHeader className='text-primary'>
                            Users 
                            <span className='text-danger'> ({userData.length})       </span>
                        </MDBCardHeader>
                        <MDBCardBody className='order-card-body'>
                            <Table title={'user'} header={userHeader} data={userData} editData={editUser} deleteData={deleteUserConfirm} changePassword={changePassword} />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md='7' style={{ height: 'inherit' }}>
                    <MDBCard alignment='center' style={{ height: 'inherit' }}>
                        <MDBCardHeader className='text-primary'>
                             {title} <span className='text-danger'>{tempEditData ? `(${tempEditData.name})` : tempPasswordData ? `(${tempPasswordData.name})` : ''} </span>
                            <span className='text-danger'> </span>
                        </MDBCardHeader>
                        <MDBCardBody className='order-card-body'>
                            <UserForm create={create} data={tempEditData} passwordData={tempPasswordData} update={update} />
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <ToastContainer />

            </MDBRow>
            {
                deleteDataUserConfirm && (
                    <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Yes, delete it!"
                    confirmBtnBsStyle="danger"
                    title="Are you sure?"
                    onConfirm={deleteUser}
                    onCancel={onCancel}
                    focusCancelBtn
                >
                    You will not be able to recover this data!
                </SweetAlert>
                )
            }
        </div>
    )
}

export default User