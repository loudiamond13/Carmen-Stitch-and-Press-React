import React from "react";
import getExpensesTableColumn from "./expenses-table-column";
import { useDataTable } from "../../../hooks/use-data-table";
import type { Expense } from "../../api/api-types";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/data-table-toolbar";
import { DataTableAddButton } from "../../../components/data-table/data-table-add-button";
import { CirclePlusIcon } from "lucide-react";

interface ExpensesTableProp {
    data: Expense[];
    pageCount: number;
    onAddNew: () => void;
    onEdit: (expense:Expense) => void;
};

export default function ExpensesTable({
    data,
    pageCount,
    onAddNew,
    onEdit
}: ExpensesTableProp) {



    const columns = React.useMemo(
        () => getExpensesTableColumn({
            onEdit
        })

        ,[]
    );

    

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        initialState: {
            columnPinning: { right: ["actions"] }
        },
        getRowId: (row) => row.expenseId,
        shallow: true,
        clearOnDefault: true,
    });

    return (
        <>
            <DataTable table={table}>
                <DataTableToolbar table={table}>
                    <DataTableAddButton
                        onCreate={onAddNew}
                        btnCaption="Add Company Expense"
                        icon={<CirclePlusIcon />}
                    />
                </DataTableToolbar>
            </DataTable>
            
        </>
    );
}