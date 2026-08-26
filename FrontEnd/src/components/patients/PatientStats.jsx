import {
    Users,
    UserCheck,
    AlertTriangle,
    Calendar,
} from "lucide-react";

function PatientStats({ patients }) {

    const total = patients.length;
    const active = patients.length;
    const highRisk = Math.floor(total * 0.15);
    const today = Math.floor(total * 0.05);

    const cards = [
        {
            title: "Total Patients",
            value: total,
            icon: <Users size={22} />,
            color: "#2563eb",
        },
        {
            title: "Active Patients",
            value: active,
            icon: <UserCheck size={22} />,
            color: "#10b981",
        },
        {
            title: "High Risk",
            value: highRisk,
            icon: <AlertTriangle size={22} />,
            color: "#ef4444",
        },
        {
            title: "Today's Visits",
            value: today,
            icon: <Calendar size={22} />,
            color: "#f59e0b",
        },
    ];

    return (

        <div className="patient-stats">

            {cards.map((card) => (

                <div
                    key={card.title}
                    className="patient-stat-card"
                >

                    <div
                        className="patient-stat-top"
                    >

                        <div
                            className="patient-stat-icon"
                            style={{
                                background: card.color,
                            }}
                        >
                            {card.icon}
                        </div>

                        <span
                            className="patient-stat-title"
                        >
                            {card.title}
                        </span>

                    </div>

                    <h1
                        className="patient-stat-value"
                    >
                        {card.value}
                    </h1>

                </div>

            ))}

        </div>

    );

}

export default PatientStats;