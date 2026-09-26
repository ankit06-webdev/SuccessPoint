import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    // Check if the user is authenticated from your Redux store
    const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

    // If they are not logged in, kick them back to the login page immediately
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If they ARE logged in, allow them to see the child components (the Dashboard Layout)
    return <Outlet />;
};

export default ProtectedRoute;