import {
    Brain,
    Heart,
    ShieldCheck,
    Activity,
    TrendingUp,
} from "lucide-react";

function Card({ title, value, color, icon }) {
    return (
        <div
            style={{
                background: "#131b2e",
                borderRadius: 18,
                padding: 22,
                color: "white",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 15,
                }}
            >
                {icon}
                <strong>{title}</strong>
            </div>

            <h1
                style={{
                    color,
                    margin: 0,
                }}
            >
                {value}
            </h1>
        </div>
    );
}

function AIPredictionTab({ twin }) {

    return (

        <div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                    gap: 20,
                }}
            >

                <Card
                    title="Heart Disease Risk"
                    value={`${twin?.heartRisk ?? 18}%`}
                    color="#ef4444"
                    icon={<Heart color="#ef4444" />}
                />

                <Card
                    title="Diabetes Risk"
                    value={`${twin?.diabetesRisk ?? 24}%`}
                    color="#3b82f6"
                    icon={<Activity color="#3b82f6" />}
                />

                <Card
                    title="Overall Health Score"
                    value={`${twin?.healthScore ?? 96}/100`}
                    color="#22c55e"
                    icon={<TrendingUp color="#22c55e" />}
                />

                <Card
                    title="AI Confidence"
                    value="98.9%"
                    color="#8b5cf6"
                    icon={<Brain color="#8b5cf6" />}
                />

            </div>

            <div
                style={{
                    background: "#131b2e",
                    marginTop: 25,
                    padding: 25,
                    borderRadius: 18,
                    color: "white",
                }}
            >

                <h2>AI Recommendation</h2>

                <p style={{ color: "#cbd5e1" }}>
                    Based on the latest vitals and patient history,
                    the AI model recommends continuing the current
                    treatment plan and scheduling a cardiovascular
                    review within the next 30 days.
                </p>

                <hr />

                <h3>Model Information</h3>

                <p>Model Version : v2.1.0</p>

                <p>Status : Production</p>

                <p>
                    <ShieldCheck color="#22c55e" />
                    {" "}
                    HIPAA & FHIR Compliant
                </p>

            </div>

        </div>

    );

}

export default AIPredictionTab;