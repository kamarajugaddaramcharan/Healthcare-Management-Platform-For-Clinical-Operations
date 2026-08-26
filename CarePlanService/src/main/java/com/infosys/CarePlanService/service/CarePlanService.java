package com.infosys.CarePlanService.service;

import com.infosys.CarePlanService.model.CarePlan;

import java.util.List;

public interface CarePlanService {

    // =====================================================
    // AI CARE PLAN
    // =====================================================

    CarePlan generateAICarePlan(String patientId);

    // =====================================================
    // CREATE
    // =====================================================

    CarePlan createCarePlan(CarePlan carePlan);

    // =====================================================
    // GET
    // =====================================================

    List<CarePlan> getAllCarePlans();

    CarePlan getCarePlanById(String id);

    // =====================================================
    // PATIENT
    // =====================================================

    List<CarePlan> getCarePlansByPatientId(String patientId);

    CarePlan getLatestCarePlan(String patientId);

    // =====================================================
    // STATUS
    // =====================================================

    List<CarePlan> getCarePlansByStatus(String status);

    // =====================================================
    // DOCTOR
    // =====================================================

    List<CarePlan> getCarePlansByDoctorId(String doctorId);

    // =====================================================
    // RISK
    // =====================================================

    List<CarePlan> getCarePlansByRiskLevel(String riskLevel);

    // =====================================================
    // UPDATE
    // =====================================================

    CarePlan updateCarePlan(
            String id,
            CarePlan carePlan
    );

    // =====================================================
    // APPROVE
    // =====================================================

    CarePlan approveCarePlan(
            String id,
            String doctorId,
            String doctorName,
            String doctorNotes
    );

    // =====================================================
    // REJECT
    // =====================================================

    CarePlan rejectCarePlan(
            String id,
            String doctorId,
            String doctorName,
            String doctorNotes
    );

    // =====================================================
    // ADHERENCE
    // =====================================================

    CarePlan updateAdherence(
            String id,
            Integer adherencePercentage
    );

    // =====================================================
    // OUTCOME
    // =====================================================

    CarePlan updateOutcome(
            String id,
            Double currentRiskPercentage,
            String outcome
    );

    // =====================================================
    // DELETE
    // =====================================================

    void deleteCarePlan(String id);
}