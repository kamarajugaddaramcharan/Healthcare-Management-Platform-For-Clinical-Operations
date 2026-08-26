import { useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Trash2,
    Search,
    User,
    ShieldCheck,
    UserPlus
} from "lucide-react";

function PatientTable({
                          patients = [],
                          onEdit,
                          onDelete,
                          onView,
                          onAssign
                      }) {

    const [search, setSearch] = useState("");

    const filteredPatients = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase();

        return patients.filter((patient) => {

            return (

                (patient.name || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (patient.patientName || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (patient.patientId || "")
                    .toString()
                    .toLowerCase()
                    .includes(keyword)

                ||

                (patient.email || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (patient.doctorName || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    }, [patients, search]);


    // =========================================================
    // INITIALS
    // =========================================================

    const getInitials = (name = "") => {

        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

    };


    // =========================================================
    // RISK
    // =========================================================

    const getRisk = (age = 0) => {

        if (age >= 60) {

            return {
                label: "High",
                color: "#ef4444"
            };

        }

        if (age >= 40) {

            return {
                label: "Medium",
                color: "#f59e0b"
            };

        }

        return {
            label: "Low",
            color: "#10b981"
        };

    };


    // =========================================================
    // ASSIGN BUTTON TEXT
    // =========================================================

    const getDoctorText = (patient) => {

        if (
            patient.doctorName &&
            patient.doctorName.trim()
        ) {

            return patient.doctorName;

        }

        return "Not Assigned";

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            style={{
                background: "#131b2e",
                borderRadius: 24,
                padding: 28,
                boxShadow:
                    "0 20px 50px rgba(0,0,0,.35)",
                border:
                    "1px solid rgba(255,255,255,.05)"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 20,
                    marginBottom: 30
                }}
            >

                <div>

                    <h2
                        style={{
                            color: "#fff",
                            margin: 0,
                            fontSize: 30,
                            fontWeight: 700
                        }}
                    >
                        Patient Directory
                    </h2>

                    <p
                        style={{
                            color: "#94a3b8",
                            marginTop: 8,
                            marginBottom: 0
                        }}
                    >
                        View and manage patient records and
                        doctor assignments
                    </p>

                </div>


                {/* SEARCH */}

                <div
                    style={{
                        position: "relative",
                        width: 350
                    }}
                >

                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: 16,
                            top: 15,
                            color: "#64748b"
                        }}
                    />

                    <input
                        placeholder="Search patient or doctor..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding:
                                "14px 18px 14px 46px",
                            borderRadius: 30,
                            border:
                                "1px solid #334155",
                            background: "#0f172a",
                            color: "#fff",
                            outline: "none",
                            fontSize: 15
                        }}
                    />

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                style={{
                    overflowX: "auto"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                    <tr
                        style={{
                            color: "#94a3b8",
                            borderBottom:
                                "1px solid #334155"
                        }}
                    >

                        <th
                            style={{
                                padding: 18,
                                textAlign: "left"
                            }}
                        >
                            Patient
                        </th>

                        <th>
                            Gender
                        </th>

                        <th>
                            Age
                        </th>

                        <th>
                            Risk
                        </th>

                        <th>
                            Doctor
                        </th>

                        <th>
                            Email
                        </th>

                        <th>
                            Phone
                        </th>

                        <th
                            style={{
                                textAlign: "center"
                            }}
                        >
                            Actions
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {filteredPatients.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                style={{
                                    padding: 60,
                                    textAlign: "center",
                                    color: "#94a3b8",
                                    fontSize: 16
                                }}
                            >
                                No Patients Found
                            </td>

                        </tr>

                    ) : (

                        filteredPatients.map(
                            (patient) => {

                                const risk =
                                    getRisk(
                                        patient.age
                                    );

                                const rawName =
                                    patient.name ||
                                    patient.patientName ||
                                    null;

                                const patientName =
                                    rawName && rawName !== "Unknown Patient"
                                        ? rawName
                                        : `Patient ${patient.patientId || "N/A"}`;

                                const assigned =
                                    Boolean(
                                        patient.doctorId &&
                                        patient.doctorName
                                    );

                                return (

                                    <tr
                                        key={
                                            patient.id ||
                                            patient.patientId
                                        }
                                        style={{
                                            borderBottom:
                                                "1px solid #273244",
                                            transition:
                                                "0.25s"
                                        }}
                                    >

                                        {/* =====================
                                                PATIENT
                                            ===================== */}

                                        <td
                                            style={{
                                                padding: 18
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 15
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        width: 52,
                                                        height: 52,
                                                        borderRadius:
                                                            "50%",
                                                        background:
                                                            "linear-gradient(135deg,#2563eb,#7c3aed)",
                                                        color: "#fff",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        fontWeight: 700,
                                                        fontSize: 17
                                                    }}
                                                >

                                                    {patientName !==
                                                    "Unknown Patient"

                                                        ? getInitials(
                                                            patientName
                                                        )

                                                        : (
                                                            <User
                                                                size={20}
                                                            />
                                                        )}

                                                </div>


                                                <div>

                                                    <div
                                                        style={{
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            fontSize: 16
                                                        }}
                                                    >
                                                        {patientName}
                                                    </div>

                                                    <div
                                                        style={{
                                                            color:
                                                                "#94a3b8",
                                                            fontSize: 13,
                                                            marginTop: 4
                                                        }}
                                                    >
                                                        ID :{" "}
                                                        {patient.patientId ||
                                                            patient.id ||
                                                            "-"}
                                                    </div>

                                                </div>

                                            </div>

                                        </td>


                                        {/* =====================
                                                GENDER
                                            ===================== */}

                                        <td>

                                                <span
                                                    style={{
                                                        background:
                                                            patient.gender ===
                                                            "Male"
                                                                ? "#2563eb"
                                                                : "#ec4899",
                                                        color: "#fff",
                                                        padding:
                                                            "6px 14px",
                                                        borderRadius: 30,
                                                        fontSize: 12,
                                                        fontWeight: 600
                                                    }}
                                                >

                                                    {patient.gender ||
                                                        "-"}

                                                </span>

                                        </td>


                                        {/* =====================
                                                AGE
                                            ===================== */}

                                        <td
                                            style={{
                                                color: "#fff",
                                                fontWeight: 600
                                            }}
                                        >

                                            {patient.age ?? "-"}

                                        </td>


                                        {/* =====================
                                                RISK
                                            ===================== */}

                                        <td>

                                                <span
                                                    style={{
                                                        display:
                                                            "inline-flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 6,
                                                        padding:
                                                            "6px 14px",
                                                        borderRadius: 30,
                                                        background:
                                                        risk.color,
                                                        color: "#fff",
                                                        fontSize: 12,
                                                        fontWeight: 700
                                                    }}
                                                >

                                                    <ShieldCheck
                                                        size={14}
                                                    />

                                                    {risk.label}

                                                </span>

                                        </td>


                                        {/* =====================
                                                DOCTOR
                                            ===================== */}

                                        <td>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection:
                                                        "column",
                                                    gap: 5,
                                                    minWidth: 150
                                                }}
                                            >

                                                    <span
                                                        style={{
                                                            color:
                                                                assigned
                                                                    ? "#fff"
                                                                    : "#f59e0b",
                                                            fontSize: 14,
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        {getDoctorText(
                                                            patient
                                                        )}
                                                    </span>

                                                {assigned && (

                                                    <span
                                                        style={{
                                                            color:
                                                                "#94a3b8",
                                                            fontSize: 11
                                                        }}
                                                    >
                                                            ID:{" "}
                                                        {
                                                            patient.doctorId
                                                        }
                                                        </span>

                                                )}

                                            </div>

                                        </td>


                                        {/* =====================
                                                EMAIL
                                            ===================== */}

                                        <td
                                            style={{
                                                color:
                                                    "#cbd5e1",
                                                fontSize: 14
                                            }}
                                        >

                                            {patient.email ||
                                                "-"}

                                        </td>


                                        {/* =====================
                                                PHONE
                                            ===================== */}

                                        <td
                                            style={{
                                                color:
                                                    "#cbd5e1",
                                                fontSize: 14
                                            }}
                                        >

                                            {patient.phone ||
                                                "-"}

                                        </td>


                                        {/* =====================
                                                ACTIONS
                                            ===================== */}

                                        <td>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "center",
                                                    alignItems:
                                                        "center",
                                                    gap: 8,
                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >

                                                {/* VIEW */}

                                                {onView && (

                                                    <button
                                                        onClick={() =>
                                                            onView(
                                                                patient
                                                            )
                                                        }
                                                        title="View Patient"
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 10,
                                                            border: "none",
                                                            background:
                                                                "#2563eb",
                                                            color: "#fff",
                                                            cursor:
                                                                "pointer",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center"
                                                        }}
                                                    >

                                                        <Eye
                                                            size={18}
                                                        />

                                                    </button>

                                                )}


                                                {/* EDIT */}

                                                {onEdit && (

                                                    <button
                                                        onClick={() =>
                                                            onEdit(
                                                                patient
                                                            )
                                                        }
                                                        title="Edit Patient"
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 10,
                                                            border: "none",
                                                            background:
                                                                "#10b981",
                                                            color: "#fff",
                                                            cursor:
                                                                "pointer",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center"
                                                        }}
                                                    >

                                                        <Pencil
                                                            size={18}
                                                        />

                                                    </button>

                                                )}


                                                {/* =================
                                                        ASSIGN DOCTOR
                                                    ================= */}

                                                {onAssign && (

                                                    <button
                                                        onClick={() =>
                                                            onAssign(
                                                                patient
                                                            )
                                                        }
                                                        title={
                                                            assigned
                                                                ? "Reassign Doctor"
                                                                : "Assign Doctor"
                                                        }
                                                        style={{
                                                            height: 40,
                                                            padding:
                                                                "0 12px",
                                                            borderRadius:
                                                                10,
                                                            border:
                                                                "none",
                                                            background:
                                                                assigned
                                                                    ? "#7c3aed"
                                                                    : "#06b6d4",
                                                            color:
                                                                "#fff",
                                                            cursor:
                                                                "pointer",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            gap: 6,
                                                            fontWeight:
                                                                700,
                                                            fontSize:
                                                                12
                                                        }}
                                                    >

                                                        <UserPlus
                                                            size={16}
                                                        />

                                                        {assigned
                                                            ? "Reassign"
                                                            : "Assign"}

                                                    </button>

                                                )}


                                                {/* DELETE */}

                                                {onDelete && (

                                                    <button
                                                        onClick={() =>
                                                            onDelete(
                                                                patient
                                                            )
                                                        }
                                                        title="Delete Patient"
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 10,
                                                            border: "none",
                                                            background:
                                                                "#ef4444",
                                                            color: "#fff",
                                                            cursor:
                                                                "pointer",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center"
                                                        }}
                                                    >

                                                        <Trash2
                                                            size={18}
                                                        />

                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                );

                            }
                        )

                    )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default PatientTable;