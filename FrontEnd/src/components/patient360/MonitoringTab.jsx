import { useEffect, useState } from "react";
import {
    Heart,
    Activity,
    Droplets,
    Thermometer,
    Play,
    Square,
    Wifi,
} from "lucide-react";

function MonitoringTab({ twin }) {

    const [streaming, setStreaming] = useState(false);

    const [vitals, setVitals] = useState({
        heartRate: twin?.heartRate ?? 72,
        bloodPressure: twin?.bloodPressure ?? "120/80",
        spo2: twin?.spo2 ?? 98,
        temperature: twin?.temperature ?? 98.6,
    });

    useEffect(() => {

        if (!streaming) return;

        const timer = setInterval(() => {

            setVitals(prev => ({
                ...prev,
                heartRate: 70 + Math.floor(Math.random() * 15),
                bloodPressure: `${115 + Math.floor(Math.random()*8)}/${78 + Math.floor(Math.random()*6)}`,
                spo2: 97 + Math.floor(Math.random() * 3),
                temperature: (98 + Math.random()).toFixed(1),
            }));

        }, 2000);

        return () => clearInterval(timer);

    }, [streaming]);

    return (

        <div>

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 30,
                    flexWrap: "wrap",
                    gap: 20,
                }}
            >

                <div>

                    <h2
                        style={{
                            color: "#0f172a",
                            marginBottom: 10,
                            fontWeight: "700",
                        }}
                    >
                        📡 Real-Time Monitoring
                    </h2>

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 18px",
                            borderRadius: 50,
                            background: streaming
                                ? "rgba(34,197,94,.15)"
                                : "rgba(239,68,68,.15)",
                            color: streaming
                                ? "#22c55e"
                                : "#ef4444",
                            fontWeight: 700,
                        }}
                    >

                        <span
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                background: streaming
                                    ? "#22c55e"
                                    : "#ef4444",
                                boxShadow: streaming
                                    ? "0 0 12px #22c55e"
                                    : "0 0 12px #ef4444",
                            }}
                        />

                        {streaming
                            ? "LIVE STREAMING"
                            : "OFFLINE"}

                    </div>

                </div>

                {/* Buttons */}

                <div
                    style={{
                        display: "flex",
                        gap: 15,
                    }}
                >

                    <button
                        onClick={() => setStreaming(true)}
                        disabled={streaming}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 22px",
                            border: "none",
                            borderRadius: 14,
                            background: streaming
                                ? "#334155"
                                : "linear-gradient(135deg,#22c55e,#16a34a)",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: streaming
                                ? "not-allowed"
                                : "pointer",
                            boxShadow: streaming
                                ? "none"
                                : "0 10px 25px rgba(34,197,94,.35)",
                            transition: ".3s",
                        }}
                    >
                        <Play size={18} />
                        Start Stream
                    </button>

                    <button
                        onClick={() => setStreaming(false)}
                        disabled={!streaming}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 22px",
                            border: "none",
                            borderRadius: 14,
                            background: !streaming
                                ? "#334155"
                                : "linear-gradient(135deg,#ef4444,#dc2626)",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: !streaming
                                ? "not-allowed"
                                : "pointer",
                            boxShadow: !streaming
                                ? "none"
                                : "0 10px 25px rgba(239,68,68,.35)",
                            transition: ".3s",
                        }}
                    >
                        <Square size={18} />
                        Stop Stream
                    </button>

                </div>

            </div>

            {/* Vital Cards */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
                    gap: 20,
                }}
            >

                <Card
                    title="Heart Rate"
                    icon={<Heart color="#ef4444" />}
                    value={`${vitals.heartRate} BPM`}
                    status="Normal"
                    color="#22c55e"
                />

                <Card
                    title="Blood Pressure"
                    icon={<Activity color="#3b82f6" />}
                    value={vitals.bloodPressure}
                    status="Stable"
                    color="#3b82f6"
                />

                <Card
                    title="SpO₂"
                    icon={<Droplets color="#22c55e" />}
                    value={`${vitals.spo2}%`}
                    status="Excellent"
                    color="#22c55e"
                />

                <Card
                    title="Temperature"
                    icon={<Thermometer color="#f97316" />}
                    value={`${vitals.temperature} °F`}
                    status="Normal"
                    color="#f97316"
                />

            </div>

            {/* Streaming Panel */}

            <div
                style={{
                    marginTop: 30,
                    background: "#ffffff",
                    borderRadius: 22,
                    padding: 28,
                    color: "#0f172a",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >

                    <div>

                        <h3
                            style={{
                                marginBottom: 15,
                                fontWeight: 700,
                                fontSize: 18,
                                color: "#0f172a"
                            }}
                        >
                            Streaming Status
                        </h3>

                        <h2
                            style={{
                                color: streaming
                                    ? "#16a34a"
                                    : "#ef4444",
                                marginBottom: 10,
                                fontWeight: 700
                            }}
                        >
                            {streaming
                                ? "🟢 LIVE"
                                : "🔴 OFFLINE"}
                        </h2>

                        <p
                            style={{
                                color: "#64748b",
                            }}
                        >
                            Ready for Kafka/WebSocket integration.
                        </p>

                    </div>

                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >

                        <Wifi
                            size={45}
                            color={
                                streaming
                                    ? "#16a34a"
                                    : "#ef4444"
                            }
                        />

                        <h4
                            style={{
                                marginTop: 10,
                                fontWeight: 700,
                                color: "#0f172a"
                            }}
                        >
                            {streaming
                                ? "Connected"
                                : "Disconnected"}
                        </h4>

                    </div>

                </div>

            </div>

        </div>

    );

}

function Card({
                  icon,
                  title,
                  value,
                  status,
                  color,
              }) {

    return (

        <div
            style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: 22,
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                transition: ".3s",
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                    }}
                >
                    {icon}
                    <strong style={{color:"#475569"}}>{title}</strong>
                </div>

                <span
                    style={{
                        background: color,
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: 30,
                        fontSize: 12,
                        fontWeight: 700,
                    }}
                >
                    {status}
                </span>

            </div>

            <h2
                style={{
                    marginTop: 25,
                    fontWeight: "700",
                    color: "#0f172a"
                }}
            >
                {value}
            </h2>

        </div>

    );

}

export default MonitoringTab;