
import {
    Calendar,
    Clock,
    ShieldCheck,
    User,
    Mail,
    Pencil,
    Trash2,
    Activity
} from "lucide-react";

function PatientHeader({ patient, onEdit, onDelete }) {
    if (!patient) return null;

    const rawName =
        patient.name ||
        patient.patientName ||
        patient.fullName ||
        null;

    const patientName =
        rawName && rawName !== "Unknown Patient"
            ? rawName
            : `Patient ${patient.patientId || "N/A"}`;

    const initials = patientName
        .split(" ")
        .map((x) => x[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const score = Math.max(72, Math.min(98, 95 - Math.floor((patient.age || 30) / 8)));

    return (
        <div
            style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 28,
                color: "#0f172a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 28,
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div
                    style={{
                        width: 86,
                        height: 86,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                        color: "#ffffff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 30,
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </div>

                <div>
                    <h2 style={{ margin: 0, color: "#0f172a" }}>{patientName}</h2>
                    <div style={{ color: "#64748b", marginTop: 6 }}>
                        Patient ID : {patient.patientId}
                    </div>

                    <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap", color: "#475569" }}>
                        <span><User size={15} style={{ verticalAlign: "middle", marginRight: 4 }}/> {patient.gender}</span>
                        <span>{patient.age} Years</span>
                        <span><Mail size={15} style={{ verticalAlign: "middle", marginRight: 4 }}/> {patient.email || "Not Available"}</span>
                    </div>
                </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <div style={{textAlign:"center",padding:"12px 18px",background:"#f0fdf4",borderRadius:14,border:"1px solid #bbf7d0",color:"#166534"}}>
                    <Activity size={22} color="#16a34a" style={{margin:"0 auto"}}/>
                    <div style={{fontSize:32,fontWeight:700,marginTop:6}}>{score}%</div>
                    <small style={{color:"#15803d",fontWeight:600}}>Health Score</small>
                </div>

                <div style={{color:"#475569"}}>
                    <small style={{color:"#64748b",fontWeight:700}}>LAST CHECKED</small>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><Calendar size={14}/> 12 May 2026</div>
                    <small style={{color:"#64748b",marginTop:8,display:"block",fontWeight:700}}>NEXT SYNC</small>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}><Clock size={14}/> 20 July 2026</div>
                </div>

                <div style={{background:"#dcfce7",color:"#15803d",border:"1px solid #bbf7d0",padding:"10px 16px",borderRadius:12,display:"flex",alignItems:"center",gap:8,fontWeight:600}}>
                    <ShieldCheck size={18}/>
                    Consent Granted
                </div>

                <button
                    onClick={onEdit}
                    style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "14px"
                    }}
                >
                    <Pencil size={15}/> Edit
                </button>

                <button
                    onClick={onDelete}
                    style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "14px"
                    }}
                >
                    <Trash2 size={15}/> Delete
                </button>
            </div>
        </div>
    );
}

export default PatientHeader;
