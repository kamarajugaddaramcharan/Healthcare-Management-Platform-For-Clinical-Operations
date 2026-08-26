import { useParams, useNavigate } from "react-router-dom";
import { User, Activity, ShieldCheck, ArrowLeft, FileText } from "lucide-react";

const Card=({title,value,color="#2563eb"})=>(
    <div style={{background:"#fff",padding:20,borderRadius:16,border:"1px solid #e2e8f0"}}>
        <div style={{color:"#64748b"}}>{title}</div>
        <h2 style={{color}}>{value}</h2>
    </div>);

export default function HealthTwinDetails(){
    const {patientId}=useParams();
    const navigate=useNavigate();
    const p={name:`Patient #${patientId}`,age:45,gender:"Male",heart:"82 bpm",bp:"120/80",spo2:"98%",temp:"36.8°C",sugar:"102 mg/dL"};
    return(
        <div style={{padding:30,background:"#f8fafc",minHeight:"100vh"}}>
            <button onClick={()=>navigate("/healthtwin")} style={{padding:"10px 18px",border:"none",background:"#2563eb",color:"#fff",borderRadius:10}}><ArrowLeft size={16}/> Back</button>
            <div style={{background:"#fff",marginTop:20,padding:30,borderRadius:20}}>
                <div style={{display:"flex",gap:20,alignItems:"center"}}>
                    <div style={{width:70,height:70,borderRadius:"50%",background:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><User/></div>
                    <div><h2>{p.name}</h2><p>Age: {p.age} | Gender: {p.gender}</p><span style={{background:"#22c55e",padding:"6px 12px",borderRadius:20,color:"#fff"}}><ShieldCheck size={14}/> Healthy</span></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginTop:24}}>
                    <Card title="Heart Rate" value={p.heart} color="#ef4444"/>
                    <Card title="Blood Pressure" value={p.bp}/>
                    <Card title="SpO₂" value={p.spo2} color="#10b981"/>
                    <Card title="Temperature" value={p.temp} color="#f59e0b"/>
                    <Card title="Blood Sugar" value={p.sugar} color="#8b5cf6"/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginTop:24}}>
                    <div style={{padding:20,borderRadius:16,background:"#fff7ed"}}>
                        <h3><Activity size={18}/> AI Recommendation</h3>
                        <p>Monitor blood pressure and continue medication.</p>
                    </div>
                    <div style={{padding:20,borderRadius:16,background:"#eff6ff"}}>
                        <h3><FileText size={18}/> Summary</h3>
                        <ul><li>Digital Twin Active</li><li>AI Confidence:98%</li><li>Last Sync:Just now</li></ul>
                    </div>
                </div>
            </div>
        </div>
    );}
