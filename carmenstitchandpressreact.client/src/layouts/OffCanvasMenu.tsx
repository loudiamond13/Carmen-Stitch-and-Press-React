import  { NavLink } from "react-router-dom";
import SideBar from "../layouts/SideBar.tsx";
import "../layouts/css/OffCanvasMenu.css"


export default function OffCanvasMenu({open,onClose}:{open:boolean; onClose:()=>void;}) {

    return (
        <div className={`bg-dark offcanvas offcanvas-start  w-50 ${open? "show" :""}`}
            style={{ visibility: open ? "visible" : "hidden" }}>
            <div className="offcanvas-header ">
                <button className="btn-close" onClick={onClose} />
            </div>
            <div className="offcanvas-body p-0 ">
                <SideBar/>
            </div>
        </div>
    );
    
}