import { useMemo } from "react";

import {
    Users,
    HeartPulse,
    TriangleAlert,
    Activity,
} from "lucide-react";


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
                         title,
                         value,
                         icon,
                         color,
                         subtitle,
                     }) {

    return (

        <div
            style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 24,
                boxShadow:
                    "0 12px 30px rgba(0,0,0,.08)",
                transition: "transform .25s ease",
                height: "100%",
                border:
                    "1px solid #eef2ff",
            }}

            onMouseEnter={(event) => {

                event.currentTarget.style.transform =
                    "translateY(-4px)";

            }}

            onMouseLeave={(event) => {

                event.currentTarget.style.transform =
                    "translateY(0)";

            }}
        >

            {/* =================================================
                TOP
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                }}
            >

                <div
                    style={{
                        width: 58,
                        height: 58,
                        borderRadius: 18,
                        background:
                            `${color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "center",
                    }}
                >

                    {icon}

                </div>

                <div
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        boxShadow:
                            `0 0 12px ${color}`,
                    }}
                />

            </div>


            {/* =================================================
                VALUE
            ================================================= */}

            <h2
                style={{
                    marginTop: 25,
                    marginBottom: 8,
                    fontWeight: 800,
                    color: "#0f172a",
                    fontSize: 32,
                }}
            >
                {value}
            </h2>


            {/* =================================================
                TITLE
            ================================================= */}

            <h6
                style={{
                    marginBottom: 6,
                    color: "#1e293b",
                    fontWeight: 700,
                    fontSize: 15,
                }}
            >
                {title}
            </h6>


            {/* =================================================
                SUBTITLE
            ================================================= */}

            <small
                style={{
                    color: "#64748b",
                }}
            >
                {subtitle}
            </small>

        </div>

    );
}


/* =========================================================
   TWIN SUMMARY CARDS
========================================================= */

function TwinSummaryCards({
                              twins = [],
                          }) {

    /* =======================================================
       SAFE DATA
    ======================================================= */

    const summary = useMemo(() => {

        const total =
            Array.isArray(twins)
                ? twins.length
                : 0;


        /* ===================================================
           HEALTHY
        =================================================== */

        let healthy = 0;


        /* ===================================================
           HEART RATE
        =================================================== */

        let heartRateTotal = 0;

        let heartRateCount = 0;


        /*
         * IMPORTANT:
         *
         * Do NOT use:
         *
         * Number(undefined)
         *
         * because it produces NaN.
         */

        for (
            const twin of twins
            ) {

            if (!twin) {
                continue;
            }


            /* -----------------------------------------------
               HEALTH STATUS
            ------------------------------------------------ */

            const status =
                String(
                    twin.status || ""
                ).toLowerCase();


            if (
                status === "healthy" ||
                status === "normal" ||
                status === "low"
            ) {

                healthy++;

            }


            /* -----------------------------------------------
               HEART RATE
            ------------------------------------------------ */

            const heartRate =
                Number(
                    twin.heartRate
                );


            if (
                Number.isFinite(
                    heartRate
                ) &&
                heartRate > 0
            ) {

                heartRateTotal +=
                    heartRate;

                heartRateCount++;

            }

        }


        /* ===================================================
           HIGH RISK
        =================================================== */

        const highRisk =
            Math.max(
                0,
                total - healthy
            );


        /* ===================================================
           AVERAGE HEART RATE
        =================================================== */

        const averageHeartRate =
            heartRateCount > 0
                ? Math.round(
                    heartRateTotal /
                    heartRateCount
                )
                : 0;


        return {

            total,

            healthy,

            highRisk,

            averageHeartRate,

        };

    }, [twins]);


    /* =======================================================
       RENDER
    ======================================================= */

    return (

        <div
            className="row g-4 mb-4"
        >

            {/* =================================================
                TOTAL TWINS
            ================================================= */}

            <div
                className="col-xl-3 col-md-6"
            >

                <SummaryCard

                    title="Total Twins"

                    value={
                        summary.total.toLocaleString()
                    }

                    subtitle=
                        "Digital Health Twins"

                    color="#2563eb"

                    icon={
                        <Users
                            color="#2563eb"
                            size={30}
                        />
                    }

                />

            </div>


            {/* =================================================
                HEALTHY
            ================================================= */}

            <div
                className="col-xl-3 col-md-6"
            >

                <SummaryCard

                    title="Healthy"

                    value={
                        summary.healthy.toLocaleString()
                    }

                    subtitle=
                        "Normal Condition"

                    color="#22c55e"

                    icon={
                        <HeartPulse
                            color="#22c55e"
                            size={30}
                        />
                    }

                />

            </div>


            {/* =================================================
                HIGH RISK
            ================================================= */}

            <div
                className="col-xl-3 col-md-6"
            >

                <SummaryCard

                    title="High Risk"

                    value={
                        summary.highRisk.toLocaleString()
                    }

                    subtitle=
                        "Need Attention"

                    color="#ef4444"

                    icon={
                        <TriangleAlert
                            color="#ef4444"
                            size={30}
                        />
                    }

                />

            </div>


            {/* =================================================
                AVERAGE HEART RATE
            ================================================= */}

            <div
                className="col-xl-3 col-md-6"
            >

                <SummaryCard

                    title="Average HR"

                    value={
                        `${summary.averageHeartRate} BPM`
                    }

                    subtitle=
                        "Live Monitoring"

                    color="#f59e0b"

                    icon={
                        <Activity
                            color="#f59e0b"
                            size={30}
                        />
                    }

                />

            </div>

        </div>

    );
}

export default TwinSummaryCards;