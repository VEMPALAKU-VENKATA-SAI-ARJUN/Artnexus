// src/components/ModeratorRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ModeratorRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.role === "moderator" ? children : <Navigate to="/" />;
};

export default ModeratorRoute;
