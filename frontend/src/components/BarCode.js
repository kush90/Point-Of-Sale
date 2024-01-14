// Barcode.js

import React, { forwardRef } from 'react';
import Barcode from 'react-barcode';

const BarCode = forwardRef(({ value, width, height }, ref) => {
  return (
    <div className='barcode' ref={ref} style={{ width, height }}>
      <Barcode value={value} />
    </div>
  );
});

export default BarCode;