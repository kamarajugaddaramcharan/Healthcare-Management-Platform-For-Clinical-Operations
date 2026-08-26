import { FaUserMd, FaHeartbeat, FaShieldAlt } from "react-icons/fa";
import { MdSync, MdEmail, MdPhone } from "react-icons/md";

function PatientProfileCard() {

    const patient = {
        id: "PT-001",
        name: "Sarah Wilson",
        age: 62,
        gender: "Female",
        bloodGroup: "O+",
        phone: "+1 555-123-4567",
        email: "sarah.wilson@medisphere.ai",
        doctor: "Dr. Emily Carter",
        status: "Stable",
        lastVisit: "20 Jul 2026",
        nextSync: "23 Jul 2026 08:30",
    };

    return (
        <div
            className="card shadow border-0 rounded-4"
            style={{
                padding: "24px",
                marginBottom: "24px",
            }}
        >

            <div className="row align-items-center">

                {/* Avatar */}

                <div className="col-md-2 text-center">

                    <img
                        src="https://i.pravatar.cc/150?img=47"
                        alt="Patient"
                        style={{
                            width: 110,
                            height: 110,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid #2563eb",
                        }}
                    />

                </div>

                {/* Patient Details */}

                <div className="col-md-5">

                    <h2 className="fw-bold mb-2">
                        {patient.name}
                    </h2>

                    <p className="text-muted mb-1">
                        Patient ID : {patient.id}
                    </p>

                    <span className="badge bg-success me-2">
                        {patient.status}
                    </span>

                    <span className="badge bg-primary">
                        {patient.bloodGroup}
                    </span>

                    <div className="mt-3">

                        <p className="mb-1">
                            <strong>Age:</strong> {patient.age}
                        </p>

                        <p className="mb-1">
                            <strong>Gender:</strong> {patient.gender}
                        </p>

                        <p className="mb-1">
                            <MdPhone /> {patient.phone}
                        </p>

                        <p className="mb-1">
                            <MdEmail /> {patient.email}
                        </p>

                    </div>

                </div>

                {/* Right Panel */}

                <div className="col-md-5">

                    <div className="row">

                        <div className="col-6 mb-3">

                            <div className="border rounded-3 p-3">

                                <FaUserMd
                                    className="text-primary mb-2"
                                />

                                <h6>Doctor</h6>

                                <strong>{patient.doctor}</strong>

                            </div>

                        </div>

                        <div className="col-6 mb-3">

                            <div className="border rounded-3 p-3">

                                <MdSync
                                    className="text-success mb-2"
                                />

                                <h6>Next Sync</h6>

                                <strong>{patient.nextSync}</strong>

                            </div>

                        </div>

                        <div className="col-6">

                            <div className="border rounded-3 p-3">

                                <FaHeartbeat
                                    className="text-danger mb-2"
                                />

                                <h6>Last Visit</h6>

                                <strong>{patient.lastVisit}</strong>

                            </div>

                        </div>

                        <div className="col-6">

                            <div className="border rounded-3 p-3">

                                <FaShieldAlt
                                    className="text-success mb-2"
                                />

                                <h6>HIPAA</h6>

                                <span className="badge bg-success">
                                    Consent Granted
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );

}

export default PatientProfileCard;