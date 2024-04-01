import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase_files/Config';
import { AuthContext } from './AuthContext';

function PrivateRoute({ component: Component }) {
    const {user} = useContext(AuthContext)

  return user ? <Component /> : <Navigate to="/login" />
}

export default PrivateRoute;
