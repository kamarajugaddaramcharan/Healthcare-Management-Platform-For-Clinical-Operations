import { CalendarDays, Clock, ClipboardList } from "lucide-react";

function UpcomingAppointments() {

    const appointments = [
        {
            patientId: "10",
            time: "09:00 AM",
            department: "Cardiology",
            status: "Confirmed",
        },
        {
            patientId: "11",
            time: "10:30 AM",
            department: "Neurology",
            status: "Pending",
        },
        {
            patientId: "12",
            time: "03:00 PM",
            department: "Orthopedics",
            status: "Confirmed",
        },
    ];

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 22,
                padding: 25,
                boxShadow: "0 15px 35px rgba(15,23,42,.08)",
                border: "1px solid #eef2ff",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <h2 style={{ margin: 0 }}>
                    <CalendarDays size={22} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Today's Appointments
                </h2>

                <span
                    style={{
                        color: "#2563eb",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    View All
                </span>
            </div>

            {appointments.map((appointment, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0",
                        borderBottom:
                            index !== appointments.length - 1
                                ? "1px solid #eef2ff"
                                : "none",
                    }}
                >
                    <div>
                        <h4
                            style={{
                                margin: 0,
                                color: "#1e293b",
                            }}
                        >
                            {appointment.patientId}
                        </h4>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginTop: 6,
                                color: "#64748b",
                                fontSize: 14,
                            }}
                        >
                            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <Clock size={14} />
                                {appointment.time}
                            </span>

                            <span>{appointment.department}</span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <span
                            style={{
                                background:
                                    appointment.status === "Confirmed"
                                        ? "#dcfce7"
                                        : "#fef3c7",
                                color:
                                    appointment.status === "Confirmed"
                                        ? "#15803d"
                                        : "#b45309",
                                padding: "6px 12px",
                                borderRadius: 20,
                                fontWeight: 600,
                                fontSize: 13,
                            }}
                        >
                            {appointment.status}
                        </span>

                        <button
                            title="View Appointment"
                            style={{
                                width: 40,
                                height: 40,
                                border: "none",
                                borderRadius: "50%",
                                background: "#eff6ff",
                                color: "#2563eb",
                                cursor: "pointer",
                            }}
                        >
                            <ClipboardList size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UpcomingAppointments;