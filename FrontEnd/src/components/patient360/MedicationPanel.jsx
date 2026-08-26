import {
    FaSyringe,
    FaShieldVirus,
    FaCheckCircle,
    FaCalendarAlt,
    FaPlus,
} from "react-icons/fa";

const vaccinations = [
    {
        vaccine: "COVID-19 Booster",
        date: "12 Jun 2026",
        status: "Completed",
        nextDose: "Not Required",
        color: "#22c55e",
    },
    {
        vaccine: "Influenza Vaccine",
        date: "15 Jan 2026",
        status: "Completed",
        nextDose: "Jan 2027",
        color: "#3b82f6",
    },
    {
        vaccine: "Hepatitis B",
        date: "20 Mar 2025",
        status: "Completed",
        nextDose: "Completed",
        color: "#8b5cf6",
    },
    {
        vaccine: "Tetanus Booster",
        date: "Pending",
        status: "Due",
        nextDose: "Schedule Soon",
        color: "#f59e0b",
    },
];

function VaccinationHistory() {
    return (
        <div
            style={{
                marginTop: 24,
                padding: 24,
                borderRadius: 24,
                background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
                color: "#fff",
                boxShadow: "0 20px 40px rgba(0,0,0,.30)",
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">

                <div className="d-flex align-items-center gap-3">

                    <div
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "rgba(59,130,246,.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                        }}
                    >
                        <FaSyringe />
                    </div>

                    <div>
                        <h3 className="fw-bold mb-1">
                            Vaccination History
                        </h3>

                        <small style={{ color: "#cbd5e1" }}>
                            Immunization records and upcoming vaccines
                        </small>
                    </div>

                </div>

                <button className="btn btn-success">
                    <FaPlus className="me-2" />
                    Add Vaccine
                </button>

            </div>

            {vaccinations.map((vaccine, index) => (

                <div
                    key={index}
                    style={{
                        background: "rgba(255,255,255,.08)",
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 18,
                        borderLeft: `6px solid ${vaccine.color}`,
                    }}
                >

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h4 className="fw-bold mb-2">
                                <FaShieldVirus
                                    className="me-2"
                                    color={vaccine.color}
                                />
                                {vaccine.vaccine}
                            </h4>

                            <span
                                className="badge"
                                style={{
                                    background: vaccine.color,
                                    color: "#fff",
                                }}
                            >
                                {vaccine.status}
                            </span>

                        </div>

                        <div className="text-end">

                            <div
                                className="fw-bold"
                                style={{ color: "#93c5fd" }}
                            >
                                <FaCalendarAlt className="me-2" />
                                {vaccine.date}
                            </div>

                            <small style={{ color: "#cbd5e1" }}>
                                Administered Date
                            </small>

                        </div>

                    </div>

                    <hr style={{ borderColor: "rgba(255,255,255,.12)" }} />

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <strong>Next Dose</strong>

                            <p
                                className="mb-0 mt-2"
                                style={{ color: "#cbd5e1" }}
                            >
                                {vaccine.nextDose}
                            </p>

                        </div>

                        <div className="d-flex align-items-center gap-2">

                            {vaccine.status === "Completed" ? (
                                <>
                                    <FaCheckCircle color="#22c55e" />
                                    <span style={{ color: "#86efac" }}>
                                        Fully Protected
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FaCalendarAlt color="#f59e0b" />
                                    <span style={{ color: "#fde68a" }}>
                                        Action Required
                                    </span>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default VaccinationHistory;