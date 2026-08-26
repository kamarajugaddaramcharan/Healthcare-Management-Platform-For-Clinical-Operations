import {
    FaDatabase,
    FaUser,
    FaHeartbeat,
    FaNotesMedical,
    FaPills,
    FaFlask,
    FaExchangeAlt,
    FaCheckCircle,
    FaServer,
} from "react-icons/fa";

const resources = [
    {
        name: "Patient",
        icon: <FaUser />,
        records: 1,
        status: "Synced",
        color: "#3b82f6",
    },
    {
        name: "Observation",
        icon: <FaHeartbeat />,
        records: 48,
        status: "Synced",
        color: "#22c55e",
    },
    {
        name: "Medication",
        icon: <FaPills />,
        records: 12,
        status: "Synced",
        color: "#f59e0b",
    },
    {
        name: "Condition",
        icon: <FaNotesMedical />,
        records: 8,
        status: "Synced",
        color: "#ef4444",
    },
    {
        name: "Lab Reports",
        icon: <FaFlask />,
        records: 25,
        status: "Synced",
        color: "#8b5cf6",
    },
];

function FHIRResources() {
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
                            background: "rgba(59,130,246,.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                        }}
                    >
                        <FaDatabase />
                    </div>

                    <div>

                        <h3 className="fw-bold mb-1">
                            HL7 FHIR Resources
                        </h3>

                        <small style={{ color: "#cbd5e1" }}>
                            Healthcare interoperability and resource synchronization
                        </small>

                    </div>

                </div>

                <span className="badge bg-success px-3 py-2">
                    FHIR R4 Compliant
                </span>

            </div>

            <div className="row g-4">

                {resources.map((resource, index) => (

                    <div
                        key={index}
                        className="col-lg-4 col-md-6"
                    >

                        <div
                            style={{
                                background: "rgba(255,255,255,.08)",
                                borderRadius: 20,
                                padding: 20,
                                height: "100%",
                                borderTop: `5px solid ${resource.color}`,
                            }}
                        >

                            <div className="d-flex justify-content-between align-items-center">

                                <div
                                    style={{
                                        width: 55,
                                        height: 55,
                                        borderRadius: "50%",
                                        background: resource.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 22,
                                    }}
                                >
                                    {resource.icon}
                                </div>

                                <FaCheckCircle color="#22c55e" size={24} />

                            </div>

                            <h5 className="mt-4 fw-bold">
                                {resource.name}
                            </h5>

                            <h2
                                className="fw-bold mt-3"
                                style={{ color: resource.color }}
                            >
                                {resource.records}
                            </h2>

                            <small style={{ color: "#cbd5e1" }}>
                                Available Resources
                            </small>

                            <hr
                                style={{
                                    borderColor: "rgba(255,255,255,.15)",
                                }}
                            />

                            <div className="d-flex justify-content-between align-items-center">

                                <span
                                    className="badge"
                                    style={{
                                        background: resource.color,
                                        color: "#fff",
                                    }}
                                >
                                    {resource.status}
                                </span>

                                <FaExchangeAlt
                                    color="#60a5fa"
                                    size={18}
                                />

                            </div>

                        </div>

                    </div>

                ))}

            </div>

            <div
                style={{
                    marginTop: 30,
                    background: "rgba(34,197,94,.12)",
                    border: "1px solid rgba(34,197,94,.35)",
                    borderRadius: 20,
                    padding: 20,
                }}
            >

                <div className="d-flex justify-content-between align-items-center">

                    <div className="d-flex align-items-center gap-3">

                        <FaServer
                            size={28}
                            color="#22c55e"
                        />

                        <div>

                            <h5 className="mb-1">
                                FHIR Server Status
                            </h5>

                            <small style={{ color: "#cbd5e1" }}>
                                All healthcare resources are synchronized successfully.
                            </small>

                        </div>

                    </div>

                    <span className="badge bg-success px-3 py-2">
                        Online
                    </span>

                </div>

            </div>

        </div>
    );
}

export default FHIRResources;