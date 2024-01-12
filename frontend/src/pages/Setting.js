import React, { useEffect } from 'react'
import {
    MDBRow, MDBCol, MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardFooter,
    MDBBtn,
    MDBTooltip, MDBIcon
} from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import SweetAlert from 'react-bootstrap-sweetalert';

import '../styles/setting.css'
import Table from '../components/Table';
import CategoryForm from '../components/modals/CategoryForm';
import ProductForm from '../components/modals/ProductForm';
import { get, post, patch, remove } from '../Api';


const Setting = () => {

    const [loading, setLoading] = React.useState(false);
    const [tempDeleteData, setTempDeleteData] = React.useState('');


    const [catModal, setCatModal] = React.useState(false);
    const [categoryData, setCategoryData] = React.useState([]);
    const [deleteDataCatConfirm, setDeleteDataCatConfirm] = React.useState(false)
    const [tempEditCatData, setTempEditCatData] = React.useState('');
    const categoryHeader = ['name', 'action'];

    const [productModal, setProductModal] = React.useState(false);
    const [productData, setProductData] = React.useState([]);
    const [deleteDataProductConfirm, setDeleteDataProductConfirm] = React.useState(false)
    const [tempEditProductData, setTempEditProductData] = React.useState('');
    const productHeader = ['name', 'category', 'price', 'stockQty', 'createdAt', 'action'];


    const getCategoryData = async () => {
        try {
            const response = await get('api/category/getAll');
            if (response.status === 200) {
                setLoading(false);
                setCategoryData(response.data.data);
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

    const getProductData = async () => {
        try {
            const response = await get('api/product/getAll');
            if (response.status === 200) {
                setLoading(false);
                setProductData(response.data.data);
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
        getCategoryData();
        getProductData();
    },[]);

    /*  ====== Product CRUD ====== */

    const openProductModal = (value) => {
        setTempEditProductData(value);
        setProductModal(true);
    }
    const closeProductModal = async (value) => {
        console.log(value,tempEditProductData)
        if (value && tempEditProductData) {
            updateProduct(value);
           
        }
        if (value && !tempEditProductData) createProduct(value)
        setProductModal(false);
        setTempEditProductData('');
        
    }

    const createProduct = async (value) => {
        try {
            setLoading(true)
            let response = await post('api/product/create', value);
            if (response.status === 200) {

                toast.success(response.data.message);
                let newArr = productData;
                newArr.unshift({ ...response.data.data });
                setProductData(newArr);
                setLoading(false);
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

    const updateProduct = async (value) => {
        try {
            let response = await patch(`api/product/update/${tempEditProductData._id}`, value);
            if (response.status === 200) {

                toast.success(response.data.message);
                let newArr = productData.map((obj) =>
                    obj._id === tempEditProductData._id ? { ...obj, ...response.data.data } : obj
                );
                setProductData(newArr);
                setLoading(false);
                setTempEditProductData('')
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
            setTempEditProductData('')
        }

    }

    const deleteProduct = async () => {
        try {
            setLoading(true)
            let response = await remove(`api/product/delete/${tempDeleteData._id}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                setProductData(productData.filter((obj) => { return obj._id !== tempDeleteData._id }))
                setLoading(false);
                setTempDeleteData('');
                setDeleteDataProductConfirm(false)
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
            setDeleteDataProductConfirm(false)
        }
    }
    const deleteProductConfirm = (value) => {
        setDeleteDataProductConfirm(true)
        setTempDeleteData(value);

    }
    /* ========= end of Product CRUD ======== */

    /*  ====== Category CRUD ====== */

    const openCategoryModal = (value) => {
        setTempEditCatData(value);
        setCatModal(true);
    }
    const closeCatModal = async (value) => {
        if (value && tempEditCatData) {
            updateCategory(value);
        }
        if (value && !tempEditCatData)  createCategory(value)
        setCatModal(false);
        setTempEditCatData('');
       
    }

    const createCategory = async (value) => {
        try {
            setLoading(true)
            let response = await post('api/category/create', { "name": value });
            if (response.status === 200) {

                toast.success(response.data.message);
                let newArr = categoryData;
                newArr.unshift({ ...response.data.data });
                setCategoryData(newArr);
                setLoading(false);
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

    const updateCategory = async (value) => {
        try {
            setLoading(true)
            let response = await patch(`api/category/update/${value._id}`, { "name": value.name });
            if (response.status === 200) {

                toast.success(response.data.message);
                let newArr = categoryData.map((obj) =>
                    obj._id === value._id ? { ...obj, "name": value.name } : obj
                );
                setCategoryData(newArr);
                setLoading(false);
                setTempEditCatData('')
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
            setTempEditCatData('')
        }

    }


    const deleteCategory = async () => {
        try {
            setLoading(true)
            let response = await remove(`api/category/delete/${tempDeleteData._id}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                setCategoryData(categoryData.filter((obj) => { return obj._id !== tempDeleteData._id }))
                setLoading(false);
                setTempDeleteData('');
                setDeleteDataCatConfirm(false)
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
            setDeleteDataCatConfirm(false)
        }
    }
    const deleteCategoryConfirm = (value) => {
        console.log(value)
        setDeleteDataCatConfirm(true)
        setTempDeleteData(value);

    }
    /* ========= end of Category CRUD ======== */
    const onCancel = () => {
        setDeleteDataCatConfirm(false);
        setDeleteDataProductConfirm(false)
        setTempDeleteData('')
    }

    return (
        <MDBRow className='custom-height custom-margin-top'>
            <MDBCol md='5' style={{ height: 'inherit' }}>
                <MDBCard alignment='center'>
                    <MDBCardHeader>

                        <span>Categories</span>
                        <MDBBtn onClick={() => setCatModal(true)} size='sm' className='text-primary position-absolute top-0 end-0 mt-1 me-3' tag='a' color='light' floating>
                            <MDBTooltip tag='span' title="Add Category">
                                <MDBIcon fas icon="add" />
                            </MDBTooltip>
                        </MDBBtn>

                    </MDBCardHeader>
                    <MDBCardBody>
                        <Table title={'category'} header={categoryHeader} data={categoryData} editData={openCategoryModal} deleteData={deleteCategoryConfirm} />
                    </MDBCardBody>
                    <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                </MDBCard>
            </MDBCol>
            <MDBCol md='7' >
                <MDBCard alignment='center'>
                    <MDBCardHeader>

                        <span>Products</span>
                        <MDBBtn onClick={() => setProductModal(true)} size='sm' className='text-primary position-absolute top-0 end-0 mt-1 me-3' tag='a' color='light' floating>
                            <MDBTooltip tag='span' title="Add Category">
                                <MDBIcon fas icon="add" />
                            </MDBTooltip>
                        </MDBBtn>

                    </MDBCardHeader>
                    <MDBCardBody>
                        <Table title={'product'} header={productHeader} data={productData} editData={openProductModal} deleteData={deleteProductConfirm} />
                    </MDBCardBody>
                    <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                </MDBCard>
            </MDBCol>

            <CategoryForm open={catModal} closeModal={closeCatModal} data={tempEditCatData} />
            <ProductForm open={productModal} closeModal={closeProductModal} data={tempEditProductData} category={categoryData} />
            <ToastContainer />
            {
                deleteDataCatConfirm && (
                    <>
                        <SweetAlert
                            warning
                            showCancel
                            confirmBtnText="Yes, delete it!"
                            confirmBtnBsStyle="danger"
                            title="Are you sure?"
                            onConfirm={deleteCategory}
                            onCancel={onCancel}
                            focusCancelBtn
                        >
                            You will not be able to recover this data!
                        </SweetAlert>
                    </>
                )
            }
            {
                deleteDataProductConfirm && (
                    <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Yes, delete it!"
                    confirmBtnBsStyle="danger"
                    title="Are you sure?"
                    onConfirm={deleteProduct}
                    onCancel={onCancel}
                    focusCancelBtn
                >
                    You will not be able to recover this data!
                </SweetAlert>
                )
            }

        </MDBRow>
    )
}

export default Setting
