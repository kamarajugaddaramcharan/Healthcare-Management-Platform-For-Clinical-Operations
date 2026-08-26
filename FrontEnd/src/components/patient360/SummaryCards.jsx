import { useEffect, useState } from "react";
import {
    HeartPulse,
    Cpu,
    Database,
    Download,
    Printer,
    RefreshCw,
    Shield,
    Calendar,
} from "lucide-react";

function SummaryCards({ patient, twin }) {

    const [status, setStatus] = useState({
        patient: "Stable",
        twin: "Online",
        ai: "Ready",
        fhir: "Connected",
        consent: "Approved",
        sync: "2 sec ago",
    });

    const [isPredicting, setIsPredicting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {

        const patientStatus = ["Stable", "Monitoring"];
        const twinStatus = ["Online", "Syncing"];
        const aiStatus = ["Ready", "Running"];

        const interval = setInterval(() => {

            setStatus(prev => ({
                ...prev,
                patient: patientStatus[Math.floor(Math.random() * patientStatus.length)],
                ai: prev.ai.includes("Sync") ? prev.ai : aiStatus[Math.floor(Math.random() * aiStatus.length)],
                sync: "Just Now",
            }));

        }, 7000);

        return () => clearInterval(interval);

    }, []);

    const handlePredict = () => {
        setIsPredicting(true);
        setStatus(prev => ({ ...prev, ai: "Processing..." }));
        setTimeout(() => {
            setIsPredicting(false);
            setStatus(prev => ({ ...prev, ai: "Prediction Sync'd!" }));
            window.alert(`AI Engine Prediction Completed:\n- Cardiovascular Risk: Low\n- Confidence: 94.2%\n- Status: Stable`);
        }, 1500);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setStatus(prev => ({ ...prev, twin: "Syncing..." }));
        setTimeout(() => {
            setIsRefreshing(false);
            setStatus(prev => ({ ...prev, twin: "Online", sync: "Just Now" }));
            window.alert("Digital Twin synchronized with latest EHR metrics successfully.");
        }, 1200);
    };

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            const element = document.createElement("a");
            const file = new Blob([
                `MEDISPHERE CLINICAL REPORT\n` +
                `======================================\n` +
                `Patient Name: ${patient?.name || 'Jane Doe'}\n` +
                `Patient ID: ${patient?.patientId || patient?.id || 'HT-360'}\n` +
                `Age: ${patient?.age || 32}\n` +
                `Gender: ${patient?.gender || 'Female'}\n` +
                `--------------------------------------\n` +
                `Clinical Status: ${status.patient}\n` +
                `Health Score: 96%\n` +
                `Heart Risk: Low\n` +
                `AI Status: Connected\n` +
                `FHIR Status: Connected\n` +
                `Consent: Approved\n` +
                `Report Generated: ${new Date().toLocaleString()}\n` +
                `======================================\n`
            ], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = `clinical_report_${patient?.patientId || 'HT-360'}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }, 800);
    };

    const handlePrint = () => {
        window.print();
    };

    const cardStyle = {
        position: "relative",
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: 24,
        padding: 24,
        height: "100%",
        boxShadow: "0 12px 35px rgba(99, 102, 241, 0.06)",
        color: "#0f172a",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    };

    const gradientLineStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "5px",
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
        opacity: 0.95,
        zIndex: 10
    };

    const buttonStyle = (gradient, disabled) => ({
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 12,
        padding: "12px 20px",
        fontWeight: 600,
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: "white",
        background: disabled ? "#94a3b8" : gradient,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        opacity: disabled ? 0.8 : 1
    });

    return (

        <div className="row mt-4 g-4" style={{ marginBottom: 40 }}>

            {/* Clinical Summary */}
            <div className="col-lg-3 col-md-6">

                <div className="card" style={cardStyle}>
                    <div style={gradientLineStyle} />
                    <div>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: "#0f172a" }}>
                            🩺 Clinical Summary
                        </h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                            <p style={{ margin: 0 }}><span style={{ color: "#64748b" }}>Status:</span> <strong>{status.patient}</strong></p>
                            <p style={{ margin: 0 }}><span style={{ color: "#64748b" }}>Health Score:</span> <strong>96%</strong></p>
                            <p style={{ margin: 0 }}><span style={{ color: "#64748b" }}>Heart Risk:</span> <strong>Low</strong></p>
                            <p style={{ margin: 0 }}><span style={{ color: "#64748b" }}>BMI:</span> <strong>Normal</strong></p>
                        </div>
                    </div>
                </div>

            </div>

            {/* System Status */}
            <div className="col-lg-3 col-md-6">

                <div className="card" style={cardStyle}>
                    <div style={gradientLineStyle} />
                    <div>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: "#0f172a" }}>
                            🧬 System Status
                        </h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                <HeartPulse size={16} color="#ef4444" /> Patient: <strong style={{ color: "#ef4444" }}>{status.patient}</strong>
                            </p>
                            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                <Cpu size={16} color="#3b82f6" /> AI: <strong style={{ color: "#3b82f6" }}>{status.ai}</strong>
                            </p>
                            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                <Database size={16} color="#10b981" /> FHIR: <strong style={{ color: "#10b981" }}>{status.fhir}</strong>
                            </p>
                            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                <Shield size={16} color="#8b5cf6" /> Consent: <strong style={{ color: "#8b5cf6" }}>{status.consent}</strong>
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Quick Actions */}
            <div className="col-lg-3 col-md-6">

                <div className="card" style={cardStyle}>
                    <div style={gradientLineStyle} />
                    <div>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: "#0f172a" }}>
                            ⚡ Quick Actions
                        </h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <button 
                                style={buttonStyle("linear-gradient(135deg, #3b82f6, #2563eb)", isPredicting)} 
                                onClick={handlePredict}
                                disabled={isPredicting}
                            >
                                <Cpu size={14} className={isPredicting ? "spin-icon" : ""} /> 
                                {isPredicting ? "Running Model..." : "Run AI Prediction"}
                            </button>
                            <button 
                                style={buttonStyle("linear-gradient(135deg, #10b981, #059669)", isRefreshing)} 
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw size={14} className={isRefreshing ? "spin-icon" : ""} /> 
                                {isRefreshing ? "Syncing..." : "Refresh Twin"}
                            </button>
                            <button 
                                style={buttonStyle("linear-gradient(135deg, #f59e0b, #d97706)", isDownloading)} 
                                onClick={handleDownload}
                                disabled={isDownloading}
                            >
                                <Download size={14} /> 
                                {isDownloading ? "Generating..." : "Download Report"}
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Activity */}
            <div className="col-lg-3 col-md-6">

                <div className="card" style={cardStyle}>
                    <div style={gradientLineStyle} />
                    <div>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, marginBottom: 18, color: "#0f172a" }}>
                            📅 Recent Activity
                        </h5>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                            <p style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <Calendar size={16} color="#64748b" style={{ marginTop: 2 }} />
                                <div>
                                    <span style={{ color: "#64748b", fontSize: 12 }}>Last Visit</span>
                                    <br />
                                    <strong>20 Jul 2026</strong>
                                </div>
                            </p>
                            <p style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                <RefreshCw size={16} color="#64748b" style={{ marginTop: 2 }} />
                                <div>
                                    <span style={{ color: "#64748b", fontSize: 12 }}>Twin Sync</span>
                                    <br />
                                    <strong>{status.sync}</strong>
                                </div>
                            </p>
                            <button 
                                style={{
                                    border: "1px solid #cbd5e1",
                                    cursor: "pointer",
                                    borderRadius: 12,
                                    padding: "10px 20px",
                                    fontWeight: 600,
                                    fontSize: "13px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    background: "#ffffff",
                                    color: "#334155",
                                    transition: "all 0.3s ease",
                                    marginTop: 4
                                }}
                                onClick={handlePrint}
                            >
                                <Printer size={14} /> Print Summary
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* CSS helper inside React for spinning icons */}
            <style dangerouslySetInnerHTML={{ __html: `
                .spin-icon {
                    animation: spinHUD 1s linear infinite;
                }
                @keyframes spinHUD {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />

        </div>

    );

}

export default SummaryCards;