import { useEffect, useMemo, useState } from "react";

import {
    Bell,
    Mail,
    Search,
    Clock,
    Activity,
    ShieldCheck,
    Sparkles,
    X,
    UserRound,
    ChevronRight
} from "lucide-react";

import "../../styles/dashboardHeader.css";


function DashboardHeader({

                             title =
                             "Healthcare Management Platform For Clinical Operations",

                             subtitle =
                             "AI Healthcare Command Center",

                             showSearch = true,

                             showStats = true,

                             showDoctor = true,

                             // DATA FROM DASHBOARD
                             patients = [],

                             stats = {
                                 patients: 0,
                                 healthTwins: 0,
                                 predictions: 0
                             },

                             // PATIENT SELECTION
                             onPatientSelect = () => {}

                         }) {


    // =========================================================
    // CLOCK
    // =========================================================

    const [currentTime, setCurrentTime] =
        useState("");


    // =========================================================
    // SEARCH
    // =========================================================

    const [searchTerm, setSearchTerm] =
        useState("");

    const [searchFocused, setSearchFocused] =
        useState(false);


    // =========================================================
    // CLOCK
    // =========================================================

    useEffect(() => {

        const updateClock = () => {

            const now = new Date();

            setCurrentTime(
                now.toLocaleString(
                    "en-IN",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                )
            );

        };


        updateClock();

        const timer =
            setInterval(
                updateClock,
                1000
            );


        return () =>
            clearInterval(timer);

    }, []);


    // =========================================================
    // FILTER PATIENTS
    // =========================================================

    const filteredPatients =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (!search) {
                return [];
            }


            if (!Array.isArray(patients)) {
                return [];
            }


            return patients
                .filter(
                    (patient) => {

                        const fields = [

                            patient?.patientId,

                            patient?.id,

                            patient?.name,

                            patient?.email,

                            patient?.phone,

                            patient?.gender,

                            patient?.doctorId,

                            patient?.doctorName,

                            patient?.assignedDoctor

                        ];


                        return fields.some(
                            (field) => {

                                if (
                                    field === null ||
                                    field === undefined
                                ) {
                                    return false;
                                }


                                return String(field)
                                    .toLowerCase()
                                    .includes(search);

                            }
                        );

                    }
                )
                .slice(0, 8);

        }, [
            patients,
            searchTerm
        ]);


    // =========================================================
    // SELECT PATIENT
    // =========================================================

    const selectPatient =
        (patient) => {

            if (!patient) {
                return;
            }


            onPatientSelect(
                patient
            );


            setSearchTerm("");

            setSearchFocused(
                false
            );

        };


    // =========================================================
    // KEYBOARD
    // =========================================================

    const handleSearchKeyDown =
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                setSearchTerm("");

                setSearchFocused(
                    false
                );

                return;
            }


            if (
                event.key ===
                "Enter" &&
                filteredPatients.length >
                0
            ) {

                selectPatient(
                    filteredPatients[0]
                );

            }

        };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            className="dashboard-header"
        >


            {/* ================================================= */}
            {/* TOP HEADER */}
            {/* ================================================= */}

            <div
                className="dashboard-header-top"
            >


                <div
                    className="header-left"
                >


                    {/* ================================================= */}
                    {/* LOGO */}
                    {/* ================================================= */}

                    <div
                        className="header-logo"
                    >

                        <div
                            className="logo-circle"
                        >
                            🏥
                        </div>


                        <div
                            style={{
                                minWidth: 0
                            }}
                        >

                            <h1
                                style={{
                                    lineHeight:
                                        "1.15",
                                    marginBottom:
                                        "4px"
                                }}
                            >

                                {title ===
                                "Healthcare Management Platform For Clinical Operations" ? (

                                    <>
                                        Healthcare Management Platform
                                        <br />
                                        <span
                                            style={{
                                                fontSize:
                                                    "0.78em"
                                            }}
                                        >
                                            For Clinical Operations
                                        </span>
                                    </>

                                ) : (

                                    title

                                )}

                            </h1>


                            <p>
                                {subtitle}
                            </p>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TIME */}
                    {/* ================================================= */}

                    <div
                        className="header-time"
                    >

                        <Clock
                            size={17}
                        />

                        <span>
                            {currentTime}
                        </span>

                    </div>

                </div>


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

                <div
                    className="header-status"
                >

                    <div
                        className="status-pill success"
                    >

                        <Activity
                            size={16}
                        />

                        All Systems Operational

                    </div>


                    <div
                        className="status-pill secure"
                    >

                        <ShieldCheck
                            size={16}
                        />

                        Secure Platform

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* TOOLBAR */}
            {/* ================================================= */}

            <div
                className="dashboard-toolbar"
            >


                {/* ================================================= */}
                {/* PREMIUM SEARCH */}
                {/* ================================================= */}

                {showSearch && (

                    <div
                        className="premium-search-wrapper"
                    >

                        <div
                            className={
                                `premium-search ${
                                    searchFocused
                                        ? "active"
                                        : ""
                                }`
                            }
                        >

                            <Search
                                size={19}
                                className="search-icon"
                            />


                            <input
                                type="text"
                                value={
                                    searchTerm
                                }

                                onChange={
                                    (event) =>
                                        setSearchTerm(
                                            event.target.value
                                        )
                                }

                                onFocus={() =>
                                    setSearchFocused(
                                        true
                                    )
                                }

                                onKeyDown={
                                    handleSearchKeyDown
                                }

                                placeholder="Search patient, ID, doctor..."

                                autoComplete="off"
                            />


                            {searchTerm && (

                                <button
                                    type="button"

                                    className="search-clear"

                                    onClick={() => {

                                        setSearchTerm("");

                                        setSearchFocused(
                                            false
                                        );

                                    }}
                                >

                                    <X
                                        size={17}
                                    />

                                </button>

                            )}

                        </div>


                        {/* ================================================= */}
                        {/* SEARCH DROPDOWN */}
                        {/* ================================================= */}

                        {searchFocused &&
                            searchTerm.trim() && (

                                <div
                                    className="premium-search-dropdown"
                                >


                                    {/* HEADER */}

                                    <div
                                        className="search-dropdown-header"
                                    >

                                        <div>

                                            <strong>
                                                Patient Search
                                            </strong>

                                            <span>
                                                {
                                                    filteredPatients.length
                                                }{" "}
                                                result
                                                {
                                                    filteredPatients.length !==
                                                    1
                                                        ? "s"
                                                        : ""
                                                }
                                            </span>

                                        </div>


                                        <Search
                                            size={17}
                                        />

                                    </div>


                                    {/* RESULTS */}

                                    {filteredPatients.length >
                                    0 ? (

                                        <div
                                            className="search-results-list"
                                        >

                                            {filteredPatients.map(
                                                (
                                                    patient
                                                ) => (

                                                    <button
                                                        type="button"

                                                        key={
                                                            patient.id ||
                                                            patient.patientId
                                                        }

                                                        className="search-result-item"

                                                        onMouseDown={(
                                                            event
                                                        ) =>
                                                            event.preventDefault()
                                                        }

                                                        onClick={() =>
                                                            selectPatient(
                                                                patient
                                                            )
                                                        }
                                                    >


                                                        {/* AVATAR */}

                                                        <div
                                                            className="search-patient-avatar"
                                                        >

                                                            <UserRound
                                                                size={
                                                                    19
                                                                }
                                                            />

                                                        </div>


                                                        {/* INFO */}

                                                        <div
                                                            className="search-patient-info"
                                                        >

                                                            <div
                                                                className="search-patient-name"
                                                            >

                                                                {
                                                                    (patient.name && patient.name !== "Unknown Patient")
                                                                        ? patient.name
                                                                        : `Patient ${patient.patientId || "N/A"}`
                                                                }

                                                            </div>


                                                            <div
                                                                className="search-patient-meta"
                                                            >

                                                                <span>
                                                                    ID:{" "}
                                                                    {
                                                                        patient.patientId ||
                                                                        patient.id ||
                                                                        "N/A"
                                                                    }
                                                                </span>


                                                                {patient.gender && (

                                                                    <>

                                                                        <span>
                                                                            •
                                                                        </span>

                                                                        <span>
                                                                            {
                                                                                patient.gender
                                                                            }
                                                                        </span>

                                                                    </>

                                                                )}


                                                                {patient.age !==
                                                                    undefined &&
                                                                    patient.age !==
                                                                    null && (

                                                                        <>

                                                                            <span>
                                                                                •
                                                                            </span>

                                                                            <span>
                                                                                {
                                                                                    patient.age
                                                                                }{" "}
                                                                                years
                                                                            </span>

                                                                        </>

                                                                    )}

                                                            </div>

                                                        </div>


                                                        {/* ARROW */}

                                                        <ChevronRight
                                                            size={
                                                                18
                                                            }

                                                            className="search-result-arrow"
                                                        />

                                                    </button>

                                                )
                                            )}

                                        </div>

                                    ) : (

                                        <div
                                            className="search-no-results"
                                        >

                                            <Search
                                                size={34}
                                            />

                                            <strong>
                                                No patient found
                                            </strong>

                                            <span>
                                                Try patient ID,
                                                name, email or
                                                phone.
                                            </span>

                                        </div>

                                    )}

                                </div>

                            )}

                    </div>

                )}


                {/* ================================================= */}
                {/* ACTION BUTTONS */}
                {/* ================================================= */}

                <div
                    className="toolbar-actions"
                >

                    <button
                        type="button"
                        className="circle-btn"
                        title="Notifications"
                    >
                        <Bell
                            size={18}
                        />
                    </button>


                    <button
                        type="button"
                        className="circle-btn"
                        title="Messages"
                    >
                        <Mail
                            size={18}
                        />
                    </button>


                    <button
                        type="button"
                        className="circle-btn"
                        title="AI Assistant"
                    >
                        <Sparkles
                            size={18}
                        />
                    </button>

                </div>


                {/* ================================================= */}
                {/* USER CARD */}
                {/* ================================================= */}

                {showDoctor && (

                    <div
                        className="doctor-card"
                    >

                        <img
                            src="https://i.pravatar.cc/100?img=32"
                            alt="Doctor"
                        />


                        <div>

                            <h3>
                                Dr. Sarah Wilson
                            </h3>

                            <span>
                                Chief Cardiologist
                            </span>

                        </div>

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* PREMIUM STATISTICS */}
            {/* ================================================= */}

            {showStats && (

                <div
                    className="dashboard-stats"
                >


                    {/* ================================================= */}
                    {/* PATIENTS */}
                    {/* ================================================= */}

                    <div
                        className="stat-card blue"
                    >

                        <div
                            className="stat-header"
                        >

                            <span>
                                👨‍⚕️ Active Patients
                            </span>

                        </div>


                        <h2>
                            {stats?.patients ?? 0}
                        </h2>


                        <div
                            className="stat-footer"
                        >

                            <span
                                className="live-dot"
                            />

                            Live

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* HEALTH TWINS */}
                    {/* ================================================= */}

                    <div
                        className="stat-card green"
                    >

                        <div
                            className="stat-header"
                        >

                            <span>
                                🧬 Health Twins
                            </span>

                        </div>


                        <h2>
                            {stats?.healthTwins ?? 0}
                        </h2>


                        <div
                            className="stat-footer"
                        >

                            <span
                                className="live-dot"
                            />

                            Live

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* AI PREDICTIONS */}
                    {/* ================================================= */}

                    <div
                        className="stat-card purple"
                    >

                        <div
                            className="stat-header"
                        >

                            <span>
                                🤖 AI Predictions
                            </span>

                        </div>


                        <h2>
                            {stats?.predictions ?? 0}
                        </h2>


                        <div
                            className="stat-footer"
                        >

                            <span
                                className="live-dot"
                            />

                            Live

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* SYSTEM */}
                    {/* ================================================= */}

                    <div
                        className="stat-card orange"
                    >

                        <div
                            className="stat-header"
                        >

                            <span>
                                ⚡ System Uptime
                            </span>

                        </div>


                        <h2>
                            99.9%
                        </h2>


                        <div
                            className="stat-footer"
                        >

                            <span
                                className="live-dot"
                            />

                            Live

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}


export default DashboardHeader;