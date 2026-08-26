import {
    FaFlask,
    FaHeartbeat,
    FaTint,
    FaNotesMedical,
    FaDownload,
    FaCheckCircle,
} from "react-icons/fa";

const reports = [
    {
        test: "Complete Blood Count",
        result: "Normal",
        value: "13.8 g/dL",
        color: "#22c55e",
        icon: <FaTint />,
    },
    {
        test: "Blood Sugar",
        result: "Normal",
        value: "108 mg/dL",
        color: "#3b82f6",
        icon: <FaFlask />,
    },
    {
        test: "ECG",
        result: "Normal Sinus Rhythm",
        value: "76 BPM",
        color: "#ef4444",
        icon: <FaHeartbeat />,
    },
    {
        test: "Cholesterol",
        result: "Borderline",
        value: "205 mg/dL",
        color: "#f59e0b",
        icon: <FaNotesMedical />,
    },
];

function LabReports() {
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

                <div>
                    <h3 className="fw-bold mb-1">
                        🧪 Laboratory Reports
                    </h3>

                    <small style={{ color: "#cbd5e1" }}>
                        Latest pathology and diagnostic reports
                    </small>
                </div>

                <button className="btn btn-info">
                    <FaDownload className="me-2" />
                    View All Reports
                </button>

            </div>

            <div className="row g-4">

                {reports.map((report, index) => (

                    <div
                        key={index}
                        className="col-lg-3 col-md-6"
                    >

                        <div
                            style={{
                                background: "rgba(255,255,255,.08)",
                                borderRadius: 20,
                                padding: 20,
                                height: "100%",
                                borderTop: `4px solid ${report.color}`,
                                transition: "0.3s",
                            }}
                        >

                            <div className="d-flex justify-content-between align-items-center">

                                <div
                                    style={{
                                        width: 55,
                                        height: 55,
                                        borderRadius: "50%",
                                        background: report.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: 24,
                                    }}
                                >
                                    {report.icon}
                                </div>

                                <span
                                    className="badge"
                                    style={{
                                        background: report.color,
                                        color: "#fff",
                                    }}
                                >
                                    {report.result}
                                </span>

                            </div>

                            <h5 className="mt-4">
                                {report.test}
                            </h5>

                            <h2
                                className="fw-bold mt-2"
                                style={{ color: report.color }}
                            >
                                {report.value}
                            </h2>

                            <div
                                className="mt-4 d-flex align-items-center gap-2"
                            >
                                <FaCheckCircle color="#22c55e" />

                                <small
                                    style={{
                                        color: "#86efac",
                                    }}
                                >
                                    AI Verified Report
                                </small>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default LabReports;