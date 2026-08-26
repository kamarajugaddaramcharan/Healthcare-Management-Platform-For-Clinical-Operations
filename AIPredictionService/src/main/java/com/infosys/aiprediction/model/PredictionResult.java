package com.infosys.aiprediction.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResult {

    private String riskLevel;
    private double riskPercentage;
    private double confidence;
    private String diagnosis;
    private String recommendation;
    private int healthScore;

}