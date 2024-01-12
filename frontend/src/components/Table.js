import React from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, MDBTooltip, MDBIcon } from 'mdb-react-ui-kit';
import { formatDateToLocaleString,separateAndCapitalize } from '../Helper';

const Table = ({ title,header, data,editData,deleteData }) => {

    const editRow = (row) =>{
        editData(row)
    }
    return (
        <MDBTable>

            <MDBTableHead>
                <tr>
                    <th scope='col'>#</th>
                    {
                        header.map((value, index) => {
                            return <th key={index} scope='col'>{separateAndCapitalize(value)}</th>
                        })
                    }
                </tr>
            </MDBTableHead>

            <MDBTableBody>
                {
                    data.length > 0 ? data.map((value, index) => {
                        return (
                            <tr key={index} >
                                <th scope='row'>{index + 1}</th>
                                <td  className="text-truncate text-primary pointer" style={{ maxWidth: 116 }}>{value.name}</td>
                                {value.categoryId && <td>{value.categoryId.name}</td>}
                                {value.price && <td>{value.price}</td>}
                                 <td className='text-danger'>{ value.qty }</td>
                                {title === 'product' && <td>{formatDateToLocaleString(value.createdAt)}</td> }
                                <td>
                                    <MDBBtn onClick={()=>editRow(value)} size='sm' className='ms-2  text-primary' tag='a' color='light' floating>
                                        <MDBTooltip tag='span' title="Edit">
                                            <MDBIcon fas icon="edit" />
                                        </MDBTooltip>
                                    </MDBBtn>
                                    <MDBBtn onClick={()=>deleteData(value)} size='sm' className='ms-2  text-danger' tag='a' color='light' floating>
                                        <MDBTooltip tag='span' title="Delete">
                                            <MDBIcon fas icon="trash" />
                                        </MDBTooltip>
                                    </MDBBtn>
                                </td>
                            </tr>
                        )
                    }) : (<tr><td colSpan={header.length+1}>No Data</td></tr>)
                }
            </MDBTableBody>

        </MDBTable>
    );
}

export default Table;