import React, { useEffect } from 'react'
import {
    MDBBtn, MDBIcon, MDBTooltip,
    MDBCard,
    MDBCardBody,
    MDBBadge,
} from 'mdb-react-ui-kit';

import '../../styles/main.css'
import { API_URL } from '../../Helper';

const CartItem = ({ item, deleteItem, increaseQty, decreaseQty, getQty }) => {
    const [qty, setQty] = React.useState(item.qty);

    useEffect(() => {
        if (item) setQty(item.qty);
    });

    const qtyChange = (e, item) => {
        let newValue = e.target.value.replace(/^0+(?=\d)/, '').replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        if (newValue <= item.stock) {
            getQty(+newValue, item.id);
            setQty(newValue)
        }
        else { alert(`Available stocks (${item.stock})`); getQty((+item.stock), item.id); }
    }

    const increase = (item) => {
        increaseQty(item.id);
    }
    return (
        <MDBCard className='left-side'>
            <MDBCardBody>
                <div className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                        <img
                            src={`${API_URL}/${item.img?.path}`}
                            alt={item.img?.name}
                            style={{ width: '45px', height: '45px' }}
                            className='rounded-circle'
                        />
                        <div className='ms-3'>
                            <p className='fw-bold mb-1'>{item.name}</p>
                            <p className='mb-0 category-color'>{item.category}</p>
                        </div>
                        <div className='ms-3'>
                            <p className='fw-bold mb-1'>Price</p>
                            <p className='mb-0'>{item.price} MMK</p>
                        </div>
                        <div className='ms-3'>
                            <p className='fw-bold mb-1'>Sub Total</p>
                            <p className='mb-0'>{item.subTotal} MMK</p>
                        </div>
                    </div>
                    <MDBBadge pill color='danger' className='pointer' onClick={() => deleteItem(item)} light>
                        Delete
                    </MDBBadge>
                </div>
                <div className='qty-wrapper'>
                    <MDBBtn onClick={() => increase(item)} size='sm' className='ms-2  custom-card-btn plus text-success' tag='a' color='light' floating>
                        <MDBTooltip placement='left' tag='span' wrapperProps={{ color: 'primary' }} title="Increase Qty">
                            <MDBIcon fas icon="plus" />
                        </MDBTooltip>
                    </MDBBtn>

                    <input
                        className='qty'
                        name="quantity"
                        value={qty}
                        onChange={(e) => qtyChange(e, item)}
                        type="text"
                    />


                    <MDBBtn size='sm' disabled={qty === 1 || qty === 0} onClick={() => decreaseQty(item.id)} className='ms-2  custom-card-btn minus text-danger' tag='a' color='light' floating>
                        <MDBTooltip placement='right' tag='span' wrapperProps={{ color: 'primary' }} title="Decrease Qty">
                            <MDBIcon fas icon="minus" />
                        </MDBTooltip>
                    </MDBBtn>
                </div>
            </MDBCardBody>

        </MDBCard>

    )
}

export default CartItem;
