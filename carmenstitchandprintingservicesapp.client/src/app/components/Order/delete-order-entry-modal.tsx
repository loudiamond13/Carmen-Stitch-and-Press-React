import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import type { OrderDeleteConfig } from "../../../config/order-modal-config";


interface DeleteOrderEntryModalProps {
    config: OrderDeleteConfig | undefined;
    open: boolean;
    onDelete: () => void;
    onClose: () => void;
}

export default function DeleteOrderEntryModal({
    config,
    open,
    onDelete,
    onClose
}: DeleteOrderEntryModalProps) {


    if (!config) return;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                </DialogHeader>
                <p>{config.description}</p>
                <p>{config.name}</p>
                <div className="flex justify-between">
                    <Button
                        variant="destructive"
                        onClick={()=> onDelete()}
                    >
                        Delete!
                    </Button>
                    <Button variant="default"
                        onClick={()=> onClose()}
                    >
                        Cancel!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}