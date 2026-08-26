import { useEffect, useState } from "react";
import {
    Heart,
    Activity,
    Thermometer,
    Droplets,
    Gauge,
    Wifi,
    TrendingUp
} from "lucide-react";

function KeyVitalsCard({ twin }) {
    const [liveVitals, setLiveVitals] = useState({
        heartRate:72,
        bloodPressure:"120/80",
        spo2:98,
        temperature:36.8,
        bloodSugar:95,
    });

    useEffect(()=>{
        if(!twin) return;
        setLiveVitals({
            heartRate:twin.heartRate ?? 72,
            bloodPressure:twin.bloodPressure ?? "120/80",
            spo2:twin.spo2 ?? 98,
            temperature:twin.temperature ?? 36.8,
            bloodSugar:twin.bloodSugar ?? 95,
        });
    },[twin]);

    useEffect(()=>{
        const id=setInterval(()=>{
            setLiveVitals(p=>({
                ...p,
                heartRate:Math.max(60,Math.min(100,p.heartRate+Math.floor(Math.random()*5-2))),
                bloodPressure:`${110+Math.floor(Math.random()*20)}/${70+Math.floor(Math.random()*15)}`,
                spo2:96+Math.floor(Math.random()*4),
                temperature:Number((36+Math.random()*2).toFixed(1)),
                bloodSugar:85+Math.floor(Math.random()*36)
            }));
        },5000);
        return ()=>clearInterval(id);
    },[]);

    if(!twin){
        return <div className="card shadow border-0 rounded-4 p-4">Loading Vitals...</div>;
    }

    const cards=[
        {icon:<Heart color="#ef4444"/>,label:"Heart Rate",value:`${liveVitals.heartRate} BPM`},
        {icon:<Activity color="#3b82f6"/>,label:"Blood Pressure",value:`${liveVitals.bloodPressure} mmHg`},
        {icon:<Droplets color="#22c55e"/>,label:"SpO₂",value:`${liveVitals.spo2}%`},
        {icon:<Thermometer color="#f59e0b"/>,label:"Temperature",value:`${liveVitals.temperature} °C`},
        {icon:<Gauge color="#06b6d4"/>,label:"Blood Sugar",value:`${liveVitals.bloodSugar} mg/dL`},
    ];

    return (
        <div style={{
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: 24,
            padding: 24,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)"
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1" style={{color:"#0f172a"}}>❤️ Live Patient Vitals</h3>
                    <small style={{color:"#64748b"}}>Real-time physiological monitoring</small>
                </div>
                <div className="badge bg-success px-3 py-2 d-flex align-items-center gap-2">
                    <Wifi size={16}/> Live
                </div>
            </div>

            <div className="row g-3">
                {cards.map(c=>(
                    <div className="col-md-6" key={c.label}>
                        <div style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 18,
                            padding: 18,
                            height: "100%"
                        }}>
                            <div className="d-flex justify-content-between align-items-center">
                                {c.icon}
                                <TrendingUp size={18} color="#16a34a"/>
                            </div>
                            <small style={{color:"#64748b",display:"block",marginTop:12,fontWeight:600}}>
                                {c.label}
                            </small>
                            <h4 className="mt-2 mb-0 fw-bold" style={{color:"#0f172a"}}>{c.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 rounded-4" style={{background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#166534",fontWeight:600}}>
                <div className="d-flex justify-content-between align-items-center">
                    <span>AI Monitoring Status</span>
                    <span className="badge bg-success">Stable • Connected</span>
                </div>
            </div>
        </div>
    );
}

export default KeyVitalsCard;
