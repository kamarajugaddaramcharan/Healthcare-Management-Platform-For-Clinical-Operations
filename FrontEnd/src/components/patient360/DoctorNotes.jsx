import { useState } from "react";
import {
    User,
    ClipboardCheck,
    Calendar,
    Brain,
    FileDown,
    Edit,
    CheckCircle2,
    Activity,
} from "lucide-react";

const initialNotes = [
    {
        doctor: "Dr. Sarah Johnson",
        date: "22 July 2026",
        diagnosis: "Hypertension under control.",
        recommendation:
            "Continue Metformin and Aspirin. Review after 30 days.",
    },
    {
        doctor: "Dr. Michael Lee",
        date: "10 July 2026",
        diagnosis: "Blood sugar stable.",
        recommendation:
            "Maintain current diet and exercise plan.",
    },
];

function DoctorNotes() {
    const [notes, setNotes] = useState(initialNotes);

    const handleExport = () => {
        const text = notes.map(n => (
            `DOCTOR CLINICAL NOTE\n` +
            `------------------------\n` +
            `Doctor: ${n.doctor}\n` +
            `Date: ${n.date}\n` +
            `Diagnosis: ${n.diagnosis}\n` +
            `Recommendation: ${n.recommendation}\n` +
            `AI clinical summary verified.\n`
        )).join("\n========================\n\n");

        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `clinical_notes.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleEditNote = (index) => {
        const note = notes[index];
        const newDiagnosis = window.prompt("Edit Diagnosis:", note.diagnosis);
        if (newDiagnosis === null) return;
        
        const newRec = window.prompt("Edit Treatment Recommendation:", note.recommendation);
        if (newRec === null) return;

        const updated = [...notes];
        updated[index] = {
            ...note,
            diagnosis: newDiagnosis.trim() || note.diagnosis,
            recommendation: newRec.trim() || note.recommendation
        };
        setNotes(updated);
    };

    const cardStyle = {
        position: "relative",
        marginTop: 24,
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: 24,
        padding: 28,
        color: "#0f172a",
        boxShadow: "0 12px 35px rgba(99, 102, 241, 0.06)",
        overflow: "hidden"
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

    return (
        <div style={cardStyle}>
            <div style={gradientLineStyle} />
            
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div className="d-flex align-items-center gap-3">

                    <div
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: "50%",
                            background: "rgba(59, 130, 246, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            color: "#2563eb"
                        }}
                    >
                        <User size={24} />
                    </div>

                    <div>
                        <h3 className="fw-bold mb-1" style={{ fontSize: "20px", color: "#0f172a", margin: 0 }}>
                            Doctor Clinical Notes
                        </h3>
                        <small style={{ color: "#64748b", display: "block", marginTop: 2 }}>
                            Clinical observations and treatment recommendations
                        </small>
                    </div>

                </div>

                <button 
                    style={{
                        border: "none",
                        cursor: "pointer",
                        borderRadius: 12,
                        padding: "10px 18px",
                        fontWeight: 600,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: "white",
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                        transition: "all 0.3s ease"
                    }}
                    onClick={handleExport}
                >
                    <FileDown size={16} />
                    Export Notes
                </button>

            </div>

            {notes.map((note, index) => (

                <div
                    key={index}
                    style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 20,
                        padding: 24,
                        marginBottom: 20,
                    }}
                >

                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">

                        <div>
                            <h5 className="fw-bold m-0" style={{ fontSize: "16px", color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                                <User size={18} color="#2563eb" />
                                {note.doctor}
                            </h5>
                            <small style={{ color: "#64748b", display: "block", marginTop: 4 }}>
                                Senior Physician
                            </small>
                        </div>

                        <span
                            style={{
                                background: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                color: "#1e40af",
                                borderRadius: 10,
                                padding: "8px 12px",
                                fontSize: "13px",
                                fontWeight: 600,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6
                            }}
                        >
                            <Calendar size={14} />
                            {note.date}
                        </span>

                    </div>

                    <hr
                        style={{
                            borderColor: "#e2e8f0",
                            margin: "16px 0",
                            borderWidth: "1px",
                            borderStyle: "solid"
                        }}
                    />

                    <div className="mb-3">
                        <h6 style={{ color: "#2563eb", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                            <ClipboardCheck size={16} />
                            Diagnosis
                        </h6>
                        <p style={{ color: "#334155", fontSize: "14px", marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                            {note.diagnosis}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h6 style={{ color: "#475569", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                            <Activity size={16} color="#64748b" />
                            Treatment Recommendation
                        </h6>
                        <p style={{ color: "#475569", fontSize: "14px", marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                            {note.recommendation}
                        </p>
                    </div>

                    <div
                        style={{
                            background: "rgba(20, 184, 166, 0.08)",
                            border: "1px solid rgba(20, 184, 166, 0.25)",
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 18,
                        }}
                    >

                        <div className="d-flex align-items-center gap-2 mb-2">
                            <Brain size={16} color="#0d9488" />
                            <strong style={{ color: "#0d9488", fontSize: "13px" }}>
                                AI Clinical Summary
                            </strong>
                        </div>

                        <p style={{ color: "#115e59", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                            Patient condition remains stable. Continue current medication plan and schedule routine follow-up. No immediate intervention required.
                        </p>

                    </div>

                    <div className="d-flex justify-content-between align-items-center">

                        <div className="d-flex align-items-center gap-2">
                            <CheckCircle2 size={16} color="#16a34a" />
                            <small style={{ color: "#16a34a", fontWeight: 600, fontSize: "12px" }}>
                                Electronically Verified
                            </small>
                        </div>

                        <button 
                            style={{
                                border: "1px solid #cbd5e1",
                                cursor: "pointer",
                                borderRadius: 10,
                                padding: "6px 14px",
                                fontWeight: 600,
                                fontSize: "12px",
                                background: "#ffffff",
                                color: "#475569",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                transition: "all 0.2s"
                            }}
                            className="action-btn-hover"
                            onClick={() => handleEditNote(index)}
                        >
                            <Edit size={12} />
                            Edit Note
                        </button>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default DoctorNotes;