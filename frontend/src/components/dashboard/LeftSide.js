import React, { useEffect } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardFooter,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';

import CartItem from '../dashboard/CartItem';
import { getStorage, clearStorage, createStorage } from '../../Helper';
import { post } from '../../Api';
import QtyAlert from '../modals/QtyAlert';
import Receipt from '../modals/Receipt';

const LeftSide = () => {

  const [loading, setLoading] = React.useState(false);
  const [cart, setCart] = React.useState([]);

  const [qtyAlert, setQtyAlert] = React.useState(false);
  const [qtyAlertMsg, setQtyAlertMsg] = React.useState('');

  const [receipt, setReceipt] = React.useState(false);
  const [receiptData, setReceiptData] = React.useState('')

  const toggleOpen = (value) => setQtyAlert(value);

  useEffect(() => {
    // Function to update the cart when localStorage changes
    const updateCart = () => {
      const storedCart = JSON.parse(getStorage('carts')) || [];
      setCart(storedCart);
    };

    // Listen for the custom event or use a state management library to detect cart updates
    window.addEventListener('cartUpdated', updateCart);

    // Load initial cart data
    updateCart();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  const totalAmountOfCart = () => {
    const sum = cart?.reduce((accumulator, object) => {
      return accumulator + object.subTotal;
    }, 0);
    return sum;
  }

  const deletItemCart = (item) => {
    let storageCart = JSON.parse(getStorage('carts'));
    let newArr = storageCart.filter((value) => {
      return (value.id !== item.id)
    });
    createStorage('carts', newArr);
    setCart(newArr);
  }
  const increaseQty = (id) => {
    let storageCart = JSON.parse(getStorage('carts'));
    storageCart.map((item) => {
      if (item.id === id) {
        if (item.qty < item.available) {
          item.qty += 1;
          item.subTotal = (item.price * item.qty);
        }
        else {
          setQtyAlertMsg(`Available stocks (${item.available})`)
          setQtyAlert(true)
        }

      }
      return item;
    });
    createStorage('carts', storageCart);
    setCart(storageCart);
  }

  const decreaseQty = (id) => {
    let storageCart = JSON.parse(getStorage('carts'));
    storageCart.map((item) => {
      if (item.id === id) {
        item.qty -= 1;
        item.subTotal = (item.price * item.qty)
      }
      return item;
    });
    createStorage('carts', storageCart);
    setCart(storageCart);
  }
  const getQty = (qty, id) => {
    let storageCart = JSON.parse(getStorage('carts'));
    storageCart?.map((item) => {
      if (item.id === id) {
        item.qty = qty;
        item.subTotal = (item.price * item.qty)
      }
      return item;
    });
    createStorage('carts', storageCart);
    setCart(storageCart);
  }
  const pay = async () => {
    try {
      setLoading(true);
      let response = await post('api/order/create', { products: cart, totalAmount: totalAmountOfCart() });
      if (response.status === 200) {
        clearStorage('carts');
        setCart([]);
        setReceiptData(response.data.data);
        const event = new Event('cartClear');
        window.dispatchEvent(event);
        setReceipt(true);
        setLoading(false);
        toast.success(response.data.message);
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

  const receiptClose = (value) =>{
    setReceipt(value)
    setReceiptData([]);
  }

  return (
    <MDBCard className="left-side" alignment='center' style={{ height: 'inherit' }}>
      <MDBCardHeader className='text-primary' style={{ fontSize: "1rem" }}>Your Carts <span className='text-danger'>({cart?.length})</span>
      </MDBCardHeader>
      <div className="left-side-div">
        <MDBCardBody style={{ paddingLeft: 12 }}>
          <MDBRow>
            {
              (cart && cart.length > 0) && cart.map((item, index) => {
                return (
                  <MDBCol size="12" key={index} style={{ marginBottom: 10 }}>
                    <CartItem size="12" key={index} item={item} deleteItem={deletItemCart} increaseQty={increaseQty} decreaseQty={decreaseQty} getQty={getQty} />
                  </MDBCol>
                )
              })
            }

          </MDBRow>
        </MDBCardBody>
      </div>
      <MDBCardFooter className='text-muted'>
        <MDBRow className='mb-4'>
          <MDBCol size="6" className='fw-bold'>Total</MDBCol>
          <MDBCol size="6" className='fw-bold'>
            {
              totalAmountOfCart()
            } MMK
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size="12">
            {loading === false ? (
              <MDBBtn size='sm' disabled={cart.length === 0} onClick={pay}>Confirm</MDBBtn>
            ) : (<MDBBtn size='sm' disabled  >
              <MDBSpinner size='sm' role='status' tag='span' className='me-2 loader-position' block="true" />
              Paying...
            </MDBBtn>)

            }
            <MDBBtn size='sm' disabled={cart.length === 0} className="ms-2" color='danger' onClick={() => { clearStorage('carts'); setCart([]) }}>Clear</MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBCardFooter>
   
        <><ToastContainer /></>
      
       { qtyAlert && <QtyAlert qtyAlert={qtyAlert} qtyAlertMsg={qtyAlertMsg} toggleOpen={toggleOpen}></QtyAlert>}
      { receipt && <Receipt open={receipt} data={receiptData} toggleOpen={receiptClose}></Receipt>}
    </MDBCard>
  );
}
export default LeftSide;