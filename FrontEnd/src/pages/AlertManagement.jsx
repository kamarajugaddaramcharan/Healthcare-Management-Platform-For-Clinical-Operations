import AlertStatistics from "../components/alert/AlertStatistics";
import ActiveAlerts from "../components/alert/ActiveAlerts";
import CriticalPatients from "../components/alert/CriticalPatients";
import AlertHistory from "../components/alert/AlertHistory";
import CriticalAlertPopup from "../components/alert/CriticalAlertPopup";

function AlertManagement() {

    return (

        <div
            className="dashboard-container"
            style={{
                paddingTop: "0",
                marginTop: "0"
            }}
        >

            <CriticalAlertPopup />

            <div
                style={{
                    marginBottom: "25px"
                }}
            >

                <h1
                    style={{
                        color: "#1E40AF",
                        fontSize: "44px",
                        fontWeight: "700",
                        marginBottom: "10px"
                    }}
                >
                    🚨 Alert Management
                </h1>

                <p
                    style={{
                        color: "#64748B",
                        fontSize: "18px"
                    }}
                >
                    Monitor, acknowledge and resolve patient alerts in real time.
                </p>

            </div>

            <AlertStatistics />

            <div
                className="bottom-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginTop: "25px"
                }}
            >

                <ActiveAlerts />

                <CriticalPatients />

            </div>

            <div
                style={{
                    marginTop: "30px"
                }}
            >

                <AlertHistory />

            </div>

        </div>

    );

}

export default AlertManagement;