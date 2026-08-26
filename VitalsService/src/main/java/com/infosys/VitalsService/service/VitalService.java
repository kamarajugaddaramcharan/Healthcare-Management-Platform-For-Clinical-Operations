package com.infosys.VitalsService.service;

import com.infosys.VitalsService.model.Vital;

import java.util.List;

public interface VitalService {

    // ==========================
    // CRUD Operations
    // ==========================

    Vital saveVital(Vital vital);

    List<Vital> getAllVitals();

    Vital getVitalById(String id);

    Vital updateVital(String id, Vital vital);

    void deleteVital(String id);

    // ==========================
    // Milestone 3 - Live Monitoring
    // ==========================

    /**
     * Generates random vitals and streams them to Kafka.
     */
    void generateRandomVitals();

    /**
     * Returns all vitals for a specific patient.
     */
    List<Vital> getVitalsByPatient(String patientId);

    /**
     * Returns the latest vital record of a patient.
     */
    Vital getLatestVital(String patientId);

    /**
     * Calculates patient risk level based on vital signs.
     */
    String calculateRisk(Vital vital);

    /**
     * Checks whether a patient's vitals require an alert.
     */
    boolean isCritical(Vital vital);
}