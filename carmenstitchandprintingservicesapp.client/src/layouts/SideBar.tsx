import logo from "../../public/CSPSLogo2.png"
import {LayoutDashboard, ListOrdered, X, LogOut, BanknoteArrowDownIcon } from "lucide-react"
import SideBarNav from "./SideBarNav";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type SideBarProps ={
    isOpen: boolean;
    onClose: () => void;
}

export default function SideBar({ isOpen,onClose}: SideBarProps) {

    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    //temporary logout functionality
    const handleLogout = async() => {
        await logout();   
        navigate("/login")
    };

    return (
        <div className={` pt-6 px-8
                    fixed flex-col inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:static lg:translate-x-0 lg:flex
                  `}

            
        >
            {/*className="w-64 flex-col pt-6 pl-8"*/}

            <div className="hidden pb-10 lg:flex">
                <NavLink to="/">
                    <img
                        src={logo}
                        alt="CSPS Logo"
                        className="h-8 w-auto object-contain sm:h-10 md:h-11" />
                </NavLink>
            </div>

            <button
                onClick={onClose}
                className="absolute top-4 right-4 lg:hidden"
            >
                <X size={ 28} className="text-foreground cursor-pointer transition-transform duration-300 hover:rotate-90" />
            </button>

            {isAuthenticated &&
                <div className="flex h-full flex-col justify-between pt-8 lg:pt-0">
                    <div className="flex flex-col gap-2">
                        <SideBarNav path="/" text="Dashboard" icon={LayoutDashboard} onClick={onClose} />
                        <SideBarNav path="orders" text="Orders" icon={ListOrdered} onClick={onClose} />
                        <SideBarNav path="expenses" text="Expenses" icon={BanknoteArrowDownIcon} onClick={onClose} />
                    </div>    

                    <button
                        onClick={handleLogout}
                        className="text-text-darker mt-6 flex items-center gap-2 hover:text-gray-300"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            }
        </div>
    );
}