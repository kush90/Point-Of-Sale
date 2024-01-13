import React, { useEffect } from 'react'
import {
    MDBAccordion, MDBAccordionItem, MDBRow, MDBCol, MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardFooter,
    MDBBtn,
    MDBTooltip, MDBIcon,
    MDBBadge, MDBListGroup, MDBListGroupItem
} from 'mdb-react-ui-kit';
import '../styles/order.css'
import { ToastContainer, toast } from 'react-toastify';

import { get } from '../Api';
import { formatDateToLocaleString } from '../Helper';
const Order = () => {

    const [loading, setLoading] = React.useState(false);
    const [orderData, setOrderData] = React.useState([]);
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

    useEffect(() => {
        getOrderData();
    }, []);
    return (
        <MDBRow className='custom-height custom-margin-top'>
            <MDBCol md='6' style={{ height: 'inherit' }}>
                <MDBCard alignment='center' style={{ height: 'inherit' }}>
                    <MDBCardHeader>

                        <span>Orders ({orderData.length})</span>
                    </MDBCardHeader>
                    <MDBCardBody className='order-card-body'>
                        <MDBAccordion flush>
                            {
                                (orderData && orderData.length > 0) && orderData.map((order, index) => {

                                    return (

                                        <MDBAccordionItem key={index + 1} collapseId={index + 1} headerTitle={<>{index + 1} &nbsp;<MDBIcon color='primary' far icon="list-alt" /> &nbsp; <span className='font-14'>{order.referenceNo} ({order.totalAmount} MMK)</span> <MDBBadge className='order-date' pill light color='danger'>
                                            {formatDateToLocaleString(order.createdAt)}
                                        </MDBBadge></>}
                                        >

                                            <MDBListGroup light numbered style={{ minWidth: '22rem' }}>
                                                {
                                                    (order.products && order.products.length > 0) && order.products.map((pro) => {
                                                        return (
                                                            <MDBListGroupItem className='d-flex justify-content-between align-items-start'>
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
                                })

                            }
                        </MDBAccordion>
                    </MDBCardBody>
                    <MDBCardFooter className='text-muted'>2 days ago</MDBCardFooter>
                </MDBCard>
            </MDBCol>
            <ToastContainer />

        </MDBRow>

    )
}
export default Order