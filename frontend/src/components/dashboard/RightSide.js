import React, { useEffect } from 'react'
import {
    MDBRow, MDBCol, MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardFooter,
    MDBInput,
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBSpinner
} from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/main.css';

import Card from './Card';

import { get } from '../../Api';


const RightSide = () => {

    const [loading, setLoading] = React.useState(false);
    const [categoryData, setCategoryData] = React.useState([]);
    const [productData, setProductData] = React.useState([]);
    const [category, setCategory] = React.useState('all');

    const handleCategory = (value) => {
        if (value === category) {

            return;
        }
        if (value !== 'all') searchCategory(value);
        else getProductData();
        setCategory(value);
    };
    const getCategoryData = async () => {
        try {
            setLoading(true)
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
            setLoading(true)
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
    }, []);

    const searchName = async (event) => {
        try {
            setLoading(true)
            let categoryId = category !== 'all' ? `&categoryId=${category}` : '';
            const response = await get(`api/product/getAll?name=${event.target.value}${categoryId}`);
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

    const searchCategory = async (id) => {
        try {
            setLoading(true)
            const response = await get(`api/product/getAll?categoryId=${id}`);
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

    return (
        <MDBCard alignment='center' style={{ height: 'inherit' }}>
            <MDBCardHeader><MDBInput onKeyUp={searchName} autoFocus label='Product name' id='form1' type='text' /></MDBCardHeader>
            <MDBCardBody>
                <MDBRow>
                    <MDBCol md='2' className='padding-0' >
                        <p className='text-primary' >Categories</p>
                        <div className="overflow-y-scroll right-side-category">
                            <MDBTabs pills className='flex-column text-center'>
                                <MDBTabsItem>
                                    <MDBTabsLink onClick={() => handleCategory(`all`)} active={category === `all`} >
                                        All
                                    </MDBTabsLink>
                                </MDBTabsItem>
                                {
                                    (loading === false) ? (categoryData.length > 0) && categoryData.map((cat, index) => {

                                        return (
                                            <MDBTabsItem key={cat._id}>
                                                <MDBTabsLink  onClick={() => handleCategory(cat._id)} active={category === cat._id} >
                                                    {cat.name}
                                                </MDBTabsLink>
                                            </MDBTabsItem>
                                        )

                                    }) : (
                                        <MDBTabsItem>
                                            <MDBTabsLink>
                                                <MDBSpinner role='status'>
                                                    <span className='visually-hidden'>Loading...</span>
                                                </MDBSpinner>
                                            </MDBTabsLink>
                                        </MDBTabsItem>)
                                }

                            </MDBTabs>
                        </div>

                    </MDBCol>
                    <MDBCol md='10'>
                        <MDBRow>
                            {
                                (loading === false) ? (productData.length > 0) && productData.map((pro, index) => {


                                    return (<MDBCol key={index} sm='4' md='3' lg="3">
                                        <Card key={index} data={pro} />
                                    </MDBCol>)
                                })
                                    : (
                                        <MDBSpinner role='status'>
                                            <span className='visually-hidden'>Loading...</span>
                                        </MDBSpinner>
                                    )
                            }

                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBCardBody>
            <MDBCardFooter className='text-muted'>Pagination</MDBCardFooter>
            <ToastContainer />
        </MDBCard>

    )

}

export default RightSide