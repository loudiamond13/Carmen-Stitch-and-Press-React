import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../../components/ui/form";
import { useEffect, useState } from "react";
import type {
    Discount,
    Expense,
    Order,
    OrderItem,
    OrderType,
    Payment,
    Status,
    User
} from "../../api/api-types";
import * as api from "../../api/api-client";
import { Input } from "../../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import AddOrderEntryModal from "./add-order-entry-modal";
import OrderItems from "./order-items";
import {
    ArrowDownToLineIcon,
    BadgePlusIcon,
    BanknoteArrowDownIcon,
    BanknoteArrowUpIcon,
    BanknoteIcon,
    CirclePercentIcon,
    ListCheckIcon,
    Loader2Icon,
    Percent,
    PhilippinePesoIcon
} from "lucide-react";
import OrderPayments from "./order-payments";
import OrderDiscounts from "./order-discounts";
import OrderImageUploader from "./order-image-uploader";
import useOrderAddEditModal from "../../../hooks/use-order-add-edit-modal";
import { useParams } from "react-router-dom";
import { OrderActionType } from "../../../config/order-modal-config";
import useOrderDeleteModal from "../../../hooks/use-order-delete-modal";
import DeleteOrderEntryModal from "./delete-order-entry-modal";
import OrderExpenses from "./order-expenses";
import LoadingScreen from "../../../components/LoadingScreen";



interface OrderFormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    onSubmit: (data: T, configType?: OrderActionType) => Promise<void>;
    onImageSelect: (file: File) => void;
    onEntryDeletion?: (entryId: number, configType?: OrderActionType) => Promise<void>;
    initialImageUrl?: string;
    order?: Order | undefined;
}


