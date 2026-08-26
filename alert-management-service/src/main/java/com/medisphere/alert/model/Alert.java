package com.medisphere.alert.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "alerts")
public class Alert {

    @Id
    private String id;

    // Prediction ID
    private String predictionId;

    private String patientId;

    private String patientName;

    private String alertType;

    private String riskLevel;

    private Double riskPercentage;

    private String message;

    private String status;

    private boolean acknowledged;

    private String assignedDoctor;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}