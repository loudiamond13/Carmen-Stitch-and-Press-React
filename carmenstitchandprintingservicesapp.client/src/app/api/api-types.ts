export interface Order {
    orderId: string;
    orderName: string;
    orderDate: string;
    totalAmount: number;
    note: string;
    createdBy: string;
    updatedBy: string;
    paidAmount: number;
    totalDiscount: number;
    totalBalance: number;
    totalExpenses: number;
    statusId: number;
    orderTypeId: number;
    
    orderItems: OrderItem[];
    payments: Payment[];
    discounts: Discount[];
    orderImages: OrderImage[];
    expenses: Expense[];
}

export interface OrderItem {
    orderItemId: string;
    orderId: string;
    description: string;
    quantity: number;
    price: number;
    createdDate: string;
    createdBy: string;
    isDone: boolean;
}

export interface Payment {
    paymentId: string;
    orderId: string;
    paymentDate: string;
    paidBy: string;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
    amount: number;
    paidTo: string;
    updatedDate: string;
}

export interface Expense {
    expenseId: string;
    orderId: string;
    description: string;
    spentDate: string;
    isCompanyExpenses: boolean;
    amount: number;
    paidBy: string;
    updatedBy: string;
    updatedDate: string;
}

export interface Discount {
    orderDiscountId: string;
    orderId: string;
    description: string;
    amount: number;
    discountedBy: string;
    updatedBy: string;
    discountDate: string;
    updatedDate: string;
}

export interface OrderImage {
    imageId: string;
    orderId: string;
    imageUrl: string;
    publicId: string;
}


export interface Status {
    statusId: string;
    statusName: string;
    statusCategory: string;
}

export interface OrderType {
    orderTypeId: string;
    orderTypeName: string;
}



export interface User {
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResponse {
    email: string;
    rememberMe: boolean;
}

export interface VerificationRequest {
    email: string;
    rememberMe: boolean;
    code: string;
}

export interface OrderResponse {
    data: Order[];
    pageNum: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
}
export interface ExpenseResponse {
    data: Expense[];
    pageNum: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
}


export interface Dashboard {
    totalRevenue: number;
    totalExpenses: number;
    totalPayments: number;
    netProfit: number;
    uncollected: number;
    expenseRatio: number;
    marginPercentage: number;
}

export interface HomePageResponse {
    years: number[];
    dashboard: Dashboard;

}