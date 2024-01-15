// BarcodeGenerator.js

import React, { useRef } from 'react';
import Barcode from './BarCode';
import html2canvas from 'html2canvas';
import {  MDBBtn, MDBTooltip, MDBIcon } from 'mdb-react-ui-kit';

const BarCodeCanavas = ({ value, width, height }) => {
    const barcodeRef = useRef(null);

    const handleDownload = () => {
        html2canvas(barcodeRef.current).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'barcode.png';
            link.click();
        });
    };

    return (
        <div className='canavas'>
            <Barcode ref={barcodeRef} value={value} width={width} height={height} />
            <MDBBtn onClick={handleDownload} size='sm' className='ms-2  text-primary' tag='a' color='light' floating>
                <MDBTooltip tag='span' title="Download Barcode">
                    <MDBIcon fas icon="download" />
                </MDBTooltip>
            </MDBBtn>
        </div>
    );
};

export default BarCodeCanavas;
