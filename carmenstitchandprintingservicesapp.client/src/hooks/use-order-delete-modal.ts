import { useState } from "react";
import {  OrderDeleteConfigs, type OrderActionType, type OrderDeleteConfig } from "../config/order-modal-config";



interface UseOrderDeleteModalConfig {
    deleteConfig: OrderDeleteConfig | undefined;
    isOrderDeleteModalOpen: boolean;
    itemId: number | null;
    deleteIndex: number | null
    openOrderDeleteModal: (
        type: OrderActionType,
        itemId: number,
        itemName: string,
        deleteIndex?: number
    ) => void;
    closeOrderDeleteModal: () => void;
   
}

export default function useOrderDeleteModal():UseOrderDeleteModalConfig {

    const [deleteConfig, setDeleteConfig] = useState<OrderDeleteConfig|undefined>(undefined);
    const [isOrderDeleteModalOpen, setIsOrderDeleteModalOpen] = useState(false);
    const [itemId, setItemId] = useState<number|null>(null);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    function openOrderDeleteModal(
        type: OrderActionType,
        itemId: number,
        itemName: string,
        deleteIndex?:number
    ) {
        const baseConfig = OrderDeleteConfigs[type];

        const updatedConfig = {
            ...baseConfig,
            name:itemName
        }

        setDeleteConfig(updatedConfig ?? undefined);
        setItemId(itemId ?? null);
        setDeleteIndex(deleteIndex ?? null);
        setIsOrderDeleteModalOpen(true);
    }

    function closeOrderDeleteModal() {
        setDeleteConfig(undefined);
        setItemId(null);
        setDeleteIndex(null);
        setIsOrderDeleteModalOpen(false);
    }

    return {
        deleteConfig,
        isOrderDeleteModalOpen,
        itemId, 
        openOrderDeleteModal,
        closeOrderDeleteModal,
        deleteIndex
    }
}