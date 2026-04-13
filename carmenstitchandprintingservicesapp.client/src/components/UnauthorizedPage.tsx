import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen flex-col items-center bg-dark pt-30">
            <p className="mb-6 text-2xl text-red-600" role="alert">
                401 Unauthorized!
            </p>
            <NavLink
                to="/"
                className="flex items-center space-x-2 rounded-xl border px-3 text-darker hover:bg-gray-800 hover:text-light"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
            </NavLink>
        </div>
    );
}
