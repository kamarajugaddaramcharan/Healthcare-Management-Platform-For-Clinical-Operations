package com.infosys.MediSphereApp.repository;

import com.infosys.MediSphereApp.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

    List<Patient> findByDoctorId(String doctorId);

    List<Patient> findByPatientIdIn(List<String> patientIds);

    // Find patient by internal patient ID
    Patient findByPatientId(String patientId);

    // Find patient by Keycloak account
    Optional<Patient> findByKeycloakId(String keycloakId);

    Optional<Patient> findByKeycloakUsername(String keycloakUsername);
}