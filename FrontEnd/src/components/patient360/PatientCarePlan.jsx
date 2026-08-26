import { useCallback, useEffect, useState } from "react";
import {
    Activity,
    AlertCircle,
    Apple,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Droplets,
    Dumbbell,
    HeartPulse,
    Loader2,
    Moon,
    Pill,
    RefreshCw,
    Stethoscope,
    UserRound,
    Utensils,
} from "lucide-react";

/*
 * Patient Care Plan
 *
 * Patient-facing care plan viewer.
 *
 * Backend:
 *   GET http://localhost:8088/careplans/patient/{patientId}/latest
 *
 * Gateway can be changed with:
 *   VITE_API_URL=http://localhost:8088
 */

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8088";

function PatientCarePlan({ patientId: propPatientId }) {
    const [carePlan, setCarePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // PATIENT ADHERENCE
    // =====================================================

    const ADHERENCE_ACTIVITIES = [
        {
            key: "MEDICATION",
            label: "Medication",
            icon: Pill,
        },
        {
            key: "EXERCISE",
            label: "Exercise",
            icon: Dumbbell,
        },
        {
            key: "VITALS",
            label: "Vitals",
            icon: HeartPulse,
        },
        {
            key: "DIET",
            label: "Diet",
            icon: Utensils,
        },
    ];

    const [completedActivities, setCompletedActivities] = useState([]);
    const [adherenceLoading, setAdherenceLoading] = useState(false);
    const [adherenceSaving, setAdherenceSaving] = useState(false);
    const [adherenceError, setAdherenceError] = useState("");

    const getToday = () => {
        const now = new Date();

        return `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}-${String(
            now.getDate()
        ).padStart(2, "0")}`;
    };

    const calculateAdherence = (activities) => {
        return Math.round(
            (activities.length / ADHERENCE_ACTIVITIES.length) * 100
        );
    };

    const loadAdherence = useCallback(
        async (plan) => {
            if (!plan?.id) {
                setCompletedActivities([]);
                return;
            }

            try {
                setAdherenceLoading(true);
                setAdherenceError("");

                const response = await fetch(
                    `${API_BASE_URL}/adherence/${encodeURIComponent(
                        plan.id
                    )}?date=${encodeURIComponent(getToday())}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 404) {
                    setCompletedActivities([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        `Adherence request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                const activities = Array.isArray(
                    data?.completedActivities
                )
                    ? data.completedActivities
                    : [];

                const validActivities =
                    ADHERENCE_ACTIVITIES.map((item) => item.key).filter(
                        (key) => activities.includes(key)
                    );

                setCompletedActivities(validActivities);

                setCarePlan((current) =>
                    current
                        ? {
                            ...current,
                            adherencePercentage:
                                data?.adherencePercentage ??
                                calculateAdherence(validActivities),
                        }
                        : current
                );
            } catch (err) {
                console.error(
                    "Failed to load adherence:",
                    err
                );

                setAdherenceError(
                    "Unable to load today's adherence."
                );
            } finally {
                setAdherenceLoading(false);
            }
        },
        []
    );

    const saveAdherence = async (activities) => {
        if (!carePlan?.id) {
            return;
        }

        try {
            setAdherenceSaving(true);
            setAdherenceError("");

            const patientId = getPatientId();

            if (!patientId) {
                throw new Error("Patient ID is not available");
            }

            const response = await fetch(
                `${API_BASE_URL}/adherence/${encodeURIComponent(
                    carePlan.id
                )}?patientId=${encodeURIComponent(
                    patientId || ""
                )}&date=${encodeURIComponent(getToday())}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(activities),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Adherence save failed: ${response.status}`
                );
            }

            const data = await response.json();

            setCarePlan((current) =>
                current
                    ? {
                        ...current,
                        adherencePercentage:
                            data?.adherencePercentage ??
                            calculateAdherence(activities),
                    }
                    : current
            );
        } catch (err) {
            console.error(
                "Failed to save adherence:",
                err
            );

            setAdherenceError(
                "Unable to save today's adherence. Please try again."
            );
        } finally {
            setAdherenceSaving(false);
        }
    };

    const toggleAdherenceActivity = async (activity) => {
        if (adherenceSaving) {
            return;
        }

        const wasCompleted =
            completedActivities.includes(activity);

        const nextActivities = wasCompleted
            ? completedActivities.filter(
                (item) => item !== activity
            )
            : [...completedActivities, activity];

        // Optimistic UI update
        setCompletedActivities(nextActivities);

        setCarePlan((current) =>
            current
                ? {
                    ...current,
                    adherencePercentage:
                        calculateAdherence(nextActivities),
                }
                : current
        );

        await saveAdherence(nextActivities);
    };

    /*
     * Get patient ID.
     *
     * Priority:
     * 1. Component prop
     * 2. localStorage patientId
     * 3. localStorage user.patientId
     */
    const getPatientId = useCallback(() => {
        /*
         * IMPORTANT:
         * The authenticated user's patientId is the source of truth.
         *
         * Priority:
         * 1. localStorage.user.patientId
         * 2. localStorage.patientId
         * 3. component prop
         * 4. localStorage.user.id
         *
         * This prevents a stale/wrong component prop (for example 12)
         * from overriding the logged-in patient's real ID (for example 11).
         */
        try {
            const storedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            // 1. Authenticated user's patientId
            if (storedUser?.patientId != null) {
                console.log(
                    "Care Plan patient ID from authenticated user:",
                    storedUser.patientId
                );

                return String(storedUser.patientId);
            }

            // 2. Stored patientId
            const storedPatientId =
                localStorage.getItem("patientId");

            if (storedPatientId) {
                console.log(
                    "Care Plan patient ID from localStorage:",
                    storedPatientId
                );

                return String(storedPatientId);
            }

            // 3. Component prop
            if (propPatientId != null) {
                console.log(
                    "Care Plan patient ID from component prop:",
                    propPatientId
                );

                return String(propPatientId);
            }

            // 4. Fallback user ID
            if (storedUser?.id != null) {
                console.log(
                    "Care Plan patient ID from user.id:",
                    storedUser.id
                );

                return String(storedUser.id);
            }
        } catch (err) {
            console.warn(
                "Unable to read authenticated user from localStorage:",
                err
            );
        }

        console.warn(
            "Care Plan: Patient ID could not be determined."
        );

        return null;
    }, [propPatientId]);

    /*
     * Load latest care plan.
     */
    const loadCarePlan = useCallback(
        async (showRefresh = false) => {
            const patientId = getPatientId();

            if (!patientId) {
                setError(
                    "Patient ID is not available."
                );
                setLoading(false);
                return;
            }

            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response = await fetch(
                    `${API_BASE_URL}/careplans/patient/${encodeURIComponent(
                        patientId
                    )}/latest`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 404) {
                    setCarePlan(null);
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        `Care plan request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                setCarePlan(data || null);

                if (data?.id) {
                    await loadAdherence(data);
                }
            } catch (err) {
                console.error(
                    "Failed to load care plan:",
                    err
                );

                setError(
                    "Unable to load your care plan. Please try again."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [getPatientId, loadAdherence]
    );

    /*
     * Initial load.
     *
     * loadCarePlan is declared BEFORE useEffect,
     * so there is no "Cannot access variable before
     * it is declared" problem.
     */
    useEffect(() => {
        loadCarePlan();
    }, [loadCarePlan]);

    /*
     * Refresh.
     */
    const handleRefresh = () => {
        loadCarePlan(true);
    };

    /*
     * Format date.
     */
    const formatDate = (value) => {
        if (!value) {
            return "Not available";
        }

        try {
            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return "Not available";
            }

            return date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        } catch {
            return "Not available";
        }
    };

    /*
     * Format date + time.
     */
    const formatDateTime = (value) => {
        if (!value) {
            return "Not available";
        }

        try {
            const date = new Date(value);

            if (Number.isNaN(date.getTime())) {
                return "Not available";
            }

            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch {
            return "Not available";
        }
    };

    /*
     * Capitalize text.
     */
    const formatText = (value) => {
        if (!value) {
            return "Not available";
        }

        return String(value)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    /*
     * Risk color helper.
     */
    const getRiskClass = (riskLevel) => {
        const risk =
            String(riskLevel || "")
                .toUpperCase();

        if (risk === "CRITICAL") {
            return "critical";
        }

        if (risk === "HIGH") {
            return "high";
        }

        if (risk === "MEDIUM") {
            return "medium";
        }

        if (risk === "LOW") {
            return "low";
        }

        return "unknown";
    };

    /*
     * Status color helper.
     */
    const getStatusClass = (status) => {
        const value =
            String(status || "")
                .toUpperCase();

        if (value === "APPROVED") {
            return "approved";
        }

        if (value === "PENDING_APPROVAL") {
            return "pending";
        }

        if (value === "REJECTED") {
            return "rejected";
        }

        if (value === "COMPLETED") {
            return "completed";
        }

        return "draft";
    };

    /*
     * Render list.
     */
    const renderList = (
        items,
        emptyText = "No recommendations available."
    ) => {
        if (!Array.isArray(items) || items.length === 0) {
            return (
                <p className="empty-list">
                    {emptyText}
                </p>
            );
        }

        return (
            <ul className="recommendation-list">
                {items.map((item, index) => (
                    <li key={`${item}-${index}`}>
                        <CheckCircle2 size={17} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        );
    };

    /*
     * Loading state.
     */
    if (loading) {
        return (
            <div className="care-plan-page">
                <div className="care-plan-loading">
                    <Loader2
                        size={34}
                        className="spinner"
                    />

                    <h3>
                        Loading your care plan...
                    </h3>

                    <p>
                        Please wait while we retrieve
                        your latest plan.
                    </p>
                </div>

                <style>{styles}</style>
            </div>
        );
    }

    /*
     * Error state.
     */
    if (error) {
        return (
            <div className="care-plan-page">
                <div className="care-plan-error">
                    <div className="error-icon">
                        <AlertCircle size={32} />
                    </div>

                    <h2>
                        Care plan unavailable
                    </h2>

                    <p>{error}</p>

                    <button
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        {refreshing ? (
                            <>
                                <Loader2
                                    size={17}
                                    className="spinner"
                                />
                                Retrying...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={17} />
                                Try Again
                            </>
                        )}
                    </button>
                </div>

                <style>{styles}</style>
            </div>
        );
    }

    /*
     * Empty state.
     */
    if (!carePlan) {
        return (
            <div className="care-plan-page">
                <div className="page-header">
                    <div>
                        <div className="eyebrow">
                            <ClipboardList size={17} />
                            Patient 360
                        </div>

                        <h1>
                            My Care Plan
                        </h1>

                        <p>
                            Your personalized treatment
                            and wellness plan.
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "spinner"
                                    : ""
                            }
                        />
                        Refresh
                    </button>
                </div>

                <div className="empty-state">
                    <ClipboardList size={46} />

                    <h2>
                        No care plan available
                    </h2>

                    <p>
                        Your doctor has not created a care
                        plan for you yet.
                    </p>
                </div>

                <style>{styles}</style>
            </div>
        );
    }

    const riskLevel =
        String(carePlan.riskLevel || "UNKNOWN")
            .toUpperCase();

    const riskClass =
        getRiskClass(carePlan.riskLevel);

    const statusClass =
        getStatusClass(carePlan.status);

    const riskPercentage =
        Number(carePlan.riskPercentage || 0);

    const healthScore =
        Number(carePlan.healthScore ?? 0);

    return (
        <div className="care-plan-page">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <div className="eyebrow">
                        <ClipboardList size={17} />
                        Patient 360
                    </div>

                    <h1>
                        My Care Plan
                    </h1>

                    <p>
                        Your personalized treatment
                        and wellness plan.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "spinner"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* PATIENT + STATUS */}
            <section className="patient-banner">
                <div className="patient-info">
                    <div className="patient-avatar">
                        <UserRound size={27} />
                    </div>

                    <div>
                        <span className="small-label">
                            Patient
                        </span>

                        <h2>
                            {carePlan.patientName ||
                                "Patient"}
                        </h2>

                        <span className="patient-id">
                            ID:{" "}
                            {carePlan.patientId ||
                                getPatientId() ||
                                "N/A"}
                        </span>
                    </div>
                </div>

                <div className="status-group">
                    <span
                        className={`status-badge ${statusClass}`}
                    >
                        {formatText(
                            carePlan.status ||
                            "DRAFT"
                        )}
                    </span>

                    <span className="updated-text">
                        Updated{" "}
                        {formatDateTime(
                            carePlan.updatedAt
                        )}
                    </span>
                </div>
            </section>

            {/* TOP CLINICAL SUMMARY */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon">
                        <HeartPulse size={23} />
                    </div>

                    <div>
                        <span>
                            Health Score
                        </span>

                        <strong>
                            {healthScore}%
                        </strong>

                        <small>
                            Overall health status
                        </small>
                    </div>
                </div>

                <div
                    className={`summary-card risk-card ${riskClass}`}
                >
                    <div className="summary-icon">
                        <Activity size={23} />
                    </div>

                    <div>
                        <span>
                            Risk Level
                        </span>

                        <strong>
                            {riskLevel}
                        </strong>

                        <small>
                            Risk:{" "}
                            {riskPercentage.toFixed(
                                1
                            )}
                            %
                        </small>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        <Calendar size={23} />
                    </div>

                    <div>
                        <span>
                            Next Review
                        </span>

                        <strong className="date-value">
                            {formatDate(
                                carePlan.nextReviewDate
                            )}
                        </strong>

                        <small>
                            Scheduled review
                        </small>
                    </div>
                </div>
            </div>

            {/* CLINICAL INFORMATION */}
            <section className="section-card">
                <div className="section-header">
                    <div className="section-title">
                        <div className="section-icon">
                            <Stethoscope size={21} />
                        </div>

                        <div>
                            <h2>
                                Clinical Information
                            </h2>

                            <p>
                                Current clinical assessment
                            </p>
                        </div>
                    </div>
                </div>

                <div className="clinical-grid">
                    <div className="clinical-item">
                        <span>
                            Diagnosis
                        </span>

                        <strong>
                            {carePlan.diagnosis ||
                                "Not available"}
                        </strong>
                    </div>

                    <div className="clinical-item">
                        <span>
                            Risk Level
                        </span>

                        <strong
                            className={`risk-text ${riskClass}`}
                        >
                            {riskLevel}
                        </strong>
                    </div>

                    <div className="clinical-item">
                        <span>
                            Risk Percentage
                        </span>

                        <strong>
                            {riskPercentage.toFixed(
                                1
                            )}
                            %
                        </strong>
                    </div>

                    <div className="clinical-item">
                        <span>
                            Health Score
                        </span>

                        <strong>
                            {healthScore}%
                        </strong>
                    </div>
                </div>
            </section>

            {/* MEDICATIONS */}
            <section className="section-card">
                <div className="section-header">
                    <div className="section-title">
                        <div className="section-icon">
                            <Pill size={21} />
                        </div>

                        <div>
                            <h2>
                                Medications
                            </h2>

                            <p>
                                Prescribed medications
                            </p>
                        </div>
                    </div>
                </div>

                {renderList(
                    carePlan.medications,
                    "No medications have been added."
                )}
            </section>

            {/* HEALTH RECOMMENDATIONS */}
            <div className="recommendation-grid">
                {/* DIET */}
                <section className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <div className="section-icon">
                                <Apple size={21} />
                            </div>

                            <div>
                                <h2>
                                    Diet
                                </h2>

                                <p>
                                    Nutrition recommendations
                                </p>
                            </div>
                        </div>
                    </div>

                    {renderList(
                        carePlan.dietRecommendations,
                        "No diet recommendations."
                    )}
                </section>

                {/* EXERCISE */}
                <section className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <div className="section-icon">
                                <Dumbbell size={21} />
                            </div>

                            <div>
                                <h2>
                                    Exercise
                                </h2>

                                <p>
                                    Physical activity recommendations
                                </p>
                            </div>
                        </div>
                    </div>

                    {renderList(
                        carePlan.exerciseRecommendations,
                        "No exercise recommendations."
                    )}
                </section>

                {/* LIFESTYLE */}
                <section className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <div className="section-icon">
                                <HeartPulse size={21} />
                            </div>

                            <div>
                                <h2>
                                    Lifestyle
                                </h2>

                                <p>
                                    Daily lifestyle recommendations
                                </p>
                            </div>
                        </div>
                    </div>

                    {renderList(
                        carePlan.lifestyleRecommendations,
                        "No lifestyle recommendations."
                    )}
                </section>

                {/* DAILY TARGETS */}
                <section className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <div className="section-icon">
                                <Droplets size={21} />
                            </div>

                            <div>
                                <h2>
                                    Daily Targets
                                </h2>

                                <p>
                                    Your daily wellness goals
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="target-list">
                        <div className="target-item">
                            <Droplets size={20} />

                            <div>
                                <span>
                                    Water Target
                                </span>

                                <strong>
                                    {carePlan.dailyWaterTarget !=
                                    null
                                        ? `${carePlan.dailyWaterTarget} L/day`
                                        : "Not specified"}
                                </strong>
                            </div>
                        </div>

                        <div className="target-item">
                            <Moon size={20} />

                            <div>
                                <span>
                                    Sleep
                                </span>

                                <strong>
                                    {carePlan.sleepRecommendation ||
                                        "Not specified"}
                                </strong>
                            </div>
                        </div>

                        <div className="target-item">
                            <Utensils size={20} />

                            <div>
                                <span>
                                    Nutrition
                                </span>

                                <strong>
                                    Follow your prescribed
                                    diet plan
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* TODAY'S ADHERENCE - PATIENT ACTIONS */}
            <section className="section-card adherence-card">
                <div className="section-header">
                    <div className="section-title">
                        <div className="section-icon">
                            <CheckCircle2 size={21} />
                        </div>

                        <div>
                            <h2>
                                Today's Adherence
                            </h2>

                            <p>
                                Mark the care-plan activities you completed today.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="adherence-progress-header">
                    <div>
                        <span className="adherence-label">
                            Today's progress
                        </span>

                        <strong className="adherence-percentage">
                            {Number(
                                carePlan.adherencePercentage ?? 0
                            )}
                            %
                        </strong>
                    </div>

                    <div className="adherence-count">
                        {completedActivities.length} of{" "}
                        {ADHERENCE_ACTIVITIES.length} completed
                    </div>
                </div>

                <div className="adherence-progress">
                    <div
                        className="adherence-progress-fill"
                        style={{
                            width: `${Math.max(
                                0,
                                Math.min(
                                    100,
                                    Number(
                                        carePlan.adherencePercentage ?? 0
                                    )
                                )
                            )}%`,
                        }}
                    />
                </div>

                {adherenceLoading ? (
                    <div className="adherence-loading">
                        <Loader2
                            size={20}
                            className="spinner"
                        />
                        Loading today's adherence...
                    </div>
                ) : (
                    <div className="adherence-grid">
                        {ADHERENCE_ACTIVITIES.map(
                            ({ key, label, icon: Icon }) => {
                                const completed =
                                    completedActivities.includes(key);

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`adherence-activity ${
                                            completed
                                                ? "completed"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            toggleAdherenceActivity(
                                                key
                                            )
                                        }
                                        disabled={
                                            adherenceSaving
                                        }
                                    >
                                        <div className="adherence-activity-icon">
                                            <Icon size={21} />
                                        </div>

                                        <div className="adherence-activity-text">
                                            <strong>
                                                {label}
                                            </strong>

                                            <span>
                                                {completed
                                                    ? "Completed today"
                                                    : "Mark as completed"}
                                            </span>
                                        </div>

                                        <CheckCircle2
                                            size={22}
                                            className="adherence-check"
                                        />
                                    </button>
                                );
                            }
                        )}
                    </div>
                )}

                {adherenceSaving && (
                    <div className="adherence-saving">
                        <Loader2
                            size={16}
                            className="spinner"
                        />
                        Saving your progress...
                    </div>
                )}

                {adherenceError && (
                    <div className="adherence-error">
                        <AlertCircle size={17} />
                        {adherenceError}
                    </div>
                )}

                <div className="adherence-note">
                    Each completed activity contributes 25% to today's
                    adherence.
                </div>
            </section>

            {/* DOCTOR */}
            <section className="section-card doctor-card">
                <div className="section-header">
                    <div className="section-title">
                        <div className="section-icon">
                            <Stethoscope size={21} />
                        </div>

                        <div>
                            <h2>
                                Doctor & Clinical Notes
                            </h2>

                            <p>
                                Your care plan was prepared
                                by your healthcare team.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="doctor-content">
                    <div className="doctor-profile">
                        <div className="doctor-avatar">
                            <Stethoscope size={24} />
                        </div>

                        <div>
                            <span>
                                Care Provider
                            </span>

                            <strong>
                                {carePlan.doctorName ||
                                    "Doctor not assigned"}
                            </strong>

                            {carePlan.doctorId && (
                                <small>
                                    Doctor ID:{" "}
                                    {carePlan.doctorId}
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="doctor-notes">
                        <span>
                            Doctor Notes
                        </span>

                        <p>
                            {carePlan.doctorNotes ||
                                "No additional notes from your doctor."}
                        </p>
                    </div>
                </div>
            </section>

            {/* OUTCOME */}
            {(carePlan.outcome ||
                carePlan.currentRiskPercentage !=
                null ||
                carePlan.previousRiskPercentage !=
                null) && (
                <section className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <div className="section-icon">
                                <Activity size={21} />
                            </div>

                            <div>
                                <h2>
                                    Treatment Outcome
                                </h2>

                                <p>
                                    Progress based on your
                                    care plan
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="outcome-grid">
                        <div>
                            <span>
                                Previous Risk
                            </span>

                            <strong>
                                {carePlan.previousRiskPercentage !=
                                null
                                    ? `${Number(
                                        carePlan.previousRiskPercentage
                                    ).toFixed(1)}%`
                                    : "Not available"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Current Risk
                            </span>

                            <strong>
                                {carePlan.currentRiskPercentage !=
                                null
                                    ? `${Number(
                                        carePlan.currentRiskPercentage
                                    ).toFixed(1)}%`
                                    : "Not available"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Outcome
                            </span>

                            <strong
                                className="outcome-value"
                            >
                                {formatText(
                                    carePlan.outcome
                                )}
                            </strong>
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER INFO */}
            <div className="care-plan-footer">
                <div>
                    <span>
                        Created
                    </span>

                    <strong>
                        {formatDateTime(
                            carePlan.createdAt
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Last Updated
                    </span>

                    <strong>
                        {formatDateTime(
                            carePlan.updatedAt
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Plan Status
                    </span>

                    <strong>
                        {formatText(
                            carePlan.status
                        )}
                    </strong>
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
}

const styles = `
.care-plan-page {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 28px;
    box-sizing: border-box;
    color: #172033;
    background: #f5f7fb;
    min-height: 100%;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
}

.eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #2563eb;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
}

.page-header h1 {
    margin: 0;
    font-size: 32px;
    line-height: 1.15;
    font-weight: 800;
    color: #172033;
}

.page-header p {
    margin: 8px 0 0;
    color: #667085;
    font-size: 15px;
}

.refresh-button {
    border: 0;
    background: #2563eb;
    color: white;
    border-radius: 10px;
    padding: 11px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
}

.refresh-button:hover {
    background: #1d4ed8;
}

.refresh-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.patient-banner {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
}

.patient-info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.patient-avatar {
    width: 54px;
    height: 54px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eaf2ff;
    color: #2563eb;
}

.small-label {
    display: block;
    font-size: 12px;
    color: #98a2b3;
    margin-bottom: 3px;
}

.patient-info h2 {
    margin: 0;
    font-size: 19px;
}

.patient-id {
    display: block;
    margin-top: 4px;
    color: #667085;
    font-size: 12px;
}

.status-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
}

.status-badge {
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
}

.status-badge.approved {
    background: #dcfce7;
    color: #15803d;
}

.status-badge.pending {
    background: #fef3c7;
    color: #b45309;
}

.status-badge.rejected {
    background: #fee2e2;
    color: #b91c1c;
}

.status-badge.completed {
    background: #dbeafe;
    color: #1d4ed8;
}

.status-badge.draft {
    background: #f1f5f9;
    color: #475569;
}

.updated-text {
    color: #98a2b3;
    font-size: 11px;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}

.summary-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 17px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.035);
}

.summary-icon {
    width: 45px;
    height: 45px;
    flex: 0 0 45px;
    border-radius: 13px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.summary-card > div:last-child {
    min-width: 0;
}

.summary-card span {
    display: block;
    color: #667085;
    font-size: 12px;
    margin-bottom: 4px;
}

.summary-card strong {
    display: block;
    font-size: 22px;
    font-weight: 800;
    color: #172033;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.summary-card small {
    display: block;
    color: #98a2b3;
    font-size: 11px;
    margin-top: 3px;
}

.summary-card.risk-card.low .summary-icon {
    background: #dcfce7;
    color: #16a34a;
}

.summary-card.risk-card.medium .summary-icon {
    background: #fef3c7;
    color: #d97706;
}

.summary-card.risk-card.high .summary-icon {
    background: #ffedd5;
    color: #ea580c;
}

.summary-card.risk-card.critical .summary-icon {
    background: #fee2e2;
    color: #dc2626;
}

.section-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 22px;
    margin-bottom: 20px;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.035);
}

.section-header {
    margin-bottom: 20px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.section-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
}

.section-title h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
}

.section-title p {
    margin: 3px 0 0;
    color: #98a2b3;
    font-size: 12px;
}

.clinical-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border: 1px solid #edf0f4;
    border-radius: 13px;
    overflow: hidden;
}

.clinical-item {
    padding: 17px;
    border-right: 1px solid #edf0f4;
}

.clinical-item:last-child {
    border-right: 0;
}

.clinical-item span {
    display: block;
    color: #98a2b3;
    font-size: 12px;
    margin-bottom: 7px;
}

.clinical-item strong {
    display: block;
    font-size: 15px;
    line-height: 1.4;
}

.risk-text.low {
    color: #16a34a;
}

.risk-text.medium {
    color: #d97706;
}

.risk-text.high {
    color: #ea580c;
}

.risk-text.critical {
    color: #dc2626;
}

.recommendation-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 11px;
}

.recommendation-list li {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 11px 12px;
    border-radius: 10px;
    background: #f8fafc;
    color: #344054;
    font-size: 13px;
    line-height: 1.5;
}

.recommendation-list svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: #16a34a;
}

.empty-list {
    color: #98a2b3;
    font-size: 13px;
    margin: 0;
}

.recommendation-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 20px;
}

.recommendation-grid .section-card {
    height: calc(100% - 20px);
}

.target-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.target-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px;
    background: #f8fafc;
    border-radius: 11px;
}

.target-item > svg {
    color: #2563eb;
}

.target-item span {
    display: block;
    font-size: 11px;
    color: #98a2b3;
    margin-bottom: 3px;
}

.target-item strong {
    display: block;
    font-size: 13px;
    color: #344054;
}

.adherence-card {
    border: 1px solid #dbeafe;
}

.adherence-progress-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 10px;
}

.adherence-label {
    display: block;
    color: #667085;
    font-size: 12px;
    margin-bottom: 4px;
}

.adherence-percentage {
    display: block;
    color: #172033;
    font-size: 30px;
    line-height: 1;
    font-weight: 800;
}

.adherence-count {
    color: #667085;
    font-size: 13px;
    font-weight: 600;
}

.adherence-progress {
    width: 100%;
    height: 10px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 18px;
}

.adherence-progress-fill {
    height: 100%;
    background: #2563eb;
    border-radius: 999px;
    transition: width 0.25s ease;
}

.adherence-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.adherence-activity {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    border-radius: 13px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 11px;
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease;
}

.adherence-activity:hover:not(:disabled) {
    border-color: #93c5fd;
    transform: translateY(-1px);
}

.adherence-activity:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.adherence-activity.completed {
    border-color: #86efac;
    background: #f0fdf4;
}

.adherence-activity-icon {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 42px;
}

.adherence-activity.completed .adherence-activity-icon {
    background: #dcfce7;
    color: #16a34a;
}

.adherence-activity-text {
    min-width: 0;
    flex: 1;
}

.adherence-activity-text strong {
    display: block;
    color: #172033;
    font-size: 14px;
    margin-bottom: 3px;
}

.adherence-activity-text span {
    display: block;
    color: #667085;
    font-size: 11px;
}

.adherence-check {
    color: #cbd5e1;
    flex: 0 0 auto;
}

.adherence-activity.completed .adherence-check {
    color: #16a34a;
}

.adherence-loading,
.adherence-saving,
.adherence-error {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.adherence-loading {
    color: #667085;
    padding: 12px 0;
}

.adherence-saving {
    color: #667085;
    margin-top: 12px;
}

.adherence-error {
    color: #b91c1c;
    background: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 10px;
    padding: 10px 12px;
    margin-top: 12px;
}

.adherence-note {
    color: #98a2b3;
    font-size: 11px;
    margin-top: 13px;
}

.doctor-content {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 20px;
}

.doctor-profile {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 13px;
}

.doctor-avatar {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: #eaf2ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.doctor-profile span,
.doctor-profile small {
    display: block;
    color: #98a2b3;
    font-size: 11px;
}

.doctor-profile strong {
    display: block;
    margin: 3px 0;
    font-size: 14px;
}

.doctor-notes {
    padding: 16px;
    background: #f8fafc;
    border-radius: 13px;
}

.doctor-notes > span {
    display: block;
    color: #667085;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 7px;
}

.doctor-notes p {
    margin: 0;
    color: #475467;
    font-size: 13px;
    line-height: 1.6;
}

.outcome-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
}

.outcome-grid > div {
    padding: 16px;
    border-radius: 12px;
    background: #f8fafc;
}

.outcome-grid span {
    display: block;
    color: #98a2b3;
    font-size: 11px;
    margin-bottom: 6px;
}

.outcome-grid strong {
    display: block;
    font-size: 16px;
}

.outcome-value {
    color: #2563eb;
}

.care-plan-footer {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 18px 4px 4px;
}

.care-plan-footer > div {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.care-plan-footer span {
    color: #98a2b3;
    font-size: 11px;
}

.care-plan-footer strong {
    color: #475467;
    font-size: 12px;
}

.care-plan-loading,
.care-plan-error,
.empty-state {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 60px 25px;
    text-align: center;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.035);
}

.care-plan-loading svg {
    color: #2563eb;
}

.care-plan-loading h3,
.care-plan-error h2,
.empty-state h2 {
    margin: 16px 0 7px;
}

.care-plan-loading p,
.care-plan-error p,
.empty-state p {
    margin: 0;
    color: #667085;
    font-size: 14px;
}

.error-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto;
    border-radius: 16px;
    background: #fee2e2;
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state > svg {
    color: #2563eb;
}

.care-plan-error .refresh-button {
    margin: 20px auto 0;
}

.spinner {
    animation: carePlanSpin 0.9s linear infinite;
}

@keyframes carePlanSpin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 1100px) {
    .summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .clinical-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .clinical-item:nth-child(2) {
        border-right: 0;
    }

    .clinical-item:nth-child(-n + 2) {
        border-bottom: 1px solid #edf0f4;
    }
}

@media (max-width: 800px) {
    .adherence-grid {
        grid-template-columns: 1fr;
    }

    .care-plan-page {
        padding: 18px;
    }

    .page-header,
    .patient-banner {
        flex-direction: column;
        align-items: stretch;
    }

    .status-group {
        align-items: flex-start;
    }

    .summary-grid,
    .recommendation-grid,
    .doctor-content {
        grid-template-columns: 1fr;
    }

    .outcome-grid {
        grid-template-columns: 1fr;
    }

    .care-plan-footer {
        flex-direction: column;
    }
}

@media (max-width: 600px) {
    .summary-grid,
    .clinical-grid {
        grid-template-columns: 1fr;
    }

    .clinical-item {
        border-right: 0;
        border-bottom: 1px solid #edf0f4;
    }

    .clinical-item:last-child {
        border-bottom: 0;
    }

    .page-header h1 {
        font-size: 26px;
    }
}
`;

export default PatientCarePlan;