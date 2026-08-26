import {
    UserPlus,
    Brain,
    Activity,
    ShieldCheck,
    Clock,
} from "lucide-react";

function ActivityTimeline() {

    const activities = [
        {
            title: "New Patient Registered",
            time: "09:15 AM",
            icon: <UserPlus size={18} />,
            color: "#2563eb",
            bg: "#dbeafe",
        },
        {
            title: "AI Prediction Generated",
            time: "10:05 AM",
            icon: <Brain size={18} />,
            color: "#7c3aed",
            bg: "#ede9fe",
        },
        {
            title: "Health Twin Updated",
            time: "11:40 AM",
            icon: <Activity size={18} />,
            color: "#16a34a",
            bg: "#dcfce7",
        },
        {
            title: "Consent Approved",
            time: "01:20 PM",
            icon: <ShieldCheck size={18} />,
            color: "#ea580c",
            bg: "#ffedd5",
        },
    ];

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
                    marginBottom: 20,
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontWeight: 700,
                    }}
                >
                    📈 Activity Timeline
                </h2>

                <span
                    style={{
                        color: "#2563eb",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Live
                </span>
            </div>

            {activities.map((activity, index) => (

                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        padding: "16px 0",
                        borderBottom:
                            index !== activities.length - 1
                                ? "1px solid #eef2ff"
                                : "none",
                    }}
                >

                    <div
                        style={{
                            width: 45,
                            height: 45,
                            borderRadius: "50%",
                            background: activity.bg,
                            color: activity.color,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {activity.icon}
                    </div>

                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 600,
                                color: "#1e293b",
                            }}
                        >
                            {activity.title}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 4,
                                color: "#64748b",
                                fontSize: 13,
                            }}
                        >
                            <Clock size={14} />
                            {activity.time}
                        </div>
                    </div>

                    <span
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#22c55e",
                        }}
                    />
                </div>

            ))}

        </div>

    );

}

export default ActivityTimeline;