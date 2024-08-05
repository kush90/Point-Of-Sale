import React, { useEffect } from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
} from 'mdb-react-ui-kit';
import '../../styles/receipt.css';
import { formatDateToLocaleString, getStorage } from '../../Helper';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../CheckOutForm'
const stripePromise = loadStripe('pk_test_51PitVX08BK5LTkERTMgbLG6QGjgQK5f1dv7kyPMl8vrpBgVFmrJcJKtxg4Cx6gzqnsS4hVilB3WfPMPzGuuQMf9j00j2ZPgzlB'); // Replace with your publishable key

const Receipt = ({ open, toggleOpen, data }) => {
    const [user, setUser] = React.useState('')
    const getLoginUser = () => {
        setUser(JSON.parse(getStorage('user')));
    }

    useEffect(() => {
        getLoginUser();
    }, [data]);

    const closeDialog = () => {
        toggleOpen(false)
    }
    const downloadReceipt = () => {
        const tableHtml = document.querySelector('.body-wrap').outerHTML;
        const blob = new Blob([tableHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table_data.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <MDBModal staticBackdrop className="receipt" open={open} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader className='bg-primary' style={{ height: 50 }}>
                            <div >
                                <p className="text-center text-white title">Order Receipt</p>
                            </div>
                            <MDBBtn className='btn-close' color='none' onClick={closeDialog}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <table className="body-wrap">
                                <tbody><tr>
                                    <td></td>
                                    <td className="container" width="600">
                                        <div className="content">
                                            <table className="main" id="printTable" width="100%" cellPadding="0" cellSpacing="0">
                                                <tbody><tr>
                                                    <td className="content-wrap aligncenter">
                                                        <table width="100%" cellPadding="0" cellSpacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="content-block">
                                                                        <table className="invoice">
                                                                            <tbody><tr>
                                                                                <td>Cashier : {user.user}<br />Reference No : {data.referenceNo}<br />Date :  {formatDateToLocaleString(data.createdAt)}</td>
                                                                            </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <table className="invoice-items" cellPadding="0" cellSpacing="0">

                                                                                            <tbody>
                                                                                                <>
                                                                                                    {
                                                                                                        (data.products && data.products.length > 0) && data.products.map((pro, index) => {

                                                                                                            return (
                                                                                                                <tr key={index}>
                                                                                                                    <td>
                                                                                                                        <span className='font-size-12'><strong className='text-primary'>Name : </strong>  {pro.name},  <strong className='text-primary'>Price : </strong>MMK {pro.price} ,  <strong className='text-primary'>Qty : </strong>({pro.qty})</span>

                                                                                                                    </td>

                                                                                                                    <td className="alignright">MMK {pro.subTotal}</td>
                                                                                                                </tr>
                                                                                                            )
                                                                                                        })
                                                                                                    }

                                                                                                </>




                                                                                                <tr className="total">
                                                                                                    <td className="alignright" width="80%">Total</td>
                                                                                                    <td className="alignright">MMK {data.totalAmount}</td>
                                                                                                </tr>
                                                                                            </tbody></table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody></table>
                                                                    </td>
                                                                </tr>


                                                            </tbody>

                                                        </table>
                                                    </td>
                                                </tr>
                                                    <tr>
                                                        <td>
                                                            <span className='thank-you'> Thank you for your business</span>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                                </tbody></table>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm orderId={data.referenceNo} amount={data.totalAmount} />
                            </Elements>
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={closeDialog}>
                                Close
                            </MDBBtn>
                            <MDBBtn color='danger' onClick={downloadReceipt}>Download</MDBBtn>
                            <MDBBtn color='success' onClick={() => window.print()}>Print</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}
export default Receipt;