package com.infosys.CarePlanService.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.infosys.CarePlanService.model.CarePlan;
import com.infosys.CarePlanService.repository.CarePlanRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CarePlanServiceImpl implements CarePlanService {

    private final CarePlanRepository carePlanRepository;
    private final GeminiCarePlanService geminiCarePlanService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${vitals.api.url}")
    private String vitalsApiUrl;

    public CarePlanServiceImpl(
            CarePlanRepository carePlanRepository,
            GeminiCarePlanService geminiCarePlanService
    ) {
        this.carePlanRepository = carePlanRepository;
        this.geminiCarePlanService = geminiCarePlanService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // =====================================================
    // AI CARE PLAN
    // =====================================================

    @Override
    public CarePlan generateAICarePlan(String patientId) {

        try {

            // -------------------------------------------------
            // 1. GET LATEST VITALS
            // -------------------------------------------------

            String url =
                    vitalsApiUrl
                            + "/vitals/patient/"
                            + patientId
                            + "/latest";

            System.out.println(
                    "Fetching latest vitals from: " + url
            );

            Object vitalResponse =
                    restTemplate.getForObject(
                            url,
                            Object.class
                    );

            if (vitalResponse == null) {

                throw new RuntimeException(
                        "No latest vitals found for patient "
                                + patientId
                );
            }

            // -------------------------------------------------
            // 2. CONVERT VITALS TO MAP
            // -------------------------------------------------

            Map<String, Object> patientData =
                    objectMapper.convertValue(
                            vitalResponse,
                            new TypeReference<Map<String, Object>>() {}
                    );

            System.out.println(
                    "Patient vitals received: "
                            + patientData
            );

            // -------------------------------------------------
            // 3. SEND REAL VITALS TO GEMINI
            // -------------------------------------------------

            Map<String, Object> aiResult =
                    geminiCarePlanService.generateCarePlan(
                            patientId,
                            patientData
                    );

            if (aiResult == null) {
                throw new RuntimeException(
                        "Gemini returned no care plan result"
                );
            }

            System.out.println(
                    "Gemini AI result: " + aiResult
            );

            // -------------------------------------------------
            // 4. CREATE CARE PLAN
            // -------------------------------------------------

            CarePlan carePlan =
                    new CarePlan();

            carePlan.setPatientId(
                    patientId
            );

            // =================================================
            // BASIC AI INFORMATION
            // =================================================

            // -------------------------------------------------
            // DIAGNOSIS
            // -------------------------------------------------

            String diagnosis =
                    getString(
                            aiResult,
                            "diagnosis"
                    );

            if (diagnosis == null
                    || diagnosis.isBlank()) {

                diagnosis =
                        "No abnormality detected from the available vital signs.";
            }

            carePlan.setDiagnosis(
                    diagnosis
            );

            // -------------------------------------------------
            // RISK LEVEL
            // -------------------------------------------------

            String riskLevel =
                    getString(
                            aiResult,
                            "riskLevel"
                    );

            if (riskLevel == null
                    || riskLevel.isBlank()) {

                riskLevel = "LOW";
            }

            carePlan.setRiskLevel(
                    riskLevel
            );

            // -------------------------------------------------
            // RISK PERCENTAGE
            // -------------------------------------------------

            Double riskPercentage =
                    getDouble(
                            aiResult,
                            "riskPercentage"
                    );

            if (riskPercentage == null) {

                riskPercentage = 5.0;
            }

            // Keep risk percentage between 0 and 100.
            riskPercentage =
                    Math.max(
                            0.0,
                            Math.min(
                                    100.0,
                                    riskPercentage
                            )
                    );

            carePlan.setRiskPercentage(
                    riskPercentage
            );

            // -------------------------------------------------
            // HEALTH SCORE
            // -------------------------------------------------

            Integer healthScore =
                    getInteger(
                            aiResult,
                            "healthScore"
                    );

            if (healthScore == null) {

                healthScore = 100;
            }

            // Keep health score between 0 and 100.
            healthScore =
                    Math.max(
                            0,
                            Math.min(
                                    100,
                                    healthScore
                            )
                    );

            carePlan.setHealthScore(
                    healthScore
            );

            // =================================================
            // MEDICATIONS
            // =================================================

            carePlan.setMedications(
                    getList(
                            aiResult,
                            "medications"
                    )
            );

            // =================================================
            // DIET
            // =================================================

            carePlan.setDietRecommendations(
                    getList(
                            aiResult,
                            "dietRecommendations"
                    )
            );

            // =================================================
            // EXERCISE
            // =================================================

            carePlan.setExerciseRecommendations(
                    getList(
                            aiResult,
                            "exerciseRecommendations"
                    )
            );

            // =================================================
            // LIFESTYLE
            // =================================================

            carePlan.setLifestyleRecommendations(
                    getList(
                            aiResult,
                            "lifestyleRecommendations"
                    )
            );

            // =================================================
            // TREATMENT GOALS
            // =================================================

            carePlan.setTreatmentGoals(
                    getList(
                            aiResult,
                            "treatmentGoals"
                    )
            );

            // =================================================
            // MONITORING PLAN
            // =================================================

            carePlan.setMonitoringPlan(
                    getList(
                            aiResult,
                            "monitoringPlan"
                    )
            );

            // =================================================
            // FOLLOW UP
            // =================================================

            String followUp =
                    getString(
                            aiResult,
                            "followUp"
                    );

            if (followUp == null
                    || followUp.isBlank()) {

                followUp =
                        "Routine physician review as recommended.";
            }

            carePlan.setFollowUp(
                    followUp
            );

            // =================================================
            // SLEEP RECOMMENDATION
            // =================================================

            String sleepRecommendation =
                    getString(
                            aiResult,
                            "sleepRecommendation"
                    );

            if (sleepRecommendation == null
                    || sleepRecommendation.isBlank()) {

                sleepRecommendation =
                        "Aim for 7 to 9 hours of sleep per night.";
            }

            carePlan.setSleepRecommendation(
                    sleepRecommendation
            );

            // =================================================
            // DAILY WATER TARGET
            // =================================================

            Double dailyWaterTarget =
                    getDouble(
                            aiResult,
                            "dailyWaterTarget"
                    );

            if (dailyWaterTarget == null) {

                dailyWaterTarget = 2.5;
            }

            // Prevent invalid negative water values.
            if (dailyWaterTarget < 0) {
                dailyWaterTarget = 2.5;
            }

            carePlan.setDailyWaterTarget(
                    dailyWaterTarget
            );

            // =================================================
            // CURRENT RISK
            // =================================================

            carePlan.setCurrentRiskPercentage(
                    riskPercentage
            );

            // =================================================
            // PREVIOUS RISK
            // =================================================

            // New care plan has no previous risk yet.
            carePlan.setPreviousRiskPercentage(
                    null
            );

            // =================================================
            // DOCTOR INFORMATION
            // =================================================

            // Doctor is assigned during approval.
            carePlan.setDoctorId(
                    null
            );

            carePlan.setDoctorName(
                    null
            );

            // =================================================
            // DOCTOR NOTES
            // =================================================

            String doctorNotes =
                    getString(
                            aiResult,
                            "doctorNotes"
                    );

            if (doctorNotes == null
                    || doctorNotes.isBlank()
                    || doctorNotes.equalsIgnoreCase("null")) {

                doctorNotes =
                        "Draft care plan generated for clinician review.";
            }

            carePlan.setDoctorNotes(
                    doctorNotes
            );

            // =================================================
            // APPROVAL TIME
            // =================================================

            // Approval has not happened yet.
            carePlan.setApprovedAt(
                    null
            );

            // =================================================
            // NEXT REVIEW DATE
            // =================================================

            /*
             * Do NOT ask Gemini to calculate the date.
             *
             * LOW       -> 30 days
             * MODERATE  -> 7 days
             * HIGH      -> 1 day
             * CRITICAL  -> 1 day
             */

            LocalDateTime nextReviewDate =
                    calculateNextReviewDate(
                            carePlan.getRiskLevel()
                    );

            carePlan.setNextReviewDate(
                    nextReviewDate
            );

            // =================================================
            // STATUS
            // =================================================

            carePlan.setStatus(
                    "PENDING_APPROVAL"
            );

            // =================================================
            // ADHERENCE
            // =================================================

            // No patient adherence exists yet.
            carePlan.setAdherencePercentage(
                    null
            );

            // =================================================
            // OUTCOME
            // =================================================

            // No clinical outcome exists yet.
            carePlan.setOutcome(
                    null
            );

            // =================================================
            // TIMESTAMPS
            // =================================================

            LocalDateTime now =
                    LocalDateTime.now();

            carePlan.setCreatedAt(
                    now
            );

            carePlan.setUpdatedAt(
                    now
            );

            // =================================================
            // SAVE TO MONGODB
            // =================================================

            CarePlan savedCarePlan =
                    carePlanRepository.save(
                            carePlan
                    );

            // =================================================
            // LOG
            // =================================================

            System.out.println(
                    "\n========================================"
            );

            System.out.println(
                    "      AI CARE PLAN GENERATED"
            );

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "Patient ID       : "
                            + savedCarePlan.getPatientId()
            );

            System.out.println(
                    "Diagnosis        : "
                            + savedCarePlan.getDiagnosis()
            );

            System.out.println(
                    "Risk Level       : "
                            + savedCarePlan.getRiskLevel()
            );

            System.out.println(
                    "Risk Percentage  : "
                            + savedCarePlan.getRiskPercentage()
            );

            System.out.println(
                    "Current Risk     : "
                            + savedCarePlan.getCurrentRiskPercentage()
            );

            System.out.println(
                    "Health Score     : "
                            + savedCarePlan.getHealthScore()
            );

            System.out.println(
                    "Water Target     : "
                            + savedCarePlan.getDailyWaterTarget()
            );

            System.out.println(
                    "Next Review      : "
                            + savedCarePlan.getNextReviewDate()
            );

            System.out.println(
                    "Doctor Notes     : "
                            + savedCarePlan.getDoctorNotes()
            );

            System.out.println(
                    "Status           : "
                            + savedCarePlan.getStatus()
            );

            System.out.println(
                    "========================================\n"
            );

            return savedCarePlan;

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to generate AI care plan: "
                            + e.getMessage(),
                    e
            );
        }
    }

    // =====================================================
    // CALCULATE NEXT REVIEW DATE
    // =====================================================

    private LocalDateTime calculateNextReviewDate(
            String riskLevel
    ) {

        if (riskLevel == null) {

            return LocalDateTime
                    .now()
                    .plusDays(30);
        }

        switch (
                riskLevel
                        .trim()
                        .toUpperCase()
        ) {

            case "CRITICAL":

                return LocalDateTime
                        .now()
                        .plusDays(1);

            case "HIGH":

                return LocalDateTime
                        .now()
                        .plusDays(1);

            case "MODERATE":

                return LocalDateTime
                        .now()
                        .plusDays(7);

            case "LOW":

                return LocalDateTime
                        .now()
                        .plusDays(30);

            default:

                return LocalDateTime
                        .now()
                        .plusDays(30);
        }
    }

    // =====================================================
    // CREATE
    // =====================================================

    @Override
    public CarePlan createCarePlan(
            CarePlan carePlan
    ) {

        LocalDateTime now =
                LocalDateTime.now();

        if (carePlan.getStatus() == null
                || carePlan.getStatus().isBlank()) {

            carePlan.setStatus(
                    "DRAFT"
            );
        }

        if (carePlan.getCreatedAt() == null) {

            carePlan.setCreatedAt(
                    now
            );
        }

        carePlan.setUpdatedAt(
                now
        );

        return carePlanRepository.save(
                carePlan
        );
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    public List<CarePlan> getAllCarePlans() {

        return carePlanRepository.findAll();
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    @Override
    public CarePlan getCarePlanById(
            String id
    ) {

        return carePlanRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // GET PATIENT CARE PLANS
    // =====================================================

    @Override
    public List<CarePlan> getCarePlansByPatientId(
            String patientId
    ) {

        return carePlanRepository
                .findByPatientId(
                        patientId
                );
    }

    // =====================================================
    // GET LATEST APPROVED
    // =====================================================

    @Override
    public CarePlan getLatestCarePlan(
            String patientId
    ) {

        return carePlanRepository
                .findFirstByPatientIdAndStatusOrderByUpdatedAtDesc(
                        patientId,
                        "APPROVED"
                )
                .orElse(null);
    }

    // =====================================================
    // GET BY STATUS
    // =====================================================

    @Override
    public List<CarePlan> getCarePlansByStatus(
            String status
    ) {

        return carePlanRepository
                .findAll()
                .stream()
                .filter(
                        plan ->
                                plan.getStatus() != null
                                        && plan.getStatus()
                                        .equalsIgnoreCase(
                                                status
                                        )
                )
                .toList();
    }

    // =====================================================
    // GET BY DOCTOR
    // =====================================================

    @Override
    public List<CarePlan> getCarePlansByDoctorId(
            String doctorId
    ) {

        return carePlanRepository
                .findByDoctorId(
                        doctorId
                );
    }

    // =====================================================
    // GET BY RISK
    // =====================================================

    @Override
    public List<CarePlan> getCarePlansByRiskLevel(
            String riskLevel
    ) {

        return carePlanRepository
                .findAll()
                .stream()
                .filter(
                        plan ->
                                plan.getRiskLevel() != null
                                        && plan.getRiskLevel()
                                        .equalsIgnoreCase(
                                                riskLevel
                                        )
                )
                .toList();
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @Override
    public CarePlan updateCarePlan(
            String id,
            CarePlan carePlan
    ) {

        CarePlan existing =
                carePlanRepository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {
            return null;
        }

        // -------------------------------------------------
        // Preserve ID
        // -------------------------------------------------

        carePlan.setId(
                existing.getId()
        );

        // -------------------------------------------------
        // Preserve creation time
        // -------------------------------------------------

        carePlan.setCreatedAt(
                existing.getCreatedAt()
        );

        // -------------------------------------------------
        // Preserve status
        // -------------------------------------------------

        if (carePlan.getStatus() == null
                || carePlan.getStatus().isBlank()) {

            carePlan.setStatus(
                    existing.getStatus()
            );
        }

        // -------------------------------------------------
        // Preserve doctor ID
        // -------------------------------------------------

        if (carePlan.getDoctorId() == null) {

            carePlan.setDoctorId(
                    existing.getDoctorId()
            );
        }

        // -------------------------------------------------
        // Preserve doctor name
        // -------------------------------------------------

        if (carePlan.getDoctorName() == null) {

            carePlan.setDoctorName(
                    existing.getDoctorName()
            );
        }

        // -------------------------------------------------
        // Preserve doctor notes
        // -------------------------------------------------

        if (carePlan.getDoctorNotes() == null) {

            carePlan.setDoctorNotes(
                    existing.getDoctorNotes()
            );
        }

        // -------------------------------------------------
        // Preserve next review date
        // -------------------------------------------------

        if (carePlan.getNextReviewDate() == null) {

            carePlan.setNextReviewDate(
                    existing.getNextReviewDate()
            );
        }

        // -------------------------------------------------
        // Preserve approval time
        // -------------------------------------------------

        if (carePlan.getApprovedAt() == null) {

            carePlan.setApprovedAt(
                    existing.getApprovedAt()
            );
        }

        // -------------------------------------------------
        // Preserve adherence
        // -------------------------------------------------

        if (carePlan.getAdherencePercentage() == null) {

            carePlan.setAdherencePercentage(
                    existing.getAdherencePercentage()
            );
        }

        // -------------------------------------------------
        // Preserve previous risk
        // -------------------------------------------------

        if (carePlan.getPreviousRiskPercentage() == null) {

            carePlan.setPreviousRiskPercentage(
                    existing.getPreviousRiskPercentage()
            );
        }

        // -------------------------------------------------
        // Preserve current risk
        // -------------------------------------------------

        if (carePlan.getCurrentRiskPercentage() == null) {

            carePlan.setCurrentRiskPercentage(
                    existing.getCurrentRiskPercentage()
            );
        }

        // -------------------------------------------------
        // Preserve outcome
        // -------------------------------------------------

        if (carePlan.getOutcome() == null) {

            carePlan.setOutcome(
                    existing.getOutcome()
            );
        }

        // -------------------------------------------------
        // Preserve diagnosis if missing
        // -------------------------------------------------

        if (carePlan.getDiagnosis() == null
                || carePlan.getDiagnosis().isBlank()) {

            carePlan.setDiagnosis(
                    existing.getDiagnosis()
            );
        }

        // -------------------------------------------------
        // Preserve risk level if missing
        // -------------------------------------------------

        if (carePlan.getRiskLevel() == null
                || carePlan.getRiskLevel().isBlank()) {

            carePlan.setRiskLevel(
                    existing.getRiskLevel()
            );
        }

        // -------------------------------------------------
        // Preserve risk percentage if missing
        // -------------------------------------------------

        if (carePlan.getRiskPercentage() == null) {

            carePlan.setRiskPercentage(
                    existing.getRiskPercentage()
            );
        }

        // -------------------------------------------------
        // Preserve health score if missing
        // -------------------------------------------------

        if (carePlan.getHealthScore() == null) {

            carePlan.setHealthScore(
                    existing.getHealthScore()
            );
        }

        carePlan.setUpdatedAt(
                LocalDateTime.now()
        );

        return carePlanRepository.save(
                carePlan
        );
    }

    // =====================================================
    // APPROVE
    // =====================================================

    @Override
    public CarePlan approveCarePlan(
            String id,
            String doctorId,
            String doctorName,
            String doctorNotes
    ) {

        CarePlan carePlan =
                carePlanRepository
                        .findById(id)
                        .orElse(null);

        if (carePlan == null) {
            return null;
        }

        // -------------------------------------------------
        // Doctor information
        // -------------------------------------------------

        carePlan.setDoctorId(
                doctorId
        );

        carePlan.setDoctorName(
                doctorName
        );

        // -------------------------------------------------
        // Doctor notes
        // -------------------------------------------------

        if (doctorNotes == null
                || doctorNotes.isBlank()) {

            doctorNotes =
                    "Care plan reviewed and approved by clinician.";
        }

        carePlan.setDoctorNotes(
                doctorNotes
        );

        // -------------------------------------------------
        // Status
        // -------------------------------------------------

        carePlan.setStatus(
                "APPROVED"
        );

        // -------------------------------------------------
        // Approval time
        // -------------------------------------------------

        LocalDateTime now =
                LocalDateTime.now();

        carePlan.setApprovedAt(
                now
        );

        carePlan.setUpdatedAt(
                now
        );

        return carePlanRepository.save(
                carePlan
        );
    }

    // =====================================================
    // REJECT
    // =====================================================

    @Override
    public CarePlan rejectCarePlan(
            String id,
            String doctorId,
            String doctorName,
            String doctorNotes
    ) {

        CarePlan carePlan =
                carePlanRepository
                        .findById(id)
                        .orElse(null);

        if (carePlan == null) {
            return null;
        }

        // -------------------------------------------------
        // Doctor information
        // -------------------------------------------------

        carePlan.setDoctorId(
                doctorId
        );

        carePlan.setDoctorName(
                doctorName
        );

        // -------------------------------------------------
        // Doctor notes
        // -------------------------------------------------

        if (doctorNotes == null
                || doctorNotes.isBlank()) {

            doctorNotes =
                    "Care plan rejected by clinician.";
        }

        carePlan.setDoctorNotes(
                doctorNotes
        );

        // -------------------------------------------------
        // Status
        // -------------------------------------------------

        carePlan.setStatus(
                "REJECTED"
        );

        carePlan.setUpdatedAt(
                LocalDateTime.now()
        );

        return carePlanRepository.save(
                carePlan
        );
    }

    // =====================================================
    // ADHERENCE
    // =====================================================

    @Override
    public CarePlan updateAdherence(
            String id,
            Integer adherencePercentage
    ) {

        CarePlan carePlan =
                carePlanRepository
                        .findById(id)
                        .orElse(null);

        if (carePlan == null) {
            return null;
        }

        if (adherencePercentage == null) {
            adherencePercentage = 0;
        }

        // Keep adherence between 0 and 100.
        adherencePercentage =
                Math.max(
                        0,
                        Math.min(
                                100,
                                adherencePercentage
                        )
                );

        carePlan.setAdherencePercentage(
                adherencePercentage
        );

        carePlan.setUpdatedAt(
                LocalDateTime.now()
        );

        return carePlanRepository.save(
                carePlan
        );
    }

    // =====================================================
    // OUTCOME
    // =====================================================

    @Override
    public CarePlan updateOutcome(
            String id,
            Double currentRiskPercentage,
            String outcome
    ) {

        CarePlan carePlan =
                carePlanRepository
                        .findById(id)
                        .orElse(null);

        if (carePlan == null) {
            return null;
        }

        // -------------------------------------------------
        // Validate new risk
        // -------------------------------------------------

        if (currentRiskPercentage != null) {

            currentRiskPercentage =
                    Math.max(
                            0.0,
                            Math.min(
                                    100.0,
                                    currentRiskPercentage
                            )
                    );
        }

        // -------------------------------------------------
        // Move current risk to previous risk
        // -------------------------------------------------

        if (carePlan.getCurrentRiskPercentage()
                != null) {

            carePlan.setPreviousRiskPercentage(
                    carePlan.getCurrentRiskPercentage()
            );
        }

        // -------------------------------------------------
        // Store new current risk
        // -------------------------------------------------

        carePlan.setCurrentRiskPercentage(
                currentRiskPercentage
        );

        // -------------------------------------------------
        // Store outcome
        // -------------------------------------------------

        carePlan.setOutcome(
                outcome
        );

        carePlan.setUpdatedAt(
                LocalDateTime.now()
        );

        return carePlanRepository.save(
                carePlan
        );
    }

    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void deleteCarePlan(
            String id
    ) {

        if (carePlanRepository.existsById(id)) {

            carePlanRepository.deleteById(
                    id
            );
        }
    }

    // =====================================================
    // HELPER: STRING
    // =====================================================

    private String getString(
            Map<String, Object> map,
            String key
    ) {

        if (map == null || key == null) {
            return null;
        }

        Object value =
                map.get(key);

        if (value == null) {
            return null;
        }

        String result =
                String.valueOf(value).trim();

        if (result.isBlank()
                || result.equalsIgnoreCase("null")
                || result.equalsIgnoreCase("n/a")
                || result.equalsIgnoreCase("not available")) {

            return null;
        }

        return result;
    }

    // =====================================================
    // HELPER: DOUBLE
    // =====================================================

    private Double getDouble(
            Map<String, Object> map,
            String key
    ) {

        if (map == null || key == null) {
            return null;
        }

        Object value =
                map.get(key);

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {

            return number.doubleValue();
        }

        if (value instanceof String string) {

            try {

                return Double.parseDouble(
                        string.trim()
                );

            } catch (NumberFormatException ignored) {

                return null;
            }
        }

        return null;
    }

    // =====================================================
    // HELPER: INTEGER
    // =====================================================

    private Integer getInteger(
            Map<String, Object> map,
            String key
    ) {

        if (map == null || key == null) {
            return null;
        }

        Object value =
                map.get(key);

        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {

            return number.intValue();
        }

        if (value instanceof String string) {

            try {

                return Integer.parseInt(
                        string.trim()
                );

            } catch (NumberFormatException ignored) {

                return null;
            }
        }

        return null;
    }

    // =====================================================
    // HELPER: LIST
    // =====================================================

    private List<String> getList(
            Map<String, Object> map,
            String key
    ) {

        if (map == null || key == null) {
            return new ArrayList<>();
        }

        Object value =
                map.get(key);

        if (value instanceof List<?>) {

            List<String> result =
                    new ArrayList<>();

            for (Object item :
                    (List<?>) value) {

                if (item != null) {

                    String text =
                            String.valueOf(item).trim();

                    if (!text.isBlank()
                            && !text.equalsIgnoreCase("null")) {

                        result.add(
                                text
                        );
                    }
                }
            }

            return result;
        }

        return new ArrayList<>();
    }
}