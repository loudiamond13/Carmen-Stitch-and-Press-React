import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { searchExpensesParamsCache } from "../lib/search-params";
import * as api from "../api/api-client";
import ExpensesTable from "../components/Expense/expenses-table";
import { useState } from "react";
import AddEditCompanyExpenseModal from "../components/Expense/add-company-expense-modal";
import type { Expense } from "../api/api-types";
import toast from "react-hot-toast";
import usePageTitle from "../../hooks/use-page-title";





export default function Expensespage() {
    usePageTitle("Expenses");

    const [search] = useQueryStates(searchExpensesParamsCache);
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

    // FETCH DATA
    const query = useQuery({
        queryKey: ["expenses", JSON.stringify(search)],
        queryFn: async () => {
            const [expenses, admins] = await Promise.all([
                api.getExpenses({ ...search }),
                api.getAllAdminUsers()
            ]);
            return { expenses, admins };
        },
    });

    // OPEN FOR ADD
    const onAddNew = () => {
        setSelectedExpense(null);
        setIsAddEditModalOpen(true);
    };

    // OPEN FOR EDIT (Call this from your table action)
    const onEdit = (expense: Expense) => {
        setSelectedExpense(expense);
        setIsAddEditModalOpen(true);
    };

    const handleSave = async (formData: Expense) => {
        if (selectedExpense?.expenseId) {
            try {
                const res = await api.updateExpense(formData);

                query.refetch();
                setSelectedExpense(null);
                setIsAddEditModalOpen(false);
                toast.success(res.message);
                return;
            }
            catch (error: any) {
                toast.error(error.message);
                return;
            }
        } else {
            try {
                const res = await api.createCompanyExpense(formData);

                query.refetch(); 
                setSelectedExpense(null);
                setIsAddEditModalOpen(false);
                toast.success(res.message);
                return;
            }
            catch (error: any) {
                toast.error(error.message);
                return;
            }
        }
    };

    return (
        <>
            <ExpensesTable
                data={query.data?.expenses.data ?? []}
                pageCount={query.data?.expenses.pageCount ?? 0}
                onAddNew={onAddNew} // Pass the new trigger
                onEdit={onEdit }

            />

            <AddEditCompanyExpenseModal
                open={isAddEditModalOpen}
                onSave={handleSave}
                onClose={() => setIsAddEditModalOpen(false)}
                initialData={selectedExpense}
                admins={query.data?.admins ?? []}
            />
        </>
    );
}