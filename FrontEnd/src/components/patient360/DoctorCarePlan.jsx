import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    Apple,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Dumbbell,
    Loader2,
    Plus,
    Save,
    Send,
    ShieldCheck,
    Stethoscope,
    Trash2,
    XCircle,
} from "lucide-react";

import {
    getLatestCarePlan,
    createCarePlan,
    updateCarePlan,
    approveCarePlan as approveCarePlanApi,
    rejectCarePlan as rejectCarePlanApi
} from "../../services/carePlanService";

function DoctorCarePlan({
                            patientId: propPatientId,
                            patientName: propPatientName,
                            doctorId: propDoctorId,
                            doctorName: propDoctorName,
                        }) {
    const [patientId, setPatientId] = useState(
        propPatientId || ""
    );

    const [patientName, setPatientName] = useState(
        propPatientName || ""
    );

    const [doctorId, setDoctorId] = useState(
        propDoctorId || ""
    );

    const [doctorName, setDoctorName] = useState(
        propDoctorName || ""
    );

    const [carePlan, setCarePlan] = useState(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [medicationInput, setMedicationInput] =
        useState("");

    const [dietInput, setDietInput] = useState("");

    const [exerciseInput, setExerciseInput] =
        useState("");

    const [lifestyleInput, setLifestyleInput] =
        useState("");

    const [form, setForm] = useState({
        diagnosis: "",
        riskLevel: "LOW",
        riskPercentage: 0,
        healthScore: 100,

        medications: [],
        dietRecommendations: [],
        exerciseRecommendations: [],
        lifestyleRecommendations: [],

        dailyWaterTarget: "",
        sleepRecommendation: "",

        doctorNotes: "",

        nextReviewDate: "",

        status: "DRAFT",
    });

    /*
     * Load doctor/patient information from localStorage
     * when props are not supplied.
     */
    const loadUserContext = useCallback(() => {
        try {
            const storedUser =
                JSON.parse(
                    localStorage.getItem("user") || "null"
                );

            if (!doctorId && storedUser?.id) {
                setDoctorId(String(storedUser.id));
            }

            if (
                !doctorName &&
                storedUser?.name
            ) {
                setDoctorName(storedUser.name);
            }

            if (
                !doctorName &&
                storedUser?.fullName
            ) {
                setDoctorName(storedUser.fullName);
            }
        } catch (err) {
            console.warn(
                "Unable to load doctor context",
                err
            );
        }
    }, [doctorId, doctorName]);

    useEffect(() => {
        loadUserContext();
    }, [loadUserContext]);

    /*
     * Keep patient information synchronized
     * when parent changes the selected patient.
     */
    useEffect(() => {
        if (propPatientId) {
            setPatientId(String(propPatientId));
        }

        if (propPatientName) {
            setPatientName(propPatientName);
        }

        if (propDoctorId) {
            setDoctorId(String(propDoctorId));
        }

        if (propDoctorName) {
            setDoctorName(propDoctorName);
        }
    }, [
        propPatientId,
        propPatientName,
        propDoctorId,
        propDoctorName,
    ]);

    /*
     * Update form field.
     */
    const updateField = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    /*
     * Load latest care plan for selected patient.
     */
    const loadCarePlan = useCallback(async () => {
        if (!patientId) {
            setCarePlan(null);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data = await getLatestCarePlan(patientId);

            setCarePlan(data);
            setForm({
                diagnosis: data.diagnosis || "",
                riskLevel: data.riskLevel || "LOW",
                riskPercentage: data.riskPercentage ?? 0,
                healthScore: data.healthScore ?? 100,
                medications: Array.isArray(data.medications) ? data.medications : [],
                dietRecommendations: Array.isArray(data.dietRecommendations) ? data.dietRecommendations : [],
                exerciseRecommendations: Array.isArray(data.exerciseRecommendations) ? data.exerciseRecommendations : [],
                lifestyleRecommendations: Array.isArray(data.lifestyleRecommendations) ? data.lifestyleRecommendations : [],
                dailyWaterTarget: data.dailyWaterTarget ?? "",
                sleepRecommendation: data.sleepRecommendation || "",
                doctorNotes: data.doctorNotes || "",
                nextReviewDate: data.nextReviewDate ? String(data.nextReviewDate).substring(0, 10) : "",
                status: data.status || "DRAFT"
            });

            if (!patientName && data.patientName) {
                setPatientName(data.patientName);
            }
        } catch (err) {
            if (err?.response?.status === 404) {
                setCarePlan(null);
                setForm((previous) => ({
                    ...previous, diagnosis: "", riskLevel: "LOW", riskPercentage: 0, healthScore: 100,
                    medications: [], dietRecommendations: [], exerciseRecommendations: [], lifestyleRecommendations: [],
                    dailyWaterTarget: "", sleepRecommendation: "", doctorNotes: "", nextReviewDate: "", status: "DRAFT"
                }));
                return;
            }
            console.error("Failed to load care plan:", err);
            setError("Unable to load the patient's care plan.");
        } finally {
            setLoading(false);
        }
    }, [patientId, patientName]);

    useEffect(() => {
        if (patientId) {
            loadCarePlan();
        }
    }, [patientId, loadCarePlan]);

    /*
     * Add item to array.
     */
    const addItem = (field, value, clearInput) => {
        const cleaned = value.trim();

        if (!cleaned) {
            return;
        }

        setForm((previous) => ({
            ...previous,
            [field]: [
                ...(previous[field] || []),
                cleaned,
            ],
        }));

        clearInput("");
    };

    /*
     * Remove item.
     */
    const removeItem = (field, index) => {
        setForm((previous) => ({
            ...previous,
            [field]: previous[field].filter(
                (_, itemIndex) =>
                    itemIndex !== index
            ),
        }));
    };

    /*
     * Build backend object.
     */
    const buildPayload = (status = form.status) => {
        return {
            patientId: patientId,
            patientName:
                patientName || "Patient",

            diagnosis:
                form.diagnosis || null,

            riskLevel:
                form.riskLevel || "LOW",

            riskPercentage:
                Number(form.riskPercentage || 0),

            healthScore:
                Number(form.healthScore || 0),

            medications:
                form.medications || [],

            dietRecommendations:
                form.dietRecommendations || [],

            exerciseRecommendations:
                form.exerciseRecommendations || [],

            lifestyleRecommendations:
                form.lifestyleRecommendations || [],

            dailyWaterTarget:
                form.dailyWaterTarget === ""
                    ? null
                    : Number(
                        form.dailyWaterTarget
                    ),

            sleepRecommendation:
                form.sleepRecommendation || null,

            doctorId:
                doctorId || null,

            doctorName:
                doctorName || null,

            doctorNotes:
                form.doctorNotes || null,

            status,

            nextReviewDate:
                form.nextReviewDate
                    ? `${form.nextReviewDate}T00:00:00`
                    : null,
        };
    };

    /*
     * CREATE / UPDATE
     */
    const saveCarePlan = async (requestedStatus = "DRAFT") => {
        if (!patientId) { setError("Select a patient before saving the care plan."); return; }
        if (!form.diagnosis.trim()) { setError("Diagnosis is required."); return; }
        try {
            setSaving(true); setError(""); setMessage("");
            const payload = buildPayload(requestedStatus);
            const saved = carePlan?.id
                ? await updateCarePlan(carePlan.id, payload)
                : await createCarePlan(payload);
            setCarePlan(saved);
            setForm((previous) => ({ ...previous, status: saved.status || requestedStatus }));
            setMessage(requestedStatus === "PENDING_APPROVAL" ? "Care plan submitted for approval." : "Care plan saved successfully.");
        } catch (err) {
            console.error("Save care plan error:", err);
            setError("Unable to save the care plan.");
        } finally { setSaving(false); }
    };

    /*
     * Approve.
     */
    const approveCarePlan = async () => {
        if (!carePlan?.id) { setError("Save the care plan before approving it."); return; }
        try {
            setSaving(true); setError(""); setMessage("");
            const approved = await approveCarePlanApi(carePlan.id, doctorId, doctorName, form.doctorNotes);
            setCarePlan(approved);
            setForm((previous) => ({ ...previous, status: approved.status || "APPROVED" }));
            setMessage("Care plan approved successfully. The patient can now see the approved plan.");
        } catch (err) {
            console.error("Approve care plan error:", err);
            setError("Unable to approve the care plan.");
        } finally { setSaving(false); }
    };

    /*
     * Reject.
     */
    const rejectCarePlan = async () => {
        if (!carePlan?.id) { setError("Save the care plan before rejecting it."); return; }
        if (!form.doctorNotes.trim()) { setError("Add doctor notes explaining the rejection."); return; }
        try {
            setSaving(true); setError(""); setMessage("");
            const rejected = await rejectCarePlanApi(carePlan.id, doctorId, doctorName, form.doctorNotes);
            setCarePlan(rejected);
            setForm((previous) => ({ ...previous, status: rejected.status || "REJECTED" }));
            setMessage("Care plan rejected.");
        } catch (err) {
            console.error("Reject care plan error:", err);
            setError("Unable to reject the care plan.");
        } finally { setSaving(false); }
    };

    /*
     * No patient selected.
     */
    if (!patientId) {
        return (
            <div className="doctor-care-plan">
                <div className="empty-box">
                    <ClipboardList size={45} />

                    <h2>
                        Select a patient
                    </h2>

                    <p>
                        Select a patient from the
                        Doctor Portal to create or
                        edit their care plan.
                    </p>
                </div>

                <style>{styles}</style>
            </div>
        );
    }

    return (
        <div className="doctor-care-plan">
            {/* HEADER */}
            <div className="doctor-page-header">
                <div>
                    <div className="eyebrow">
                        <Stethoscope size={17} />
                        Doctor Portal
                    </div>

                    <h1>
                        Patient Care Plan
                    </h1>

                    <p>
                        Create, edit and manage the
                        patient's treatment plan.
                    </p>
                </div>

                <div className="patient-header">
                    <div className="patient-header-icon">
                        {patientName
                            ? patientName
                                .charAt(0)
                                .toUpperCase()
                            : "P"}
                    </div>

                    <div>
                        <strong>
                            {patientName ||
                                "Patient"}
                        </strong>

                        <span>
                            Patient ID: {patientId}
                        </span>
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            {error && (
                <div className="alert error">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {message && (
                <div className="alert success">
                    <CheckCircle2 size={18} />
                    {message}
                </div>
            )}

            {loading && (
                <div className="loading-box">
                    <Loader2
                        className="spinner"
                        size={25}
                    />

                    Loading care plan...
                </div>
            )}

            {/* FORM */}
            {!loading && (
                <>
                    {/* STATUS */}
                    <div className="status-bar">
                        <div>
                            <span>
                                Current Status
                            </span>

                            <strong>
                                {(
                                    form.status ||
                                    "DRAFT"
                                )
                                    .replaceAll(
                                        "_",
                                        " "
                                    )}
                            </strong>
                        </div>

                        {carePlan?.updatedAt && (
                            <small>
                                Last updated:{" "}
                                {new Date(
                                    carePlan.updatedAt
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </small>
                        )}
                    </div>

                    {/* CLINICAL */}
                    <section className="card">
                        <div className="card-title">
                            <ShieldCheck size={21} />

                            <div>
                                <h2>
                                    Clinical Assessment
                                </h2>

                                <p>
                                    Enter the patient's
                                    current clinical
                                    assessment.
                                </p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="field full">
                                <label>
                                    Diagnosis
                                </label>

                                <textarea
                                    value={
                                        form.diagnosis
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "diagnosis",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter diagnosis..."
                                    rows={3}
                                />
                            </div>

                            <div className="field">
                                <label>
                                    Risk Level
                                </label>

                                <select
                                    value={
                                        form.riskLevel
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "riskLevel",
                                            event.target
                                                .value
                                        )
                                    }
                                >
                                    <option value="LOW">
                                        LOW
                                    </option>

                                    <option value="MEDIUM">
                                        MEDIUM
                                    </option>

                                    <option value="HIGH">
                                        HIGH
                                    </option>

                                    <option value="CRITICAL">
                                        CRITICAL
                                    </option>
                                </select>
                            </div>

                            <div className="field">
                                <label>
                                    Risk Percentage
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={
                                        form.riskPercentage
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "riskPercentage",
                                            event.target
                                                .value
                                        )
                                    }
                                />
                            </div>

                            <div className="field">
                                <label>
                                    Health Score
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={
                                        form.healthScore
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "healthScore",
                                            event.target
                                                .value
                                        )
                                    }
                                />
                            </div>

                            <div className="field">
                                <label>
                                    Next Review Date
                                </label>

                                <input
                                    type="date"
                                    value={
                                        form.nextReviewDate
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "nextReviewDate",
                                            event.target
                                                .value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* MEDICATIONS */}
                    <section className="card">
                        <div className="card-title">
                            <ClipboardList size={21} />

                            <div>
                                <h2>
                                    Medications
                                </h2>

                                <p>
                                    Add medications prescribed
                                    to the patient.
                                </p>
                            </div>
                        </div>

                        <ItemEditor
                            value={
                                medicationInput
                            }
                            setValue={
                                setMedicationInput
                            }
                            onAdd={() =>
                                addItem(
                                    "medications",
                                    medicationInput,
                                    setMedicationInput
                                )
                            }
                            items={
                                form.medications
                            }
                            onRemove={(index) =>
                                removeItem(
                                    "medications",
                                    index
                                )
                            }
                            placeholder="Example: Continue prescribed medication"
                        />
                    </section>

                    {/* RECOMMENDATIONS */}
                    <div className="two-column">
                        <section className="card">
                            <div className="card-title">
                                <Apple size={21} />

                                <div>
                                    <h2>
                                        Diet
                                    </h2>

                                    <p>
                                        Nutrition
                                        recommendations.
                                    </p>
                                </div>
                            </div>

                            <ItemEditor
                                value={dietInput}
                                setValue={
                                    setDietInput
                                }
                                onAdd={() =>
                                    addItem(
                                        "dietRecommendations",
                                        dietInput,
                                        setDietInput
                                    )
                                }
                                items={
                                    form.dietRecommendations
                                }
                                onRemove={(index) =>
                                    removeItem(
                                        "dietRecommendations",
                                        index
                                    )
                                }
                                placeholder="Example: Maintain a balanced diet"
                            />
                        </section>

                        <section className="card">
                            <div className="card-title">
                                <Dumbbell size={21} />

                                <div>
                                    <h2>
                                        Exercise
                                    </h2>

                                    <p>
                                        Physical activity
                                        recommendations.
                                    </p>
                                </div>
                            </div>

                            <ItemEditor
                                value={
                                    exerciseInput
                                }
                                setValue={
                                    setExerciseInput
                                }
                                onAdd={() =>
                                    addItem(
                                        "exerciseRecommendations",
                                        exerciseInput,
                                        setExerciseInput
                                    )
                                }
                                items={
                                    form.exerciseRecommendations
                                }
                                onRemove={(index) =>
                                    removeItem(
                                        "exerciseRecommendations",
                                        index
                                    )
                                }
                                placeholder="Example: Regular light exercise"
                            />
                        </section>
                    </div>

                    {/* LIFESTYLE */}
                    <section className="card">
                        <div className="card-title">
                            <ShieldCheck size={21} />

                            <div>
                                <h2>
                                    Lifestyle
                                </h2>

                                <p>
                                    Daily lifestyle
                                    recommendations.
                                </p>
                            </div>
                        </div>

                        <ItemEditor
                            value={
                                lifestyleInput
                            }
                            setValue={
                                setLifestyleInput
                            }
                            onAdd={() =>
                                addItem(
                                    "lifestyleRecommendations",
                                    lifestyleInput,
                                    setLifestyleInput
                                )
                            }
                            items={
                                form.lifestyleRecommendations
                            }
                            onRemove={(index) =>
                                removeItem(
                                    "lifestyleRecommendations",
                                    index
                                )
                            }
                            placeholder="Example: Continue routine monitoring"
                        />
                    </section>

                    {/* DAILY TARGETS */}
                    <section className="card">
                        <div className="card-title">
                            <Calendar size={21} />

                            <div>
                                <h2>
                                    Daily Targets
                                </h2>

                                <p>
                                    Set the patient's
                                    wellness targets.
                                </p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label>
                                    Daily Water Target
                                    (Litres)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={
                                        form.dailyWaterTarget
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "dailyWaterTarget",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Example: 2.5"
                                />
                            </div>

                            <div className="field">
                                <label>
                                    Sleep Recommendation
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.sleepRecommendation
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "sleepRecommendation",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Example: 7-8 hours"
                                />
                            </div>
                        </div>
                    </section>

                    {/* DOCTOR */}
                    <section className="card">
                        <div className="card-title">
                            <Stethoscope size={21} />

                            <div>
                                <h2>
                                    Doctor Information
                                </h2>

                                <p>
                                    Clinical notes and
                                    approval information.
                                </p>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label>
                                    Doctor ID
                                </label>

                                <input
                                    type="text"
                                    value={doctorId}
                                    onChange={(event) =>
                                        setDoctorId(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Doctor ID"
                                />
                            </div>

                            <div className="field">
                                <label>
                                    Doctor Name
                                </label>

                                <input
                                    type="text"
                                    value={doctorName}
                                    onChange={(event) =>
                                        setDoctorName(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Doctor name"
                                />
                            </div>

                            <div className="field full">
                                <label>
                                    Doctor Notes
                                </label>

                                <textarea
                                    rows={5}
                                    value={
                                        form.doctorNotes
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "doctorNotes",
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Enter clinical notes..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* ACTIONS */}
                    <div className="actions">
                        <button
                            className="button secondary"
                            disabled={saving}
                            onClick={() =>
                                saveCarePlan(
                                    "DRAFT"
                                )
                            }
                        >
                            {saving ? (
                                <Loader2
                                    size={17}
                                    className="spinner"
                                />
                            ) : (
                                <Save size={17} />
                            )}

                            Save Draft
                        </button>

                        <button
                            className="button primary"
                            disabled={saving}
                            onClick={() =>
                                saveCarePlan(
                                    "PENDING_APPROVAL"
                                )
                            }
                        >
                            {saving ? (
                                <Loader2
                                    size={17}
                                    className="spinner"
                                />
                            ) : (
                                <Send size={17} />
                            )}

                            Submit for Approval
                        </button>

                        {carePlan?.id && (
                            <>
                                <button
                                    className="button approve"
                                    disabled={saving}
                                    onClick={
                                        approveCarePlan
                                    }
                                >
                                    <CheckCircle2
                                        size={17}
                                    />

                                    Approve
                                </button>

                                <button
                                    className="button reject"
                                    disabled={saving}
                                    onClick={
                                        rejectCarePlan
                                    }
                                >
                                    <XCircle
                                        size={17}
                                    />

                                    Reject
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}

            <style>{styles}</style>
        </div>
    );
}

/*
 * Reusable list editor.
 */
function ItemEditor({
                        value,
                        setValue,
                        onAdd,
                        items,
                        onRemove,
                        placeholder,
                    }) {
    return (
        <div>
            <div className="item-input">
                <input
                    value={value}
                    onChange={(event) =>
                        setValue(
                            event.target.value
                        )
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key === "Enter"
                        ) {
                            event.preventDefault();
                            onAdd();
                        }
                    }}
                    placeholder={placeholder}
                />

                <button
                    type="button"
                    onClick={onAdd}
                >
                    <Plus size={17} />
                    Add
                </button>
            </div>

            <div className="item-list">
                {items.length === 0 ? (
                    <p className="empty-items">
                        Nothing added yet.
                    </p>
                ) : (
                    items.map(
                        (item, index) => (
                            <div
                                className="item"
                                key={`${item}-${index}`}
                            >
                                <div>
                                    <CheckCircle2
                                        size={16}
                                    />

                                    <span>
                                        {item}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(
                                            index
                                        )
                                    }
                                >
                                    <Trash2
                                        size={15}
                                    />
                                </button>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}

const styles = `
.doctor-care-plan {
    max-width: 1400px;
    margin: 0 auto;
    padding: 28px;
    background: #f5f7fb;
    min-height: 100%;
    color: #172033;
    font-family: Inter, system-ui, sans-serif;
}

.doctor-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 22px;
}

.eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #2563eb;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 7px;
}

.doctor-page-header h1 {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
}

.doctor-page-header p {
    margin: 7px 0 0;
    color: #667085;
    font-size: 14px;
}

.patient-header {
    display: flex;
    align-items: center;
    gap: 11px;
    background: white;
    padding: 11px 15px;
    border: 1px solid #e5e7eb;
    border-radius: 13px;
}

.patient-header-icon {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2563eb;
    color: white;
    font-weight: 800;
}

.patient-header strong,
.patient-header span {
    display: block;
}

.patient-header strong {
    font-size: 14px;
}

.patient-header span {
    margin-top: 3px;
    font-size: 11px;
    color: #98a2b3;
}

.alert {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 13px 15px;
    border-radius: 11px;
    margin-bottom: 18px;
    font-size: 13px;
    font-weight: 600;
}

.alert.error {
    background: #fee2e2;
    color: #b91c1c;
}

.alert.success {
    background: #dcfce7;
    color: #15803d;
}

.loading-box,
.empty-box {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 17px;
    padding: 50px;
    text-align: center;
}

.empty-box > svg {
    color: #2563eb;
}

.empty-box h2 {
    margin: 15px 0 7px;
}

.empty-box p {
    color: #667085;
    font-size: 14px;
}

.status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 18px;
    background: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 13px;
    margin-bottom: 18px;
}

.status-bar span {
    display: block;
    color: #64748b;
    font-size: 11px;
}

.status-bar strong {
    display: block;
    margin-top: 3px;
    color: #2563eb;
    font-size: 14px;
}

.status-bar small {
    color: #64748b;
}

.card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 17px;
    padding: 21px;
    margin-bottom: 18px;
    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.035);
}

.card-title {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-bottom: 20px;
}

.card-title > svg {
    width: 40px;
    height: 40px;
    padding: 9px;
    box-sizing: border-box;
    border-radius: 11px;
    background: #eff6ff;
    color: #2563eb;
}

.card-title h2 {
    margin: 0;
    font-size: 17px;
}

.card-title p {
    margin: 3px 0 0;
    color: #98a2b3;
    font-size: 11px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 17px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.field.full {
    grid-column: 1 / -1;
}

.field label {
    font-size: 12px;
    color: #475467;
    font-weight: 700;
}

.field input,
.field textarea,
.field select,
.item-input input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d9dee8;
    border-radius: 9px;
    padding: 11px 12px;
    outline: none;
    background: white;
    color: #172033;
    font-family: inherit;
    font-size: 13px;
}

.field textarea {
    resize: vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus,
.item-input input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.09);
}

.two-column {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0 18px;
}

.item-input {
    display: flex;
    gap: 9px;
}

.item-input button {
    flex: 0 0 auto;
    border: 0;
    border-radius: 9px;
    background: #2563eb;
    color: white;
    padding: 0 15px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-weight: 700;
}

.item-input button:hover {
    background: #1d4ed8;
}

.item-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
}

.item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: #f8fafc;
    border-radius: 9px;
    padding: 10px 12px;
}

.item > div {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}

.item > div svg {
    color: #16a34a;
    flex: 0 0 auto;
}

.item span {
    font-size: 13px;
    color: #344054;
}

.item > button {
    border: 0;
    background: transparent;
    color: #dc2626;
    cursor: pointer;
}

.empty-items {
    color: #98a2b3;
    font-size: 12px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
    padding-bottom: 20px;
}

.button {
    border: 0;
    border-radius: 10px;
    padding: 11px 16px;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    font-weight: 700;
    font-size: 13px;
}

.button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.button.secondary {
    background: #e2e8f0;
    color: #334155;
}

.button.primary {
    background: #2563eb;
    color: white;
}

.button.approve {
    background: #16a34a;
    color: white;
}

.button.reject {
    background: #dc2626;
    color: white;
}

.spinner {
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 850px) {
    .doctor-page-header {
        flex-direction: column;
    }

    .patient-header {
        width: fit-content;
    }

    .form-grid,
    .two-column {
        grid-template-columns: 1fr;
    }

    .field.full {
        grid-column: auto;
    }
}

@media (max-width: 600px) {
    .doctor-care-plan {
        padding: 16px;
    }

    .status-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .actions {
        justify-content: stretch;
    }

    .button {
        flex: 1;
        justify-content: center;
    }
}
`;

export default DoctorCarePlan;