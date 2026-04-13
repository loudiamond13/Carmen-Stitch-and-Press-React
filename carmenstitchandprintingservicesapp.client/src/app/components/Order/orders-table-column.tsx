


import type { Order } from "../../api/api-types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../components/data-table/data-table-column-header";
import { Button } from "../../../components/ui/button";
import { Ellipsis, Text } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "../../../components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { OrderActionType } from "../../../config/order-modal-config";



interface getOrdersTableColumns {

    navigate: ReturnType<typeof useNavigate>;
    onOpenViewOrderModal: (orderId: string) => void;
    onOpenActionModal: (
        type: OrderActionType,
        orderId: string,
        orderName:string
    ) => void;
}

const formatPHP = (number: number) => new Intl.NumberFormat("en-PH", {style:"currency", currency:"PHP"}).format(number)

export function getOrdersTableColumns({ navigate, onOpenViewOrderModal,onOpenActionModal }: getOrdersTableColumns): ColumnDef<Order>[] {

     


    return [
        {
            id: "orderName",
            accessorKey: "orderName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Order Name"  className="text-darker"/>
            ),
            cell: ({ row }) => <div className="m-0 p-0" >{row.getValue("orderName")}</div>,
            meta: {
                label: "Order Name",
                placeholder: "Search Order...",
                variant: "text",
                icon: Text,
            },
            enableSorting: false,
            enableHiding: false,
            enableColumnFilter: true,

        },
        {
            id: "paidAmount",
            accessorKey: "paidAmount",
            cell: ({ row }) => {
                const amount = Number(row.getValue("paidAmount"));

                return (
                    <div className="m-0 p-0">
                        { formatPHP(amount)}
                    </div>
                );
            },
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Paid Amount" />
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: "totalBalance",
            accessorKey: "totalBalance",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Total Balance" />
            ),
            cell: ({ row }) => {
                const amount = Number(row.getValue("totalBalance"));
                return (
                    <div className=" p-0">
                        {formatPHP(amount)}
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "totalAmount",
            accessorKey: "totalAmount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} label="Total Amount" />
            ),
            cell: ({ row }) => {
                const amount = Number(row.getValue("totalAmount"));

                return (
                    <div className="m-0 p-0">
                        {formatPHP(amount)}
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
           size:5
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
                                <DropdownMenuItem
                                    onClick={() => { onOpenViewOrderModal(row.original.orderId) }}
                                >
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                    navigate(`/order/${row.original.orderId}`)
                                }}>
                                    Edit
                                </DropdownMenuItem>
                                {/*<hr className="text-darker"/>*/}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Actions</DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            onClick={() => { onOpenActionModal(OrderActionType.Payment, row.original.orderId, row.original.orderName) }}
                                        >
                                            Add Payment
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => { onOpenActionModal(OrderActionType.Item, row.original.orderId, row.original.orderName) }}
                                        >
                                            Add Order Item
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => { onOpenActionModal(OrderActionType.Discount, row.original.orderId, row.original.orderName) }}
                                        >
                                            Add Discount
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => { onOpenActionModal(OrderActionType.Expense, row.original.orderId, row.original.orderName) }}
                                        >
                                            Add Expense
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                {/*<hr className="text-darker"/>*/}
                                {/*<DropdownMenuItem*/}
                                {/*    className="hover:bg-light"*/}
                                {/*    onSelect={() => setRowAction({ row, variant: "delete" })}*/}
                                {/*>*/}
                                {/*    Delete*/}
                                {/*</DropdownMenuItem>*/}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            size: 5,
        },
    ]
}