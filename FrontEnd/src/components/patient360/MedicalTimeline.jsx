import {
    FaUserMd,
    FaNotesMedical,
    FaPills,
    FaProcedures,
    FaHistory,
    FaCheckCircle,
} from "react-icons/fa";

const timeline = [
    {
        date: "21 Jul 2026",
        title: "AI Health Prediction",
        icon: <FaNotesMedical />,
        description: "AI model predicted low cardiovascular risk.",
        color: "#2563eb",
    },
    {
        date: "20 Jul 2026",
        title: "Doctor Consultation",
        icon: <FaUserMd />,
        description: "Routine health check completed successfully.",
        color: "#16a34a",
    },
    {
        date: "18 Jul 2026",
        title: "Medication Updated",
        icon: <FaPills />,
        description: "Blood pressure medication dosage adjusted.",
        color: "#f59e0b",
    },
    {
        date: "15 Jul 2026",
        title: "Hospital Admission",
        icon: <FaProcedures />,
        description: "Patient admitted for observation.",
        color: "#dc2626",
    },
];

function MedicalTimeline() {
    return (
        <div
            style={{
                marginTop: 24,
                padding: 24,
                borderRadius: 24,
                background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
                color: "#fff",
                boxShadow: "0 20px 40px rgba(0,0,0,.30)",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div className="d-flex align-items-center gap-3">

                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "rgba(59,130,246,.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 26,
                        }}
                    >
                        <FaHistory />
                    </div>

                    <div>
                        <h3 className="mb-1 fw-bold">
                            Medical History Timeline
                        </h3>

                        <small style={{ color: "#cbd5e1" }}>
                            Patient medical events and clinical history
                        </small>
                    </div>

                </div>

                <span className="badge bg-success px-3 py-2">
                    4 Records
                </span>

            </div>

            {timeline.map((item, index) => (

                <div
                    key={index}
                    className="d-flex position-relative"
                    style={{ marginBottom: 28 }}
                >

                    {/* Timeline */}

                    <div
                        style={{
                            width: 70,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >

                        <div
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                background: item.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 22,
                                boxShadow: `0 0 20px ${item.color}`,
                            }}
                        >
                            {item.icon}
                        </div>

                        {index !== timeline.length - 1 && (

                            <div
                                style={{
                                    width: 3,
                                    flex: 1,
                                    background:
                                        "linear-gradient(#3b82f6,#1e40af)",
                                    marginTop: 8,
                                    minHeight: 70,
                                    borderRadius: 10,
                                }}
                            />

                        )}

                    </div>

                    {/* Card */}

                    <div
                        style={{
                            flex: 1,
                            background: "rgba(255,255,255,.08)",
                            borderRadius: 18,
                            padding: 18,
                            marginLeft: 12,
                        }}
                    >

                        <div className="d-flex justify-content-between align-items-center">

                            <small
                                style={{
                                    color: "#93c5fd",
                                    fontWeight: 600,
                                }}
                            >
                                {item.date}
                            </small>

                            <span
                                className="badge"
                                style={{
                                    background: item.color,
                                    color: "#fff",
                                }}
                            >
                                Completed
                            </span>

                        </div>

                        <h5 className="mt-3 mb-2">
                            {item.title}
                        </h5>

                        <p
                            className="mb-3"
                            style={{
                                color: "#cbd5e1",
                            }}
                        >
                            {item.description}
                        </p>

                        <div
                            className="d-flex align-items-center gap-2"
                        >
                            <FaCheckCircle color="#22c55e" />

                            <small
                                style={{
                                    color: "#86efac",
                                }}
                            >
                                Verified Medical Event
                            </small>

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default MedicalTimeline;