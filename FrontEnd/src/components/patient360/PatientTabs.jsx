import {
    Activity,
    HeartPulse,
    Brain,
    ShieldCheck,
    FileText
} from "lucide-react";

function PatientTabs({ activeTab, setActiveTab }) {

    const tabs = [
        {
            id: "overview",
            label: "Health Twin Overview",
            icon: <Activity size={16} />
        },
        {
            id: "monitoring",
            label: "Real-time Monitoring",
            icon: <HeartPulse size={16} />
        },
        {
            id: "prediction",
            label: "AI Predictions",
            icon: <Brain size={16} />
        },
        {
            id: "hipaa",
            label: "HIPAA Audit Trail",
            icon: <ShieldCheck size={16} />
        },
        {
            id: "fhir",
            label: "FHIR Resource",
            icon: <FileText size={16} />
        }
    ];

    return (
        <div
            style={{
                display: "flex",
                gap: 15,
                marginTop: 20,
                marginBottom: 25,
                flexWrap: "wrap"
            }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        cursor: "pointer",
                        borderRadius: 12,
                        padding: "14px 22px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        background:
                            activeTab === tab.id
                                ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                                : "#ffffff",
                        border: activeTab === tab.id ? "1px solid transparent" : "1px solid #e2e8f0",
                        color:
                            activeTab === tab.id
                                ? "#ffffff"
                                : "#475569",
                        boxShadow:
                            activeTab === tab.id
                                ? "0 4px 12px rgba(37, 99, 235, 0.2)"
                                : "none"
                    }}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default PatientTabs;