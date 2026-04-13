import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginRequest, User, VerificationRequest } from "../app/api/api-types";
import * as api from "../app/api/api-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"



type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    roles: string[];
    login: (credential: LoginRequest) => Promise<void>;
    isLoading: boolean;
    logout: () => Promise<void>;
    verify: (data: VerificationRequest) => Promise<void>;
    hasAnyRole: (requiredRoles: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

//user: null,
//    isAuthenticated: false,
//        roles: [],
//            login: async () => { },
//                isLoading: true,
//                    logout: async () => { },
//                        verify: async () => { },
//                            hasAnyRole: () => false

//hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await api.getCurrentUser();
                if (user) {
                    setUser(user);
                    setRoles(user.roles);
                    setIsAuthenticated(true);
                }
                else {
                    setUser(null);
                    setRoles([]);
                    setIsAuthenticated(false);
                }
            }
            catch (error: any) {
                console.error("Error fetching current user:", error);
                setUser(null);
                setRoles([]);
                setIsAuthenticated(false);
            }
            finally {
                setIsLoading(false);
            }
        };
        init();

    },[]);

    const hasAnyRole = (requiredRoles: string[]) => {
        return roles.some(role => requiredRoles.includes(role));
    }

    const login = async (loginRequest: LoginRequest) => {
        setIsLoading(true);
        try {
            const loginResponse = await api.login(loginRequest);
            if (loginResponse?.email) {
                navigate("/verify", {
                    state: {
                        email: loginResponse.email,
                        rememberMe: loginResponse.rememberMe
                    }
                });
            }
        }
        catch (error: any) {
            toast.error(error.message || "Login failed");
            setUser(null);
            setRoles([]);
            setIsAuthenticated(false);
        }
        finally {
            setIsLoading(false);
        }
    }

    const verify = async (verificationRequest: VerificationRequest) => {
        setIsLoading(true);
        try {
            const verifyResponse = await api.verifyCode(verificationRequest);
            if (verifyResponse === 200) {
                const user = await api.getCurrentUser();
                setUser(user);
                setRoles(user?.roles || []);
                setIsAuthenticated(true);
                navigate("/");
            }
            else {
                toast.error("Invalid Verification Code");
            }
        }
        catch (error: any) {
            toast.error(error.message || "Verification failed");
        }
        finally {
            setIsLoading(false);
        }
    }

    const logout = async() => {
        try {
            await api.logout();
            setUser(null);
            setRoles([]);
            setIsAuthenticated(false);
        }
        catch (error: any) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <AuthContext.Provider value= {{ isAuthenticated, roles, login, user, isLoading, logout, verify, hasAnyRole } } >
            {children}
        </AuthContext.Provider>
    );
}