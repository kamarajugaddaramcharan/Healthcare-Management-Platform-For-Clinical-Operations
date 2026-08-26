import {
    Users,
    HeartPulse,
    Brain,
    ShieldCheck,
    Heart,
    Activity,
} from "lucide-react";

import "./SummaryCard.css";

function SummaryCard({ title, value, color }) {

    const getIcon = () => {

        switch (title) {

            case "Patients":
                return <Users size={30} />;

            case "Health Twins":
                return <HeartPulse size={30} />;

            case "AI Predictions":
                return <Brain size={30} />;

            case "System Status":
                return <ShieldCheck size={30} />;

            case "Heart Disease":
                return <Heart size={30} />;

            case "Diabetes Risk":
                return <Activity size={30} />;

            default:
                return <Activity size={30} />;

        }

    };

    const getTrend = () => {

        switch (title) {

            case "Patients":
                return "+18 Today";

            case "Health Twins":
                return "100% Synced";

            case "AI Predictions":
                return "+32 Today";

            case "System Status":
                return "Healthy";

            case "Heart Disease":
                return "AI Analysis";

            case "Diabetes Risk":
                return "Updated Live";

            default:
                return "";

        }

    };

    return (

        <div className="summary-card">

            <div className="summary-top">

                <div
                    className="summary-icon"
                    style={{
                        background: `${color}20`,
                        color: color,
                    }}
                >
                    {getIcon()}
                </div>

                <span className="summary-live">
                    ● Live
                </span>

            </div>

            <div className="summary-body">

                <h5>{title}</h5>

                <h1
                    style={{
                        color,
                    }}
                >
                    {value}
                </h1>

                <p>{getTrend()}</p>

            </div>

        </div>

    );

}

export default SummaryCard;