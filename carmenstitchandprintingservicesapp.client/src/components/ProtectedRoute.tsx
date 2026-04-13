
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "./LoadingScreen";


interface ProtectedRouteProps {
    requiredRoles?: string[];
}


export default function ProtectedRoute({ requiredRoles }: ProtectedRouteProps) {

    const {isLoading, isAuthenticated ,hasAnyRole} = useAuth();

    if (isLoading) return <LoadingScreen />;

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if(requiredRoles && !hasAnyRole(requiredRoles)) return <Navigate to="/unauthorized" replace/>
 

    return (<Outlet/>);
}
