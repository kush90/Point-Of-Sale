import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkStorage } from './Helper';

const AuthGuard = ({ Component }) => {
    const auth = checkStorage('user');
    // If has token, return outlet in other case return navigate to login page
    return auth ? <Component /> : <Navigate to="/" />;
}

export default AuthGuard