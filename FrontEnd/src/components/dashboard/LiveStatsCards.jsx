import { useEffect, useState } from "react";

import {
    getAllPatients,
    getPatientsByDoctor
} from "../../services/patientService";

import { getDashboardData } from "../../services/dashboardService";
import { isDoctor as checkIsDoctor } from "../../keycloak";

function LiveStatsCards() {

    const isDoctor = checkIsDoctor();

    const doctorId = "D001";

    const [stats, setStats] = useState({
        totalPatients: 0,
        onlinePatients: 0,
        activeAlerts: 0,
        criticalAlerts: 0,
        highRiskPatients: 0,

        // null = no data yet
        // 0 = valid health score of zero
        healthScore: null
    });

    // =========================================================
    // LOAD STATS
    // =========================================================

    const loadDashboardStats = async () => {

        try {

            // =================================================
            // DOCTOR
            // =================================================

            if (isDoctor) {

                /*
                 * Load assigned patients and AI dashboard data
                 * at the same time.
                 */
                const [patients, dashboardData] =
                    await Promise.all([
                        getPatientsByDoctor(doctorId),
                        getDashboardData()
                    ]);

                const assignedPatients =
                    patients || [];

                const data =
                    dashboardData || {};

                // -------------------------------------------------
                // TOTAL ASSIGNED PATIENTS
                // -------------------------------------------------

                const totalPatients =
                    assignedPatients.length;

                // -------------------------------------------------
                // ONLINE PATIENTS
                // -------------------------------------------------
                /*
                 * There is currently no real online/offline field
                 * in the Patient model.
                 *
                 * Until Vitals/device status is connected,
                 * use assigned patient count.
                 */

                const onlinePatients =
                    assignedPatients.length;

                // -------------------------------------------------
                // HIGH RISK PATIENTS
                // -------------------------------------------------
                /*
                 * Current Patient model does not contain a real
                 * riskLevel field.
                 *
                 * Therefore we are NOT inventing an AI risk level.
                 *
                 * Current temporary rule:
                 * patients age >= 60.
                 */

                const highRiskPatients =
                    assignedPatients.filter(
                        (patient) =>
                            Number(patient.age || 0) >= 60
                    ).length;

                // -------------------------------------------------
                // ALERTS
                // -------------------------------------------------
                /*
                 * Doctor-specific alert aggregation is not yet
                 * connected here.
                 *
                 * Do not show fake global alert numbers.
                 */

                const activeAlerts = 0;

                const criticalAlerts = 0;

                // -------------------------------------------------
                // HEALTH SCORE
                // -------------------------------------------------
                /*
                 * IMPORTANT:
                 *
                 * Do NOT use:
                 *
                 *     data.healthScore || 0
                 *
                 * because a valid healthScore of 0 would be
                 * treated incorrectly.
                 */

                const healthScore =
                    data.healthScore !== null &&
                    data.healthScore !== undefined
                        ? Number(data.healthScore)
                        : null;

                // -------------------------------------------------
                // UPDATE STATE
                // -------------------------------------------------

                setStats({
                    totalPatients,
                    onlinePatients,
                    activeAlerts,
                    criticalAlerts,
                    highRiskPatients,
                    healthScore
                });

                return;
            }

            // =================================================
            // ADMIN / NON-DOCTOR
            // =================================================

            const [patients, dashboardData] =
                await Promise.all([
                    getAllPatients(),
                    getDashboardData()
                ]);

            const allPatients =
                patients || [];

            const data =
                dashboardData || {};

            // -------------------------------------------------
            // HEALTH SCORE
            // -------------------------------------------------

            const healthScore =
                data.healthScore !== null &&
                data.healthScore !== undefined
                    ? Number(data.healthScore)
                    : null;

            // -------------------------------------------------
            // UPDATE ADMIN STATS
            // -------------------------------------------------

            setStats({

                totalPatients:
                allPatients.length,

                onlinePatients:
                    data.onlinePatients ?? 0,

                activeAlerts:
                    data.activeAlerts ?? 0,

                criticalAlerts:
                    data.criticalAlerts ?? 0,

                highRiskPatients:
                    data.highRiskPatients ?? 0,

                healthScore
            });

        } catch (error) {

            console.error(
                "Dashboard Stats Error:",
                error
            );

            /*
             * null means no health score was received.
             *
             * Do not use 0 here because 0 can be
             * a legitimate AI health score.
             */

            setStats({
                totalPatients: 0,
                onlinePatients: 0,
                activeAlerts: 0,
                criticalAlerts: 0,
                highRiskPatients: 0,
                healthScore: null
            });
        }
    };

    // =========================================================
    // INITIAL LOAD + LIVE REFRESH
    // =========================================================

    useEffect(() => {

        loadDashboardStats();

        /*
         * Refresh every 5 seconds.
         */
        const interval =
            setInterval(() => {
                loadDashboardStats();
            }, 5000);

        return () =>
            clearInterval(interval);

    }, [isDoctor]);

    // =========================================================
    // HEALTH SCORE DISPLAY
    // =========================================================

    const healthScoreDisplay =
        stats.healthScore !== null &&
        stats.healthScore !== undefined
            ? `${stats.healthScore}%`
            : "N/A";

    // =========================================================
    // CARDS
    // =========================================================

    const cards = [

        {
            title: isDoctor
                ? "My Patients"
                : "Total Patients",

            value:
            stats.totalPatients,

            color: "#2563eb",

            icon: "👨‍⚕️"
        },

        {
            title: isDoctor
                ? "Assigned Patients"
                : "Online Patients",

            value:
            stats.onlinePatients,

            color: "#10b981",

            icon: "🟢"
        },

        {
            title:
                "Active Alerts",

            value:
            stats.activeAlerts,

            color: "#f59e0b",

            icon: "🚨"
        },

        {
            title:
                "Critical Alerts",

            value:
            stats.criticalAlerts,

            color: "#ef4444",

            icon: "🔴"
        },

        {
            title:
                "High Risk Patients",

            value:
            stats.highRiskPatients,

            color: "#ef4444",

            icon: "⚠️"
        },

        {
            title:
                "Health Score",

            value:
            healthScoreDisplay,

            color: "#16a34a",

            icon: "❤️"
        }

    ];

    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            style={{
                display: "grid",

                gridTemplateColumns:
                    "repeat(auto-fit,minmax(220px,1fr))",

                gap: "20px",

                marginBottom: "25px"
            }}
        >

            {cards.map((card, index) => (

                <div
                    key={index}
                    className="dashboard-card"
                    style={{
                        padding: "20px",
                        borderLeft: `6px solid ${card.color}`
                    }}
                >

                    <div
                        style={{
                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center"
                        }}
                    >

                        <div>

                            <h4
                                style={{
                                    margin: 0,

                                    color:
                                        "#94a3b8",

                                    fontSize:
                                        "15px"
                                }}
                            >
                                {card.title}
                            </h4>

                            <h2
                                style={{
                                    marginTop:
                                        "10px",

                                    marginBottom:
                                        0,

                                    color:
                                    card.color,

                                    fontSize:
                                        "32px"
                                }}
                            >
                                {card.value}
                            </h2>

                        </div>

                        <div
                            style={{
                                fontSize:
                                    "35px"
                            }}
                        >
                            {card.icon}
                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default LiveStatsCards;