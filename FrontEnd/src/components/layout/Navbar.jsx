import {
    isAdmin,
    isDoctor,
    isPatient,
    getDoctorName,
    logout
} from "../../keycloak";

function Navbar() {

    const admin = isAdmin();
    const doctor = isDoctor();
    const patient = isPatient();

    // =====================================================
    // USER NAME
    // =====================================================

    let userName = "User";

    if (doctor) {

        // Doctor portal is currently Sarah Wilson / D001
        userName = getDoctorName();

    } else if (admin) {

        userName = "Admin";

    } else if (patient) {

        userName = "Patient";

    }


    // =====================================================
    // ROLE LABEL
    // =====================================================

    const getRoleLabel = () => {

        if (admin) {
            return "Administrator";
        }

        if (doctor) {
            return "Doctor";
        }

        if (patient) {
            return "Patient";
        }

        return "User";
    };


    // =====================================================
    // AVATAR
    // =====================================================

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

        return "US";
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <header
            style={{
                height: "80px",

                background: "#ffffff",

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                padding:
                    "0 35px",

                boxShadow:
                    "0 5px 15px rgba(0,0,0,.05)",

                borderBottom:
                    "1px solid #EEF2F7",

                position:
                    "relative",

                zIndex: 10
            }}
        >

            {/* =================================================
                LEFT
            ================================================= */}

            <div>

                <h2
                    style={{
                        margin: 0,

                        color:
                            "#0F172A",

                        fontSize:
                            "22px",

                        fontWeight:
                            800,

                        lineHeight:
                            "1.1"
                    }}
                >

                    Healthcare Management Platform

                </h2>


                <small
                    style={{
                        color:
                            "#64748B",

                        fontSize:
                            "13px"
                    }}
                >

                    For Clinical Operations

                </small>

            </div>


            {/* =================================================
                RIGHT
            ================================================= */}

            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        "14px"
                }}
            >

                {/* =================================================
                    USER INFORMATION
                ================================================= */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "10px"
                    }}
                >

                    {/* =================================================
                        AVATAR
                    ================================================= */}

                    <div
                        style={{
                            width:
                                "42px",

                            height:
                                "42px",

                            borderRadius:
                                "50%",

                            background:
                                "#2563EB",

                            color:
                                "#ffffff",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            fontWeight:
                                800,

                            fontSize:
                                "13px"
                        }}
                    >

                        {getInitials()}

                    </div>


                    {/* =================================================
                        NAME
                    ================================================= */}

                    <div
                        style={{
                            display:
                                "flex",

                            flexDirection:
                                "column"
                        }}
                    >

                        <strong
                            style={{
                                color:
                                    "#1E293B",

                                fontSize:
                                    "14px"
                            }}
                        >

                            {userName}

                        </strong>


                        <span
                            style={{
                                color:
                                    "#64748B",

                                fontSize:
                                    "12px"
                            }}
                        >

                            {getRoleLabel()}

                        </span>

                    </div>

                </div>


                {/* =================================================
                    LOGOUT
                ================================================= */}

                <button
                    type="button"

                    onClick={
                        logout
                    }

                    style={{
                        background:
                            "#2563EB",

                        color:
                            "#ffffff",

                        padding:
                            "11px 20px",

                        borderRadius:
                            "10px",

                        border:
                            "none",

                        fontWeight:
                            700,

                        cursor:
                            "pointer",

                        transition:
                            "0.2s"
                    }}

                    onMouseEnter={(
                        event
                    ) => {

                        event.currentTarget.style.background =
                            "#1D4ED8";

                    }}

                    onMouseLeave={(
                        event
                    ) => {

                        event.currentTarget.style.background =
                            "#2563EB";

                    }}
                >

                    Logout

                </button>

            </div>

        </header>

    );
}

export default Navbar;