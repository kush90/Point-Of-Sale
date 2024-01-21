import React, { useEffect } from 'react'
import {
    MDBAccordion, MDBAccordionItem, MDBRow, MDBCol, MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBIcon,
    MDBBadge, MDBListGroup, MDBListGroupItem,
    MDBSpinner,
    MDBTable, MDBTableHead, MDBTableBody, MDBInput
} from 'mdb-react-ui-kit';
import '../styles/order.css'
import { ToastContainer, toast } from 'react-toastify';

import { get } from '../Api';
import { formatDateToLocaleString, months } from '../Helper';
import RechartBarChart from '../components/BarChart';
import { API_URL } from '../Helper';
import defaultImage from '../assets/default.jpeg';

const Order = () => {

    const [loading, setLoading] = React.useState(false);
    const [orderData, setOrderData] = React.useState([]);

    const [chartLoading, setchartLoading] = React.useState(false);
    const [chartData, setChartData] = React.useState([]);

    const [soldLoading, setSoldLoading] = React.useState(false);
    const [mostSoldProduct, setMostSoldProduct] = React.useState([]);

    const [month, setMonth] = React.useState('')
    const [referenceNo, setReferenceNo] = React.useState('ORD0000')

    const getOrderData = async () => {
        try {
            setLoading(true)
            const response = await get('api/order/getAll');
            if (response.status === 200) {
                setLoading(false);
                setOrderData(response.data.data);
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

    const getOrderDataChart = async (month) => {
        setchartLoading(true)
        let monthQuery = (month) ? `?month=${month}` : ''
        try {
            const response = await get(`api/order/chart${monthQuery}`);
            if (response.status === 200) {
                setchartLoading(false);
                setChartData(response.data.data);
            }
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.error)
            }
            else {
                toast.error(error.message)
            }
            setchartLoading(false);
        }
    }

    const getMostSoldProduct = async () => {
        try {
            setSoldLoading(true)
            const response = await get('api/product/sold');
            if (response.status === 200) {
                setSoldLoading(false);
                setMostSoldProduct(response.data.data);
                console.log(response.data.data)
            }
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.error)
            }
            else {
                toast.error(error.message)
            }
            setSoldLoading(false);
        }
    }

    useEffect(() => {
        getOrderData();
        getOrderDataChart();
        getMostSoldProduct();
    }, []);

    const handleMonth = (e) => {
        if (e.target.value) {
            setMonth(e.target.value)
            getOrderDataChart(e.target.value)
        }
    }

    const clearMonth = () => {
        setMonth('');
        getOrderDataChart();
    }

    const searchOrder = async (e) => {
        try {
            let userInput = e.target.value.replace(/^0+(?=\d)/, '').replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            setReferenceNo(userInput);
            setLoading(true)
            const response = await get(`api/order/getAll?referenceNo=${'ORD0000' + userInput}`);
            if (response.status === 200) {
                setLoading(false);
                setOrderData(response.data.data);
                setReferenceNo('')


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
        <div className='order'>
            <MDBRow className='custom-margin-top'>
                <MDBCol md='5'>
                    <MDBCard alignment='center' style={{ height: '100%' }}>
                        <MDBCardHeader className='text-primary'>
                            Orders
                            <span className='text-danger'> ({orderData.length})       </span>
                            <span>
                                <MDBInput
                                    onKeyUp={searchOrder} label='Order Reference no' placeholder='Enter just last number' id='form1' type='text' />
                            </span>
                        </MDBCardHeader>
                        <MDBCardBody className='order-card'>
                            <MDBAccordion flush>
                                {
                                    (loading === false) ? (orderData && orderData.length > 0) && orderData.map((order, index) => {

                                        return (

                                            <MDBAccordionItem key={index + 1} collapseId={index + 1} headerTitle={<>{index + 1} &nbsp;<MDBIcon color='primary' far icon="list-alt" /> &nbsp; <span className='font-14'>{order.referenceNo} ({order.totalAmount} MMK)</span> <MDBBadge className='order-date' pill light color='danger'>
                                                {formatDateToLocaleString(order.createdAt)}
                                            </MDBBadge></>}
                                            >

                                                <MDBListGroup light numbered style={{ minWidth: '22rem' }}>
                                                    {
                                                        (order.products && order.products.length > 0) && order.products.map((pro, index) => {
                                                            return (
                                                                <MDBListGroupItem key={index} className='d-flex justify-content-between align-items-start'>
                                                                    <div className='ms-2 me-auto font-14'>
                                                                        <div className='fw-bold'>{pro.name}</div>{pro.category}<br />
                                                                    </div>
                                                                    <div className='me-2 font-14'>
                                                                        {pro.price} MMK
                                                                    </div>
                                                                    <MDBBadge pill light>
                                                                        {pro.qty}
                                                                    </MDBBadge>
                                                                </MDBListGroupItem>
                                                            )
                                                        })
                                                    }

                                                </MDBListGroup>
                                            </MDBAccordionItem>
                                        )
                                    }) :
                                        (

                                            <MDBSpinner role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </MDBSpinner>

                                        )

                                }
                            </MDBAccordion>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md='7'>
                    {/* order chart */}
                    <MDBCard alignment='center' className='custom-height'>
                        <MDBCardHeader className='text-primary' style={{ position: "relative" }}>

                            Order Bar Chart Default by <span className='text-danger'>( This Week )</span>
                            <MDBBadge style={{ opacity: month ? 1 : 0.6, cursor: month ? 'default' : 'not-allowed' }} className='ms-4 pointer' onClick={clearMonth}>Set Bar Chart Default</MDBBadge>
                            <div className='month-select'>
                                <select className="browser-default custom-select" value={month} onChange={(e) => handleMonth(e)}>
                                    <option value={null} defaultValue={''}>Choose Month</option>
                                    {
                                        months.map((month, index) => {
                                            return <option key={index} value={index} >{month}</option>
                                        })
                                    }

                                </select>
                            </div>
                        </MDBCardHeader>
                        <MDBCardBody className='order-card-right'>
                            {
                                (chartLoading === false) ? (<RechartBarChart orders={chartData} month={month} />) : (
                                    <MDBSpinner role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                    </MDBSpinner>
                                )
                            }

                        </MDBCardBody>
                    </MDBCard>
                    {/* Top 5 most sold products */}
                    <MDBRow className='custom-height custom-margin-top-row'>
                        <MDBCol md='12' style={{ height: 'inherit' }}>
                            <MDBCard alignment='center' style={{ height: 'inherit' }}>
                                <MDBCardHeader className='text-primary'>
                                    Top <span className='text-danger'>(5)</span> Most Sold Products
                                    <span className='text-danger'>  </span>
                                </MDBCardHeader>
                                <MDBCardBody className='order-card-right' style={{ height: 'inherit' }}>
                                    {
                                        (soldLoading === false) ?

                                            <MDBTable align='middle'>
                                                <MDBTableHead>
                                                    <tr>
                                                        <th scope='col'>Product</th>
                                                        <th scope='col'>Category</th>
                                                        <th scope='col'>Price</th>
                                                        <th scope='col'>Total Sold</th>
                                                        <th scope='col'>Total Amount</th>
                                                    </tr>
                                                </MDBTableHead>
                                                <MDBTableBody style={{ height: 'inherit' }}>
                                                    {
                                                        (mostSoldProduct && mostSoldProduct.length > 0) && mostSoldProduct.map((pro, index) => {
                                                            return (<tr key={index}>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <img
                                                                            src={(pro.product.images && pro.product.images.length > 0) ? `${API_URL}/${pro.product.images[0]?.path}` : defaultImage} alt={(pro.product.images && pro.product.images.length > 0) ? pro.product.images[0]?.name : 'default'}
                                                                            style={{ width: '45px', height: '45px' }}
                                                                            className='rounded-circle'
                                                                        />
                                                                        <div className='ms-3'>
                                                                            <p className='fw-bold mb-1'>{pro.product.name}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className='fw-normal mb-1'>{pro.product.category?.name}</p>
                                                                </td>
                                                                <td>
                                                                    <p className='fw-normal mb-1'>{pro.product.price}</p>

                                                                </td>
                                                                <td> <p className='fw-normal mb-1'>{pro.sold}</p></td>
                                                                <td>
                                                                    <p className='fw-normal mb-1'>{pro.totalAmount}</p>
                                                                </td>
                                                            </tr>)
                                                        })
                                                    }

                                                </MDBTableBody>
                                            </MDBTable>
                                            : (<MDBSpinner role='status'>
                                                <span className='visually-hidden'>Loading...</span>
                                            </MDBSpinner>)
                                    }
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <ToastContainer />

                    </MDBRow>
                </MDBCol>
                <ToastContainer />

            </MDBRow>

        </div>
    )
}
export default Order