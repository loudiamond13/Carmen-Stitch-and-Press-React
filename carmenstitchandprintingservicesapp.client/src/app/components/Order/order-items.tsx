import {  SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { OrderItem } from "../../api/api-types";



interface OrderItemsProps {
    items?: OrderItem[];
    onEdit: (item: OrderItem, index: number) => void;
    onDelete: (itemId:number, itemName:string, index:number) => void;
}

export default function OrderItems({ items ,onEdit, onDelete}: OrderItemsProps) {
    if (!items) return null;

    return (
        <div className="text-foreground md:w-3/4">
            {items.map((item,index) => (
                <div
                    key={item.orderItemId}
                    className="flex flex-row items-center justify-between py-1"
                >
                    
                    <div className="flex flex-1">
                        <span className="font-medium break-words">
                            {item.description}
                        </span>
                    </div>

                    
                    <div className="w-20 text-gray-600">
                        {item.quantity} pc(s)
                    </div>

                    
                    <div className="w-32 px-4 font-semibold">
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                        }).format(item.price)
                        }
                    </div>

                    
                    <div className="flex w-20 justify-end gap-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="edit"
                            onClick={() => onEdit(item, index)}
                        >
                            <SquarePenIcon/>
                        </Button>

                        <Button
                            size="sm"
                            type="button"
                            variant="destructive2"
                            onClick={() => onDelete(Number(item.orderItemId), item.description, index)}
                        >
                            <Trash2Icon  />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}