import { useEffect, useState } from "react";
import { getAllPatients } from "../../services/patientService";
import { User, Eye, ClipboardList } from "lucide-react";

function RecentPatients() {

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await getAllPatients();
            setPatients(data.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

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
                    marginBottom: 25,
                }}
            >

                <h2
                    style={{
                        margin: 0,
                        fontWeight: 700,
                    }}
                >
                    👨‍⚕️ Recent Patients
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

            {patients.map((patient) => (

                <div
                    key={patient.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 0",
                        borderBottom: "1px solid #eef2ff",
                    }}
                >

                    {/* Left */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                        }}
                    >

                        <div
                            style={{
                                width: 55,
                                height: 55,
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg,#2563eb,#06b6d4)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 18,
                            }}
                        >
                            {patient.name
                                ?.split(" ")
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase() || <User />}
                        </div>

                        <div>

                            <h5
                                style={{
                                    margin: 0,
                                    fontWeight: 700,
                                }}
                            >
                                {patient.name}
                            </h5>

                            <small
                                style={{
                                    color: "#64748b",
                                }}
                            >
                                Patient ID : {patient.patientId}
                            </small>

                            <br />

                            <small
                                style={{
                                    color: "#94a3b8",
                                }}
                            >
                                {patient.age} Years • {patient.gender}
                            </small>

                        </div>

                    </div>

                    {/* Right */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >

                        <span
                            style={{
                                background: "#dcfce7",
                                color: "#15803d",
                                padding: "6px 14px",
                                borderRadius: 30,
                                fontWeight: 600,
                                fontSize: 13,
                            }}
                        >
                            Stable
                        </span>

                        {/* View */}

                        <button
                            title="View Patient"
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: "50%",
                                border: "none",
                                background: "#eff6ff",
                                color: "#2563eb",
                                cursor: "pointer",
                                transition: ".3s",
                            }}
                        >
                            <Eye size={18} />
                        </button>

                        {/* Patient 360 */}

                        <button
                            title="Patient 360"
                            style={{
                                width: 42,
                                height: 42,
                                borderRadius: "50%",
                                border: "none",
                                background: "#f3f4f6",
                                color: "#4f46e5",
                                cursor: "pointer",
                                transition: ".3s",
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

export default RecentPatients;