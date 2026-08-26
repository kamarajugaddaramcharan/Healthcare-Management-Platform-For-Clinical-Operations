package com.infosys.aiprediction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {

    private String predictionId;

    private String patientId;

    private String patientName;

    private String alertType;

    private String riskLevel;

    private Double riskPercentage;

    private String message;

    private String assignedDoctor;

}