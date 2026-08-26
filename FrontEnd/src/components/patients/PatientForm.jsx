import { useEffect, useState } from "react";
import "./PatientForm.css";

function PatientForm({ patient, onSave, onCancel }) {

    const [form, setForm] = useState({
        patientId: "",
        age: "",
        gender: "",
        medicalCondition: "",
        treatment: "",
        outcome: "",
        insuranceType: "",
        income: "",
        region: "",
        smokingStatus: "",
        admissionType: "",
        hospitalId: "",
        lengthOfStay: "",
    });

    useEffect(() => {
        if (patient) {
            setForm({
                patientId: patient.patientId || "",
                age: patient.age || "",
                gender: patient.gender || "",
                medicalCondition: patient.medicalCondition || "",
                treatment: patient.treatment || "",
                outcome: patient.outcome || "",
                insuranceType: patient.insuranceType || "",
                income: patient.income || "",
                region: patient.region || "",
                smokingStatus: patient.smokingStatus || "",
                admissionType: patient.admissionType || "",
                hospitalId: patient.hospitalId || "",
                lengthOfStay: patient.lengthOfStay || "",
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (

        <form className="premium-patient-form" onSubmit={handleSubmit}>

            <div className="form-grid">

                <div className="form-group">
                    <label>Patient ID</label>
                    <input
                        name="patientId"
                        value={form.patientId}
                        onChange={handleChange}
                        placeholder="PAT-1001"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={form.age}
                        onChange={handleChange}
                        placeholder="Age"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Medical Condition</label>
                    <input
                        name="medicalCondition"
                        value={form.medicalCondition}
                        onChange={handleChange}
                        placeholder="Heart Disease"
                    />
                </div>

                <div className="form-group">
                    <label>Treatment</label>
                    <input
                        name="treatment"
                        value={form.treatment}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Outcome</label>
                    <input
                        name="outcome"
                        value={form.outcome}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Insurance</label>
                    <input
                        name="insuranceType"
                        value={form.insuranceType}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Income</label>
                    <input
                        type="number"
                        name="income"
                        value={form.income}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Region</label>
                    <input
                        name="region"
                        value={form.region}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Smoking Status</label>
                    <input
                        name="smokingStatus"
                        value={form.smokingStatus}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Admission Type</label>
                    <input
                        name="admissionType"
                        value={form.admissionType}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Hospital ID</label>
                    <input
                        name="hospitalId"
                        value={form.hospitalId}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full">
                    <label>Length of Stay (Days)</label>
                    <input
                        type="number"
                        name="lengthOfStay"
                        value={form.lengthOfStay}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-buttons">

                <button
                    className="cancel-btn"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    className="save-btn"
                    type="submit"
                >
                    Save Patient
                </button>

            </div>

        </form>

    );
}

export default PatientForm;