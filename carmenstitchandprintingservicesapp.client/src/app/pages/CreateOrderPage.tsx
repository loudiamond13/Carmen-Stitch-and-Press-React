import { useForm } from "react-hook-form";
import OrderForm from "../components/Order/order-form";
import type { Order } from "../api/api-types";
import { createOrder } from "../api/api-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import usePageTitle from "../../hooks/use-page-title";



export default function CreateOrderPage() {

    usePageTitle("Create Order");

    const form = useForm<Order>();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // move state here

    const onSubmit = async (data: Order) => {
        try {
            const formData = new FormData();

            // Append all order fields
            //Object.entries(data).forEach(([key, value]) => {
            //    if (value !== undefined && value !== null) {
            //        formData.append(key, value as string);
            //    }
            //});

            //formData.append("orderName", data.orderName);
            //formData.append("statusId", String(data.statusId));
            //formData.append("orderTypeId", String(data.orderTypeId));
            //formData.append("note", data.note);

            //// Append related arrays (items, payments, discounts) as JSON strings
            //formData.append("orderItems", JSON.stringify(data.orderItems));
            //formData.append("payments", JSON.stringify(data.payments));
            //formData.append("discounts", JSON.stringify(data.discounts));

            formData.append("order", JSON.stringify(data));

            //append image file if selected
            if (selectedImage) {
                formData.append("images", selectedImage);

            }

            const res = await createOrder(formData);
            form.reset();
            navigate("/orders");
            toast.success(res.message);
        }
        catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="p-5">
            <p className="text-foreground text-2xl">Create Order</p>
            <OrderForm
                form={form}
                onSubmit={onSubmit}
                onImageSelect={(file) => setSelectedImage(file)}
            />
        </div>
    );
}