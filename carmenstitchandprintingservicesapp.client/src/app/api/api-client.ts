import axios from "axios";
import type {
    Discount,
    Expense,
    ExpenseResponse,
    HomePageResponse,
    LoginRequest,
    LoginResponse,
    Order,
    OrderItem,
    OrderResponse,
    OrderType,
    Payment,
    Status,
    User,
    VerificationRequest
} from "./api-types";
import type { GetExpensesSchema, GetHomePageSchema, GetOrdersSchema } from "../lib/search-params";
import qs from "qs";

const api = axios.create({
    baseURL: '/api',
    withCredentials: true
});


const fetchApi = {
    get: async (endpoint:string)=>{
        const res = await fetch(`/api${endpoint}`, {
            method: "GET",
            credentials: "include"
        });

        return res;
    },
    post: async(endpoint: string, body: any, isMultipart = false) => {

        const options: RequestInit = {
            method: "POST",
            credentials: "include",
            headers: {}
        }

        if (!isMultipart) {
            options.headers = { 'Content-Type': "application/json" }
            options.body = JSON.stringify(body);
        }
        else {
            options.body = body;
        }

        const res = await fetch(`/api${endpoint}`, options);

        return res;
    }
}


api.interceptors.response.use(
    response => response,
    async error => {
        if (!error.response) {
            console.error("Backend unreachable!");
        }
        return Promise.reject(error);
    }
);

export const getCurrentUser = async ():Promise<User|null> => {
   
   // const response = await api.get<User>('/identity/current-user');

    const res = await fetchApi.get("/identity/current-user");

    if (res.status === 401) {
        return null;
    }
    return res.json();
    
}


export const login = async (loginRequest:LoginRequest):Promise<LoginResponse> => {

    try {
        //const response = await api.post<LoginResponse>('/identity/login', loginRequest);
        //return response.data;

        const res = await fetchApi.post('/identity/login', loginRequest);

        return res.json();

    }
    catch (error: any) {
        let message = error.response?.data.message || "Login failed.";

        if (error.status === 429) {
            message = error.response?.data;
        }

        throw new Error(message);
    }
}

export const verifyCode = async (verificationRequest: VerificationRequest) => {
    try {
        const response = await api.post('/identity/verify-code', verificationRequest);
        return response.status;
    }
    catch (error: any) {
        throw new Error(error.message || "Verification failed");
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/identity/logout');
        return response.status;
    }
    catch (error: any) {
        throw new Error(error.message || "Logout failed");
    }
}


export const getOrders = async (params: GetOrdersSchema): Promise<OrderResponse> => {
    try {
        const filters = []

        if (params.orderName) {
            filters.push({
                id: "OrderName",
                operator: "contains",
                value: params.orderName
            })
        }


        const response = await api.get('/order/getOrders', {
            params: {
                pageNumber: params.page,
                pageSize: params.perPage,
                filters,
                sort: params.sort
                
            },
            paramsSerializer: (params) => {
                return qs.stringify(params,
                    {
                        arrayFormat: 'indices',
                        allowDots: true
                    }
                );
            }

        });

        if (response.status !== 200) {
            throw new Error("Failed to fetch orders");
        }

        return await response.data;
    } catch (error) {
        console.error("getOrders error:", error);
        throw error;
    }
}


//: Promise<{ statusId: string, statusName:string, statusCategory:string }>
export const getAllOrderStatuses = async ():Promise<Status[]> => {

    try {
        const response = await api.get('/order/get-all-order-statuses');
        return response.data;
    }
    catch (error) {
        throw new Error("Failed to fetch order statuses");
    }
}

export const getAllAdminUsers = async (): Promise<User[]> => {

    try {
        const response = await api.get('/user/get-all-admin-users');
        return response.data;
    }
    catch (error) {
        throw new Error("Failed to fetch admin users");
    }
}

export const getAllOrderTypes = async (): Promise<OrderType[]> => {
    try {
        const response = await api.get('/order/get-all-order-types');
        return response.data;
    }
    catch (error) {
        throw new Error("Failed to fetch order types");
    }
}


