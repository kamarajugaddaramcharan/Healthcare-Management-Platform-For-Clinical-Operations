import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    UserRound,
    HeartPulse,
    Activity,
    Brain,
    ClipboardList,
    FileText,
    ShieldCheck,
    Bell,
    LogOut,
} from "lucide-react";

import { logout } from "../../keycloak";

function PatientSidebar() {
    const menu = [
        {
            path: "/patient/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            path: "/patient/profile",
            label: "My Health",
            icon: UserRound,
        },
        {
            path: "/patient/health-twin",
            label: "My Health Twin",
            icon: HeartPulse,
        },
        {
            path: "/patient/vitals",
            label: "My Vitals",
            icon: Activity,
        },
        {
            path: "/patient/ai-results",
            label: "My AI Results",
            icon: Brain,
        },
        {
            path: "/patient/care-plan",
            label: "Care Plan",
            icon: ClipboardList,
        },
        {
            path: "/patient/fhir",
            label: "FHIR Resources",
            icon: FileText,
        },
        {
            path: "/patient/consent",
            label: "Consent",
            icon: ShieldCheck,
        },
        {
            path: "/patient/alerts",
            label: "Alerts",
            icon: Bell,
        },
    ];

    return (
        <aside
            style={{
                width: 260,
                minHeight: "100vh",
                background: "#172033",
                color: "#fff",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
            }}
        >

            {/* ================================================= */}
            {/* PLATFORM LOGO */}
            {/* ================================================= */}

            <div
                style={{
                    padding: "25px 24px",
                    borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                    }}
                >

                    {/* ICON */}

                    <div
                        style={{
                            width: 42,
                            height: 42,
                            minWidth: 42,
                            borderRadius: 12,
                            background:
                                "linear-gradient(135deg,#2563eb,#06b6d4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                        }}
                    >
                        🏥
                    </div>


                    {/* BRAND NAME */}

                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 18,
                                lineHeight: 1.3,
                                fontWeight: 800,
                                color: "#ffffff",
                            }}
                        >
                            Healthcare
                            <br />
                            Management
                        </h2>

                        <div
                            style={{
                                marginTop: 2,
                                fontSize: 12,
                                lineHeight: 1.4,
                                color: "#cbd5e1",
                            }}
                        >
                            Platform For Clinical
                            <br />
                            Operations
                        </div>

                        <div
                            style={{
                                marginTop: 5,
                                fontSize: 11,
                                color: "#94a3b8",
                            }}
                        >
                            Patient Portal
                        </div>
                    </div>

                </div>
            </div>


            {/* ================================================= */}
            {/* MENU */}
            {/* ================================================= */}

            <nav
                style={{
                    padding: "20px 14px",
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                padding: "13px 16px",
                                marginBottom: 7,
                                borderRadius: 12,
                                textDecoration: "none",
                                color: isActive
                                    ? "#ffffff"
                                    : "#cbd5e1",
                                background: isActive
                                    ? "#2563eb"
                                    : "transparent",
                                fontWeight: isActive
                                    ? 700
                                    : 500,
                                transition: ".2s",
                            })}
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>


            {/* ================================================= */}
            {/* LOGOUT */}
            {/* ================================================= */}

            <div
                style={{
                    padding: 18,
                    borderTop:
                        "1px solid rgba(255,255,255,.08)",
                }}
            >
                <button
                    type="button"
                    onClick={logout}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        padding: "13px",
                        border: "none",
                        borderRadius: 12,
                        background: "#ef4444",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

        </aside>
    );
}

export default PatientSidebar;