import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { ArrowDownToLineIcon, ReceiptTextIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import type { Expense, User } from "../../api/api-types";

interface AddEditExpenseModalProps {
    open: boolean;
    onSave: (data: Expense) => Promise<void>;
    onClose: () => void;
    initialData?: Expense | null;
    admins: User[];
}

export default function AddEditCompanyExpenseModal({
    open,
    onSave,
    onClose,
    initialData,
    admins = []
}: AddEditExpenseModalProps) {
    const isEdit = !!initialData?.expenseId;

    const form = useForm<Expense>({
        defaultValues: initialData ?? {
            description: "",
            paidBy: "",
        }
    });

    // Sync form with initialData when modal opens or record changes
    useEffect(() => {
        if (open) {
            form.reset(initialData ?? {
                description: "",
               
                paidBy: ""
            });
        }
    }, [open, initialData, form]);

    const onSubmit = async (data: Expense) => {
        await onSave(data);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle className= "flex items-center gap-1">
                        <ReceiptTextIcon /> 
                        {isEdit ? "Edit Expense" : "New Company Expense"}
                    </DialogTitle>
                    <DialogDescription className="text-darker/80">
                        {isEdit ? "Update existing expense details." : "Record a new expenditure for the company."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        <FormField
                            control={form.control}
                            name="description"
                            rules={{ required: "Description is required" }}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-darker text-xs font-bold tracking-wider uppercase">Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Office Supplies"
                                            className="border-dark/10 focus:border-dark"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage  />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                rules={{ required: "Amount is required", min: 1 }}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-darker text-xs font-bold tracking-wider uppercase">Amount</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="text-darker/70 absolute top-2.5 left-3 text-xs font-bold">₱</span>
                                                <Input
                                                    type="number"
                                                    className="border-dark/10 pl-7 focus:border-dark"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage  />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paidBy"
                                rules={{ required: "Required" }}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-darker text-xs font-bold tracking-wider uppercase">Spent By</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-dark/10">
                                                    <SelectValue placeholder="Select User" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {admins.map((admin) => (
                                                    <SelectItem key={admin.email} value={admin.email}>
                                                        {admin.firstName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage  />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="border-dark/5 flex gap-3 border-t pt-4">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="bg-darker text-light flex-1 font-bold hover:bg-dark"
                            >
                                <ArrowDownToLineIcon className="mr-2 h-4 w-4" />
                                {form.formState.isSubmitting ? "Saving..." : "Save Expense"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="border-dark/10 text-darker hover:bg-dark/5"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}