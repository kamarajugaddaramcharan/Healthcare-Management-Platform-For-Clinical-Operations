import {
    User,
    Calendar,
    Droplets,
    Heart,
    Activity,
    ShieldCheck,
    Stethoscope,
    Sparkles,
} from "lucide-react";

function PatientProfileCard({ patient, twin }) {

    if (!patient) {
        return (
            <div className="patient-profile-card">
                Loading patient...
            </div>
        );
    }

    const initials = patient?.name
        ? patient.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
        : "PT";

    const healthScore = 96;

    return (
        <div
            className="patient-profile-card"
        >
            <div className="row align-items-center">

                {/* Left */}

                <div className="col-lg-4">

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                        }}
                    >

                        <div
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: "50%",
                                background:
                                    "linear-gradient(135deg,#2563eb,#06b6d4)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#fff",
                                fontSize: 30,
                                fontWeight: 700,
                            }}
                        >
                            {initials}
                        </div>

                        <div>

                            <h2
                                style={{
                                    marginBottom: 6,
                                    fontWeight: 700,
                                    color: "#ffffff"
                                }}
                            >
                                {patient.name}
                            </h2>

                            <p
                                style={{
                                    color: "#475569",
                                    marginBottom: 12,
                                }}
                            >
                                Patient ID : {patient.patientId}
                            </p>

                            <span
                                style={{
                                    background: "#dcfce7",
                                    border: "1px solid #bbf7d0",
                                    color: "#15803d",
                                    padding: "8px 18px",
                                    borderRadius: 30,
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                Active Patient
                            </span>

                        </div>

                    </div>

                </div>

                {/* Center */}

                <div className="col-lg-5">

                    <div className="row g-3">

                        <InfoBox
                            icon={<User size={20} />}
                            title="Age"
                            value={`${patient.age ?? "--"} Years`}
                        />

                        <InfoBox
                            icon={<Heart size={20} />}
                            title="Gender"
                            value={patient.gender || "--"}
                        />

                        <InfoBox
                            icon={<Droplets size={20} />}
                            title="Blood Group"
                            value={twin?.bloodGroup || "A+"}
                        />

                        <InfoBox
                            icon={<Calendar size={20} />}
                            title="Last Visit"
                            value={patient.lastVisit || "Today"}
                        />

                        <InfoBox
                            icon={<Activity size={20} />}
                            title="Heart Rate"
                            value={`${twin?.heartRate || 74} BPM`}
                        />

                        <InfoBox
                            icon={<Stethoscope size={20} />}
                            title="Doctor"
                            value="Dr. Sarah Wilson"
                        />

                    </div>

                </div>

                {/* Right */}

                <div className="col-lg-3">

                    <div
                        style={{
                            background:
                                "linear-gradient(135deg,#2563eb,#3b82f6)",
                            color: "#fff",
                            borderRadius: 22,
                            padding: 25,
                            textAlign: "center",
                        }}
                    >

                        <Sparkles size={34} />

                        <h5
                            style={{
                                marginTop: 15,
                            }}
                        >
                            AI Health Score
                        </h5>

                        <h1
                            style={{
                                fontSize: 56,
                                margin: "15px 0",
                                fontWeight: 800,
                            }}
                        >
                            {healthScore}
                        </h1>

                        <div
                            style={{
                                background: "rgba(255,255,255,.2)",
                                borderRadius: 50,
                                height: 10,
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${healthScore}%`,
                                    height: "100%",
                                    background: "#22c55e",
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginTop: 18,
                                display: "flex",
                                justifyContent: "center",
                                gap: 8,
                                alignItems: "center",
                            }}
                        >
                            <ShieldCheck size={18} />

                            <strong>Excellent</strong>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

function InfoBox({ icon, title, value }) {

    return (

        <div className="col-6">

            <div
                className="info-box"
                style={{
                    borderRadius: 18,
                    padding: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: "100%",
                }}
            >

                <div
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: "#dbeafe",
                        color: "#2563eb",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {icon}
                </div>

                <div>

                    <small
                        style={{
                            color: "#64748b",
                        }}
                    >
                        {title}
                    </small>

                    <br />

                    <strong style={{ color: "#0f172a" }}>{value}</strong>

                </div>

            </div>

        </div>

    );

}

export default PatientProfileCard;