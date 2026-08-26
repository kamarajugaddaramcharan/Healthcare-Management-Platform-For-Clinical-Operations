import { ShieldCheck, Clock, UserCheck } from "lucide-react";

function HipaaTab() {

    const logs = [
        {
            user: "Dr. Smith",
            action: "Viewed Patient Record",
            time: "10:25 AM"
        },
        {
            user: "Nurse Mary",
            action: "Updated Medication",
            time: "09:10 AM"
        },
        {
            user: "AI Prediction",
            action: "Generated Risk Report",
            time: "08:45 AM"
        }
    ];

    return (

        <div
            style={{
                background:"#131b2e",
                borderRadius:18,
                padding:25,
                color:"white"
            }}
        >

            <h2>
                <ShieldCheck /> HIPAA Audit Trail
            </h2>

            <table className="table table-dark mt-4">

                <thead>

                <tr>

                    <th>User</th>
                    <th>Action</th>
                    <th>Time</th>

                </tr>

                </thead>

                <tbody>

                {logs.map((log,index)=>(

                    <tr key={index}>

                        <td>
                            <UserCheck size={16}/> {log.user}
                        </td>

                        <td>{log.action}</td>

                        <td>
                            <Clock size={15}/> {log.time}
                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>

    );

}

export default HipaaTab;