import React from 'react'
import { Outlet } from 'react-router-dom'
import {MDBContainer} from 'mdb-react-ui-kit'
import Navbar from './Navbar'
import '../styles/main.css';
const Main = () => {
    return (
        <>
            <Navbar></Navbar>
            <MDBContainer  fluid>
                <><Outlet /></>
            </MDBContainer>

        </>
    )
}

export default Main