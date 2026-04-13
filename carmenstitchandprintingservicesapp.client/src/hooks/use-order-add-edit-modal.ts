import { useState } from "react";
import type { User } from "../app/api/api-types";
import { OrderAddEditModalConfigs, OrderActionType, type ModalField, type OrderAddEditModalConfig } from "../config/order-modal-config";



interface UseOrderAddEditModalProps {
    addEditConfig: OrderAddEditModalConfig | undefined;
    isModalOpen: boolean;
    initialData?: Record<string, any>;
    editingIndex: number | null;
    openModal: (
        type: OrderActionType ,
        initialData?: Record<string, any>,
        editingIndex?: number,
        admins?: User[],
        orderName?:string,
    ) => void;
    closeModal: () => void;

}

export default function useOrderAddEditModal(): UseOrderAddEditModalProps {

    const [addEditConfig, setAddEditConfig] = useState<OrderAddEditModalConfig | undefined>(undefined);
    const [initialData, setInitialData] = useState<Record<string, any>>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (
        type: OrderActionType,
        initialData?: Record<string, any>,
        editingIndex?: number | null,
        admins?: User[],
        orderName?: string,
    ) => {
        const baseConfig = OrderAddEditModalConfigs[type];

        const updatedConfig = {
            ...baseConfig,
            description: orderName ? `For order: ${orderName}`: undefined,
            fields: baseConfig.fields.map((field) =>
                field.name === "paidTo" || field.name === "paidBy"
                    ? {
                        ...field,
                        options: admins?.map((admin) => ({
                            label: admin.firstName,
                            value: admin.email
                        }))
                    } as ModalField
                    : field
            )
        };

        setAddEditConfig(updatedConfig);
        setInitialData(initialData ?? {});
        setEditingIndex(editingIndex ?? null);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setInitialData({});
        setEditingIndex(null);
        setIsModalOpen(false);
        setAddEditConfig(undefined);

    }

    return {
        addEditConfig,
        isModalOpen,
        initialData,
        editingIndex,
        openModal,
        closeModal,
        
    }
}