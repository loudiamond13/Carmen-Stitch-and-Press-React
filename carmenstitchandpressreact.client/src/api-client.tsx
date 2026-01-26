import axios from 'axios';
import type { LoginRequest,User ,LoginResponse, VerificationRequest} from './types/api-types'


const api = axios.create({
    baseURL: 'api',
    withCredentials:true
});

//login
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const res = await api.post("/identity/login", data);
    
        return res.data;

    }
    catch (error:any) {
        if (error.response && error.response.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Login failed. Please try again.");
    
    }
};

//get current user
export const getCurrentUser = async (retries = 3, delay = 500): Promise<User | null> => {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await api.get("/identity/currentUser");
            return res.data;
        } catch (error: any) {
            if (i === retries - 1) throw new Error("Failed to fetch current user");
            await new Promise(r => setTimeout(r, delay)); // wait before retry
        }
    }
    return null;
};

//logout 
export const logout = async () => {
    try {
        console.log("API logout called");
        await api.post("/identity/logout");
    }
    catch(error:any) {
        console.log(error);
    }
}

//verification code
export const verifyCode = async (data: VerificationRequest)  => {
    try {
        const res = await api.post("/identity/verifyCode", data);

        return res.status;
    }
    catch (error:any) {
        if (error.status === 400) {
            return error.message
        }
    }
}