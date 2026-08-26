import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import {
    getUserName,
    getUsername,
    logout,
} from "../../keycloak";

function PatientNavbar() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const name =
            getUserName() ||
            getUsername() ||
            "Patient";

        setUserName(name);
    }, []);

    return (
        <header
            style={{
                height: 80,
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 32px",
                borderBottom: "1px solid #e5e7eb",
                boxShadow:
                    "0 4px 15px rgba(15,23,42,0.05)",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}
        >

            {/* ================================================= */}
            {/* LEFT - PLATFORM BRANDING */}
            {/* ================================================= */}

            <div>
                <h2
                    style={{
                        margin: 0,
                        color: "#172033",
                        fontSize: 22,
                        fontWeight: 800,
                        lineHeight: 1.15,
                    }}
                >
                    Healthcare Management Platform
                </h2>

                <span
                    style={{
                        color: "#64748b",
                        fontSize: 13,
                    }}
                >
                    For Clinical Operations • Patient Portal
                </span>
            </div>


            {/* ================================================= */}
            {/* RIGHT */}
            {/* ================================================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                }}
            >

                {/* USER */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >

                    {/* AVATAR */}

                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background:
                                "linear-gradient(135deg,#2563eb,#06b6d4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontWeight: 800,
                        }}
                    >
                        {userName
                            .substring(0, 2)
                            .toUpperCase()}
                    </div>


                    {/* USER NAME */}

                    <div>
                        <strong
                            style={{
                                display: "block",
                                color: "#172033",
                            }}
                        >
                            {userName}
                        </strong>

                        <span
                            style={{
                                color: "#64748b",
                                fontSize: 13,
                            }}
                        >
                            Patient
                        </span>
                    </div>

                </div>


                {/* ================================================= */}
                {/* LOGOUT */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={logout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "none",
                        borderRadius: 12,
                        padding: "11px 18px",
                        background: "#2563eb",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    <LogOut size={17} />
                    Logout
                </button>

            </div>

        </header>
    );
}

export default PatientNavbar;