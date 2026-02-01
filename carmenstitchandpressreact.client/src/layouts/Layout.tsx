import  { type ReactNode, useState } from 'react'
import Header from '../components/Header';
import UserMenu from '../components/UserMenu';
import SideBar from '../layouts/SideBar';
import OffcanvasMenu from '../layouts/OffCanvasMenu';
import TopNavBar from '../layouts/TopNavBar';
import "../layouts/css/Layout.css"

type Props={
    children : ReactNode
}

const Layout = ({ children }: Props) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="d-flex">
            
            {/*<div className="bg-light">
                
                <Header />
            </div>*/}

            {/* Desktop sidebar */}
            <div className="d-none d-lg-block ">
                <SideBar />
            </div>

            {/* Mobile top navbar */}
            <TopNavBar onMenuClick={() => setMobileOpen(true)} />

            {/* Mobile offcanvas */}
            <OffcanvasMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />


            <main className="bg-light flex-grow-1 min-vh-100 main-content pt-3 mt-5 mt-lg-0" >
                {/* <div className="float-end position-absolute end-0 pt-2 pe-4">
                   <UserMenu/>
                </div>*/}
                {children}
            </main>
           
        {/*<Footer/>*/}
        </div>
    );
};

export default Layout;