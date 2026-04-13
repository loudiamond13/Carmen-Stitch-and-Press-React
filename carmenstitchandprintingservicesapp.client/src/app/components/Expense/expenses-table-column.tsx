import type { ColumnDef } from "@tanstack/react-table";
import type { Expense } from "../../api/api-types";
import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header";
import { CalendarIcon, Ellipsis, Text } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";


interface getExpensesTableColumnProps {
    onEdit:(expense:Expense)=>void
}

export default function getExpensesTableColumn({onEdit }:getExpensesTableColumnProps): ColumnDef<Expense>[] {

    return [
        {
            id: "description",
            accessorKey: "description",
            header: ({ column }) => (
                 <DataTableColumnHeader column={column} label="Description" />
            ),
            cell: ({ row }) => (
                 <div>{row.getValue("description")}</div>
            ),
            meta: {
                label: "Description",
                placeholder: "Search Expense...",
                variant: "text",
                icon: Text
            },
            enableSorting: false,
            enableHiding: false,
            enableColumnFilter: true
        },
        {
            id: "spentDate",
            accessorKey: "spentDate",
            header: ({ column }) => (
                 <DataTableColumnHeader column={ column} label="Date"/>
            ),
            cell: ({ row }) => {
                const date = String(row.getValue("spentDate")); //Date(row.getValue("spentDate"))
                return <div>{new Date(date).toLocaleDateString()}</div>
            },
            meta: {
                label: "Spent On",
                variant: "dateRange",
                icon: CalendarIcon
            },
            enableColumnFilter: true
        },
       
        {
            id: "amount",
            accessorKey: "amount",
            header: ({ column }) => {
                return <DataTableColumnHeader column={column } label="Amount" />
            },
            cell: ({ row }) => {
                const amt = Number(row.getValue("amount"));
                return (
                    <div>
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                        }).format(amt)
                        }
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: function Cell({ row }) {
                return (
                    <div className="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                >
                                    <Ellipsis className="size-4" aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start"
                                side="left"
                                sideOffset={5}
                                className="bg-dark text-darker border-0 sm:side-bottom sm:align-end"
                            >
                                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                    Edit
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            size: 5,
        },
    ];
}