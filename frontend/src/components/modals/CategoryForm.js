import React, {useEffect} from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInput
} from 'mdb-react-ui-kit';

const CategoryForm = (props) => {
    const { open, closeModal,data } = props;
    const [name,setName] = React.useState('');


    useEffect(()=>{
        if(data.name) setName(data.name)
    },[data]);

    const toggleOpenClose = (status) => {
        if(data && status === 'save') {
            let newObj = {...data,name};
            closeModal(newObj);
        }
        if(data === '' && status === 'save') closeModal(name);
        if(status === 'close') closeModal();
        setName('')
    }
    
    return (
        <>
            <MDBModal staticBackdrop  open={open} tabIndex='-1' onClose={toggleOpenClose} >
                <MDBModalDialog>
                    <MDBModalContent>
                      
                      
                        <MDBModalHeader>
                            <MDBModalTitle>Category Form</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={()=>toggleOpenClose('close')} ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                           
                                <MDBInput className='mb-4' required onChange={(e)=>setName(e.target.value)} value={name}  label='Category Name' />
                          
                        </MDBModalBody>

                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={()=>toggleOpenClose('close')}>
                                Close
                            </MDBBtn>
                            <MDBBtn disabled={!name}onClick={()=>toggleOpenClose('save')} >Save changes</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}

export default CategoryForm;