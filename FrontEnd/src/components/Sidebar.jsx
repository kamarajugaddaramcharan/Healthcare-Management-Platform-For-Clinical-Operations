import { Link } from "react-router-dom";

function Sidebar() {

    return (
        <aside className="sidebar">

            <h1 className="logo">🏥 MediSphere</h1>

            <nav className="menu">

                <Link to="/">📊 Dashboard</Link>

                <Link to="/patients">👤 Patients</Link>

                <Link to="/vitals">❤️ Vitals</Link>

                <Link to="/healthtwin">🫀 Health Twin</Link>

                <Link to="/consent">🔒 Consent</Link>

                <Link to="/fhir">📄 FHIR</Link>

                <Link to="/predictions">🤖 AI Predictions</Link>

            </nav>

        </aside>
    );

}

export default Sidebar;