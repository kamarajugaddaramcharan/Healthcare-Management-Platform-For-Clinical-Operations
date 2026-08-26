import PatientForm from "./PatientForm";
import "./PatientModal.css";

function PatientModal({
                          open,
                          patient,
                          onSave,
                          onClose,
                      }) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="premium-modal">

                <div className="premium-header">

                    <div>

                        <h2>

                            {patient ? "✏️ Edit Patient" : "➕ Add Patient"}

                        </h2>

                        <p>

                            Manage patient healthcare information.

                        </p>

                    </div>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕

                    </button>

                </div>

                <div className="premium-body">

                    <PatientForm
                        patient={patient}
                        onSave={onSave}
                        onCancel={onClose}
                    />

                </div>

            </div>

        </div>

    );

}

export default PatientModal;