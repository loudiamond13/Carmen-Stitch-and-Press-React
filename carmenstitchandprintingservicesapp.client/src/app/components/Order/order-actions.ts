import * as api from "../../api/api-client";
import type { Payment, OrderItem, Discount, Expense } from "../../api/api-types";


export const OrderAddActionHandlers = {
    payment: (payment: Record<string, any>) => {
        if (payment?.paymentId == undefined) {
            return api.createOrderPayment(payment as Payment);
        } else {
            return api.updateOrderPayment(payment as Payment);
        }
    },

    item: (item: Record<string, any>) => {
        if (item?.orderItemId === undefined) {
            return api.createOrderOrderItem(item as OrderItem)
        } else {
            return api.updateOrderItem(item as OrderItem)
        }
    },
    discount: (discount: Record<string, any>) => {
        if (discount.orderDiscountId === undefined) {
            return api.createOrderDiscount(discount as Discount);
        } else {
            return api.updateOrderDiscount(discount as Discount);
        }
    },
    expense: (expense: Record<string, any>) => {
        if (expense.expenseId === undefined) {
            return api.createOrderExpense(expense as Expense);
        } else {
            return api.updateExpense(expense as Expense);
        }

    }
}



export const OrderEntryDeleteActionHandlers = {
    payment: (paymentId:number) => 
        api.deleteOrderPayment(paymentId),

    item: (itemId:number) =>
        api.deleteOrderItem(itemId),
    discount: (discountId: number) =>
        api.deleteOrderDiscount(discountId),
    expense: (expenseId:number) =>
        api.deleteExpense(expenseId)
}

//export type OrderActionMap = {
//    payment: Payment
//    item: OrderItem
//    discount: Discount
//    expense: Expense
//}

//export const OrderActionHandlers: {
//    [K in keyof OrderActionMap]: (data: OrderActionMap[K]) => Promise<any>
//} = {
//    payment: (data) => api.createOrderPayment(data),
//    item: (data) => api.createOrderOrderItem(data),
//    discount: (data) => api.createOrderDiscount(data),
//    expense: (data) => api.createOrderExpense(data),
//};

