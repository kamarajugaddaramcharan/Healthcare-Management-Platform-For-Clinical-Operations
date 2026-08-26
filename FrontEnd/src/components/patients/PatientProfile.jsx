import { useEffect, useState } from "react";
import {
    UserRound,
    Calendar,
    HeartPulse,
    Stethoscope,
    ShieldCheck,
    MapPin,
    Activity,
    Hospital,
} from "lucide-react";

import { getCurrentPatient } from "../../services/patientPortalService";

function PatientProfile() {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPatient();
    }, []);

    const loadPatient = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCurrentPatient();

            setPatient(data);
        } catch (err) {
            console.error("Failed to load patient:", err);

            setError(
                err.message ||
                "Unable to load patient information."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h1
                    style={{
                        fontSize: 34,
                        fontWeight: 800,
                    }}
                >
                    My Health
                </h1>

                <p style={{ color: "#64748b" }}>
                    Loading your personal health information...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 30,
                    color: "#dc2626",
                }}
            >
                <h2>Unable to load patient</h2>

                <p>{error}</p>

                <button
                    onClick={loadPatient}
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: 10,
                        background: "#2563eb",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!patient) {
        return null;
    }

    return (
        <div>
            {/* HEADER */}

            <h1
                style={{
                    fontSize: 34,
                    fontWeight: 800,
                    marginBottom: 5,
                }}
            >
                My Health
            </h1>

            <p style={{ color: "#64748b" }}>
                Your personal health information
            </p>

            {/* PATIENT SUMMARY */}

            <section
                style={{
                    background: "#fff",
                    borderRadius: 22,
                    padding: 28,
                    marginTop: 25,
                    boxShadow:
                        "0 10px 30px rgba(15,23,42,.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 18,
                            background: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <UserRound size={32} />
                    </div>

                    <div>
                        <h2
                            style={{
                                margin: 0,
                            }}
                        >
                            Patient {patient.patientId}
                        </h2>

                        <p
                            style={{
                                margin: "5px 0 0",
                                color: "#64748b",
                            }}
                        >
                            Keycloak account:{" "}
                            {patient.keycloakUsername || "--"}
                        </p>
                    </div>
                </div>
            </section>

            {/* MAIN GRID */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(320px,1fr))",
                    gap: 22,
                    marginTop: 22,
                }}
            >
                {/* PERSONAL INFORMATION */}

                <section
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: 28,
                        boxShadow:
                            "0 10px 30px rgba(15,23,42,.06)",
                    }}
                >
                    <h2>
                        <UserRound
                            size={24}
                            style={{
                                verticalAlign: "middle",
                                marginRight: 8,
                            }}
                        />
                        Personal Information
                    </h2>

                    <Info
                        label="Patient ID"
                        value={patient.patientId}
                    />

                    <Info
                        label="Age"
                        value={
                            patient.age !== undefined
                                ? `${patient.age} years`
                                : "--"
                        }
                    />

                    <Info
                        label="Gender"
                        value={patient.gender}
                    />

                    <Info
                        label="Region"
                        value={patient.region}
                        icon={<MapPin size={16} />}
                    />

                    <Info
                        label="Smoking Status"
                        value={patient.smokingStatus}
                    />
                </section>

                {/* MEDICAL INFORMATION */}

                <section
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: 28,
                        boxShadow:
                            "0 10px 30px rgba(15,23,42,.06)",
                    }}
                >
                    <h2>
                        <HeartPulse
                            size={24}
                            style={{
                                verticalAlign: "middle",
                                marginRight: 8,
                            }}
                        />
                        Medical Information
                    </h2>

                    <Info
                        label="Medical Condition"
                        value={patient.medicalCondition}
                        icon={<Activity size={16} />}
                    />

                    <Info
                        label="Treatment"
                        value={patient.treatment}
                        icon={<Stethoscope size={16} />}
                    />

                    <Info
                        label="Outcome"
                        value={patient.outcome}
                    />

                    <Info
                        label="Admission Type"
                        value={patient.admissionType}
                    />

                    <Info
                        label="Length of Stay"
                        value={
                            patient.lengthOfStay !== undefined
                                ? `${patient.lengthOfStay} days`
                                : "--"
                        }
                        icon={<Calendar size={16} />}
                    />
                </section>

                {/* HOSPITAL INFORMATION */}

                <section
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: 28,
                        boxShadow:
                            "0 10px 30px rgba(15,23,42,.06)",
                    }}
                >
                    <h2>
                        <Hospital
                            size={24}
                            style={{
                                verticalAlign: "middle",
                                marginRight: 8,
                            }}
                        />
                        Hospital Information
                    </h2>

                    <Info
                        label="Hospital ID"
                        value={patient.hospitalId}
                        icon={<Hospital size={16} />}
                    />

                    <Info
                        label="Doctor ID"
                        value={patient.doctorId}
                    />

                    <Info
                        label="Doctor"
                        value={patient.doctorName}
                    />

                    <Info
                        label="Insurance"
                        value={patient.insuranceType}
                        icon={<ShieldCheck size={16} />}
                    />
                </section>

                {/* ACCOUNT INFORMATION */}

                <section
                    style={{
                        background: "#fff",
                        borderRadius: 22,
                        padding: 28,
                        boxShadow:
                            "0 10px 30px rgba(15,23,42,.06)",
                    }}
                >
                    <h2>Account Information</h2>

                    <Info
                        label="Username"
                        value={
                            patient.keycloakUsername || "--"
                        }
                    />

                    <Info
                        label="Keycloak ID"
                        value={
                            patient.keycloakId || "--"
                        }
                    />

                    <Info
                        label="Patient ID"
                        value={patient.patientId || "--"}
                    />
                </section>
            </div>
        </div>
    );
}

function Info({ label, value, icon }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px 0",
                borderBottom: "1px solid #eef2f7",
                gap: 20,
            }}
        >
            <span
                style={{
                    color: "#64748b",
                    display: "flex",
                    gap: 7,
                    alignItems: "center",
                }}
            >
                {icon}
                {label}
            </span>

            <strong
                style={{
                    textAlign: "right",
                }}
            >
                {value ?? "--"}
            </strong>
        </div>
    );
}

export default PatientProfile;