export const createOrder = async (orderData: FormData) => {
    try {
        const response = await api.post('/order/create-order', orderData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }
    catch (error: any) {
        let message = error.response?.data || "Unexpected error while updating payment.";

        const res = error.response?.data;

        //handle ModelState validation errors
        if (res?.errors) {
            const messages = Object.values(res.errors).flat();
            message = messages.join("\n");
        }

        //handle ASP.NET Core "title + errors" format
        else if (res?.title && res?.errors) {
            const messages = Object.values(res.errors).flat();
            message = messages.join("\n");
        }

        //handle simple string messages (BusinessRuleException, etc.)
        else if (typeof res === "string") {
            message = res;
        }

        throw new Error(message);
    }
}


export const updateOrder = async(orderData: FormData) => {
    try {
        const response = await api.patch("/order/update-order", orderData, {
            headers: {
                "Content-Type":"multipart/form-data"
            }
        })

        return response.data;
    }
    catch (error:any) {
        let message = error.response?.data || "Unexpected error while updating order.";

        if (message?.errors) {
            const msg = Object.values(message.errors).flat();
            message = msg.join("\n");
        }
        else if (message?.errors && message?.title) {
            const msg = Object.values(message?.errors).flat();
            message = msg.join("\n");
        }

        throw new Error(message);
    }
}

export const getOrderById = async (orderId: string): Promise<Order> =>
{
    try {
        const response = await api.get(`/order/get-order-by-id/${orderId}`);
        return response.data;
    }
    catch (error) {
        throw new Error("Failed to fetch order details");
    }
}

export const uploadImage = async(file:File) => {
    try {
        const res = await api.get('/order/get-cloudinary-signature');

        if (!res || res.status !== 200) {
            throw new Error("Unable to connect to cloudinary");
        }

        const { signature, timestamp, apiKey, cloudName } = res.data;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "Orders");
        formData.append("signature", signature);
        formData.append("timestamp", timestamp);
        formData.append("api_key", apiKey);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        return response.data;
    }
    catch (error) {
        throw new Error("Failed to upload image");
    }
}

export const createOrderPayment = async (data: Payment) => {
    try {
        
        const response = await api.post("/order/create-order-payment", data);
        return response.data;
    }
    catch (error: any) {
        let res = error.response?.data || "Unexpected error occurred on creating order payment";

        if (res?.errors) {
            const msg = Object.values(res.errors).flat();
            res = msg.join("\n");
        }
        else {
            res = res.message;
        }

        throw new Error(res);
    }
};

export const createOrderOrderItem = async (data: OrderItem) => {
    try {

        const response = await api.post("/order/create-order-item", data);
        return response.data;
    }
    catch (error: any) {
        let res = error.response?.data || "Unexpected error occured on creating order item."

        if (res?.errors) {
            const msg = Object.values(res.errors).flat();
            res = msg.join("\n");
        }
        else {
            res = res.message;
        }

        throw new Error(res);
    }
    
}

export const createOrderDiscount = async (data:Discount) => {
    try {
        const response = await api.post("/order/create-order-discount",data);
        return response.data;
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error occured on creating order discount.";
        throw new Error(message);
    }
}

export const createOrderExpense = async (data: Expense) => {
    try {
        const response = await api.post("/order/create-order-expense", data);
        return response.data;
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error occured on creating order expense";
        throw new Error(message);
    }
}

export const createCompanyExpense = async (data: Expense) => {
    try {
        const response = await api.post("/order/create-company-expense", data);
        return response.data;
    }
    catch (error: any) {
        let message = error.response?.data || "Unexpected error while updating payment.";

        const res = error.response?.data;

        //handle ModelState validation errors
        if (res?.errors) {
            const messages = Object.values(res.errors).flat();
            message = messages.join("\n");
        }

        //handle ASP.NET Core "title + errors" format
        else if (res?.title && res?.errors) {
            const messages = Object.values(res.errors).flat();
            message = messages.join("\n");
        }

        //handle simple string messages (BusinessRuleException, etc.)
        else if (typeof res === "string") {
            message = res;
        }

        throw new Error(message);
    }
}

export const getExpenses = async (params:GetExpensesSchema):Promise<ExpenseResponse> => {

    try {

        const filters = [];

        if (params.spentDate.length > 0) {
            filters.push({
                id: "SpentDate",
                operator: ">=",
                value: String(params.spentDate[0])
            })
            filters.push({
                id: "SpentDate",
                operator: "<",
                value: String(params.spentDate[1])
            })
        }

        if (params.description) {
            filters.push({
                id: "Description",
                operator: "contains",
                value:params.description
            })
        }

        const response = await api.get("/order/get-expenses", {
            params: {
                pageNumber: params.page,
                pageSize: params.perPage,
                filters: filters,
                sort: params.sort
            },
            paramsSerializer: (params) => {
                return qs.stringify(params, {
                    arrayFormat: 'indices',
                    allowDots: true
                });
            }
        });

        return response.data;
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error occured on getting expenses."
        return message;
    }
}


