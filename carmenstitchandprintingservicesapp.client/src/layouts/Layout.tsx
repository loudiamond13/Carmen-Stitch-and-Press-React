import { useState } from "react";
import SideBar from "./SideBar";
import TopNavBar from "./TopNavBar";
import SideBarBackDrop from "./SideBarBackDrop";
import { Outlet } from "react-router-dom";




export default function Layout() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="font-arimo flex min-h-screen w-full flex-col bg-background">
            <div className="lg:hidden">
                <TopNavBar onMenuClick={ () => setIsOpen(true) } />
            </div>

            <SideBarBackDrop isOpen={ isOpen} onClick={ ()=> setIsOpen(false) } />

            <div className="flex flex-1">
                <div className="flex"> {/*hidden lg:flex*/}
                    <SideBar isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </div>

                <main className=" flex-1">
                    <Outlet/>
                </main>
            </div>

        </div>
    );
}