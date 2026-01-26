import { NavLink} from 'react-router-dom';
import "./css/Header.css";
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/cspLogo-removebg-preview.png'
//import UserMenu from "../components/UserMenu";



const Header = () => {

    const { isAuthenticated } = useAuth();
    return (
        /*className="d-flex flex-column  p-3 text-white " style={{ width: '250px', height: '' }}*/
        <>
            <nav className=" d-lg-flex navbar-expand-lg flex-lg-column navbar1 p-lg-3 p-1  flex-shrink-1">
               
                <div className="d-flex"> 
                    <NavLink to="/" className=" mb-lg-2 mb-md-1  text-darker text-decoration-none me-auto">
                        <img src={logo} />{/*<span className="fs-3 fst-italic">CSP Tailoring</span>*/}
                    </NavLink>
                    <button className="navbar-toggler border me-3 mb-0 border-2 " type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon border border-2 ">a</span>
                    </button>
                </div>

                <hr className="d-none d-lg-flex"/>
               
                    {isAuthenticated && (
                        <>
                            <div className=" collapse navbar-collapse z-2" id="navbarTogglerDemo03">

                                <ul className="nav text-decoration-none nav-pills gap-1 flex-column w-100 mb-auto">
                                    <li className="nav-item">
                                        <NavLink to="/" className="nav-link  " aria-current="page">
                                            <i className="fa-solid fa-grip"></i>
                                            <span className="fw-medium"> Dashboard</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/orders" className="nav-link ">
                                            <i className="fs-5 bi bi-bag"></i>
                                            <span className="fw-medium"> Orders</span>

                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
               
            </nav>
        </>
    );
}

export default Header;