export const getDistinctYears = async(params:GetHomePageSchema) :Promise<HomePageResponse> => {
    try {
        
        const response = await api.get("/home/authorized-home", {
            params: {
                year:params.year
            }
        });

        return response.data
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error on getting home settings."

        return message;
    }
}

export const deleteOrderItem = async(orderItemId: number) => {
    try {
        const response = await api.delete("/order/delete-order-item", {
            params: {
                orderItemId:orderItemId
            }
        });
        return response.data;
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error on deleting order item.";
        throw new Error (message);
    }
}

export const deleteOrderPayment = async (paymentId:number) => {
    try {
        const response = await api.delete("/order/delete-order-payment", {
            params: {
                paymentId:paymentId
            }
        });
        return response.data;
    }
    catch (error:any) {
        const message = error.response?.data || "Unexpected error on deleting order payment.";
        throw new Error(message);
    }
}

export const deleteOrderDiscount = async (discountId:number) => {
    try {
        const response = await api.delete("/order/delete-order-discount", {
            params: {
                discountId: discountId
            }
        });

        return response.data;
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error on deleting order discount";
        throw new Error(message);
    }
}

export const deleteExpense = async (expenseId:number) => {
    try {
        const response = await api.delete("/order/delete-expense", {
            params: {
                expenseId: expenseId
            }
        });

        return response.data;
    }
    catch (error: any) {
        const message = error.response?.data || "Unexpected error on deleting order discount";
        throw new Error(message);
    }
}


export const updateOrderPayment = async(data:Payment) => {
    try {
        //data.amount = 0;
        //data.paidBy = "";
        const response = await api.patch("/order/update-order-payment", data)
        return response.data;
    }
    catch (error: any) {
        let message = error.response?.data || "Unexpected error while updating payment.";

        const res = error.response?.data;

        //handle ModelState validation errors
        if (res?.errors) {
            const messages = Object.values(res.errors).flat();
            message = messages.join("\n");
        }

        //handle ASP.NET Core "title + errors" format
        else if (res?.title && res?.errors) {
            const messages = Object.values(res.errors).flat();
            message = messages.join("\n");
        }

        //handle simple string messages (BusinessRuleException, etc.)
        else if (typeof res === "string") {
            message = res;
        }

        throw new Error(message);


    }
    
}


export const updateOrderItem = async(data:OrderItem) => {
    try {
        const response = await api.patch("/order/update-order-item", data);
        return response.data
    }
    catch (error: any) {

        let message = error.response?.data || "Unexpected error occured while updating the order item."

        if (message?.errors) {
            const msgs = Object.values(message?.errors).flat();
            message = msgs.join("\n");
        }
        else if (message?.title && message?.errors) {
            const msgs = Object.values(message?.errors).flat();
            message = msgs.join("\n");
        }
        //else if (typeof message === "string") {

        //}

        throw new Error(message);
    }
}

export const updateExpense = async(data:Expense) => {
    try {
        //data.amount = 0;
        const response = await api.patch("/order/update-expense", data);
        return response.data;
    }
    catch (error: any) {

        let message = error.response?.data || "Unexpected error occured while updating the order item."

        if (message?.errors) {
            const msgs = Object.values(message?.errors).flat();
            message = msgs.join("\n");
        }
        else if (message?.title && message?.errors) {
            const msgs = Object.values(message?.errors).flat();
            message = msgs.join("\n");
        }
        //else if (typeof message === "string") {

        //}

        throw new Error(message);
    }

}


export const updateOrderDiscount = async(discount: Discount) => {
    try {
        discount.amount = 0;
        const res = await api.patch("/order/update-order-discount", discount);
        return res.data;
    }
    catch (error: any) {
        let message = error.response?.data || "Unexpected error occured while updating order discount.";

        if (message?.errors) {
            const msg = Object.values(message?.errors).flat();
            message = msg.join("\n");
        }


        throw new Error(message.message);
    }
}

