import React, { useEffect } from 'react'
import {
    MDBAccordion, MDBAccordionItem, MDBRow, MDBCol, MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBIcon,
    MDBBadge, MDBListGroup, MDBListGroupItem,
    MDBSpinner,
    MDBCardFooter
} from 'mdb-react-ui-kit';
import '../styles/order.css'
import { ToastContainer, toast } from 'react-toastify';

import { get } from '../Api';
import { formatDateToLocaleString, months } from '../Helper';
import RechartBarChart from '../components/BarChart';
const Order = () => {

    const [loading, setLoading] = React.useState(true);
    const [orderData, setOrderData] = React.useState([]);
    const [chartData, setChartData] = React.useState([]);
    const [month, setMonth] = React.useState('')
    const getOrderData = async () => {
        try {
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
        let monthQuery = (month) ? `?month=${month}` : ''
        try {
            const response = await get(`api/order/chart${monthQuery}`);
            if (response.status === 200) {
                setLoading(false);
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
            setLoading(false);
        }
    }

    useEffect(() => {
        getOrderData();
        getOrderDataChart();
    }, []);

    const handleMonth = (e) => {
        if (e.target.value) {
            setMonth(e.target.value)
            getOrderDataChart(e.target.value)
        }
    }
    const clearMonth = () =>{
        setMonth('');
        getOrderDataChart();
    }
    return (
        <MDBRow className='custom-height custom-margin-top'>
            <MDBCol md='5' style={{ height: 'inherit' }}>
                <MDBCard alignment='center' style={{ height: 'inherit' }}>
                    <MDBCardHeader className='text-primary'>
                    Orders 
                        <span className='text-danger'> ({orderData.length}) </span>
                    </MDBCardHeader>
                    <MDBCardBody className='order-card-body'>
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
                    <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                </MDBCard>
            </MDBCol>
            <MDBCol md='7' style={{ height: 'inherit' }}>
                <MDBCard alignment='center' style={{ height: 'inherit' }}>
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
                    <MDBCardBody className='order-card-body'>
                        {
                            (loading === false) ? (<RechartBarChart orders={chartData} month={month} />) : (
                                <MDBSpinner role='status'>
                                    <span className='visually-hidden'>Loading...</span>
                                </MDBSpinner>
                            )
                        }

                    </MDBCardBody>
                    <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                </MDBCard>
            </MDBCol>
            <ToastContainer />

        </MDBRow>

    )
}
export default Order