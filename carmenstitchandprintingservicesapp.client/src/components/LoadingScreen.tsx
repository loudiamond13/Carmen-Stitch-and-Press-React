

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-dark">
            <div className="flex flex-row items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-darker" />
            </div>
        </div>
    );
}
