import "./DeleteDialog.css";
function DeleteDialog({
                          open,
                          patient,
                          onDelete,
                          onClose,
                      }) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="delete-modal">

                <h2>Delete Patient</h2>

                <p>

                    Are you sure you want to delete

                    <strong> {patient?.name}</strong> ?

                </p>

                <div className="delete-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="delete-btn"
                        onClick={() => onDelete(patient.id)}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteDialog;