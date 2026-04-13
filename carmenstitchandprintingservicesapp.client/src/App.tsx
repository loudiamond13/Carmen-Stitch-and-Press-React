import { Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './app/pages/HomePage';
import OrdersPage from './app/pages/OrdersPage';
import LoginPage from './app/pages/LoginPage';
import VerificationPage from './app/pages/VerificationPage';
import { Toaster } from "react-hot-toast";
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';
import { Roles } from './constants/roles';
import CreateOrderPage from './app/pages/CreateOrderPage';
import UpdateOrderPage from './app/pages/UpdateOrderPage';
import Expensespage from './app/pages/ExpensesPage';
import TempPage from './app/pages/TestPublicHome';



function App() {

    const {isLoading } = useAuth();

    if (isLoading) {
        return (<LoadingScreen/>);
    }


    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    //style: {
                    //    borderRadius: "12px",
                    //    padding: "12px 16px",
                    //    fontSize: "14px"
                    //}
                }}
            />

            <Routes>
                <Route element={<Layout />} >


                    <Route path="/verify" element={<VerificationPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route element={<ProtectedRoute requiredRoles={[Roles.ADMIN, Roles.COMPANY]} />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/expenses" element={<Expensespage />} />
                        <Route path="/order/create" element={<CreateOrderPage />} />
                        <Route path="/order/:orderId" element={<UpdateOrderPage />} />
                    </Route>



                </Route>
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
            

        </>
    
    );
}

export default App;