
import "../layouts/css/TopNavBar.css";
import { NavLink } from "react-router-dom";
import logo from '../assets/images/cspLogo-removebg-preview.png'

export default function TopNavbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
        <nav className="navbar navbar-dark bg-dark fixed-top d-lg-none">
            <div className="container-fluid ">
                <button
                  className="navbar-toggler  border-0 "
                type="button"
                onClick={onMenuClick}
                >
                  {/* <span className="navbar-toggler-icon" />*/}
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              
              <span>
                  <NavLink to="/" className=" mb-lg-2 mb-md-1  text-darker text-decoration-none me-auto">
                      <img src={logo} />{/*<span className="fs-3 fst-italic">CSP Tailoring</span>*/}
                  </NavLink>
              </span>
             
            </div>
        </nav>
  );
}
