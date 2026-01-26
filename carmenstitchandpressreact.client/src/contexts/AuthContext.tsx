import toastr from "toastr";
import {  createContext, useEffect, useState, type ReactNode, useContext } from 'react';
import type { LoginRequest, User, VerificationRequest } from '../types/api-types';
import * as api from '../api-client';
import { useNavigate } from "react-router-dom";


type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    roles: string[];
    login: (credential: LoginRequest) => Promise<void>;
    isLoading: boolean;
    logout: () => Promise<void>;
    verify: (data: VerificationRequest) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    roles: [],
    login: async () => { },
    isLoading:true,
    logout: async () => { },
    verify: async () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await api.getCurrentUser();
             
                if (user?.firstName) {
                    setUser(user);
                    setIsAuthenticated(true);
                    setRoles(user.roles);
                }
                else {
                    setIsAuthenticated(false);
                    setRoles([]);
                }
            }
            catch (error: any) {
                toastr.error(error.message)
                setIsAuthenticated(false);
                setRoles([]);
                
            } finally {
                setIsLoading(false); // done loading
            }
        };
        init();
    },[]);

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {
            const loginResult = await api.login(credentials);
            if (loginResult?.email) {

                navigate("/verify", {
                    state: {
                        email: loginResult.email,
                        rememberMe: loginResult.rememberMe
                    }
                });
            }

        }
        catch (error: any) {
            toastr.error(error.message);
            setIsAuthenticated(false);
            setRoles([]);
        }
        finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await api.logout();
        setIsAuthenticated(false);
        setRoles([]);
        setUser(null);
    };

    const verify = async (data: VerificationRequest) => {
        const res = await api.verifyCode(data);

        if (res === 200) {
            const user = await api.getCurrentUser(); //fetches current user info
            setUser(user);
            setRoles(user.roles);
            setIsAuthenticated(true);
            navigate("/");

        }
        else {
            toastr.error("Invalid Verification Code");
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, roles, login ,user, isLoading,logout, verify }}>
            {children}
        </AuthContext.Provider>
    );
};