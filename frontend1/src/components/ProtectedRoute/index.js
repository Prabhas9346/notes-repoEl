import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getJwtToken } from '../utils/auth';

const ProtectedRoute = () => {
    const token = getJwtToken();
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
