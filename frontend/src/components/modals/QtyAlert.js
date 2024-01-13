import React from 'react';
import {
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBIcon
} from 'mdb-react-ui-kit';

const QtyAlert = ({ qtyAlert, toggleOpen,qtyAlertMsg }) => {
    const close = () => {
        toggleOpen(false)
    }

    return (
        <>
            <MDBModal open={qtyAlert} tabIndex='-1' onClose={close}>
                <MDBModalDialog size='sm'>
                    <MDBModalContent>
                        <MDBModalHeader className='bg-danger' style={{height:40}}>
                            <MDBModalTitle className='text-white'>Warning !</MDBModalTitle>
                            <MDBIcon onClick={close} color='light' fas icon='close'></MDBIcon>
                        </MDBModalHeader>
                        <MDBModalBody>{qtyAlertMsg}</MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}

export default QtyAlert;