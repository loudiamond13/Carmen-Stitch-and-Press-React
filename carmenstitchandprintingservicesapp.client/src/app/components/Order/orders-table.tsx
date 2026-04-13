"use client"

import * as React from "react";
import type { Order, User } from "../../api/api-types";
import { getOrdersTableColumns } from "./orders-table-column";
import { useDataTable } from "../../../hooks/use-data-table";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/data-table-toolbar";
import { DataTableSortList } from "../../../components/data-table/data-table-sort-list";
import { useNavigate } from "react-router-dom";
import { DataTableAddButton } from "../../../components/data-table/data-table-add-button";
import OrderViewModal from "./order-view-modal";
import useOrderAddEditModal from "../../../hooks/use-order-add-edit-modal";
import AddOrderEntryModal from "./add-order-entry-modal";
import type { OrderActionType } from "../../../config/order-modal-config";
import { CirclePlusIcon } from "lucide-react";



interface OrdersTableProps {
    data: Order[];
    pageCount: number;
    admins: User[];
    onSaveOrderEntry: (
        data: Record<string, any>,
        type: OrderActionType
    ) => Promise<void>;
}

export default function OrdersTable({
    data,
    pageCount,
    admins,
    onSaveOrderEntry
}: OrdersTableProps) {

    const navigate = useNavigate();

    const {
        addEditConfig,
        isModalOpen,
        closeModal,
        openModal,
        initialData
    } = useOrderAddEditModal();


    const [viewOrder, setViewOrder] = React.useState(false);
    const [orderId, setOrderId] = React.useState<string | null>(null);

    const columns = React.useMemo(
        () =>
            getOrdersTableColumns({
                navigate,
                onOpenViewOrderModal: (orderId: string) => {
                    
                    setOrderId(orderId)
                    setViewOrder(true)
                },
                onOpenActionModal: (type, orderId, orderName) => {
                    openModal(type, { orderId },undefined,admins, orderName);
                }
            })
        , [navigate,openModal]
    );

    const { table} = useDataTable({
        data,
        columns,
        pageCount,
        initialState: {
            columnPinning: { right: ["actions"] }
        },
        getRowId: (row) => row.orderId,
        shallow: true,
        clearOnDefault: true,

    });

    return (
        <>
            <DataTable table={table}>
                <DataTableToolbar table={table}>
                    <DataTableAddButton onCreate={() => navigate("/order/create")} btnCaption="Create Order" icon={<CirclePlusIcon/> } />
                    <DataTableSortList table={table} align="end"/>
                </DataTableToolbar>
            </DataTable>
            <OrderViewModal
                open={viewOrder}
                onClose={() => setViewOrder(false)}
                orderId={orderId}
            />
            <AddOrderEntryModal
                config={addEditConfig}
                open={isModalOpen}
                initialData={initialData}
                onClose={closeModal}
                onSave={async (data) => {

                    try {
                        if (!addEditConfig) return;

                        await onSaveOrderEntry(data, addEditConfig.type);
                        closeModal();
                    }
                    catch (error) {
                        return
                    }
                }}
            />
        </>
    );
}