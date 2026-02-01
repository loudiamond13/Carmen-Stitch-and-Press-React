import "../layouts/css/SideBar.css"
import  { NavLink } from "react-router-dom";

import logo from '../assets/images/cspLogo-removebg-preview.png'
import { useAuth } from "../contexts/AuthContext";

export default function SideBar() {
    const {isAuthenticated } = useAuth();
    const isLgScreen = window.innerWidth > 992;

    return (

        <aside className="sidebar bg-dark  position-fixed min-vh-100">
            <nav className="p-3">
                <ul className="nav flex-column gap-2">
                    {isLgScreen && 
                        <li className="nav-item">
                            <NavLink to="/" className=" mb-lg-2 mb-md-1  text-darker text-decoration-none me-auto">
                                <img src={logo} />{/*<span className="fs-3 fst-italic">CSP Tailoring</span>*/}
                            </NavLink>
                        </li>    
                    }
                    {isAuthenticated &&
                        (
                            <>
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link  " aria-current="page">
                                        <i className="fs-5 fa-solid fa-grip"></i>
                                        <span className="fw-medium"> Dashboard</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/orders" className="nav-link ">
                                        <i className="fs-5 fa-solid fa-list-check"></i>
                                        <span className="fw-medium"> Orders</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/logout" className="nav-link">
                                        <i className="fs-5 fa-solid fa-arrow-right-from-bracket"></i>
                                        <span className="fw-medium"> Logout</span>
                                    </NavLink>
                                </li>
                            </>
                        )
                    }

                </ul>
            </nav>
        </aside>
      );
}