import { type ReactNode } from 'react'
import Header from '../components/Header';
import UserMenu from '../components/UserMenu';

type Props={
    children : ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div className="container-fluid m-0 p-0 d-lg-flex">
            
            <div className="bg-light">
                
                <Header />
            </div>
            <main className="bg-light flex-grow-1 min-vh-100" >
                <div className="float-end position-absolute end-0 pt-2 pe-4">
                    <UserMenu/>
                </div>
                {children}
            </main>
           
        {/*<Footer/>*/}
        </div>
    );
};

export default Layout;