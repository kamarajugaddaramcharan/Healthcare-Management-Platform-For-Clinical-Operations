package com.infosys.aiprediction.service;

import com.infosys.aiprediction.model.PredictionResult;
import org.springframework.stereotype.Service;

@Service
public class AIAnomalyService {

    public PredictionResult analyzePatient(
            int age,
            double heartRate,
            double spo2,
            double temperature,
            double systolicBP
    ) {

        double score = 0;

        // ==========================
        // HEART RATE
        // ==========================

        if (heartRate > 140) {
            score += 40;
        } else if (heartRate > 120) {
            score += 25;
        } else if (heartRate > 100) {
            score += 10;
        } else if (heartRate < 50) {
            score += 25;
        } else if (heartRate < 60) {
            score += 10;
        }

        // ==========================
        // OXYGEN
        // ==========================

        if (spo2 < 90) {
            score += 30;
        } else if (spo2 < 94) {
            score += 15;
        }

        // ==========================
        // TEMPERATURE
        // ==========================

        if (temperature > 39) {
            score += 15;
        } else if (temperature > 38) {
            score += 8;
        }

        // ==========================
        // BLOOD PRESSURE
        // ==========================

        if (systolicBP > 180) {
            score += 15;
        } else if (systolicBP > 160) {
            score += 8;
        } else if (systolicBP > 140) {
            score += 5;
        }

        // ==========================
        // RISK
        // ==========================

        String riskLevel;

        if (score >= 80) {
            riskLevel = "CRITICAL";
        } else if (score >= 60) {
            riskLevel = "HIGH";
        } else if (score >= 35) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        int healthScore =
                Math.max(0, 100 - (int) score);

        String diagnosis;
        String recommendation;

        switch (riskLevel) {

            case "CRITICAL":
                diagnosis = "Critical vital abnormality detected";
                recommendation = "Seek immediate medical attention";
                break;

            case "HIGH":
                diagnosis = "High cardiovascular risk indicators detected";
                recommendation = "Urgent doctor review recommended";
                break;

            case "MEDIUM":
                diagnosis = "Moderate health risk indicators detected";
                recommendation = "Continue monitoring and consult doctor";
                break;

            default:
                diagnosis = "Patient vitals are currently stable";
                recommendation = "Continue routine monitoring";
                break;
        }

        return PredictionResult.builder()
                .riskLevel(riskLevel)
                .riskPercentage(score)
                .confidence(95.0)
                .diagnosis(diagnosis)
                .recommendation(recommendation)
                .healthScore(healthScore)
                .build();
    }
}