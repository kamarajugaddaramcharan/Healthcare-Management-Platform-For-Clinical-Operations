package com.infosys.CarePlanService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "adherence_records")
public class AdherenceRecord {

    @Id
    private String id;

    private String carePlanId;
    private String patientId;
    private LocalDate date;

    private List<String> completedActivities;

    private Integer adherencePercentage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdherenceRecord() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCarePlanId() {
        return carePlanId;
    }

    public void setCarePlanId(String carePlanId) {
        this.carePlanId = carePlanId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<String> getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(List<String> completedActivities) {
        this.completedActivities = completedActivities;
    }

    public Integer getAdherencePercentage() {
        return adherencePercentage;
    }

    public void setAdherencePercentage(Integer adherencePercentage) {
        this.adherencePercentage = adherencePercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}