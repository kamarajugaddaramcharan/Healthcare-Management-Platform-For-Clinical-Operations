import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../../styles/layout.css";

function Layout({ children }) {

    const location = useLocation();

    const hideNavbar = location.pathname === "/alerts";

    return (

        <div className="app-layout">

            <Sidebar />

            <div className="main-content">

                {!hideNavbar && <Navbar />}

                <div className="page-content">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default Layout;