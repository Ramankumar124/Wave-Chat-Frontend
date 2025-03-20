import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'

const ProtectedRoute: React.FC<{
    children?: React.ReactNode;
    user: any;
    redirect?: string;
}> = ({ children, user, redirect = "/login" }) => {
    if (!user) return <Navigate to={redirect} />;
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute