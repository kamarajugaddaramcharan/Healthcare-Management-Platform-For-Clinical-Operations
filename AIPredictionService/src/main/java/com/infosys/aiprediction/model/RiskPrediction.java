package com.infosys.aiprediction.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "risk_predictions")
public class RiskPrediction {

    @Id
    private String id;

    private String patientId;

    // Heart Disease Dataset Features
    private Integer age;
    private Integer sex;
    private Integer chestPainType;
    private Integer restingBloodPressure;
    private Integer cholesterol;
    private Integer fastingBloodSugar;
    private Integer restingECG;
    private Integer maxHeartRate;
    private Integer exerciseInducedAngina;
    private Double oldPeak;
    private Integer slope;
    private Integer majorVessels;
    private Integer thal;

    // Optional (actual dataset label)
    private Integer target;

    // AI Prediction Result
    private Double riskPercentage;
    private String riskLevel;
    private Double confidence;

    // AI Clinical Result
    private String diagnosis;
    private String recommendation;
    private Integer healthScore;

    // Metadata
    private LocalDateTime predictionDate;
    private String modelVersion;
}