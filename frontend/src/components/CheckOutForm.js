import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../Helper';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBTypography,
  MDBSpinner,
} from 'mdb-react-ui-kit';
const CheckoutForm = (orderId, amount) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${API_URL}/api/payment/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'usd', orderId }), // Example amount in cents
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      elements.getElement(CardElement).clear();
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center payment-padding">
        <MDBCol md="6">
          <MDBTypography tag="h2" className="text-center mb-4">
            Payment
          </MDBTypography>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <CardElement />
            </div>
            <MDBBtn
              type="submit"
              color="primary"
              block
              disabled={processing || !clientSecret || succeeded}
            >
              {processing ? <MDBSpinner size="sm" role="status" tag="span" /> : 'Pay'}
            </MDBBtn>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {succeeded && <div className="alert alert-success mt-3">Payment succeeded!</div>}
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default CheckoutForm;
