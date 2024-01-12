import React from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardImage,
    MDBIcon,
    MDBTooltip
} from 'mdb-react-ui-kit';
import '../../styles/main.css';
import { API_URL,createStorage,checkStorage,getStorage } from '../../Helper';

const Card = ({data})=> {

        const  addToCart = (item)=>{
            let checkCart = checkStorage('carts');
            if(checkCart === false) {
                let cartsArray = [];
                cartsArray.push({"img":{path:item.images[0].path,name:item.images[0].name},"id":item._id,"name":item.name,"category":item.categoryId.name,"price":item.price,"qty":1,"subTotal":(item.price*1),"stock":item.qty});
                createStorage('carts',cartsArray);
            }
            else {
                let cartsArray = JSON.parse(getStorage('carts'));
                const existingProduct = cartsArray.find(cart => cart.id === item._id);
                if(existingProduct) {
                    existingProduct.qty += 1;
                    existingProduct.subTotal = (existingProduct.qty * existingProduct.price);
                }
                else {
                    cartsArray.push({"img":{path:item.images[0].path,name:item.images[0].name},"id":item._id,"name":item.name,"category":item.categoryId.name,"price":item.price,"qty":1,"subTotal":(item.price*1),"stock":item.qty});
                }
                createStorage('carts',cartsArray)
            }
            const event = new Event('cartUpdated');
            window.dispatchEvent(event);
        }

        return (
            <MDBCard className='custom-card'>
                <MDBCardImage className='img-fluid img-thumbnail custom-card-image hover-overlay' src={data.images.length > 0 && `${API_URL}/${data.images[0].path}`} alt={data.name} position='top' />
                <MDBCardBody className='custom-card-height-body'>
                    <MDBCardText>
                        <span className="d-inline-block text-truncate text-primary pointer" style={{ maxWidth: 116 }}>
                           {data.name}
                        </span><br />
                        <span className="d-inline-block text-truncate category-color" style={{ maxWidth: 150 }}>{data.categoryId.name}</span><br />
                        <span className="d-inline-block text-truncate" style={{ maxWidth: 150 }}>MMK {data.price}</span><br />
                        <MDBBtn disabled={data.qty == 0} onClick={(e)=>addToCart(data)} size='sm' className='ms-2  custom-card-btn text-success' tag='a' color='light' floating>
                        <MDBTooltip tag='span' wrapperProps={{ color: 'primary' }} title="Add Cart">
                            <MDBIcon fas icon="shopping-cart" />
                        </MDBTooltip>
                        </MDBBtn>

                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        )
}

export default Card