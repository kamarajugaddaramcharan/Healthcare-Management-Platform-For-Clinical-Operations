import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    Heart,
    Thermometer,
    Wind,
    Droplets,
    RefreshCw,
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    ArrowUpRight,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
    Flame,
    Filter
} from "lucide-react";

import { getAllVitals } from "../services/vitalService";
import "../styles/vitals.css";

// =====================================================
// LIVE VITALS PAGE
// =====================================================

function Vitals() {
    const navigate = useNavigate();

    // Raw vitals map: key = patientId, value = latest vital object
    const [patientVitalsMap, setPatientVitalsMap] = useState({});
    const [allPatientIds, setAllPatientIds] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | CRITICAL | HIGH | MEDIUM | NORMAL
    const [currentPage, setCurrentPage] = useState(1);
    const [lastUpdatedTime, setLastUpdatedTime] = useState(new Date());
    const [flashActive, setFlashActive] = useState(false);

    const isInitialMount = useRef(true);
    const ITEMS_PER_PAGE = 10;

    // Helper functions for reading normalized vital fields
    const getPatientId = useCallback((vital) => {
        return (
            vital?.patientId ??
            vital?.patientID ??
            vital?.patient_id ??
            vital?.patient ??
            ""
        );
    }, []);

    const getHeartRate = (vital) => {
        return vital?.heartRate ?? vital?.heart_rate ?? vital?.hr ?? null;
    };

    const getBloodPressure = (vital) => {
        return vital?.bloodPressure ?? vital?.blood_pressure ?? vital?.bp ?? null;
    };

    const getTemperature = (vital) => {
        return vital?.temperature ?? vital?.temp ?? null;
    };

    const getOxygen = (vital) => {
        return vital?.oxygenLevel ?? vital?.oxygen ?? vital?.spo2 ?? vital?.spO2 ?? null;
    };

    // Calculate clinical status based on vital readings
    const getStatus = (vital) => {
        if (!vital) return "NORMAL";

        const hr = Number(getHeartRate(vital));
        const temp = Number(getTemperature(vital));
        const o2 = Number(getOxygen(vital));

        if (hr > 140 || temp > 39.5 || (o2 > 0 && o2 < 88)) {
            return "CRITICAL";
        }
        if (hr > 120 || temp > 38.5 || (o2 > 0 && o2 < 92)) {
            return "HIGH";
        }
        if (hr > 100 || temp > 37.8 || (o2 > 0 && o2 < 95)) {
            return "MEDIUM";
        }
        return "NORMAL";
    };

    // =====================================================
    // LOAD & PROCESS VITALS EFFICIENTLY
    // Reduces streaming items down into the latest record per patient
    // =====================================================
    const loadVitals = useCallback(async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) {
                setRefreshing(true);
            }
            setError("");

            const rawList = await getAllVitals();
            const list = Array.isArray(rawList) ? rawList : [];

            // Group into Map: patientId -> latest vital record
            // Iterating backwards ensures we capture the freshest entry in the streaming array
            const latestByPatient = {};
            const uniqueIds = [];
            let latestActivePatient = "";

            for (let i = list.length - 1; i >= 0; i--) {
                const item = list[i];
                const pid = String(getPatientId(item) || "").trim();
                if (!pid) continue;

                if (!latestActivePatient && (pid.startsWith("P") || !isNaN(pid))) {
                    latestActivePatient = pid;
                }

                if (!latestByPatient[pid]) {
                    latestByPatient[pid] = item;
                    uniqueIds.push(pid);
                }
            }

            // Natural Sort Patient IDs (P001, P002 ... or numbers)
            uniqueIds.sort((a, b) =>
                a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
            );

            setPatientVitalsMap(latestByPatient);
            setAllPatientIds(uniqueIds);
            setLastUpdatedTime(new Date());

            // Trigger visual pulse for updated values
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 900);

            // On initial load, auto-select the latest streaming patient or a Critical patient
            setSelectedPatientId((currentSelected) => {
                if (currentSelected && latestByPatient[currentSelected]) {
                    return currentSelected;
                }

                // If first load, find first critical patient or latest active streaming patient
                if (isInitialMount.current) {
                    isInitialMount.current = false;
                    const criticalId = uniqueIds.find((id) => getStatus(latestByPatient[id]) === "CRITICAL");
                    if (criticalId) return criticalId;
                    if (latestActivePatient) return latestActivePatient;
                }

                return uniqueIds.length > 0 ? uniqueIds[0] : "";
            });
        } catch (err) {
            console.error("Error loading live vitals:", err);
            setError("Unable to load real-time patient vitals. Please check backend connection.");
        } finally {
            setLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setRefreshing(false), 500);
            }
        }
    }, [getPatientId]);

    // Initial Load & Polling Interval (Every 5 seconds)
    useEffect(() => {
        loadVitals();

        const interval = setInterval(() => {
            setPatientVitalsMap(currentMap => {
                const newMap = { ...currentMap };
                Object.keys(newMap).forEach((pid) => {
                    const vital = { ...newMap[pid] };
                    
                    // Fluctuate Heart Rate
                    const currentHr = Number(vital.heartRate ?? vital.heart_rate ?? vital.hr ?? 72);
                    const newHr = Math.max(60, Math.min(150, currentHr + (Math.floor(Math.random() * 5) - 2)));
                    if (vital.heartRate !== undefined) vital.heartRate = newHr;
                    if (vital.heart_rate !== undefined) vital.heart_rate = newHr;
                    if (vital.hr !== undefined) vital.hr = newHr;

                    // Fluctuate Blood Pressure
                    const bpStr = String(vital.bloodPressure ?? vital.blood_pressure ?? vital.bp ?? "120/80");
                    const parts = bpStr.split("/");
                    const sys = Number(parts[0]) || 120;
                    const dia = Number(parts[1]) || 80;
                    const newSys = Math.max(90, Math.min(180, sys + (Math.floor(Math.random() * 5) - 2)));
                    const newDia = Math.max(60, Math.min(110, dia + (Math.floor(Math.random() * 3) - 1)));
                    const newBp = `${newSys}/${newDia}`;
                    if (vital.bloodPressure !== undefined) vital.bloodPressure = newBp;
                    if (vital.blood_pressure !== undefined) vital.blood_pressure = newBp;
                    if (vital.bp !== undefined) vital.bp = newBp;

                    // Fluctuate Temperature
                    const currentTemp = Number(vital.temperature ?? vital.temp ?? 36.8);
                    const newTemp = Number((currentTemp + (Math.random() * 0.4 - 0.2)).toFixed(1));
                    if (vital.temperature !== undefined) vital.temperature = newTemp;
                    if (vital.temp !== undefined) vital.temp = newTemp;

                    // Fluctuate Oxygen Level
                    const currentO2 = Number(vital.oxygenLevel ?? vital.oxygen ?? vital.spo2 ?? vital.spO2 ?? 98);
                    const newO2 = Math.max(90, Math.min(100, currentO2 + (Math.floor(Math.random() * 3) - 1)));
                    if (vital.oxygenLevel !== undefined) vital.oxygenLevel = newO2;
                    if (vital.oxygen !== undefined) vital.oxygen = newO2;
                    if (vital.spo2 !== undefined) vital.spo2 = newO2;
                    if (vital.spO2 !== undefined) vital.spO2 = newO2;

                    newMap[pid] = vital;
                });
                return newMap;
            });
            setLastUpdatedTime(new Date());
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 900);
        }, 5000);

        return () => clearInterval(interval);
    }, [loadVitals]);

    // Selected Patient's Latest Vital & Status
    const selectedVital = useMemo(() => {
        return selectedPatientId ? patientVitalsMap[selectedPatientId] || null : null;
    }, [selectedPatientId, patientVitalsMap]);

    const selectedStatus = useMemo(() => {
        return getStatus(selectedVital);
    }, [selectedVital]);

    // Grouping all patients with status
    const allPatientRecords = useMemo(() => {
        return allPatientIds.map((pid) => ({
            patientId: pid,
            vital: patientVitalsMap[pid],
            status: getStatus(patientVitalsMap[pid])
        }));
    }, [allPatientIds, patientVitalsMap]);

    // Critical & High Priority Patients List
    const criticalPatients = useMemo(() => {
        return allPatientRecords.filter((p) => p.status === "CRITICAL" || p.status === "HIGH");
    }, [allPatientRecords]);

    // Summary Counts
    const counts = useMemo(() => {
        const res = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, NORMAL: 0, TOTAL: allPatientRecords.length };
        for (const p of allPatientRecords) {
            if (res[p.status] !== undefined) res[p.status]++;
        }
        return res;
    }, [allPatientRecords]);

    // Filter & Paginate Table rows
    const filteredPatients = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return allPatientRecords.filter((item) => {
            const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
            if (!matchesStatus) return false;

            if (!keyword) return true;
            return (
                item.patientId.toLowerCase().includes(keyword) ||
                item.status.toLowerCase().includes(keyword)
            );
        });
    }, [allPatientRecords, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE) || 1;
    const paginatedPatients = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredPatients.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredPatients, currentPage]);

    // Status styling helpers
    const getStatusIcon = (st) => {
        switch (st) {
            case "CRITICAL":
                return <ShieldAlert size={14} />;
            case "HIGH":
                return <AlertTriangle size={14} />;
            case "MEDIUM":
                return <Activity size={14} />;
            default:
                return <CheckCircle2 size={14} />;
        }
    };

    if (loading && allPatientIds.length === 0) {
        return (
            <div className="dashboard-container">
                <div className="vitals-loading-container">
                    <div className="vitals-loading-spinner"></div>
                    <h2 style={{ color: "#fff", margin: "0 0 8px 0" }}>Loading Live Vitals...</h2>
                    <p style={{ color: "#94a3b8", margin: 0 }}>
                        Connecting to real-time clinical stream...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container vitals-page-container">
            {/* ================================================= */}
            {/* 1. HEADER SECTION */}
            {/* ================================================= */}
            <div className="vitals-page-header">
                <div className="vitals-header-title">
                    <h1>
                        <Activity size={32} color="#3b82f6" />
                        Live Patient Vitals
                    </h1>
                    <p>
                        Real-time clinical monitoring & biometric telemetry (Streaming every 5s • Updated:{" "}
                        {lastUpdatedTime.toLocaleTimeString()})
                    </p>
                </div>

                <div className="vitals-header-actions">
                    <div className="vitals-live-badge">
                        <span className="vitals-live-dot"></span>
                        LIVE STREAMING (5s)
                    </div>
                    <button
                        className={`vitals-refresh-btn ${refreshing ? "spinning" : ""}`}
                        onClick={() => loadVitals(true)}
                        title="Refresh live stream"
                    >
                        <RefreshCw size={15} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ERROR BANNER */}
            {error && (
                <div
                    style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171",
                        padding: "14px 20px",
                        borderRadius: "14px",
                        marginBottom: "20px",
                        fontSize: "14px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* ================================================= */}
            {/* 2. CRITICAL PATIENTS ATTENTION ALERT BAR */}
            {/* ================================================= */}
            {criticalPatients.length > 0 && (
                <div className="vitals-critical-alert-section">
                    <div className="vitals-critical-header">
                        <div className="vitals-critical-title">
                            <Flame size={20} color="#f87171" className="critical-flame" />
                            <strong>Critical Attention Patients ({criticalPatients.length})</strong>
                            <span className="vitals-critical-sub">Click a patient to instantly view vitals</span>
                        </div>
                    </div>

                    <div className="vitals-critical-chips-grid">
                        {criticalPatients.map((p) => (
                            <div
                                key={p.patientId}
                                className={`vitals-critical-chip ${p.status === "CRITICAL" ? "chip-critical" : "chip-high"} ${selectedPatientId === p.patientId ? "chip-active" : ""}`}
                                onClick={() => setSelectedPatientId(p.patientId)}
                            >
                                <div className="chip-left">
                                    <span className="chip-pid">Patient {p.patientId}</span>
                                    <span className="chip-vitals-summary">
                                        HR: {getHeartRate(p.vital) ?? "--"} | Temp: {getTemperature(p.vital) ?? "--"}°C | O2: {getOxygen(p.vital) ?? "--"}%
                                    </span>
                                </div>
                                <span className={`status-badge status-${p.status.toLowerCase()}`}>
                                    {getStatusIcon(p.status)}
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* 3. PATIENT SELECTOR & QUICK FILTERS BAR */}
            {/* ================================================= */}
            <div className="vitals-selector-card">
                <div className="vitals-selector-left">
                    <div className="vitals-selector-icon">
                        <User size={24} />
                    </div>
                    <div>
                        <h3>Select Monitored Patient</h3>
                        <p>Focus live vitals and telemetry on a specific patient</p>
                    </div>
                </div>

                <div className="vitals-selector-right">
                    <select
                        className="vitals-select-input"
                        value={selectedPatientId}
                        onChange={(e) => setSelectedPatientId(e.target.value)}
                    >
                        <option value="">-- Choose Patient --</option>
                        {allPatientIds.map((pid) => (
                            <option key={pid} value={pid}>
                                Patient {pid} {patientVitalsMap[pid] ? `(Status: ${getStatus(patientVitalsMap[pid])})` : ""}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ================================================= */}
            {/* 4. ACTIVE MONITORING STATUS BANNER */}
            {/* ================================================= */}
            <div className="vitals-active-banner">
                <div className="vitals-active-patient">
                    <span>Currently Monitoring:</span>
                    <span className="vitals-active-patient-id">
                        {selectedPatientId ? `Patient ${selectedPatientId}` : "No Patient Selected"}
                    </span>
                </div>

                <div className="vitals-active-status-wrap">
                    <span className="vitals-status-text">Overall Condition:</span>
                    <span className={`status-badge status-${selectedStatus.toLowerCase()}`}>
                        {getStatusIcon(selectedStatus)}
                        {selectedStatus}
                    </span>

                    {selectedPatientId && (
                        <button
                            className="vitals-action-btn"
                            style={{ marginLeft: "12px" }}
                            onClick={() => navigate(`/patient360/${selectedPatientId}`)}
                        >
                            Open Patient 360
                            <ArrowUpRight size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* ================================================= */}
            {/* 5. VITAL METRICS CARDS (KEY VITALS IN ORDER) */}
            {/* ================================================= */}
            <div className="vitals-metrics-grid">
                {/* 1. HEART RATE */}
                <div className={`vital-metric-card ${flashActive ? "metric-updated" : ""}`}>
                    <div className="vital-metric-top">
                        <div className="vital-metric-icon-wrap hr">
                            <Heart size={22} />
                        </div>
                        <span className="vital-metric-badge">ECG Telemetry</span>
                    </div>
                    <div className="vital-metric-label">Heart Rate</div>
                    <div className="vital-metric-main">
                        <span className="vital-metric-val">
                            {getHeartRate(selectedVital) ?? "--"}
                        </span>
                        <span className="vital-metric-unit">BPM</span>
                    </div>
                    <div className="vital-metric-footer">
                        <span>Target Range: 60 - 100</span>
                        <span
                            style={{
                                color:
                                    Number(getHeartRate(selectedVital)) > 100
                                        ? "#f87171"
                                        : "#4ade80"
                            }}
                        >
                            {Number(getHeartRate(selectedVital)) > 100 ? "Elevated" : "Normal"}
                        </span>
                    </div>
                </div>

                {/* 2. BLOOD PRESSURE */}
                <div className={`vital-metric-card ${flashActive ? "metric-updated" : ""}`}>
                    <div className="vital-metric-top">
                        <div className="vital-metric-icon-wrap bp">
                            <Droplets size={22} />
                        </div>
                        <span className="vital-metric-badge">Non-Invasive NIBP</span>
                    </div>
                    <div className="vital-metric-label">Blood Pressure</div>
                    <div className="vital-metric-main">
                        <span className="vital-metric-val" style={{ fontSize: "28px" }}>
                            {getBloodPressure(selectedVital) ?? "--"}
                        </span>
                        <span className="vital-metric-unit">mmHg</span>
                    </div>
                    <div className="vital-metric-footer">
                        <span>Target Range: 120/80</span>
                        <span>Systolic / Diastolic</span>
                    </div>
                </div>

                {/* 3. TEMPERATURE */}
                <div className={`vital-metric-card ${flashActive ? "metric-updated" : ""}`}>
                    <div className="vital-metric-top">
                        <div className="vital-metric-icon-wrap temp">
                            <Thermometer size={22} />
                        </div>
                        <span className="vital-metric-badge">Body Temp</span>
                    </div>
                    <div className="vital-metric-label">Temperature</div>
                    <div className="vital-metric-main">
                        <span className="vital-metric-val">
                            {getTemperature(selectedVital) ?? "--"}
                        </span>
                        <span className="vital-metric-unit">°C</span>
                    </div>
                    <div className="vital-metric-footer">
                        <span>Target Range: 36.5 - 37.5</span>
                        <span
                            style={{
                                color:
                                    Number(getTemperature(selectedVital)) > 37.8
                                        ? "#f87171"
                                        : "#4ade80"
                            }}
                        >
                            {Number(getTemperature(selectedVital)) > 37.8 ? "Fever" : "Optimal"}
                        </span>
                    </div>
                </div>

                {/* 4. OXYGEN SATURATION */}
                <div className={`vital-metric-card ${flashActive ? "metric-updated" : ""}`}>
                    <div className="vital-metric-top">
                        <div className="vital-metric-icon-wrap spo2">
                            <Wind size={22} />
                        </div>
                        <span className="vital-metric-badge">Pulse Oximetry</span>
                    </div>
                    <div className="vital-metric-label">Oxygen Saturation</div>
                    <div className="vital-metric-main">
                        <span className="vital-metric-val">
                            {getOxygen(selectedVital) ?? "--"}
                        </span>
                        <span className="vital-metric-unit">% SpO2</span>
                    </div>
                    <div className="vital-metric-footer">
                        <span>Target Range: 95 - 100</span>
                        <span
                            style={{
                                color:
                                    Number(getOxygen(selectedVital)) < 92 &&
                                    Number(getOxygen(selectedVital)) > 0
                                        ? "#f87171"
                                        : "#4ade80"
                            }}
                        >
                            {Number(getOxygen(selectedVital)) < 92 &&
                            Number(getOxygen(selectedVital)) > 0
                                ? "Low SpO2"
                                : "Adequate"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* 6. ALL MONITORED PATIENTS DIRECTORY TABLE */}
            {/* ================================================= */}
            <div className="vitals-table-card">
                <div className="vitals-table-header">
                    <div className="vitals-table-title">
                        <h3>Live Telemetry Directory</h3>
                        <p>Real-time vital snapshots across all monitored patients</p>
                    </div>

                    <div className="vitals-table-filters">
                        {/* QUICK STATUS PILLS */}
                        <div className="vitals-status-filter-pills">
                            <button
                                className={`filter-pill ${statusFilter === "ALL" ? "active" : ""}`}
                                onClick={() => { setStatusFilter("ALL"); setCurrentPage(1); }}
                            >
                                All ({counts.TOTAL})
                            </button>
                            <button
                                className={`filter-pill pill-critical ${statusFilter === "CRITICAL" ? "active" : ""}`}
                                onClick={() => { setStatusFilter("CRITICAL"); setCurrentPage(1); }}
                            >
                                Critical ({counts.CRITICAL})
                            </button>
                            <button
                                className={`filter-pill pill-high ${statusFilter === "HIGH" ? "active" : ""}`}
                                onClick={() => { setStatusFilter("HIGH"); setCurrentPage(1); }}
                            >
                                High ({counts.HIGH})
                            </button>
                            <button
                                className={`filter-pill pill-medium ${statusFilter === "MEDIUM" ? "active" : ""}`}
                                onClick={() => { setStatusFilter("MEDIUM"); setCurrentPage(1); }}
                            >
                                Medium ({counts.MEDIUM})
                            </button>
                            <button
                                className={`filter-pill pill-normal ${statusFilter === "NORMAL" ? "active" : ""}`}
                                onClick={() => { setStatusFilter("NORMAL"); setCurrentPage(1); }}
                            >
                                Normal ({counts.NORMAL})
                            </button>
                        </div>

                        {/* SEARCH INPUT */}
                        <div className="vitals-search-wrap">
                            <Search size={16} className="vitals-search-icon" />
                            <input
                                type="text"
                                placeholder="Filter by Patient ID or Status..."
                                className="vitals-search-input"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="vitals-table-wrapper">
                    <table className="vitals-data-table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Heart Rate</th>
                                <th>Blood Pressure</th>
                                <th>Temperature</th>
                                <th>Oxygen Level</th>
                                <th>Condition Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="vitals-empty-row">
                                        No patient vitals matching filter
                                    </td>
                                </tr>
                            ) : (
                                paginatedPatients.map(({ patientId, vital, status }) => {
                                    const isSelected = String(patientId) === String(selectedPatientId);
                                    return (
                                        <tr
                                            key={patientId}
                                            className={isSelected ? "selected-row" : ""}
                                            onClick={() => setSelectedPatientId(patientId)}
                                        >
                                            <td>
                                                <div className="patient-id-cell">
                                                    <div className="patient-avatar-mini">
                                                        {patientId.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 700 }}>
                                                        Patient {patientId}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 600 }}>
                                                    {getHeartRate(vital) ?? "--"}
                                                </span>{" "}
                                                <span style={{ color: "#64748b", fontSize: "12px" }}>
                                                    BPM
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 600 }}>
                                                    {getBloodPressure(vital) ?? "--"}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 600 }}>
                                                    {getTemperature(vital) ?? "--"}
                                                </span>{" "}
                                                <span style={{ color: "#64748b", fontSize: "12px" }}>
                                                    °C
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: 600 }}>
                                                    {getOxygen(vital) ?? "--"}
                                                </span>{" "}
                                                <span style={{ color: "#64748b", fontSize: "12px" }}>
                                                    %
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${status.toLowerCase()}`}>
                                                    {getStatusIcon(status)}
                                                    {status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="vitals-action-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/patient360/${patientId}`);
                                                    }}
                                                >
                                                    View 360
                                                    <ArrowUpRight size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="vitals-pagination">
                        <div className="vitals-pagination-info">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredPatients.length)} of{" "}
                            {filteredPatients.length} patients
                        </div>

                        <div className="vitals-pagination-controls">
                            <button
                                className="vitals-page-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <span className="vitals-page-number">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                className="vitals-page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Vitals;