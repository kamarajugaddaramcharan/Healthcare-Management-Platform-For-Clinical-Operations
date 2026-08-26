package com.infosys.CarePlanService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "care_plans")
public class CarePlan {

    @Id
    private String id;

    // =====================================================
    // PATIENT
    // =====================================================

    private String patientId;
    private String patientName;

    // =====================================================
    // CLINICAL INFORMATION
    // =====================================================

    private String diagnosis;
    private String riskLevel;
    private Double riskPercentage;
    private Integer healthScore;

    // =====================================================
    // AI CARE PLAN
    // =====================================================

    private List<String> medications;

    private List<String> dietRecommendations;

    private List<String> exerciseRecommendations;

    private List<String> lifestyleRecommendations;

    private Double dailyWaterTarget;

    private String sleepRecommendation;

    // =====================================================
    // ADDITIONAL AI RECOMMENDATIONS
    // =====================================================

    private List<String> treatmentGoals;

    private List<String> monitoringPlan;

    private String followUp;

    // =====================================================
    // DOCTOR
    // =====================================================

    private String doctorId;

    private String doctorName;

    private String doctorNotes;

    // =====================================================
    // APPROVAL
    // =====================================================

    /*
     * DRAFT
     * PENDING_APPROVAL
     * APPROVED
     * REJECTED
     * COMPLETED
     */

    private String status;

    // =====================================================
    // DATES
    // =====================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime approvedAt;

    // =====================================================
    // REVIEW
    // =====================================================

    private LocalDateTime nextReviewDate;

    // =====================================================
    // ADHERENCE
    // =====================================================

    private Integer adherencePercentage;

    // =====================================================
    // OUTCOME
    // =====================================================

    private Double previousRiskPercentage;

    private Double currentRiskPercentage;

    /*
     * IMPROVED
     * STABLE
     * WORSENED
     */

    private String outcome;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public CarePlan() {
    }

    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getRiskPercentage() {
        return riskPercentage;
    }

    public void setRiskPercentage(Double riskPercentage) {
        this.riskPercentage = riskPercentage;
    }

    public Integer getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(Integer healthScore) {
        this.healthScore = healthScore;
    }

    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public List<String> getDietRecommendations() {
        return dietRecommendations;
    }

    public void setDietRecommendations(
            List<String> dietRecommendations
    ) {
        this.dietRecommendations = dietRecommendations;
    }

    public List<String> getExerciseRecommendations() {
        return exerciseRecommendations;
    }

    public void setExerciseRecommendations(
            List<String> exerciseRecommendations
    ) {
        this.exerciseRecommendations =
                exerciseRecommendations;
    }

    public List<String> getLifestyleRecommendations() {
        return lifestyleRecommendations;
    }

    public void setLifestyleRecommendations(
            List<String> lifestyleRecommendations
    ) {
        this.lifestyleRecommendations =
                lifestyleRecommendations;
    }

    public Double getDailyWaterTarget() {
        return dailyWaterTarget;
    }

    public void setDailyWaterTarget(
            Double dailyWaterTarget
    ) {
        this.dailyWaterTarget = dailyWaterTarget;
    }

    public String getSleepRecommendation() {
        return sleepRecommendation;
    }

    public void setSleepRecommendation(
            String sleepRecommendation
    ) {
        this.sleepRecommendation =
                sleepRecommendation;
    }

    public List<String> getTreatmentGoals() {
        return treatmentGoals;
    }

    public void setTreatmentGoals(
            List<String> treatmentGoals
    ) {
        this.treatmentGoals = treatmentGoals;
    }

    public List<String> getMonitoringPlan() {
        return monitoringPlan;
    }

    public void setMonitoringPlan(
            List<String> monitoringPlan
    ) {
        this.monitoringPlan = monitoringPlan;
    }

    public String getFollowUp() {
        return followUp;
    }

    public void setFollowUp(String followUp) {
        this.followUp = followUp;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorNotes() {
        return doctorNotes;
    }

    public void setDoctorNotes(String doctorNotes) {
        this.doctorNotes = doctorNotes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(
            LocalDateTime approvedAt
    ) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(
            LocalDateTime nextReviewDate
    ) {
        this.nextReviewDate = nextReviewDate;
    }

    public Integer getAdherencePercentage() {
        return adherencePercentage;
    }

    public void setAdherencePercentage(
            Integer adherencePercentage
    ) {
        this.adherencePercentage =
                adherencePercentage;
    }

    public Double getPreviousRiskPercentage() {
        return previousRiskPercentage;
    }

    public void setPreviousRiskPercentage(
            Double previousRiskPercentage
    ) {
        this.previousRiskPercentage =
                previousRiskPercentage;
    }

    public Double getCurrentRiskPercentage() {
        return currentRiskPercentage;
    }

    public void setCurrentRiskPercentage(
            Double currentRiskPercentage
    ) {
        this.currentRiskPercentage =
                currentRiskPercentage;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}