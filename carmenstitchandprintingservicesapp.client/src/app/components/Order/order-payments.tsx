import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { Payment, User } from "../../api/api-types";



interface OrderPaymentsProps {
    payments?: Payment[];
    users:User[]
    onEdit: (payment:Payment, index:number) => void;
    onDelete: (paymentId:number, paymentAmt:string, index:number) => void;
}

export default function OrderPayments({ payments, onEdit, users,onDelete }: OrderPaymentsProps) {
    if (!payments) return null;

    const getUserName = (email: string) => {
        return users.find(x => x.email === email)?.firstName ?? email;
    }

    return (
        <div className="text-foreground md:w-3/4">
            {payments.map((payment, index) => (
                <div className="flex flex-row items-center justify-between py-1">
                    <div className="flex-1">
                        {payment.paidBy}
                    </div>
                    <div className="w-24 font-semibold">
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency:"PHP"
                        }).format(payment.amount)
                        }
                    </div>
                    <div className="w-24 px-4">
                        {getUserName(payment.paidTo)}
                    </div>
                    
                    <div className="flex w-20 justify-end gap-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="edit"
                            onClick={()=> onEdit(payment, index) }
                        >
                            <SquarePenIcon/>
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            variant="destructive2"
                            onClick={() => onDelete(
                                Number(payment.paymentId),
                                String(new Intl.NumberFormat("en-PH", {
                                    currency: "PHP",
                                    style:"currency"
                                }).format(payment.amount)),
                                index
                            )}
                        >
                            <Trash2Icon />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}