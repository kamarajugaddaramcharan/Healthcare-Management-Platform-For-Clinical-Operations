package com.infosys.aiprediction.model;

import java.util.List;

public class CarePlanResponse {

    private String patientId;

    private String diagnosis;

    private String riskLevel;

    private Double riskPercentage;

    private Double healthScore;

    private List<String> medications;

    private List<String> treatmentGoals;

    private List<String> monitoringPlan;

    private List<String> lifestyleRecommendations;

    private String followUp;

    private String status;

    public CarePlanResponse() {
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
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

    public Double getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(Double healthScore) {
        this.healthScore = healthScore;
    }

    public List<String> getMedications() {
        return medications;
    }

    public void setMedications(List<String> medications) {
        this.medications = medications;
    }

    public List<String> getTreatmentGoals() {
        return treatmentGoals;
    }

    public void setTreatmentGoals(List<String> treatmentGoals) {
        this.treatmentGoals = treatmentGoals;
    }

    public List<String> getMonitoringPlan() {
        return monitoringPlan;
    }

    public void setMonitoringPlan(List<String> monitoringPlan) {
        this.monitoringPlan = monitoringPlan;
    }

    public List<String> getLifestyleRecommendations() {
        return lifestyleRecommendations;
    }

    public void setLifestyleRecommendations(
            List<String> lifestyleRecommendations) {

        this.lifestyleRecommendations =
                lifestyleRecommendations;
    }

    public String getFollowUp() {
        return followUp;
    }

    public void setFollowUp(String followUp) {
        this.followUp = followUp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}