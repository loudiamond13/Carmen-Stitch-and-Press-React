
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import * as api from "../../api/api-client";
import { useQuery } from "@tanstack/react-query";
import { AdvancedImage } from "@cloudinary/react";
import useCloudinaryImage from "../../../hooks/use-cloudinary-image";
import {
    ListCheckIcon,
    PercentIcon,
    PhilippinePesoIcon,
    ReceiptTextIcon,
    ArrowUpRightIcon,
    WalletIcon,
    Calendar1Icon,
    UserIcon,
    ArrowRightIcon
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";

interface OrderViewModalProps {
    open: boolean;
    onClose?: () => void;
    orderId: string | null;
}

const formatPHP = (amount: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);


export default function OrderViewModal({ open, onClose, orderId }: OrderViewModalProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const [order, admins] = await Promise.all([
                api.getOrderById(orderId!),
                api.getAllAdminUsers()
            ]);
            return { order, admins };
        },
        enabled: open && !!orderId,
    });

    const order = data?.order;
    const admins = data?.admins;
    const publicId = order?.orderImages?.[0]?.publicId ?? "sample";
    const cldImg = useCloudinaryImage({ publicId });

    const getAdminNameById = (id: string) => admins?.find(x => x.email === id)?.firstName ?? id;

    if (!order || isLoading) return null;

    const isFullyPaid = order.totalBalance <= 0;

    return (
        <div>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className=" bg-light overflow-hidden border-none p-0 backdrop-blur-xl">
                    {/* Header: Gradient Banner Style max-w-3xl*/}
                    <div className=" bg-dark px-6 py-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-darker bg-slate-100 hover:bg-slate-100">
                                        Order Summary
                                    </Badge>
                                    {isFullyPaid ? (
                                        <Badge className="border-emerald-200 bg-emerald-500/10 text-emerald-600 text-[10px] uppercase">Paid</Badge>
                                    ) : (
                                        <Badge className="border-amber-200 bg-amber-500/10 text-amber-600 text-[10px] uppercase">Pending Balance</Badge>
                                    )}
                                </div>
                                <h2 className="text-darker text-2xl font-bold tracking-tight">{order.orderName}</h2>
                            </div>

                            <div className="text-right">
                                <p className="text-darker text-sm">Remaining Balance</p>
                                <p className={cn(
                                    "text-2xl font-black",
                                    isFullyPaid ? "text-emerald-800" : "text-red-400"
                                )}>
                                    {formatPHP(order.totalBalance)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className=" max-h-[75vh] space-y-6 overflow-y-auto px-6 pb-4">
                        {/* Bento Grid: Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <StatCard
                                label="Total Amount"
                                value={formatPHP(order.totalAmount)}
                                icon={<ReceiptTextIcon className="h-4 w-4" />}
                                color="text-darker"
                            />
                            <StatCard
                                label="Total Paid"
                                value={formatPHP(order.paidAmount)}
                                icon={<WalletIcon className="h-4 w-4" />}
                                color="text-emerald-600"
                            />
                            <StatCard
                                label="Discounts"
                                value={`-${formatPHP(order.totalDiscount)}`}
                                icon={<PercentIcon className="h-4 w-4" />}
                                color="text-blue-600"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                            {/* Left Column: Items List (Spans 3) */}
                            <div className="space-y-4 md:col-span-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-darker flex items-center gap-2 font-bold">
                                        <ListCheckIcon className="text-darker h-4 w-4" />
                                        Order Items
                                    </h3>
                                    <Badge variant="outline" className="text-darker font-normal">{order.orderItems.length} items</Badge>
                                </div>

                                <div className="space-y-2">
                                    {order.orderItems.map((item) => (
                                        <div key={item.orderItemId} className="transition-hover flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm hover:border-slate-300">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-700">{item.description}</span>
                                                <span className="text-xs font-medium text-slate-500">Qty: {item.quantity}</span>
                                            </div>
                                            <div className="text-darker font-bold">{formatPHP(item.price)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column: Image & Metadata (Spans 2) */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-darker font-bold">Preview</h3>
                                <div className="group relative aspect-square overflow-hidden rounded-3xl border-4 border-white shadow-xl">
                                    <AdvancedImage
                                        cldImg={cldImg}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                        <ArrowUpRightIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Timeline Section */}
                        {order?.payments && order.payments.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-darker flex items-center gap-2 font-bold">
                                    <PhilippinePesoIcon className="text-darker h-4 w-4" />
                                    Payment(s)
                                </h3>
                                <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                                    {order.payments.map((payment) => (
                                        <div key={payment.paymentId} className="group relative flex items-center justify-between pl-12">
                                            <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white transition-all group-hover:scale-110 group-hover:border-emerald-500">
                                                <div className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-emerald-500" />
                                            </div>
                                            <div className="flex flex-1 items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                                                <div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                                                        <Calendar1Icon className="h-3 w-3" />
                                                        {new Date(payment.paymentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-700">
                                                        <UserIcon className="h-3 w-3 text-slate-400" />
                                                        {payment.paidBy} <span className="mx-1 font-normal text-slate-300"><ArrowRightIcon /></span> <span className="text-blue-600 italic">@{getAdminNameById(payment.paidTo)}</span>
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-emerald-50 px-3 py-1 text-right font-black text-emerald-600">
                                                    +{formatPHP(payment.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {order?.discounts && order.discounts.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-darker flex items-center gap-2 font-bold">
                                    <PercentIcon className="text-darker h-4 w-4" />
                                    Applied Discounts
                                </h3>
                                <div className="grid gap-2">
                                    {order.discounts.map((discount, idx) => (
                                        <div key={idx} className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/50 p-3">
                                            <div className="text-sm">
                                                <p className="font-bold text-orange-700">{discount.description}</p>
                                                <p className="text-xs text-orange-600/70">{new Date(discount.discountDate).toLocaleDateString()}</p>
                                            </div>
                                            <span className="font-bold text-orange-600">-{formatPHP(discount.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Modern Footer Action */}
                    {/*<div className="flex justify-end gap-3 border-t bg-slate-50 p-4">*/}
                    {/*    <button*/}
                    {/*        onClick={onClose}*/}
                    {/*        className="px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-800"*/}
                    {/*    >*/}
                    {/*        Close*/}
                    {/*    </button>*/}
                    {/*    <button className="rounded-full bg-slate-900 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95">*/}
                    {/*        Print Receipt*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {/* Discounts */}

                </DialogContent>
            </Dialog>
        </div>
    );
}

//sub component
function StatCard({ label, value, icon, color = "text-slate-900" }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
    return (
        <div className="space-y-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400">
                {icon}
                <span className="text-darker font-bold tracking-wider text-nowrap text-[10px] uppercase">{label}</span>
            </div>
            <p className={cn("text-lg font-bold tracking-tight", color)}>{value}</p>
        </div>
    );
}
