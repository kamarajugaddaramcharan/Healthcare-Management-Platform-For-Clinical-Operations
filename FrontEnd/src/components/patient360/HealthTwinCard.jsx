import {
    Activity,
    Heart,
    Weight,
    Ruler,
    ShieldCheck,
    Cpu,
    CircleCheckBig,
    Brain,
    Droplets
} from "lucide-react";

function HealthTwinCard({ twin }) {
    if (!twin) {
        return (
            <div className="card shadow border-0 rounded-4 p-4">
                Loading Digital Twin...
            </div>
        );
    }

    const organs = [
        { icon: <Heart size={18} color="#ef4444"/>, name:"Heart", status:"Healthy"},
        { icon: <Brain size={18} color="#8b5cf6"/>, name:"Brain", status:"Normal"},
        { icon: <Droplets size={18} color="#3b82f6"/>, name:"Blood", status:"Stable"},
        { icon: <CircleCheckBig size={18} color="#22c55e"/>, name:"Vitals", status:"Optimal"},
    ];

    return (
        <div
            style={{
                borderRadius:24,
                padding:24,
                color:"#0f172a",
                background:"#ffffff",
                border:"1px solid #e2e8f0",
                boxShadow:"0 10px 30px rgba(15, 23, 42, 0.03)"
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1" style={{color:"#0f172a"}}>🧬 Digital Health Twin</h3>
                    <small style={{color:"#64748b"}}>AI-powered real-time patient model</small>
                </div>

                <span
                    style={{
                        background:"#dcfce7",
                        color:"#15803d",
                        border:"1px solid #bbf7d0",
                        padding:"8px 16px",
                        borderRadius:20,
                        fontWeight:600
                    }}
                >
          ● Live
        </span>
            </div>

            <div className="row g-4">

                <div className="col-lg-5">
                    <div
                        style={{
                            background:"#f8fafc",
                            border:"1px solid #e2e8f0",
                            borderRadius:20,
                            padding:20,
                            textAlign:"center",
                            color:"#0f172a"
                        }}
                    >
                        <Cpu size={54} color="#2563eb"/>
                        <h5 className="mt-3" style={{color:"#475569"}}>Twin Accuracy</h5>
                        <h2 style={{fontWeight:700,color:"#0f172a"}}>98.7%</h2>

                        <div className="progress mt-3" style={{height:10,background:"#e2e8f0"}}>
                            <div
                                className="progress-bar bg-success"
                                style={{width:"98.7%"}}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">

                    <div className="row g-3">

                        <div className="col-6">
                            <div className="p-3 rounded-4" style={{background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a"}}>
                                <Activity className="text-primary mb-2"/>
                                <div style={{color:"#64748b",fontSize:13}}>Blood Group</div>
                                <h5 className="fw-bold m-0" style={{marginTop:4}}>{twin.bloodGroup}</h5>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="p-3 rounded-4" style={{background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a"}}>
                                <Heart className="text-danger mb-2"/>
                                <div style={{color:"#64748b",fontSize:13}}>Heart Rate</div>
                                <h5 className="fw-bold m-0" style={{marginTop:4}}>{twin.heartRate} BPM</h5>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="p-3 rounded-4" style={{background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a"}}>
                                <Ruler className="text-info mb-2"/>
                                <div style={{color:"#64748b",fontSize:13}}>Height</div>
                                <h5 className="fw-bold m-0" style={{marginTop:4}}>{twin.height} cm</h5>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="p-3 rounded-4" style={{background:"#f8fafc",border:"1px solid #e2e8f0",color:"#0f172a"}}>
                                <Weight className="text-warning mb-2"/>
                                <div style={{color:"#64748b",fontSize:13}}>Weight</div>
                                <h5 className="fw-bold m-0" style={{marginTop:4}}>{twin.weight} kg</h5>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <hr style={{borderTop:"1px solid #e2e8f0",opacity:1,margin:"20px 0"}}/>

            <div className="row">
                {organs.map((o)=>(
                    <div className="col-md-3 col-6 mb-3" key={o.name}>
                        <div className="d-flex align-items-center gap-2">
                            {o.icon}
                            <div>
                                <div style={{fontWeight:600,color:"#0f172a"}}>{o.name}</div>
                                <small style={{color:"#16a34a",fontWeight:600}}>{o.status}</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center gap-2" style={{color:"#475569",fontWeight:500}}>
                    <ShieldCheck className="text-success"/>
                    AI Sync Status
                </div>

                <span className="badge bg-success px-3 py-2">
          Connected
        </span>
            </div>
        </div>
    );
}

export default HealthTwinCard;
