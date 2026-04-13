import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { ArrowDownToLineIcon, CircleXIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { FormItem } from "../../../components/ui/form";
import type { OrderAddEditModalConfig, SelectOption } from "../../../config/order-modal-config";

interface AddOrderEntryModalProps {
    config: OrderAddEditModalConfig | undefined;
    open: boolean;
    onSave: (data: Record<string, any>) => Promise<void>;
    onClose: () => void;
    initialData?: Record<string, any>;
    editingIndex?: number | null;
}

export default function AddOrderEntryModal({
    config,
    open,
    onSave,
    onClose,
    initialData = {},
    editingIndex
}: AddOrderEntryModalProps) {
    //independent RHF instance for the modal
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<Record<string, any>>({
        defaultValues: initialData
    });

    //reset form when modal opens or config changes
    useEffect(() => {
        if (open) {
            reset(initialData);
        }
        else {
            reset({});
        }
    }, [open, initialData, reset]);

    const isEdit = typeof editingIndex === "number";

    const onSubmit = async(data: Record<string, any>) => {

        await onSave(data);
        reset(); //clear modal after save
    };

    if (!config) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-1">
                        {config.icon && <config.icon />}
                        <DialogTitle>{isEdit ? config.editTitle : config.addTitle}</DialogTitle>
                    </div>
                    <DialogDescription className="flex">{config.description ?? "Fill out the fields below."}</DialogDescription>
                </DialogHeader>

                <form  className="space-y-4">
                    {config.fields.map((field) => {
                        if (field.type === "select") {
                            return (
                                <Controller
                                    key={field.name}
                                    name={field.name}
                                    control={control}
                                    rules={{ required: `${field.label} is required` }}
                                    render={({ field: selectField }) => (
                                        <FormItem>
                                            <Select onValueChange={selectField.onChange} value={selectField.value || ""}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={field.label} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {field.options?.map((opt: SelectOption) => (
                                                        <SelectItem key={`${field.name}-${opt.value}`} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors[field.name] && (
                                                <p className="mt-1 text-sm text-red-500">{errors[field.name]?.message?.toString()}</p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            );
                        }

                        //default input field
                        return (
                            <div key={field.name}>
                                <Input
                                    {...register(field.name, { required: `${field.label} is required` })}
                                    type={field.type || "text"}
                                    placeholder={field.label}
                                    
                                />
                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-500">{errors[field.name]?.message?.toString()}</p>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="success"
                            onClick={handleSubmit(onSubmit)}
                        >
                            <ArrowDownToLineIcon/>
                            Save
                        </Button>
                        <Button type="button" variant="destructive2" className="flex items-center gap-2 rounded px-4 py-2" onClick={onClose}>
                            <CircleXIcon />
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}