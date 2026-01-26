import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";



const ProtectedRoute = () => {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return (<LoadingScreen />);
    }

    if (!isAuthenticated) {
        return (<Navigate to="/login" replace />);

    }

    return (
    <Outlet/>
    );
}

export default ProtectedRoute;