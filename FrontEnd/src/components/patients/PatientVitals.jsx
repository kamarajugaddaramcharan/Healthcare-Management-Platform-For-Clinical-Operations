import {
    Heart,
    Activity,
    Droplets,
    Thermometer,
} from "lucide-react";

function PatientVitals() {
    const vitals = [
        {
            title: "Heart Rate",
            value: "76 BPM",
            icon: <Heart />,
            color: "#ef4444",
        },
        {
            title: "Blood Pressure",
            value: "116/77 mmHg",
            icon: <Activity />,
            color: "#2563eb",
        },
        {
            title: "SpO₂",
            value: "98%",
            icon: <Droplets />,
            color: "#16a34a",
        },
        {
            title: "Temperature",
            value: "36.8°C",
            icon: <Thermometer />,
            color: "#f97316",
        },
    ];

    return (
        <div>
            <h1>My Vitals</h1>

            <p style={{ color: "#64748b" }}>
                Your latest recorded vital signs
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(230px,1fr))",
                    gap: 20,
                    marginTop: 25,
                }}
            >
                {vitals.map((vital) => (
                    <div
                        key={vital.title}
                        style={{
                            background: "#fff",
                            borderRadius: 20,
                            padding: 25,
                            border:
                                "1px solid #e5e7eb",
                        }}
                    >
                        <div
                            style={{
                                color: vital.color,
                            }}
                        >
                            {vital.icon}
                        </div>

                        <p
                            style={{
                                color: "#64748b",
                                marginTop: 20,
                            }}
                        >
                            {vital.title}
                        </p>

                        <h2>{vital.value}</h2>

                        <span
                            style={{
                                background:
                                    "#dcfce7",
                                color:
                                    "#15803d",
                                padding:
                                    "6px 12px",
                                borderRadius:
                                    999,
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            Normal
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PatientVitals;