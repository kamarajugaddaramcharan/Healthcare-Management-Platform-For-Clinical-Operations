import { useEffect, useState } from "react";
import { getCurrentPatient } from "../../services/patientPortalService";

import {
    ClipboardList,
    CheckCircle,
    Clock,
    HeartPulse,
    Pill,
    Activity,
    Utensils,
    RefreshCw,
} from "lucide-react";

const CAREPLAN_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8088";
const ADHERENCE_API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8088";

function PatientCarePlan() {
    const [carePlan, setCarePlan] = useState(null);
    const [adherence, setAdherence] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [patientId, setPatientId] = useState("");

    const today = new Date()
        .toISOString()
        .split("T")[0];

    // =====================================================
    // LOAD CARE PLAN + PRESERVE TODAY'S ADHERENCE
    // =====================================================

    const loadCarePlan = async () => {
        try {
            setLoading(true);
            setError("");

            const currentPatient = await getCurrentPatient();
            const resolvedPatientId = currentPatient?.patientId || currentPatient?.id;
            if (!resolvedPatientId) {
                throw new Error("Patient ID not found");
            }
            setPatientId(resolvedPatientId);

            /*
             * IMPORTANT:
             * Remember the previous care-plan ID.
             *
             * When AI regenerates a care plan, the backend may
             * create a NEW care-plan ID.
             *
             * Today's adherence belongs to the previous ID.
             */
            const previousCarePlanId =
                localStorage.getItem(
                    `patientCarePlanId_${resolvedPatientId}`
                );

            // =================================================
            // STEP 1: LOAD LATEST CARE PLAN
            // =================================================

            const response = await fetch(
                `${CAREPLAN_API}/careplans/patient/${resolvedPatientId}/latest`
            );

            if (!response.ok) {
                throw new Error(
                    `Care plan request failed: ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "LATEST CARE PLAN:",
                data
            );

            setCarePlan(data);

            if (!data?.id) {
                setAdherence(null);
                return;
            }

            const newCarePlanId = data.id;

            // Save latest ID for future regeneration detection
            localStorage.setItem(
                `patientCarePlanId_${resolvedPatientId}`,
                newCarePlanId
            );

            // =================================================
            // STEP 2: LOAD ADHERENCE FOR NEW CARE PLAN
            // =================================================

            let currentAdherence =
                await fetchAdherence(
                    newCarePlanId,
                    resolvedPatientId
                );

            // =================================================
            // STEP 3:
            // IF NEW CARE PLAN HAS NO ADHERENCE,
            // TRY THE PREVIOUS CARE PLAN
            // =================================================

            const hasCurrentActivities =
                Array.isArray(
                    currentAdherence?.completedActivities
                ) &&
                currentAdherence.completedActivities
                    .length > 0;

            const carePlanChanged =
                previousCarePlanId &&
                previousCarePlanId !== newCarePlanId;

            if (
                carePlanChanged &&
                !hasCurrentActivities
            ) {
                console.log(
                    "Care plan regenerated.",
                    "Old:",
                    previousCarePlanId,
                    "New:",
                    newCarePlanId
                );

                const previousAdherence =
                    await fetchAdherence(
                        previousCarePlanId,
                        resolvedPatientId
                    );

                const previousActivities =
                    previousAdherence?.completedActivities ||
                    [];

                // =============================================
                // STEP 4:
                // TRANSFER TODAY'S COMPLETED ACTIVITIES
                // TO THE NEW CARE PLAN
                // =============================================

                if (
                    previousActivities.length > 0
                ) {
                    console.log(
                        "Preserving today's activities:",
                        previousActivities
                    );

                    const transferredAdherence =
                        await saveAdherence(
                            newCarePlanId,
                            previousActivities
                        );

                    if (
                        transferredAdherence
                    ) {
                        currentAdherence =
                            transferredAdherence;
                    } else {
                        // Fallback to local state
                        currentAdherence = {
                            ...previousAdherence,
                            carePlanId:
                            newCarePlanId,
                        };
                    }
                }
            }

            // =================================================
            // STEP 5: SET FINAL ADHERENCE
            // =================================================

            setAdherence(
                currentAdherence
            );
        } catch (err) {
            console.error(
                "Failed to load care plan:",
                err
            );

            setError(
                "Unable to load your care plan."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH ADHERENCE
    // =====================================================

    const fetchAdherence = async (
        carePlanId,
        patId = patientId
    ) => {
        try {
            const response = await fetch(
                `${ADHERENCE_API}/adherence/${carePlanId}?patientId=${patId}&date=${today}`
            );

            if (!response.ok) {
                console.warn(
                    "Adherence request failed:",
                    response.status
                );

                return null;
            }

            const data =
                await response.json();

            console.log(
                "ADHERENCE:",
                carePlanId,
                data
            );

            return data;
        } catch (err) {
            console.error(
                "Failed to fetch adherence:",
                err
            );

            return null;
        }
    };

    // =====================================================
    // SAVE ADHERENCE
    // =====================================================

    const saveAdherence = async (
        carePlanId,
        activities
    ) => {
        try {
            const response = await fetch(
                `${ADHERENCE_API}/adherence/${carePlanId}?patientId=${patientId}&date=${today}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        activities
                    ),
                }
            );

            if (!response.ok) {
                console.error(
                    "Adherence save failed:",
                    response.status
                );

                return null;
            }

            const data =
                await response.json();

            console.log(
                "ADHERENCE SAVED:",
                data
            );

            return data;
        } catch (err) {
            console.error(
                "Failed to save adherence:",
                err
            );

            return null;
        }
    };

    // =====================================================
    // MARK ACTIVITY COMPLETED
    // =====================================================

    const markCompleted = async (
        activity
    ) => {
        if (!carePlan?.id) {
            return;
        }

        try {
            const currentActivities =
                adherence?.completedActivities ||
                [];

            // Already completed
            if (
                currentActivities.includes(
                    activity
                )
            ) {
                return;
            }

            const updatedActivities = [
                ...currentActivities,
                activity,
            ];

            const data =
                await saveAdherence(
                    carePlan.id,
                    updatedActivities
                );

            if (!data) {
                throw new Error(
                    "Unable to save adherence."
                );
            }

            setAdherence(data);
        } catch (err) {
            console.error(
                "Failed to update adherence:",
                err
            );
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadCarePlan();
    }, [patientId]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 40,
                    textAlign: "center",
                }}
            >
                <RefreshCw
                    size={30}
                    style={{
                        animation:
                            "spin 1s linear infinite",
                    }}
                />

                <h2>
                    Loading your care plan...
                </h2>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    Please wait.
                </p>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div>
                <div
                    style={{
                        background:
                            "linear-gradient(135deg,#2563eb,#06b6d4)",
                        color: "#fff",
                        borderRadius: 24,
                        padding: 30,
                    }}
                >
                    <ClipboardList size={32} />

                    <h1
                        style={{
                            marginTop: 15,
                        }}
                    >
                        Personalized Care Plan
                    </h1>

                    <p
                        style={{
                            color: "#dbeafe",
                        }}
                    >
                        Follow the recommendations
                        provided by your healthcare
                        team.
                    </p>
                </div>

                <div
                    style={{
                        marginTop: 25,
                        background: "#fff",
                        border:
                            "1px solid #fecaca",
                        borderRadius: 18,
                        padding: 25,
                        color: "#dc2626",
                    }}
                >
                    {error}
                </div>

                <button
                    onClick={loadCarePlan}
                    style={{
                        marginTop: 20,
                        padding:
                            "12px 20px",
                        borderRadius: 10,
                        border: "none",
                        background:
                            "#2563eb",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    <RefreshCw
                        size={16}
                        style={{
                            verticalAlign:
                                "middle",
                            marginRight: 7,
                        }}
                    />

                    Retry
                </button>
            </div>
        );
    }

    // =====================================================
    // NO CARE PLAN
    // =====================================================

    if (!carePlan) {
        return (
            <div
                style={{
                    background: "#fff",
                    padding: 30,
                    borderRadius: 20,
                }}
            >
                No care plan available.
            </div>
        );
    }

    // =====================================================
    // ADHERENCE
    // =====================================================

    const completedActivities =
        adherence?.completedActivities || [];

    /*
     * Calculate from completedActivities instead of
     * blindly trusting the backend percentage.
     *
     * 4 activities:
     * VITALS      = 25%
     * MEDICATION  = 25%
     * EXERCISE    = 25%
     * DIET        = 25%
     */

    const adherencePercentage =
        Math.round(
            (completedActivities.length / 4) *
            100
        );

    // =====================================================
    // ACTIVITY DATA
    // =====================================================

    const activities = [
        {
            id: "VITALS",

            title: "Vitals",

            description:
                "Record today's heart rate, blood pressure and oxygen level.",

            icon: (
                <HeartPulse size={22} />
            ),
        },

        {
            id: "MEDICATION",

            title: "Medication",

            description:
                "Take prescribed medication according to your doctor's instructions.",

            icon: (
                <Pill size={22} />
            ),
        },

        {
            id: "EXERCISE",

            title: "Exercise",

            description:
                "Complete your recommended physical activity.",

            icon: (
                <Activity size={22} />
            ),
        },

        {
            id: "DIET",

            title: "Diet",

            description:
                "Follow today's recommended diet plan.",

            icon: (
                <Utensils size={22} />
            ),
        },
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div>
            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    background:
                        "linear-gradient(135deg,#2563eb,#06b6d4)",

                    color: "#fff",

                    borderRadius: 24,

                    padding: 30,
                }}
            >
                <ClipboardList size={32} />

                <h1
                    style={{
                        marginTop: 15,
                    }}
                >
                    Personalized Care Plan
                </h1>

                <p
                    style={{
                        color: "#dbeafe",
                    }}
                >
                    Follow the recommendations
                    provided by your healthcare
                    team.
                </p>
            </div>

            {/* =================================================
                TODAY'S PROGRESS
            ================================================= */}

            <div
                style={{
                    background: "#fff",

                    borderRadius: 20,

                    padding: 25,

                    marginTop: 25,

                    border:
                        "1px solid #e5e7eb",
                }}
            >
                <div
                    style={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems: "center",
                    }}
                >
                    <div>
                        <h2>
                            Today's Progress
                        </h2>

                        <p
                            style={{
                                color:
                                    "#64748b",

                                marginTop: 5,
                            }}
                        >
                            Complete your daily
                            care activities.
                        </p>
                    </div>

                    <strong
                        style={{
                            fontSize: 32,

                            color: "#2563eb",
                        }}
                    >
                        {adherencePercentage}%
                    </strong>
                </div>

                {/* =================================================
                    PROGRESS BAR
                ================================================= */}

                <div
                    style={{
                        height: 10,

                        background:
                            "#e5e7eb",

                        borderRadius: 10,

                        marginTop: 20,

                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${adherencePercentage}%`,

                            height: "100%",

                            background:
                                "linear-gradient(90deg,#2563eb,#06b6d4)",

                            borderRadius: 10,

                            transition:
                                "width 0.3s ease",
                        }}
                    />
                </div>

                <p
                    style={{
                        color: "#64748b",

                        marginTop: 12,
                    }}
                >
                    {completedActivities.length}{" "}
                    of 4 activities completed
                    today.
                </p>

                {/* =================================================
                    ACTIVITIES
                ================================================= */}

                <div
                    style={{
                        display: "grid",

                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",

                        gap: 15,

                        marginTop: 20,
                    }}
                >
                    {activities.map(
                        (activity) => {
                            const completed =
                                completedActivities.includes(
                                    activity.id
                                );

                            return (
                                <div
                                    key={
                                        activity.id
                                    }
                                    style={{
                                        border:
                                            "1px solid #e2e8f0",

                                        borderRadius:
                                            16,

                                        padding: 18,

                                        background:
                                            completed
                                                ? "#f0fdf4"
                                                : "#fff",

                                        transition:
                                            "all 0.2s ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            display:
                                                "flex",

                                            justifyContent:
                                                "space-between",

                                            alignItems:
                                                "center",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                gap: 10,

                                                fontWeight:
                                                    700,
                                            }}
                                        >
                                            {
                                                activity.icon
                                            }

                                            {
                                                activity.title
                                            }
                                        </div>

                                        <CheckCircle
                                            size={20}
                                            color={
                                                completed
                                                    ? "#16a34a"
                                                    : "#94a3b8"
                                            }
                                        />
                                    </div>

                                    <p
                                        style={{
                                            color:
                                                "#64748b",

                                            lineHeight:
                                                1.5,
                                        }}
                                    >
                                        {
                                            activity.description
                                        }
                                    </p>

                                    <button
                                        disabled={
                                            completed
                                        }
                                        onClick={() =>
                                            markCompleted(
                                                activity.id
                                            )
                                        }
                                        style={{
                                            border:
                                                "none",

                                            background:
                                                "transparent",

                                            padding: 0,

                                            color:
                                                completed
                                                    ? "#16a34a"
                                                    : "#2563eb",

                                            fontWeight:
                                                700,

                                            cursor:
                                                completed
                                                    ? "default"
                                                    : "pointer",
                                        }}
                                    >
                                        {completed
                                            ? "Completed"
                                            : "Mark as completed"}
                                    </button>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            {/* =================================================
                CARE PLAN DETAILS
            ================================================= */}

            <div
                style={{
                    display: "grid",

                    gap: 18,

                    marginTop: 25,
                }}
            >
                <PlanCard
                    title="Daily Vital Monitoring"
                    description="Monitor heart rate, blood pressure and oxygen level."
                    frequency="Daily"
                    status="Active"
                />

                <PlanCard
                    title="Medication Adherence"
                    description="Take prescribed medication according to your doctor's instructions."
                    frequency="Daily"
                    status="Active"
                />

                <PlanCard
                    title="Physical Activity"
                    description="Maintain regular physical activity as recommended."
                    frequency="5 days/week"
                    status="Active"
                />

                <PlanCard
                    title="Doctor Follow-up"
                    description={
                        carePlan.followUp ||
                        "Review health progress with your assigned clinician."
                    }
                    frequency="Scheduled"
                    status="Upcoming"
                />
            </div>

            {/* =================================================
                DOCTOR INFORMATION
            ================================================= */}

            <div
                style={{
                    background: "#fff",

                    borderRadius: 20,

                    padding: 25,

                    marginTop: 25,

                    border:
                        "1px solid #e5e7eb",
                }}
            >
                <h2>
                    Doctor Information
                </h2>

                <div
                    style={{
                        display: "grid",

                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(250px,1fr))",

                        gap: 18,

                        marginTop: 18,
                    }}
                >
                    <InfoBox
                        label="Doctor Name"
                        value={
                            carePlan.doctorName ||
                            "Not assigned"
                        }
                    />

                    <InfoBox
                        label="Doctor ID"
                        value={
                            carePlan.doctorId ||
                            "Not assigned"
                        }
                    />
                </div>
            </div>

            {/* =================================================
                PLAN INFORMATION
            ================================================= */}

            <div
                style={{
                    background: "#fff",

                    borderRadius: 20,

                    padding: 25,

                    marginTop: 25,

                    border:
                        "1px solid #e5e7eb",
                }}
            >
                <h2>
                    Plan Information
                </h2>

                <div
                    style={{
                        display: "grid",

                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(180px,1fr))",

                        gap: 15,

                        marginTop: 18,
                    }}
                >
                    <InfoBox
                        label="Patient ID"
                        value={
                            carePlan.patientId
                        }
                    />

                    <InfoBox
                        label="Status"
                        value={
                            carePlan.status ||
                            "PENDING"
                        }
                    />

                    <InfoBox
                        label="Risk Level"
                        value={
                            carePlan.riskLevel ||
                            "Not available"
                        }
                    />

                    <InfoBox
                        label="Health Score"
                        value={
                            carePlan.healthScore !==
                            undefined
                                ? `${carePlan.healthScore}/100`
                                : "Not available"
                        }
                    />

                    <InfoBox
                        label="Next Review"
                        value={
                            carePlan.nextReviewDate
                                ? new Date(
                                    carePlan.nextReviewDate
                                ).toLocaleDateString()
                                : "Not available"
                        }
                    />
                </div>
            </div>
        </div>
    );
}

// =====================================================
// PLAN CARD
// =====================================================

function PlanCard({
                      title,
                      description,
                      frequency,
                      status,
                  }) {
    return (
        <div
            style={{
                background: "#fff",

                borderRadius: 20,

                padding: 24,

                border:
                    "1px solid #e5e7eb",

                display: "flex",

                justifyContent:
                    "space-between",

                gap: 20,

                flexWrap: "wrap",
            }}
        >
            <div>
                <h3>{title}</h3>

                <p
                    style={{
                        color: "#64748b",
                    }}
                >
                    {description}
                </p>

                <span
                    style={{
                        display:
                            "inline-flex",

                        alignItems:
                            "center",

                        gap: 6,

                        color: "#64748b",
                    }}
                >
                    <Clock size={15} />

                    {frequency}
                </span>
            </div>

            <div
                style={{
                    display: "flex",

                    alignItems:
                        "center",

                    gap: 7,

                    color:
                        status === "Active"
                            ? "#16a34a"
                            : "#2563eb",

                    fontWeight: 700,
                }}
            >
                <CheckCircle size={18} />

                {status}
            </div>
        </div>
    );
}

// =====================================================
// INFO BOX
// =====================================================

function InfoBox({
                     label,
                     value,
                 }) {
    return (
        <div
            style={{
                background: "#f8fafc",

                border:
                    "1px solid #e2e8f0",

                borderRadius: 14,

                padding: 18,
            }}
        >
            <div
                style={{
                    color: "#64748b",

                    fontSize: 14,

                    marginBottom: 7,
                }}
            >
                {label}
            </div>

            <strong>
                {value}
            </strong>
        </div>
    );
}

export default PatientCarePlan;