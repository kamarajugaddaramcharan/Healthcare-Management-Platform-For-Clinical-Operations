import { useEffect, useState } from "react";
import {
    Activity,
    Heart,
    Droplets,
    Thermometer,
    Brain,
} from "lucide-react";

function OverviewTab({ twin }) {

    const [liveVitals, setLiveVitals] = useState({
        heartRate: twin?.heartRate ?? 72,
        bloodPressure: twin?.bloodPressure ?? "120/80",
        spo2: twin?.spo2 ?? 98,
        bloodSugar: twin?.bloodSugar ?? 95,
        temperature: twin?.temperature ?? 98.6,
        bmi: twin?.bmi ?? 22.9,
    });

    useEffect(() => {

        setLiveVitals({
            heartRate: twin?.heartRate ?? 72,
            bloodPressure: twin?.bloodPressure ?? "120/80",
            spo2: twin?.spo2 ?? 98,
            bloodSugar: twin?.bloodSugar ?? 95,
            temperature: twin?.temperature ?? 98.6,
            bmi: twin?.bmi ?? 22.9,
        });

    }, [twin]);

    useEffect(() => {

        const interval = setInterval(() => {

            setLiveVitals({

                heartRate: Math.floor(Math.random() * 25) + 65,

                bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,

                spo2: Math.floor(Math.random() * 5) + 95,

                bloodSugar: Math.floor(Math.random() * 40) + 80,

                temperature: (97 + Math.random() * 3).toFixed(1),

                bmi: (21 + Math.random() * 3).toFixed(1),

            });

        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Holographic Console */}
            <div
                style={{
                    width: "100%",
                    height: "540px",
                    background: "radial-gradient(circle, #0a1128 0%, #020617 100%)",
                    backgroundImage: "radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    borderRadius: 24,
                    border: "1px solid #1e3a8a",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(0, 240, 255, 0.08)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {/* Tech Bracket Corners */}
                <div style={{ position: "absolute", top: 15, left: 15, width: 20, height: 20, borderTop: "2px solid #00f0ff", borderLeft: "2px solid #00f0ff" }} />
                <div style={{ position: "absolute", top: 15, right: 15, width: 20, height: 20, borderTop: "2px solid #00f0ff", borderRight: "2px solid #00f0ff" }} />
                <div style={{ position: "absolute", bottom: 15, left: 15, width: 20, height: 20, borderBottom: "2px solid #00f0ff", borderLeft: "2px solid #00f0ff" }} />
                <div style={{ position: "absolute", bottom: 15, right: 15, width: 20, height: 20, borderBottom: "2px solid #00f0ff", borderRight: "2px solid #00f0ff" }} />

                {/* Laser Scanning Line */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
                        boxShadow: "0 0 15px #00f0ff",
                        zIndex: 5,
                        animation: "scanLineAnim 5s linear infinite"
                    }}
                />

                {/* Concentric Rotating floor rings */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "30px",
                        width: "280px",
                        height: "80px",
                        transform: "rotateX(75deg)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 3
                    }}
                >
                    {/* Ring 1 - Solid Blue Outer */}
                    <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "2px solid rgba(0, 240, 255, 0.4)", boxShadow: "0 0 30px rgba(0, 240, 255, 0.3)" }} />
                    {/* Ring 2 - Dashed Red Inner */}
                    <div style={{ position: "absolute", width: "85%", height: "85%", borderRadius: "50%", border: "2px dashed rgba(244, 63, 94, 0.6)", animation: "rotateHUDCounter 10s linear infinite" }} />
                    {/* Ring 3 - Double Cyan Inner */}
                    <div style={{ position: "absolute", width: "70%", height: "70%", borderRadius: "50%", border: "1px double rgba(0, 240, 255, 0.5)", animation: "rotateHUD 15s linear infinite" }} />
                </div>

                {/* Left Side HUD panels */}
                <div style={{ position: "absolute", left: 30, top: 40, bottom: 40, width: 230, display: "flex", flexDirection: "column", gap: 20, zIndex: 6 }}>
                    
                    {/* Heart Rate Panel */}
                    <div className="hud-panel">
                        <div className="hud-header">
                            <Heart size={14} color="#f43f5e" />
                            <span>Heart Rate</span>
                        </div>
                        <div className="hud-value" style={{ color: "#f43f5e" }}>
                            {liveVitals.heartRate} <small>Bpm</small>
                        </div>
                        {/* Cardiac Waveform ECG SVG */}
                        <svg className="hud-svg" width="100%" height="40" viewBox="0 0 100 40">
                            <path d="M0,20 L25,20 L30,10 L35,30 L40,0 L45,40 L50,20 L60,20 L65,10 L70,30 L75,0 L80,40 L85,20 L100,20" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* Oxygen Saturation Panel */}
                    <div className="hud-panel">
                        <div className="hud-header">
                            <Droplets size={14} color="#00f0ff" />
                            <span>Oxygen Saturation</span>
                        </div>
                        <div className="hud-value" style={{ color: "#00f0ff" }}>
                            {liveVitals.spo2}% <small>SpO₂</small>
                        </div>
                        {/* SpO2 wave area SVG */}
                        <svg className="hud-svg" width="100%" height="40" viewBox="0 0 100 40">
                            <path d="M0,25 Q15,10 30,25 T60,25 T90,25" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
                            <path d="M0,25 Q15,10 30,25 T60,25 T90,25 L100,40 L0,40 Z" fill="rgba(0, 240, 255, 0.1)" stroke="none" />
                        </svg>
                    </div>

                    {/* Temperature */}
                    <div className="hud-panel">
                        <div className="hud-header">
                            <Thermometer size={14} color="#fb923c" />
                            <span>Temperature</span>
                        </div>
                        <div className="hud-value" style={{ color: "#fb923c" }}>
                            {liveVitals.temperature} <small>°F</small>
                        </div>
                    </div>
                </div>

                {/* CENTER SECTION - Rotating Body Silhouette */}
                <div
                    style={{
                        fontSize: "160px",
                        zIndex: 4,
                        animation: "rotateAvatarY 12s linear infinite",
                        userSelect: "none",
                        transformStyle: "preserve-3d",
                        color: "#00f0ff",
                        filter: "drop-shadow(0 0 20px rgba(0, 240, 255, 0.85))",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "-20px"
                    }}
                >
                    🧍
                </div>

                {/* Right Side HUD panels */}
                <div style={{ position: "absolute", right: 30, top: 40, bottom: 40, width: 230, display: "flex", flexDirection: "column", gap: 20, zIndex: 6, alignItems: "flex-end" }}>
                    
                    {/* Cardiovascular Mapping */}
                    <div className="hud-panel text-end">
                        <div className="hud-header" style={{ justifyContent: "flex-end" }}>
                            <span>Cardiovascular Mapping</span>
                            <Activity size={14} color="#22c55e" />
                        </div>
                        <div className="hud-value" style={{ color: "#22c55e" }}>
                            {liveVitals.bloodPressure} <small>mmHg</small>
                        </div>
                        {/* Dual wave chart */}
                        <svg className="hud-svg" width="100%" height="40" viewBox="0 0 100 40">
                            <path d="M0,15 Q25,35 50,15 T100,15" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                            <path d="M0,25 Q25,5 50,25 T100,25" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" />
                        </svg>
                    </div>

                    {/* EMG Data */}
                    <div className="hud-panel text-end">
                        <div className="hud-header" style={{ justifyContent: "flex-end" }}>
                            <span>EMG Data</span>
                            <Brain size={14} color="#a855f7" />
                        </div>
                        <div className="hud-value" style={{ color: "#a855f7" }}>
                            {liveVitals.bmi} <small>BMI</small>
                        </div>
                    </div>

                    {/* Real-time sparkline graph */}
                    <div className="hud-panel text-end">
                        <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                            Live Telemetry
                        </div>
                        <svg className="hud-svg" width="100%" height="45" style={{ marginTop: 8 }}>
                            <path d="M0,25 L10,25 L15,5 L20,35 L25,10 L30,40 L35,25 L50,25 L55,15 L60,30 L65,5 L70,40 L75,25 L100,25" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000">
                                <animate attributeName="stroke-dashoffset" values="1000;0" dur="4s" repeatCount="indefinite" />
                            </path>
                        </svg>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                            <span style={{ fontSize: 10, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>
                                {twin?.height || 182} cm
                            </span>
                            <span style={{ fontSize: 10, color: "#3b82f6", background: "rgba(59,130,246,0.1)", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>
                                {twin?.weight || 76} kg
                            </span>
                        </div>
                    </div>
                </div>

                {/* CSS styles inside React for sci-fi layout */}
                <style dangerouslySetInnerHTML={{ __html: `
                    .hud-panel {
                        background: rgba(2, 6, 23, 0.72);
                        backdrop-filter: blur(8px);
                        border: 1px solid rgba(0, 240, 255, 0.15);
                        border-radius: 12px;
                        padding: 12px 14px;
                        width: 100%;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                        transition: all 0.3s ease;
                    }
                    .hud-panel:hover {
                        border-color: rgba(0, 240, 255, 0.4);
                        box-shadow: 0 4px 25px rgba(0, 240, 255, 0.15);
                        transform: translateY(-2px);
                    }
                    .hud-header {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 11px;
                        font-weight: 700;
                        color: #64748b;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .hud-value {
                        font-size: 20px;
                        font-weight: 800;
                        margin-top: 5px;
                        letter-spacing: -0.5px;
                    }
                    .hud-value small {
                        font-size: 11px;
                        color: #64748b;
                        font-weight: 500;
                    }
                    .hud-svg {
                        margin-top: 8px;
                        display: block;
                        overflow: visible;
                    }
                    @keyframes scanLineAnim {
                        0% { top: 0%; opacity: 0; }
                        5% { opacity: 1; }
                        95% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    @keyframes rotateHUD {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes rotateHUDCounter {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(-360deg); }
                    }
                    @keyframes rotateAvatarY {
                        0% { transform: rotateY(0deg) scale(1) translateY(0); filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.3)); }
                        50% { transform: rotateY(180deg) scale(1.03) translateY(-4px); filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.5)); }
                        100% { transform: rotateY(360deg) scale(1) translateY(0); filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.3)); }
                    }
                    @keyframes pulseHeart {
                        0%, 100% { transform: translateZ(10px) scale(0.9); opacity: 0.8; }
                        50% { transform: translateZ(10px) scale(1.22); opacity: 1; }
                    }
                    @keyframes pulseOrgan {
                        0%, 100% { transform: translateZ(5px) scale(0.95); }
                        50% { transform: translateZ(5px) scale(1.1); }
                    }
                `}} />
            </div>

            {/* Bottom details row (Diagnostics & Allergies) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Diagnostics */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)" }}>
                    <h5 style={{ margin: 0, color: "#16a34a", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        ✅ System Diagnostics
                    </h5>
                    <div style={{ color: "#475569", marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <p style={{ margin: 0 }}>🟢 Nervous System : Functional</p>
                        <p style={{ margin: 0 }}>🟢 Cardiovascular : Functional</p>
                        <p style={{ margin: 0 }}>🟢 Respiratory : Functional</p>
                        <p style={{ margin: 0 }}>🟢 Musculoskeletal : Functional</p>
                    </div>
                </div>

                {/* Allergies */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)" }}>
                    <h5 style={{ margin: 0, color: "#ef4444", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        ⚠️ Allergies & Diagnoses
                    </h5>
                    <p style={{ color: "#64748b", marginTop: 12, marginBottom: 0, fontSize: 14 }}>
                        No chronic conditions or critical drug allergies logged in patient EHR.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OverviewTab;