
import * as api from "../api/api-client";
import OrdersTable from "../components/Order/orders-table";
import { DataTableSkeleton } from "../../components/data-table/data-table-skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { searchOrdersParamsCache } from "../lib/search-params";
import toast from "react-hot-toast";
import { OrderAddActionHandlers } from "../components/Order/order-actions";
import type { OrderActionType } from "../../config/order-modal-config";
import usePageTitle from "../../hooks/use-page-title";



export default function OrdersPage() {
    usePageTitle("Orders");
    const [search] = useQueryStates(searchOrdersParamsCache);
    const queryClient = useQueryClient();



    const query = useQuery({
        queryKey: ["orders", search],
        queryFn: async () => {

            const [orders, admins] = await Promise.all([
                api.getOrders({ ...search }),
                api.getAllAdminUsers()
            ]);

            return {orders,admins};
        },    
        placeholderData: (prev) => prev,
    });

    

    const handleSaveOrderEntryAction = async (data: Record<string, any>, type: OrderActionType) => {

        try {
            const res = await OrderAddActionHandlers[type](data);
            toast.success(res.message);

            queryClient.refetchQueries({ queryKey: ["orders", search]});
        }
        catch (error: any) {
            toast.error(error.message);
            throw error;
        }
    }

    if (query.isLoading) {
        return (
            <DataTableSkeleton
                columnCount={5}
                filterCount={1}
                cellWidths={["20rem", "10rem", "10rem", "10rem", "6rem"]}
                className=""
            />
        );
    }

    return (
        <div>
            <OrdersTable
                data={query.data?.orders.data ?? []}
                pageCount={query.data?.orders.pageCount ?? 0}
                admins={query.data?.admins ?? []}
                onSaveOrderEntry={ handleSaveOrderEntryAction}
            />
        </div>
    );
}