export default function OrderForm<T extends FieldValues>({
    form,
    onSubmit,
    onImageSelect,
    initialImageUrl,
    onEntryDeletion,
    order
}: OrderFormProps<T>) {

    const { orderId } = useParams();

    const [statuses, setStatuses] = useState<Status[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const {
        addEditConfig,
        isModalOpen,
        initialData,
        editingIndex,
        openModal,
        closeModal
    } = useOrderAddEditModal();

    const {
        deleteConfig,
        isOrderDeleteModalOpen,
        itemId: itemIdToBeDeleted,
        openOrderDeleteModal,
        closeOrderDeleteModal,
        deleteIndex
    } = useOrderDeleteModal();

    useEffect(() => {
        const init = async () => {
            const [statuses, admins, orderTypes] = await Promise.all([
                api.getAllOrderStatuses(),
                api.getAllAdminUsers(),
                api.getAllOrderTypes()
            ])

            setStatuses(statuses);
            setAdmins(admins);
            setOrderTypes(orderTypes);
        }

        init();
        setOrderItems(order?.orderItems ?? []);
        setPayments(order?.payments ?? []);
        setDiscounts(order?.discounts ?? []);
        setExpenses(order?.expenses ?? [])

    }, [order])



    const handleSave = async (data: any) => {
        if (!addEditConfig) return;

        if (orderId) {
            try {
                await onSubmit(data, addEditConfig.type);
            }
            catch (error) {
                return;
            }
        }
    

        const update = (arr: any[], setter: any) => {
            if (editingIndex !== null) {
                const updated = [...arr]
                updated[editingIndex] = data
                setter(updated)
            } else {
                setter((prev: any[]) => [...prev, data])
            }
        }

        if (addEditConfig.type === OrderActionType.Item) update(orderItems, setOrderItems);
        if (addEditConfig.type === OrderActionType.Payment) update(payments, setPayments);
        if (addEditConfig.type === OrderActionType.Discount) update(discounts, setDiscounts);
        if (addEditConfig.type === OrderActionType.Expense) update(expenses, setExpenses);


        closeModal();
    }



    const handleOpenOrderEntryModal = (
        type: OrderActionType,
        data?: Record<string, any>,
        editingIndex?: number,
    ) => {
        openModal(type,data,editingIndex,admins);
    }

    const handleDelete = async () => {
        if (!deleteConfig) return;

        if (itemIdToBeDeleted && onEntryDeletion) {
            await onEntryDeletion(itemIdToBeDeleted, deleteConfig.type)
        }

        const remove = (arr: any[], setter:any) => {
            if (deleteIndex !== null) {
                const updated = arr.filter((_, i) => i !== deleteIndex);
                setter(updated)
            }
        }

        if (deleteConfig.type === OrderActionType.Item) remove(orderItems, setOrderItems);
        if (deleteConfig.type === OrderActionType.Payment) remove(payments, setPayments);
        if (deleteConfig.type === OrderActionType.Discount) remove(discounts, setDiscounts);
        if (deleteConfig.type === OrderActionType.Expense) remove(expenses, setExpenses);

        closeOrderDeleteModal();
    }

    if (!statuses.length || !orderTypes.length) {
        return <LoadingScreen />;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit( async(data) =>
                    await onSubmit({
                            ...data,
                            orderItems,
                            payments,
                            discounts
                        })
                )}
                className="flex flex-col py-5 md:flex-row"
            >
                <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <div className="flex-1">
                            <FormField
                                rules={{required: "Order Name is required"}}
                                control={form.control}
                                name={"orderName" as FieldPath<T>}
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Order Name</FormLabel>
                                        <FormControl >
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={"statusId" as FieldPath<T>}
                            rules={{ required: "Status is required" }}
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value): ""}
                                    >
                                        <FormControl className="w-40">
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem key={status.statusId} value={String(status.statusId)}>
                                                    {status.statusName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"orderTypeId" as FieldPath<T>}
                            rules={{ required: "Order Type is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Order Type</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                    >
                                        <FormControl className="w-44">
                                            <SelectTrigger className="capitalize">
                                                <SelectValue placeholder="Select Order Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {orderTypes.map((orderType) => (
                                                <SelectItem key={orderType.orderTypeId} value={String(orderType.orderTypeId)} className="capitalize">
                                                    {orderType.orderTypeName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name={"note" as FieldPath<T>}
                            render={({ field }) => (
                                <FormItem className="md:w-1/2">
                                    <FormLabel>Description / Note</FormLabel>
                                    <FormControl >
                                        <Textarea {...field} className="resize-none" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="gap-3">
                            <span className="text-foreground flex flex-row gap-1 font-bold">
                               <ListCheckIcon /> Items
                            </span>
                            <OrderItems
                                items={orderItems}
                                onEdit={(item, index) => handleOpenOrderEntryModal(OrderActionType.Item, item, index)}
                                onDelete={(itemId, itemName,index)=> openOrderDeleteModal(OrderActionType.Item, itemId, itemName, index) }
                            />
                            <div className="pt-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleOpenOrderEntryModal(OrderActionType.Item, {orderId:orderId})}
                                    className=""
                                >
                                    <BadgePlusIcon />
                                    Add Item
                                </Button>
                            </div>
                        </div>
                        
                        <div className="gap-3">
                            <span className="text-foreground flex flex-row gap-1 font-bold">
                                <PhilippinePesoIcon className=" rounded border"/> Payments
                            </span>
                            <OrderPayments
                                payments={payments}
                                onEdit={(payment, index) => handleOpenOrderEntryModal(OrderActionType.Payment, payment, index)}
                                users={admins}
                                onDelete={(itemId, paymentAmt, index) => openOrderDeleteModal(OrderActionType.Payment, itemId, paymentAmt,index) }
                            />
                            <div className="pt-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleOpenOrderEntryModal(OrderActionType.Payment, { orderId: orderId })}
                                >
                                    <BanknoteArrowUpIcon />
                                    Add Payment
                                </Button>
                            </div>
                        </div>
                        <div>
                            <span className="text-foreground flex flex-row gap-1 font-bold">
                                <Percent className=" rounded border" /> Discounts
                            </span>
                            <OrderDiscounts
                                discounts={discounts}
                                onEdit={(discount, index) => handleOpenOrderEntryModal(OrderActionType.Discount, discount, index)}
                                onDelete={(discountId,discountAmt,index)=> openOrderDeleteModal(OrderActionType.Discount, discountId,discountAmt,index)}
                            />
                            <div className="pt-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => handleOpenOrderEntryModal(OrderActionType.Discount, { orderId: orderId }) }
                                >
                                    <CirclePercentIcon />
                                    Add Discount
                                </Button>
                            </div>
                        </div>
                        <div>
                            <span className="text-foreground flex flex-row gap-1 font-bold">
                                <BanknoteArrowDownIcon /> Expenses
                            </span>
                            <OrderExpenses
                                expenses={expenses}
                                users={ admins}
                                onEdit={(expense, index) => handleOpenOrderEntryModal(OrderActionType.Expense, expense, index)}
                                onDelete={(expenseId,description,index)=> openOrderDeleteModal(OrderActionType.Expense, expenseId,description,index)}
                            />
                            <div className="pt-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => handleOpenOrderEntryModal(OrderActionType.Expense, { orderId: orderId }) }
                                >
                                    < BanknoteIcon/>
                                    Add Expense
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex w-50 items-center justify-center overflow-auto">
                        <OrderImageUploader
                            onFileSelect={onImageSelect}
                            intialPreviewUrl={initialImageUrl}
                        />
                    </div>
                    <Button
                        className="font-semibold"
                        variant="success"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <ArrowDownToLineIcon className="mr-2 h-4 w-4" />
                                {!!orderId ? "Update Order" : "Create Order"}
                            </>
                        )}
                    </Button>
                </div>

                <AddOrderEntryModal
                    config={addEditConfig}
                    initialData={initialData}
                    open={isModalOpen}
                    onClose={closeModal}
                    onSave={handleSave}
                    editingIndex={ editingIndex}
                />

                <DeleteOrderEntryModal
                    config={deleteConfig}
                    onClose={closeOrderDeleteModal}
                    open={isOrderDeleteModalOpen}
                    onDelete={handleDelete}
                />
                
            </form>
        </Form>
    );
}