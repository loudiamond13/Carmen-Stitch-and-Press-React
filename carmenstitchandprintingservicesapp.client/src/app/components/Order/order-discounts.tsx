import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { Discount } from "../../api/api-types";


interface OrderPaymentsProps {
    discounts: Discount[];
    onEdit: (discount: Discount, index: number) => void;
    onDelete: (discountId:number, discountAmt:string, index:number) => void;
}

export default function OrderDiscounts({ discounts, onEdit, onDelete }: OrderPaymentsProps) {
    if (!discounts) return null;

    return (
        <div className="text-foreground md:w-3/4">
            {discounts.map((discount, index) => (
                <div className="flex items-center justify-between py-1">
                    <div className="flex-1">
                        {discount.description }
                    </div>
                    <div className="w-24 font-semibold">
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP"
                        }).format(discount.amount)
                        }
                    </div>
                    <div className="flex w-20 justify-end gap-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="edit"
                            onClick={()=> onEdit(discount, index) }
                        >
                        <SquarePenIcon/>
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            variant="destructive2"
                            onClick={() => onDelete(
                                Number(discount.orderDiscountId),
                                String(new Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency:"PHP"
                                }).format(discount.amount)),
                                index
                            )}
                        >
                            <Trash2Icon />
                        </Button>
                    </div>
                </div>
            ))
            }
        </div>
    );
}