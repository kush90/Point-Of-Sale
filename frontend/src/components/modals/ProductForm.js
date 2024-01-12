import React, { useEffect, useRef } from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon
} from 'mdb-react-ui-kit';
import '../../styles/setting.css'
import { API_URL } from '../../Helper';

const ProductForm = (props) => {
    const { open, closeModal, data, category } = props;
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [categoryId, setCategoryId] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [qty, setQty] = React.useState('');
    const [barCode, setBarcode] = React.useState('');
    const [images, setImages] = React.useState([]);
    const [imgUrl, setImgUrl] = React.useState([]);
    const ref = useRef();


    useEffect(() => {
        if (data) {
            setName(data.name);
            setDescription(data.description);
            setCategoryId(data?.categoryId?._id);
            setPrice(data.price);
            setQty(data.qty);
            setBarcode(data.barCode)
            setImgUrl(data.images)
        }
    }, [data]);

    const toggleOpenClose = (status) => {
        if (data && status === 'save') {
            let newFormData = new FormData();
            newFormData.append('name', name)
            newFormData.append('description', description)
            newFormData.append('categoryId', categoryId)
            newFormData.append('price', price)
            newFormData.append('qty', qty)
            newFormData.append('barCode', barCode);
            let path = [];
            for (const url of imgUrl) {
                if (!url.hasOwnProperty('new')) path.push(url)
            }
            newFormData.append('images', JSON.stringify(path));
            for (const file of images) {
                console.log(file)
                newFormData.append('files', file);
            }
            closeModal(newFormData);
        }
        if (data === '' && status === 'save') {

            let newFormData = new FormData();
            newFormData.append('name', name)
            newFormData.append('description', description)
            newFormData.append('categoryId', categoryId)
            newFormData.append('price', price)
            newFormData.append('qty', qty)
            newFormData.append('barCode', barCode);
            for (const file of images) {
                console.log(file)
                newFormData.append('files', file);
            }
            closeModal(newFormData);
        }
        if (status === 'close') closeModal();
        setName('');
        setDescription('');
        setCategoryId('');
        setPrice('');
        setQty('');
        setBarcode('');
        setImages('');
        setImgUrl([]);
        ref.current.value = null;
    }
    const imageUpload = (e) => {
        setImages(e.target.files)
        let newArr = imgUrl;
        for (let i = 0; i < e.target.files.length; i++) {

            newArr.unshift({ name: e.target.files[i].name, type: e.target.files[i].type, path: URL.createObjectURL(e.target.files[i]), new: true });
        }
        setImgUrl(newArr)
    }
    const removeImage = (name) => {
        let newArr = imgUrl.filter((img) => { return img.name !== name });
        let newFile = [];
        for (const file of images) {
            if (file.name !== name) newFile.push(file)
        }
        setImgUrl(newArr);
        setImages(newFile)
    }

    return (
        <>
            <MDBModal staticBackdrop open={open} tabIndex='-1' onClose={toggleOpenClose} >
                <MDBModalDialog>
                    <MDBModalContent>


                        <MDBModalHeader>
                            <MDBModalTitle>Product Form</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={() => toggleOpenClose('close')} ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>

                            <MDBInput className='mb-4' required onChange={(e) => setName(e.target.value)} value={name} label='Name' />
                            <MDBInput className='mb-4' required onChange={(e) => setDescription(e.target.value)} value={description} label='Description' />
                            <div className='mb-4'>
                                <select className="browser-default custom-select" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                    <option value="" >Choose Product Category</option>
                                    {
                                        category.map((cat, index) => {
                                            return <option key={cat._id} value={cat._id} >{cat.name}</option>
                                        })
                                    }

                                </select>
                            </div>
                            <MDBInput className='mb-4' required onChange={(e) => setPrice(e.target.value)} value={price} label='Price' />
                            <MDBInput className='mb-4' required onChange={(e) => setQty(e.target.value)} value={qty} label='Qty' />
                            <MDBInput className='mb-4' required onChange={(e) => setBarcode(e.target.value)} value={barCode} label='Barcode' />
                            <label for="file-upload" class="custom-file-upload">
                                <i class="fa fa-cloud-upload"></i> <span>Upload Images</span>
                            </label>
                            <input accept='image/*' ref={ref} id="file-upload" type="file"  onChange={(e)=>imageUpload(e)} multiple />
                            <MDBContainer className='product-modal-img-list'>
                                <MDBRow>
                                    {
                                        (imgUrl && imgUrl.length > 0) && imgUrl.map((img, index) => {

                                            return (
                                                <MDBCol key={index} lg='4' md='12' className='mb-4 set-relative'>
                                                <MDBIcon fas icon="times-circle" color='danger' className='delete-btn' onClick={() => removeImage(img.name)} />

                                                    <img
                                                        src={img?.new ? img.path : `${API_URL}/${img.path}`}
                                                        className='img-fluid shadow-2-strong rounded-4 custom-img'
                                                        alt={img.name}
                                                    />
                                                </MDBCol>
                                            )
                                        })
                                    }
                                </MDBRow>
                            </MDBContainer>
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={() => toggleOpenClose('close')}>
                                Close
                            </MDBBtn>
                            <MDBBtn disabled={(!name || !description || !price || !categoryId || !qty || !barCode)}
                                onClick={() => toggleOpenClose('save')} >Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}

export default ProductForm;