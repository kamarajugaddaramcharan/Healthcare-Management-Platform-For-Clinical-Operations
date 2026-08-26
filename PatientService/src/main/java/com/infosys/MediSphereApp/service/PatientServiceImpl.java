package com.infosys.MediSphereApp.service;

import com.infosys.MediSphereApp.model.Patient;
import com.infosys.MediSphereApp.repository.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl
        implements PatientService {

    @Autowired
    private PatientRepository repository;


    // =====================================================
    // SAVE
    // =====================================================

    @Override
    public Patient savePatient(
            Patient patient
    ) {

        return repository.save(patient);
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    public List<Patient> getAllPatients() {

        return repository.findAll();
    }


    // =====================================================
    // GET BY DATABASE ID
    // =====================================================

    @Override
    public Patient getPatientById(
            String id
    ) {

        return repository
                .findById(id)
                .orElse(null);
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @Override
    public Patient updatePatient(
            String id,
            Patient patient
    ) {

        Patient existing =
                repository
                        .findById(id)
                        .orElse(null);

        if (existing != null) {

            existing.setPatientId(
                    patient.getPatientId()
            );

            existing.setName(
                    patient.getName()
            );

            existing.setAge(
                    patient.getAge()
            );

            existing.setGender(
                    patient.getGender()
            );

            existing.setMedicalCondition(
                    patient.getMedicalCondition()
            );

            existing.setTreatment(
                    patient.getTreatment()
            );

            existing.setOutcome(
                    patient.getOutcome()
            );

            existing.setInsuranceType(
                    patient.getInsuranceType()
            );

            existing.setIncome(
                    patient.getIncome()
            );

            existing.setRegion(
                    patient.getRegion()
            );

            existing.setSmokingStatus(
                    patient.getSmokingStatus()
            );

            existing.setAdmissionType(
                    patient.getAdmissionType()
            );

            existing.setHospitalId(
                    patient.getHospitalId()
            );

            existing.setLengthOfStay(
                    patient.getLengthOfStay()
            );


            // Doctor

            existing.setDoctorId(
                    patient.getDoctorId()
            );

            existing.setDoctorName(
                    patient.getDoctorName()
            );


            // =================================================
            // KEYCLOAK MAPPING
            // =================================================

            if (
                    patient.getKeycloakId() != null &&
                            !patient.getKeycloakId()
                                    .trim()
                                    .isEmpty()
            ) {

                existing.setKeycloakId(
                        patient.getKeycloakId()
                );
            }

            if (
                    patient.getKeycloakUsername() != null &&
                            !patient.getKeycloakUsername()
                                    .trim()
                                    .isEmpty()
            ) {

                existing.setKeycloakUsername(
                        patient.getKeycloakUsername()
                );
            }


            return repository.save(existing);
        }

        return null;
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void deletePatient(
            String id
    ) {

        repository.deleteById(id);
    }


    // =====================================================
    // DOCTOR PATIENTS
    // =====================================================

    @Override
    public List<Patient> getPatientsByDoctor(
            String doctorId
    ) {

        return repository.findByDoctorId(
                doctorId
        );
    }


    // =====================================================
    // ASSIGN TEST PATIENTS
    // =====================================================

    @Override
    public void assignTestPatientsToDoctor() {

        String doctorId = "D001";

        String doctorName =
                "Dr. Sarah Wilson";


        List<Patient> assignedPatients =
                repository.findByDoctorId(
                        doctorId
                );

        int alreadyAssigned =
                assignedPatients.size();


        if (alreadyAssigned >= 5) {

            return;
        }


        int remaining =
                5 - alreadyAssigned;


        List<Patient> allPatients =
                repository.findAll();


        List<Patient> unassignedPatients =
                allPatients
                        .stream()
                        .filter(
                                patient ->
                                        patient.getDoctorId()
                                                == null
                                                ||
                                                patient.getDoctorId()
                                                        .trim()
                                                        .isEmpty()
                        )
                        .limit(remaining)
                        .collect(
                                Collectors.toList()
                        );


        for (
                Patient patient :
                unassignedPatients
        ) {

            patient.setDoctorId(
                    doctorId
            );

            patient.setDoctorName(
                    doctorName
            );
        }


        if (
                !unassignedPatients.isEmpty()
        ) {

            repository.saveAll(
                    unassignedPatients
            );
        }
    }


    // =====================================================
    // FIND BY KEYCLOAK ID
    // =====================================================

    @Override
    public Patient getPatientByKeycloakId(
            String keycloakId
    ) {

        if (
                keycloakId == null ||
                        keycloakId.trim().isEmpty()
        ) {

            return null;
        }

        return repository
                .findByKeycloakId(
                        keycloakId
                )
                .orElse(null);
    }


    // =====================================================
    // FIND BY KEYCLOAK USERNAME
    // =====================================================

    @Override
    public Patient getPatientByKeycloakUsername(
            String keycloakUsername
    ) {

        if (
                keycloakUsername == null ||
                        keycloakUsername.trim().isEmpty()
        ) {

            return null;
        }

        return repository
                .findByKeycloakUsername(
                        keycloakUsername
                )
                .orElse(null);
    }


    // =====================================================
    // LINK PATIENT TO KEYCLOAK
    // =====================================================

    @Override
    public Patient linkPatientToKeycloak(
            String patientId,
            String keycloakId,
            String keycloakUsername
    ) {

        Patient patient =
                repository
                        .findByPatientId(
                                patientId
                        );

        if (patient == null) {

            return null;
        }


        patient.setKeycloakId(
                keycloakId
        );

        patient.setKeycloakUsername(
                keycloakUsername
        );


        return repository.save(
                patient
        );
    }
}