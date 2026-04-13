import { NavLink } from "react-router-dom";



type SideBarNav = {
    text: string;
    path: string;
    icon: React.ComponentType<{ size?: number }>;
    onClick: () => void;
}
export default function SideBarNav({ text, path, onClick,icon:Icon }: SideBarNav) {   


    return (
        <NavLink to={path.startsWith("/") ? path : `/${path}`}
            onClick={ onClick}
            className={({ isActive }) =>
                `flex gap-3 items-center px-2 py-1 rounded hover:bg-foreground transition-colors duration-300 
                ${isActive ? "bg-foreground text-light" : "text-foreground hover:text-light"}`
            }>
            <Icon/>
            {text }
        </NavLink>
    );
}