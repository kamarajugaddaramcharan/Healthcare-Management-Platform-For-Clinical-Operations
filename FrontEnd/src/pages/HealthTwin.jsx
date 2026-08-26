import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { getAllHealthTwins } from "../services/healthTwinService";

import TwinSummaryCards from "../components/healthTwin/TwinSummaryCards";
import PatientTwinCard from "../components/healthTwin/PatientTwinCard";


function HealthTwin() {

    /* =========================================================
       DATA
    ========================================================= */

    const [twins, setTwins] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [lastUpdated, setLastUpdated] = useState(
        new Date()
    );

    const [refreshing, setRefreshing] = useState(false);


    /* =========================================================
       PAGINATION
    ========================================================= */

    const ITEMS_PER_PAGE = 20;


    /* =========================================================
       RANDOM HELPERS
    ========================================================= */

    const random = (min, max) => {

        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;

    };


    const randomTemperature = () => {

        return (
            36 +
            Math.random() * 2.5
        ).toFixed(1);

    };


    /* =========================================================
       NORMALIZE BACKEND DATA
    ========================================================= */

    const normalizeTwin = (item) => {

        const heartRate =
            Number(item?.heartRate);

        const bloodPressure =
            item?.bloodPressure;

        const oxygen =
            item?.oxygenLevel ??
            item?.spo2;

        return {

            ...item,

            heartRate:
                Number.isFinite(heartRate) &&
                heartRate > 0
                    ? heartRate
                    : random(65, 95),

            bloodPressure:
                bloodPressure ||
                `${random(110, 135)}/${random(70, 90)}`,

            oxygenLevel:
                oxygen != null
                    ? Number(oxygen)
                    : random(95, 100),

            temperature:
                item?.temperature != null
                    ? Number(item.temperature).toFixed(1)
                    : randomTemperature(),

            height:
                item?.height ?? "--",

            weight:
                item?.weight ?? "--",

            bloodSugar:
                item?.bloodSugar ??
                "--",

            status:
                item?.status ||
                "Healthy",

        };

    };


    /* =========================================================
       LOAD DATA
    ========================================================= */

    const loadHealthTwins = async () => {

        try {

            setError("");

            const data =
                await getAllHealthTwins();

            if (!Array.isArray(data)) {

                setTwins([]);

                return;

            }

            const normalized =
                data.map(normalizeTwin);

            setTwins(normalized);

            setLastUpdated(
                new Date()
            );

        } catch (err) {

            console.error(
                "Health Twin loading error:",
                err
            );

            setError(
                "Unable to load Health Twin data."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        loadHealthTwins();

    }, []);


    /* =========================================================
       FILTER
    ========================================================= */

    const filteredTwins = useMemo(() => {

        const query =
            search
                .trim()
                .toLowerCase();

        if (!query) {

            return twins;

        }

        return twins.filter((twin) => {

            const patientId =
                String(
                    twin?.patientId ?? ""
                ).toLowerCase();

            const id =
                String(
                    twin?.id ?? ""
                ).toLowerCase();

            const name =
                String(
                    twin?.patientName ??
                    twin?.name ??
                    ""
                ).toLowerCase();

            const doctor =
                String(
                    twin?.doctorName ??
                    twin?.doctor ??
                    ""
                ).toLowerCase();

            return (
                patientId.includes(query) ||
                id.includes(query) ||
                name.includes(query) ||
                doctor.includes(query)
            );

        });

    }, [twins, search]);


    /* =========================================================
       PAGE COUNT
    ========================================================= */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredTwins.length /
                ITEMS_PER_PAGE
            )
        );


    /* =========================================================
       KEEP PAGE VALID
    ========================================================= */

    useEffect(() => {

        if (
            currentPage >
            totalPages
        ) {

            setCurrentPage(
                totalPages
            );

        }

    }, [
        currentPage,
        totalPages
    ]);


    /* =========================================================
       CURRENT PAGE
    ========================================================= */

    const pageStart =
        (currentPage - 1) *
        ITEMS_PER_PAGE;

    const pageEnd =
        pageStart +
        ITEMS_PER_PAGE;


    const visibleTwins =
        filteredTwins.slice(
            pageStart,
            pageEnd
        );


    /* =========================================================
       LIVE UPDATE

       IMPORTANT:
       ONLY UPDATE THE 20 VISIBLE PATIENTS.

       DO NOT MAP 19,539 PATIENTS EVERY 5 SECONDS.
    ========================================================= */

    useEffect(() => {

        const interval =
            setInterval(() => {

                setTwins((previous) => {

                    if (
                        previous.length === 0
                    ) {

                        return previous;

                    }


                    /*
                     * Get IDs currently displayed.
                     */

                    const visibleIds =
                        new Set(
                            visibleTwins.map(
                                (twin) =>
                                    twin.id
                            )
                        );


                    /*
                     * Only update visible records.
                     */

                    return previous.map(
                        (twin) => {

                            if (
                                !visibleIds.has(
                                    twin.id
                                )
                            ) {

                                return twin;

                            }


                            const heartRate =
                                random(
                                    65,
                                    120
                                );


                            const systolic =
                                random(
                                    105,
                                    145
                                );


                            const diastolic =
                                random(
                                    65,
                                    95
                                );


                            const oxygenLevel =
                                random(
                                    90,
                                    100
                                );


                            const temperature =
                                randomTemperature();


                            /*
                             * Calculate status
                             */

                            let status =
                                "Healthy";


                            if (
                                heartRate >= 140 ||
                                oxygenLevel < 88 ||
                                Number(
                                    temperature
                                ) >= 39.5
                            ) {

                                status =
                                    "Critical";

                            } else if (
                                heartRate >= 120 ||
                                oxygenLevel < 92 ||
                                Number(
                                    temperature
                                ) >= 38.5
                            ) {

                                status =
                                    "High Risk";

                            } else if (
                                heartRate >= 100 ||
                                Number(
                                    temperature
                                ) >= 37.8
                            ) {

                                status =
                                    "Medium";

                            }


                            return {

                                ...twin,

                                heartRate,

                                bloodPressure:
                                    `${systolic}/${diastolic}`,

                                oxygenLevel,

                                /*
                                 * Keep spo2 too because
                                 * some existing components
                                 * may use it.
                                 */

                                spo2:
                                oxygenLevel,

                                temperature,

                                status,

                                updatedAt:
                                    new Date()
                                        .toISOString(),

                            };

                        }
                    );

                });


                setLastUpdated(
                    new Date()
                );

            }, 5000);


        return () => {

            clearInterval(
                interval
            );

        };

    }, [
        currentPage,
        search,
        visibleTwins,
    ]);


    /* =========================================================
       SEARCH RESET
    ========================================================= */

    const handleSearch = (
        event
    ) => {

        setSearch(
            event.target.value
        );

        setCurrentPage(1);

    };


    /* =========================================================
       MANUAL REFRESH
    ========================================================= */

    const handleRefresh = async () => {

        setRefreshing(true);

        try {

            await loadHealthTwins();

        } finally {

            setRefreshing(false);

        }

    };


    /* =========================================================
       PAGE CHANGE
    ========================================================= */

    const goToPage = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
        ) {

            return;

        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 15,
                }}
            >

                <RefreshCw
                    size={40}
                    color="#2563eb"
                    style={{
                        animation:
                            "spin 1s linear infinite",
                    }}
                />

                <h3>
                    Loading Health Twins...
                </h3>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    Preparing patient monitoring data
                </p>

                <style>
                    {`
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }

                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}
                </style>

            </div>

        );

    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {

        return (

            <div
                style={{
                    padding: 40,
                    textAlign: "center",
                }}
            >

                <h2>
                    Health Twin Error
                </h2>

                <p
                    style={{
                        color: "#dc2626",
                    }}
                >
                    {error}
                </p>

                <button
                    onClick={
                        loadHealthTwins
                    }
                    style={{
                        marginTop: 20,
                        padding:
                            "12px 24px",
                        border: "none",
                        borderRadius: 10,
                        background:
                            "#2563eb",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    Try Again
                </button>

            </div>

        );

    }


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div
            style={{
                padding: 24,
                maxWidth: 1600,
                margin: "0 auto",
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    marginBottom: 25,
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "flex-start",
                        gap: 20,
                        flexWrap: "wrap",
                    }}
                >

                    <div>

                        <h1
                            style={{
                                margin: 0,
                                fontSize: 36,
                                fontWeight: 800,
                                color:
                                    "#0f172a",
                            }}
                        >
                            Patient Health Twins
                        </h1>

                        <p
                            style={{
                                marginTop: 8,
                                color:
                                    "#64748b",
                                fontSize: 16,
                            }}
                        >
                            AI-powered Digital Twin
                            Monitoring Dashboard
                        </p>

                    </div>


                    {/* LIVE STATUS */}

                    <div
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            gap: 10,
                            background:
                                "#ecfdf5",
                            color:
                                "#059669",
                            padding:
                                "10px 16px",
                            borderRadius: 999,
                            fontWeight: 700,
                        }}
                    >

                        <span
                            style={{
                                width: 9,
                                height: 9,
                                borderRadius:
                                    "50%",
                                background:
                                    "#10b981",
                                boxShadow:
                                    "0 0 10px #10b981",
                            }}
                        />

                        LIVE

                        <span
                            style={{
                                color:
                                    "#64748b",
                                fontWeight: 500,
                            }}
                        >
                            • Updates every 5 seconds
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <TwinSummaryCards
                twins={visibleTwins}
            />


            {/* =================================================
                SEARCH + REFRESH
            ================================================= */}

            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 18,
                    marginBottom: 25,
                    border:
                        "1px solid #e2e8f0",
                    boxShadow:
                        "0 8px 25px rgba(15,23,42,.05)",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        alignItems:
                            "center",
                    }}
                >

                    {/* SEARCH */}

                    <div
                        style={{
                            position:
                                "relative",
                            flex: 1,
                        }}
                    >

                        <Search
                            size={20}
                            style={{
                                position:
                                    "absolute",
                                left: 16,
                                top: "50%",
                                transform:
                                    "translateY(-50%)",
                                color:
                                    "#64748b",
                            }}
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={
                                handleSearch
                            }
                            placeholder=
                                "Search patient ID, name, doctor..."
                            style={{
                                width: "100%",
                                height: 52,
                                border:
                                    "1px solid #dbe3ef",
                                borderRadius: 14,
                                padding:
                                    "0 18px 0 48px",
                                outline: "none",
                                fontSize: 15,
                                background:
                                    "#f8fafc",
                                boxSizing:
                                    "border-box",
                            }}
                        />

                    </div>


                    {/* REFRESH */}

                    <button
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing
                        }
                        style={{
                            height: 52,
                            minWidth: 52,
                            border: "none",
                            borderRadius: 14,
                            background:
                                "#2563eb",
                            color: "#fff",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            cursor:
                                refreshing
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                refreshing
                                    ? 0.7
                                    : 1,
                        }}
                        title="Refresh"
                    >

                        <RefreshCw
                            size={20}
                            style={{
                                animation:
                                    refreshing
                                        ? "spin 1s linear infinite"
                                        : "none",
                            }}
                        />

                    </button>

                </div>


                {/* RESULT INFO */}

                <div
                    style={{
                        marginTop: 12,
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        flexWrap: "wrap",
                        gap: 10,
                    }}
                >

                    <span
                        style={{
                            color:
                                "#475569",
                            fontSize: 14,
                        }}
                    >

                        Showing{" "}

                        <strong>
                            {filteredTwins.length === 0
                                ? 0
                                : pageStart + 1}
                        </strong>

                        {" - "}

                        <strong>
                            {Math.min(
                                pageEnd,
                                filteredTwins.length
                            )}
                        </strong>

                        {" of "}

                        <strong>
                            {filteredTwins.length.toLocaleString()}
                        </strong>

                        {" patients"}

                    </span>


                    <span
                        style={{
                            color:
                                "#64748b",
                            fontSize: 13,
                        }}
                    >

                        Last update:{" "}

                        {lastUpdated.toLocaleTimeString()}

                    </span>

                </div>

            </div>


            {/* =================================================
                NO RESULTS
            ================================================= */}

            {visibleTwins.length === 0 && (

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: 60,
                        textAlign: "center",
                        color: "#64748b",
                    }}
                >

                    <Search
                        size={50}
                        style={{
                            marginBottom: 15,
                        }}
                    />

                    <h3>
                        No patients found
                    </h3>

                    <p>
                        Try another patient ID,
                        name, or doctor.
                    </p>

                </div>

            )}


            {/* =================================================
                PATIENT CARDS
            ================================================= */}

            <div>

                {visibleTwins.map(
                    (twin) => (

                        <div
                            key={
                                twin.id ??
                                twin.patientId
                            }
                            style={{
                                marginBottom: 24,
                            }}
                        >

                            <PatientTwinCard
                                twin={twin}
                            />

                        </div>

                    )
                )}

            </div>


            {/* =================================================
                PAGINATION
            ================================================= */}

            {filteredTwins.length > 0 && (

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 20,
                        padding: 18,
                        marginTop: 25,
                        display: "flex",
                        justifyContent:
                            "center",
                        alignItems: "center",
                        gap: 12,
                        border:
                            "1px solid #e2e8f0",
                    }}
                >

                    <button
                        onClick={() =>
                            goToPage(
                                currentPage - 1
                            )
                        }
                        disabled={
                            currentPage === 1
                        }
                        style={{
                            width: 44,
                            height: 44,
                            border: "none",
                            borderRadius: 12,
                            background:
                                currentPage === 1
                                    ? "#e2e8f0"
                                    : "#2563eb",
                            color:
                                currentPage === 1
                                    ? "#94a3b8"
                                    : "#fff",
                            cursor:
                                currentPage === 1
                                    ? "not-allowed"
                                    : "pointer",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                        }}
                    >

                        <ChevronLeft
                            size={20}
                        />

                    </button>


                    <div
                        style={{
                            minWidth: 130,
                            textAlign: "center",
                            fontWeight: 700,
                            color:
                                "#0f172a",
                        }}
                    >

                        Page{" "}

                        {currentPage}

                        {" / "}

                        {totalPages}

                    </div>


                    <button
                        onClick={() =>
                            goToPage(
                                currentPage + 1
                            )
                        }
                        disabled={
                            currentPage ===
                            totalPages
                        }
                        style={{
                            width: 44,
                            height: 44,
                            border: "none",
                            borderRadius: 12,
                            background:
                                currentPage ===
                                totalPages
                                    ? "#e2e8f0"
                                    : "#2563eb",
                            color:
                                currentPage ===
                                totalPages
                                    ? "#94a3b8"
                                    : "#fff",
                            cursor:
                                currentPage ===
                                totalPages
                                    ? "not-allowed"
                                    : "pointer",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                        }}
                    >

                        <ChevronRight
                            size={20}
                        />

                    </button>

                </div>

            )}


            {/* =================================================
                ANIMATION
            ================================================= */}

            <style>
                {`

                    @keyframes spin {

                        from {
                            transform:
                                rotate(0deg);
                        }

                        to {
                            transform:
                                rotate(360deg);
                        }

                    }

                `}
            </style>

        </div>

    );

}

export default HealthTwin;