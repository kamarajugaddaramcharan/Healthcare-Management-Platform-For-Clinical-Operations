import { useNavigate } from "react-router-dom";
import {
    Eye,
    Activity,
    FileText,
    History,
} from "lucide-react";

function ActionButton({
                          icon,
                          text,
                          color,
                          onClick,
                      }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                marginBottom: 14,
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
                background: color,
                transition: ".3s",
                boxShadow: "0 8px 18px rgba(0,0,0,.12)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {icon}
            <span>{text}</span>
        </button>
    );
}

function TwinActions({ twin }) {

    const navigate = useNavigate();

    const handleViewTwin = () => {
        console.log("handleViewTwin called for twin:", twin);
        if (!twin || !twin.patientId) {
            console.error("View Twin failed: patientId is missing in twin object", twin);
            alert("Error: Patient ID is missing for this Health Twin.");
            return;
        }
        navigate(`/healthtwin/${twin.patientId}`);
    };

    const handleLiveMonitor = () => {
        console.log("handleLiveMonitor called");
        navigate("/vitals");
    };

    const handleAIReport = () => {
        console.log("handleAIReport called");
        navigate("/predictions");
    };

    const handleHistory = () => {
        console.log("handleHistory called");
        navigate("/patient360");
    };

    return (

        <div
            style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 24,
                height: "100%",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(0,0,0,.08)",
            }}
        >

            <h5
                style={{
                    marginBottom: 20,
                    fontWeight: 700,
                }}
            >
                Quick Actions
            </h5>

            <ActionButton
                text="View Twin"
                color="linear-gradient(135deg,#2563eb,#3b82f6)"
                icon={<Eye size={20} />}
                onClick={handleViewTwin}
            />

            <ActionButton
                text="Live Monitor"
                color="linear-gradient(135deg,#22c55e,#16a34a)"
                icon={<Activity size={20} />}
                onClick={handleLiveMonitor}
            />

            <ActionButton
                text="AI Report"
                color="linear-gradient(135deg,#7c3aed,#8b5cf6)"
                icon={<FileText size={20} />}
                onClick={handleAIReport}
            />

            <ActionButton
                text="Medical History"
                color="linear-gradient(135deg,#f97316,#ea580c)"
                icon={<History size={20} />}
                onClick={handleHistory}
            />

        </div>

    );
}

export default TwinActions;