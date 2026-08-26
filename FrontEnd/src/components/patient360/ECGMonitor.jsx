import {
    ResponsiveContainer,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid
} from "recharts";
import { HeartPulse, Activity, Wifi, ShieldCheck } from "lucide-react";

const ecgData=[
    {t:0,ecg:0},{t:1,ecg:1.2},{t:2,ecg:0.3},{t:3,ecg:2.5},
    {t:4,ecg:-1.2},{t:5,ecg:0.4},{t:6,ecg:1.8},{t:7,ecg:0.2},
    {t:8,ecg:2.3},{t:9,ecg:-0.8},{t:10,ecg:0.5},
];

function ECGMonitor(){
    return(
        <div style={{
            marginTop:24,
            borderRadius:24,
            padding:24,
            color:"#fff",
            background:"linear-gradient(135deg,#071a2f,#14532d)",
            boxShadow:"0 20px 40px rgba(0,0,0,.30)"
        }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1"><HeartPulse/> Live ECG Monitor</h3>
                    <small style={{color:"#cbd5e1"}}>Real-time cardiac waveform monitoring</small>
                </div>
                <span className="badge bg-success px-3 py-2 d-flex align-items-center gap-2">
          <Wifi size={15}/> LIVE
        </span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={ecgData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#355"/>
                    <XAxis dataKey="t" stroke="#cbd5e1"/>
                    <YAxis stroke="#cbd5e1"/>
                    <Tooltip/>
                    <Line
                        type="monotone"
                        dataKey="ecg"
                        stroke="#22c55e"
                        strokeWidth={4}
                        dot={false}
                        activeDot={{r:6}}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="row g-3 mt-3">
                {[
                    {label:"Heart Rate",value:"76 BPM"},
                    {label:"SpO₂",value:"98%"},
                    {label:"Blood Pressure",value:"120/80"},
                    {label:"Respiration",value:"18/min"}
                ].map(item=>(
                    <div className="col-md-3 col-6" key={item.label}>
                        <div style={{
                            background:"rgba(255,255,255,.08)",
                            borderRadius:18,
                            padding:16,
                            textAlign:"center"
                        }}>
                            <Activity className="mb-2" color="#22c55e"/>
                            <h4 className="mb-1">{item.value}</h4>
                            <small style={{color:"#cbd5e1"}}>{item.label}</small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 rounded-4" style={{background:"rgba(34,197,94,.15)"}}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <ShieldCheck color="#22c55e"/>
                        AI ECG Analysis
                    </div>
                    <strong style={{color:"#86efac"}}>Normal Sinus Rhythm</strong>
                </div>
            </div>
        </div>
    );
}

export default ECGMonitor;
