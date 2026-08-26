import { useEffect, useState } from "react";
import { getAllAlerts } from "../../services/alertService";

function AlertHistory() {

    const [alerts, setAlerts] = useState([]);

    const loadHistory = async () => {

        try {

            const data = await getAllAlerts();

            setAlerts(data);

        } catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        loadHistory();

    }, []);

    const getColor = (riskLevel) => {

        switch (riskLevel) {

            case "CRITICAL":
                return "#dc2626";

            case "HIGH":
                return "#ea580c";

            case "MEDIUM":
                return "#f59e0b";

            default:
                return "#16a34a";

        }

    };

    return (

        <div className="dashboard-card">

            <h2 style={{ marginBottom: "20px" }}>
                📜 Alert History
            </h2>

            <table className="table table-hover">

                <thead>

                <tr>

                    <th>Patient</th>

                    <th>Risk</th>

                    <th>Status</th>

                    <th>Date</th>

                </tr>

                </thead>

                <tbody>

                {

                    alerts.map(alert => (

                        <tr key={alert.id}>

                            <td>{alert.patientId}</td>

                            <td
                                style={{
                                    color: getColor(alert.riskLevel),
                                    fontWeight: "bold"
                                }}
                            >
                                {alert.riskLevel}
                            </td>

                            <td>{alert.status}</td>

                            <td>{alert.createdAt}</td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

}

export default AlertHistory;