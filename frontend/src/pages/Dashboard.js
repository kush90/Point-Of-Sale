import React from 'react'
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

import LeftSide from '../components/dashboard/LeftSide';
import RightSide from '../components/dashboard/RightSide';
import '../styles/main.css';

const Dashboard = () => {
  return (
    <MDBRow className='custom-height custom-margin-top'>
      <MDBCol md='5' style={{height:'inherit'}}>
       <><LeftSide/></>
      </MDBCol>
      <MDBCol md='7' style={{height:'inherit'}}>
       <><RightSide/></>
      </MDBCol>
    </MDBRow>
  )
}

export default Dashboard;