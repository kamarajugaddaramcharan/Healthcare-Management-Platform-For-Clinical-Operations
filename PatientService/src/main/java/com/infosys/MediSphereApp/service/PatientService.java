package com.infosys.MediSphereApp.service;

import com.infosys.MediSphereApp.model.Patient;

import java.util.List;

public interface PatientService {

    Patient savePatient(Patient patient);

    List<Patient> getAllPatients();

    Patient getPatientById(String id);

    Patient updatePatient(String id, Patient patient);

    void deletePatient(String id);

    List<Patient> getPatientsByDoctor(String doctorId);

    void assignTestPatientsToDoctor();

    // ==========================================
    // KEYCLOAK PATIENT MAPPING
    // ==========================================

    Patient getPatientByKeycloakId(String keycloakId);

    Patient getPatientByKeycloakUsername(String keycloakUsername);

    Patient linkPatientToKeycloak(
            String patientId,
            String keycloakId,
            String keycloakUsername
    );
}