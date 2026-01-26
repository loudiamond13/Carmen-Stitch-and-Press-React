//import { useEffect, useState } from 'react';
//import {  AuthProvider} from './contexts/AuthContext';
//import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useAuth} from "./contexts/AuthContext"
import Layout from './layouts/Layout';
import Login from "./pages/LoginPage";
import "../src/test.css"


import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import LoadingScreen from './components/LoadingScreen';
import PageNotFound from './pages/PageNotFound';
import VerificationPage from './pages/VerificationPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    const { isLoading } = useAuth();


    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (

            <Routes>
                
               
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/verify" element={<Layout><VerificationPage /></Layout>} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout><HomePage/></Layout>} />
                <Route path="/orders" element={<Layout><OrdersPage/></Layout>} />
            </Route>

                <Route path="*" element={<Layout><PageNotFound /></Layout> } />
            </Routes>

    );
}

export default App;