import { Button } from "../ui/button";
import type React from "react";




interface DataTableAddButtonProps {
    onCreate: () => void;
    btnCaption: string;
    icon?: React.ReactNode;
}

export function DataTableAddButton({ onCreate, btnCaption ,icon}:DataTableAddButtonProps) {
    return (
        <Button
            size="sm"
            variant="default"
            className=""
            onClick={ onCreate}
        >
            { icon}
            {btnCaption}
        </Button>
    );
}