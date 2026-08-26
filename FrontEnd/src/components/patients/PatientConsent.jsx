import {
    ShieldCheck,
    CheckCircle,
} from "lucide-react";

function PatientConsent() {
    return (
        <div>
            <h1>Consent Management</h1>

            <p style={{ color: "#64748b" }}>
                Manage your healthcare data permissions
            </p>

            <div
                style={{
                    marginTop: 25,
                    background: "#fff",
                    borderRadius: 22,
                    padding: 30,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                    }}
                >
                    <ShieldCheck
                        size={38}
                        color="#2563eb"
                    />

                    <div>
                        <h2
                            style={{
                                margin: 0,
                            }}
                        >
                            Healthcare Data Consent
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#64748b",
                            }}
                        >
                            Your current consent
                            status
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        marginTop: 25,
                        padding: 20,
                        background: "#f0fdf4",
                        border:
                            "1px solid #bbf7d0",
                        borderRadius: 16,
                        color: "#166534",
                    }}
                >
                    <CheckCircle
                        size={20}
                        style={{
                            verticalAlign:
                                "middle",
                            marginRight: 8,
                        }}
                    />

                    Consent is active
                </div>

                <div
                    style={{
                        marginTop: 20,
                        display: "grid",
                        gap: 12,
                    }}
                >
                    <ConsentRow text="Healthcare data processing" />
                    <ConsentRow text="AI health analysis" />
                    <ConsentRow text="FHIR interoperability" />
                    <ConsentRow text="Doctor access" />
                </div>
            </div>
        </div>
    );
}

function ConsentRow({ text }) {
    return (
        <div
            style={{
                padding: 16,
                borderRadius: 12,
                background: "#f8fafc",
                display: "flex",
                justifyContent:
                    "space-between",
            }}
        >
            <span>{text}</span>

            <strong
                style={{
                    color: "#16a34a",
                }}
            >
                Granted
            </strong>
        </div>
    );
}

export default PatientConsent;