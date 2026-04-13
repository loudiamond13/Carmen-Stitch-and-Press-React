import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { Order } from "../api/api-types";
import { useState } from "react";
import * as api from "../api/api-client";
import OrderForm from "../components/Order/order-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { OrderActionType } from "../../config/order-modal-config";
import { OrderAddActionHandlers, OrderEntryDeleteActionHandlers } from "../components/Order/order-actions";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";
import usePageTitle from "../../hooks/use-page-title";




export default function UpdateOrderPage() {
    usePageTitle("Update Order");
    const { orderId } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const query = useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => await api.getOrderById(orderId!),
        enabled: !!orderId
    });

  

    const form = useForm<Order>({
        values: query.data
    });



    const handleSubmit = async (data: Order, configType?: OrderActionType) => {

        //if configType is not undefined, add order item/payment/discount to DB
        if (configType) {
            try {
                const res = await OrderAddActionHandlers[configType](data);
                queryClient.invalidateQueries({ queryKey: ["order", orderId] });
                query.refetch();
                toast.success(res.message);
            }
            catch (error: any) {

                toast.error(error.message);
                throw error;
            }
        } else {
            try {
                const formData = new FormData();

                //const { orderImages, ...orderDataOnly } = data as any;

                formData.append("order", JSON.stringify(data));
                if (selectedImage) {
                    formData.append("images", selectedImage);
                }

                const res = await api.updateOrder(formData);
                query.refetch();
                toast.success(res.message);
                navigate("/orders");
            }
            catch (error:any) {
                toast.error(error.message);
                return;
            }
        }
    }

 

    const handleOrderEntryDeletion = async (entryId: number, configType?:OrderActionType) => {

        if (configType) {
            try {
                const res = await OrderEntryDeleteActionHandlers[configType](entryId);
                queryClient.invalidateQueries({ queryKey: ["order", orderId] });
                toast.success(res.message);
                return;
            }
            catch (error:any) {
                toast.error(error.message);
                return;
            }
        }
    }


    if (query.isLoading) return <LoadingScreen />;

    return (
        <div className="p-5">
            <p className="text-foreground text-2xl">Edit Order</p>
            <OrderForm
                form={form}
                onSubmit={handleSubmit}
                onImageSelect={(file) => setSelectedImage(file)}
                onEntryDeletion={handleOrderEntryDeletion}
                order={query.data}
                initialImageUrl={query.data?.orderImages[0]?.imageUrl}
            >
            </OrderForm>
        </div>
    );
}