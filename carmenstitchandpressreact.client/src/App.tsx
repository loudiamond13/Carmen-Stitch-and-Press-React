//import { useEffect, useState } from 'react';
//import {  AuthProvider} from './contexts/AuthContext';
//import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useAuth} from "./contexts/AuthContext"
import "../src/test.css"

import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import LoadingScreen from './components/LoadingScreen';
import PageNotFound from './pages/PageNotFound';
import VerificationPage from './pages/Identity/VerificationPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/Identity/ForgotPasswordPage';
import ResetPasswordPage from './pages/Identity/ResetPasswordPage';
import LoginPage from "./pages/Identity/LoginPage";
import { useAsyncLoading } from './hooks/useAsyncLoading';


function App() {
    const { isLoading:authLoading } = useAuth();
    const { isLoading:actionLoading } = useAsyncLoading();


    if (authLoading || actionLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (

            <Routes>
                
               
                <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                <Route path="/verify" element={<Layout><VerificationPage /></Layout>} />
                <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
                <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout><HomePage/></Layout>} />
                <Route path="/orders" element={<Layout><OrdersPage/></Layout>} />
            </Route>

                <Route path="*" element={<Layout><PageNotFound /></Layout> } />
            </Routes>

    );
}

export default App;