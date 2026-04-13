
import { BanknoteArrowDownIcon, HandCoinsIcon, ShoppingBagIcon, TicketPercentIcon } from "lucide-react";
import type React from "react";


export const OrderActionType = {
    Item: "item",
    Payment: "payment",
    Discount: "discount",
    Expense: "expense",
} as const;

export type OrderActionType =
    typeof OrderActionType[keyof typeof OrderActionType];

type FieldType = "text" | "number" | "select" | "textarea";


export interface SelectOption {
    label: string;
    value: string;
}

export interface ModalField {
    name: string;
    label: string;
    type?: FieldType;
    options?: SelectOption[];
}

export interface OrderAddEditModalConfig {
    type: OrderActionType;
    addTitle: string;
    editTitle: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    fields: ModalField[];
    description?: string;
}


export const OrderAddEditModalConfigs: Record<OrderActionType, OrderAddEditModalConfig> = {
    item: {
        type:"item",
        addTitle: "Add Order Item",
        editTitle: "Edit Order Item",
        icon: ShoppingBagIcon,
        fields: [
            { name: "description", label: "Description" },
            { name: "quantity", label: "Quantity", type: "number" },
            { name: "price", label: "Price", type: "number" }
        ]
    },

    payment: {
        type: "payment",
        addTitle: "Add Payment",
        editTitle: "Edit Payment",
        icon: HandCoinsIcon,
        fields: [
            { name: "paidBy", label: "Paid By" },
            { name: "amount", label: "Amount", type: "number" },
            { name: "paidTo", label: "Paid To", type: "select", options: [] }
        ]
    },

    discount: {
        type: "discount",
        addTitle: "Add Discount",
        editTitle: "Edit Discount",
        icon: TicketPercentIcon,
        fields: [
            { name: "description", label: "Description" },
            { name: "amount", label: "Amount", type: "number" }
        ]
    },
    expense: {
        type: "expense",
        addTitle: "Add Order Expense",
        editTitle: "Edit Order Expense",
        icon: BanknoteArrowDownIcon,
        fields: [
            { name: "description", label: "Description" },
            { name: "amount", label: "Amount", type: "number" },
            { name: "paidBy", label: "Paid By", type: "select", options: [] }
        ]
    },
};


export interface OrderDeleteConfig {
    type: OrderActionType;
    title: string;
    name?: string;
    description:string;
}

export const OrderDeleteConfigs: Record<OrderActionType, OrderDeleteConfig>={
    item: {
        type: "item",
        title: "Delete Order Item",
        description:"Are you sure you want to delete this item?"
    },
    payment: {
        type: "payment",
        title: "Delete Order Payment",
        description:"Are you sure you want to delete this payment?"
    },
    discount: {
        type: "discount",
        title: "Delete Order Discount",
        description:"Are you sure you want to delete this discount?"
    },
    expense: {
        type: "expense",
        title: "Delete Order Expense",
        description:"Are you sure you want to delete this expense?"
    }
}