import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    Tooltip, CartesianGrid, AreaChart, Area
} from "recharts";
import { Activity, HeartPulse } from "lucide-react";

const heartData=[
    {time:"08:00",value:72},{time:"09:00",value:75},{time:"10:00",value:74},
    {time:"11:00",value:78},{time:"12:00",value:76},{time:"13:00",value:80},
    {time:"14:00",value:77},
];

const bpData=[
    {day:"Mon",sys:120},{day:"Tue",sys:122},{day:"Wed",sys:119},
    {day:"Thu",sys:124},{day:"Fri",sys:121},{day:"Sat",sys:118},{day:"Sun",sys:120},
];

export default function ChartsSection(){
    return(
        <div className="row mt-4 g-4">

            <div className="col-lg-8">
                <div style={{
                    background:"linear-gradient(135deg,#111827,#1e3a8a)",
                    borderRadius:24,padding:24,color:"#fff",
                    boxShadow:"0 20px 40px rgba(0,0,0,.30)"
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1"><HeartPulse/> Heart Rate Analytics</h4>
                            <small style={{color:"#cbd5e1"}}>AI monitored heart-rate trend</small>
                        </div>
                        <span className="badge bg-success px-3 py-2">Live</span>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={heartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                            <XAxis dataKey="time" stroke="#cbd5e1"/>
                            <YAxis stroke="#cbd5e1"/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={4} dot={{r:5}} activeDot={{r:8}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-lg-4">
                <div style={{
                    background:"linear-gradient(135deg,#0f172a,#1d4ed8)",
                    borderRadius:24,padding:24,color:"#fff",
                    boxShadow:"0 20px 40px rgba(0,0,0,.30)"
                }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1"><Activity/> Blood Pressure</h4>
                            <small style={{color:"#cbd5e1"}}>Weekly systolic trend</small>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={bpData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
                            <XAxis dataKey="day" stroke="#cbd5e1"/>
                            <YAxis stroke="#cbd5e1"/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="sys" stroke="#38bdf8" fill="#60a5fa"/>
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className="mt-3 p-3 rounded-4" style={{background:"rgba(34,197,94,.15)"}}>
                        <div className="d-flex justify-content-between">
                            <span>AI Analysis</span>
                            <strong style={{color:"#86efac"}}>Normal Range</strong>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
