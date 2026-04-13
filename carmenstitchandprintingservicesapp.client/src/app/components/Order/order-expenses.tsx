import { SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { Expense, User } from "../../api/api-types";


interface OrderExpensesProps {
    expenses: Expense[];
    users: User[];
    onEdit: (expense: Expense, index: number) => void;
    onDelete: (expenseId: number, description: string, index: number) => void;
}

export default function OrderExpenses({ expenses, onEdit,users,onDelete }: OrderExpensesProps) {

    if (!expenses) return null;

    const getUserName = (email: string) => users?.find(x => x.email == email)?.firstName ?? email;

    console.log(expenses[0]?.expenseId);
    console.log(expenses[0]?.expenseId);

    return (
        <div className="text-foreground md:w-3/4">
            {expenses.map((expense, index) => (
                <div className="flex flex-row items-center justify-between py-1">
                    <div className="flex-1">
                        {expense.description}
                    </div>
                    <div className="w-24 font-semibold">
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP"
                        }).format(expense.amount)
                        }
                    </div>
                    <div className="w-24 px-4">
                        {getUserName(expense.paidBy)}
                    </div>

                    <div className="flex w-20 justify-end gap-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="edit"
                            onClick={() => onEdit(expense, index)}
                        >
                            <SquarePenIcon />
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            variant="destructive2"
                            onClick={() => onDelete(
                                expense.expenseId ? Number(expense.expenseId) : 0,
                                String(new Intl.NumberFormat("en-PH", {
                                    currency: "PHP",
                                    style: "currency"
                                }).format(expense.amount)),
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