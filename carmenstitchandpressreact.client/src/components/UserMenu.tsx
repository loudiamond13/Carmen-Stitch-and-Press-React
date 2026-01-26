
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "react-router";
import { useNavigate } from "react-router-dom";

import "../components/css/UserMenu.css";

const UserMenu = () => {
    const navigate = useNavigate();
    let {isAuthenticated,user,logout } = useAuth();

    const handleLogOut = async () => {
        await logout();
        navigate("/");
    }

    return (
        <>
            {isAuthenticated ? (
                <div className="dropdown userMenu">
                    <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                        {/*<img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2" />*/}
                        <i className="bi fs-2 bi-person-circle">{ user?.firstName}</i>

                    </a>
                    <ul className="dropdown-menu  text-small shadow bg-dark " aria-labelledby="dropdownUser">
                        <li ><a className="dropdown-item text-darker" href="#profile ">Profile</a></li>
                        <li><a className="dropdown-item text-darker" href="#settings ">Settings</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item text-darker" onClick={handleLogOut}>Logout</a></li>
                    </ul>
                </div>
            ) : (
                    <div className="userMenu " >
                        <NavLink className="text-darker  fs-4 fw-medium text-decoration-none" to="/login">Login</NavLink>
                    </div>
            )}
        </>
    );

};

export default UserMenu;