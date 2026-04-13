
import logo from "../../public/CSPSLogo2.png"
import { Menu } from "lucide-react";

type TopNavBarProps = {
    onMenuClick: () => void;
}

export default function TopNavBar({onMenuClick }:TopNavBarProps) {

    return (
        <div className="flex items-center justify-between bg-gradient-to-tr from-light to-darker p-4">
           
            <div>
                <button onClick={ onMenuClick} className="cursor-pointer">
                    <Menu className="text-darker"/>
                </button>
            </div>
            <div>
                <img
                    src={logo}
                    alt="CSPS Logo"
                    className="h-8 w-auto object-contain sm:h-10 md:h-11" />
            </div>
        </div>
    );
}