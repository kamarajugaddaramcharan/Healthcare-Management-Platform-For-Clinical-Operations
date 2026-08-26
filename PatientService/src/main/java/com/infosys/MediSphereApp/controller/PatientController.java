package com.infosys.MediSphereApp.controller;

import com.infosys.MediSphereApp.model.Patient;
import com.infosys.MediSphereApp.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService service;

    // =====================================================
    // CREATE PATIENT
    // =====================================================

    @PostMapping
    public Patient addPatient(
            @RequestBody Patient patient
    ) {
        return service.savePatient(patient);
    }

    // =====================================================
    // GET ALL PATIENTS
    // =====================================================

    @GetMapping
    public List<Patient> getAllPatients() {
        return service.getAllPatients();
    }

    // =====================================================
    // GET PATIENTS BY DOCTOR
    // =====================================================

    @GetMapping("/doctor/{doctorId}")
    public List<Patient> getPatientsByDoctor(
            @PathVariable String doctorId
    ) {
        return service.getPatientsByDoctor(doctorId);
    }

    // =====================================================
    // GET PATIENT BY KEYCLOAK ID
    // =====================================================

    @GetMapping("/keycloak/{keycloakId}")
    public Patient getPatientByKeycloakId(
            @PathVariable String keycloakId
    ) {
        return service.getPatientByKeycloakId(keycloakId);
    }

    // =====================================================
    // GET PATIENT BY USERNAME
    // =====================================================

    @GetMapping("/username/{username}")
    public Patient getPatientByUsername(
            @PathVariable String username
    ) {
        return service.getPatientByKeycloakUsername(username);
    }

    // =====================================================
    // LINK PATIENT TO KEYCLOAK
    // =====================================================

    @PutMapping("/{patientId}/link-keycloak")
    public Patient linkPatientToKeycloak(
            @PathVariable String patientId,
            @RequestParam String keycloakId,
            @RequestParam String keycloakUsername
    ) {
        return service.linkPatientToKeycloak(
                patientId,
                keycloakId,
                keycloakUsername
        );
    }

    // =====================================================
    // ASSIGN TEST PATIENTS TO SARAH
    // =====================================================

    @PostMapping("/assign-test-doctor")
    public String assignTestPatientsToDoctor() {

        service.assignTestPatientsToDoctor();

        return "5 patients assigned to Dr. Sarah Wilson";
    }

    // =====================================================
    // GET PATIENT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Patient getPatientById(
            @PathVariable String id
    ) {
        return service.getPatientById(id);
    }

    // =====================================================
    // UPDATE PATIENT
    // =====================================================

    @PutMapping("/{id}")
    public Patient updatePatient(
            @PathVariable String id,
            @RequestBody Patient patient
    ) {
        return service.updatePatient(
                id,
                patient
        );
    }

    // =====================================================
    // DELETE PATIENT
    // =====================================================

    @DeleteMapping("/{id}")
    public String deletePatient(
            @PathVariable String id
    ) {

        service.deletePatient(id);

        return "Patient deleted successfully";
    }
}