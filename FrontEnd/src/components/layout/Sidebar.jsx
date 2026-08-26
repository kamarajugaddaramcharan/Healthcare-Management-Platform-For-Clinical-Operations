import { NavLink } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUserInjured,
    FaHeartbeat,
    FaStethoscope,
    FaRobot,
    FaUserMd,
    FaUserCog,
    FaBell,
    FaShieldAlt,
    FaFileMedical,
    FaClipboardList,
    FaCog,
} from "react-icons/fa";

import {
    Sparkles,
    Activity,
    ShieldCheck,
} from "lucide-react";

import {
    isAdmin,
    isDoctor,
    isPatient,
    getUserName,
    logout,
} from "../../keycloak";

import "../../styles/sidebar.css";


function Sidebar() {

    // =========================================================
    // ROLE CHECKS
    // =========================================================

    const admin = isAdmin();

    const doctor = isDoctor();

    const patient = isPatient();

    const userName =
        getUserName() || "User";


    // =========================================================
    // ROLE DISPLAY
    // =========================================================

    const getRoleName = () => {

        if (admin) {
            return "System Administrator";
        }

        if (doctor) {
            return "Doctor";
        }

        if (patient) {
            return "Patient";
        }

        return "User";
    };


    // =========================================================
    // AVATAR
    // =========================================================

    const getInitials = () => {

        if (admin) {
            return "AD";
        }

        if (doctor) {
            return "DR";
        }

        if (patient) {
            return "PT";
        }

        if (userName) {

            return userName
                .split(" ")
                .map(
                    (name) =>
                        name.charAt(0)
                )
                .join("")
                .substring(0, 2)
                .toUpperCase();
        }

        return "US";
    };


    // =========================================================
    // MENU
    // =========================================================

    return (

        <aside className="sidebar">

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <div className="sidebar-logo">

                <div className="logo-icon">
                    🏥
                </div>

                <div className="sidebar-brand-text">

                    <h2>
                        Healthcare Management
                    </h2>

                    <span>
                        Platform For Clinical Operations
                    </span>

                </div>

            </div>


            {/* ================================================= */}
            {/* SYSTEM STATUS */}
            {/* ================================================= */}

            <div className="status-card">

                <div className="status-row">

                    <Activity size={18} />

                    <span>
                        Hospital Online
                    </span>

                </div>


                <div className="status-row">

                    <ShieldCheck size={18} />

                    <span>
                        HIPAA Secure
                    </span>

                </div>


                <div className="status-row">

                    <Sparkles size={18} />

                    <span>
                        AI Ready
                    </span>

                </div>

            </div>


            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}

            <nav className="menu">

                {/* ============================================= */}
                {/* DASHBOARD - ADMIN + DOCTOR */}
                {/* ============================================= */}

                {(admin || doctor) && (

                    <>

                        <NavLink to="/">

                            <FaTachometerAlt />

                            <span>
                                Dashboard
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* PATIENT MANAGEMENT */}
                        {/* ========================================= */}

                        <NavLink to="/patients">

                            <FaUserInjured />

                            <span>
                                {doctor
                                    ? "My Patients"
                                    : "Patients"}
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* ASSIGN PATIENTS - ADMIN ONLY */}
                        {/* ========================================= */}

                        {admin && (

                            <NavLink to="/assign-patients">

                                <FaUserCog />

                                <span>
                                    Assign Patients
                                </span>

                            </NavLink>

                        )}


                        {/* ========================================= */}
                        {/* PATIENT 360 */}
                        {/* ========================================= */}

                        <NavLink to="/patient360">

                            <FaUserMd />

                            <span>
                                Patient 360
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* HEALTH TWIN */}
                        {/* ========================================= */}

                        <NavLink to="/healthtwin">

                            <FaHeartbeat />

                            <span>
                                Health Twin
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* LIVE VITALS */}
                        {/* ========================================= */}

                        <NavLink to="/vitals">

                            <FaStethoscope />

                            <span>
                                Live Vitals
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* AI PREDICTIONS */}
                        {/* ========================================= */}

                        <NavLink to="/predictions">

                            <FaRobot />

                            <span>
                                AI Predictions
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* CARE PLAN */}
                        {/* ========================================= */}

                        <NavLink to="/care-plan">

                            <FaClipboardList />

                            <span>
                                Care Plan
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* ALERT MANAGEMENT */}
                        {/* ========================================= */}

                        <NavLink to="/alerts">

                            <FaBell />

                            <span>
                                Alert Management
                            </span>

                        </NavLink>

                    </>

                )}


                {/* ================================================= */}
                {/* PATIENT PORTAL */}
                {/* ================================================= */}

                {patient && (

                    <>

                        <NavLink to="/patient360">

                            <FaUserMd />

                            <span>
                                My Health
                            </span>

                        </NavLink>


                        <NavLink to="/healthtwin">

                            <FaHeartbeat />

                            <span>
                                My Health Twin
                            </span>

                        </NavLink>


                        <NavLink to="/vitals">

                            <FaStethoscope />

                            <span>
                                My Vitals
                            </span>

                        </NavLink>


                        <NavLink to="/predictions">

                            <FaRobot />

                            <span>
                                My AI Results
                            </span>

                        </NavLink>


                        {/* ===================================== */}
                        {/* PATIENT CARE PLAN */}
                        {/* ===================================== */}

                        <NavLink to="/care-plan">

                            <FaClipboardList />

                            <span>
                                Care Plan
                            </span>

                        </NavLink>

                    </>

                )}


                {/* ================================================= */}
                {/* ADMIN ONLY */}
                {/* ================================================= */}

                {admin && (

                    <>

                        {/* ========================================= */}
                        {/* CONSENT */}
                        {/* ========================================= */}

                        <NavLink to="/consent">

                            <FaShieldAlt />

                            <span>
                                Consent
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* FHIR */}
                        {/* ========================================= */}

                        <NavLink to="/fhir">

                            <FaFileMedical />

                            <span>
                                FHIR
                            </span>

                        </NavLink>


                        {/* ========================================= */}
                        {/* MODEL MANAGEMENT */}
                        {/* ========================================= */}

                        <NavLink to="/model-management">

                            <FaCog />

                            <span>
                                Model Management
                            </span>

                        </NavLink>

                    </>

                )}

            </nav>


            {/* ================================================= */}
            {/* USER FOOTER */}
            {/* ================================================= */}

            <div className="sidebar-footer">

                <div className="doctor-card">

                    <div className="doctor-avatar">

                        {getInitials()}

                        <span className="online-dot"></span>

                    </div>


                    <div className="doctor-info">

                        <h4>
                            {userName}
                        </h4>

                        <p>
                            {getRoleName()}
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* LOGOUT */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={logout}
                    style={{
                        width: "100%",
                        marginTop: "14px",
                        padding: "10px 14px",
                        border: "none",
                        borderRadius: "10px",
                        background: "#FEE2E2",
                        color: "#DC2626",
                        fontWeight: "700",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;