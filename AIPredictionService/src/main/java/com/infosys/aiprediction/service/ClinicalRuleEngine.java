package com.infosys.aiprediction.service;

import com.infosys.aiprediction.model.PredictionResult;
import org.springframework.stereotype.Service;

@Service
public class ClinicalRuleEngine {

    public PredictionResult applyClinicalRules(
            int age,
            double heartRate,
            double spo2,
            double temperature,
            double systolicBP,
            PredictionResult result
    ) {

        // ==========================
        // SEVERE HYPOXIA
        // ==========================

        if (spo2 < 90) {

            result.setRiskLevel("CRITICAL");

            result.setDiagnosis(
                    "Severe oxygen desaturation detected"
            );

            result.setRecommendation(
                    "Immediate medical evaluation required"
            );

            result.setRiskPercentage(98.0);
            result.setHealthScore(2);

            return result;
        }

        // ==========================
        // EXTREME HEART RATE
        // ==========================

        if (heartRate > 140 || heartRate < 45) {

            result.setRiskLevel("CRITICAL");

            result.setDiagnosis(
                    "Severely abnormal heart rate detected"
            );

            result.setRecommendation(
                    "Immediate medical evaluation required"
            );

            result.setRiskPercentage(95.0);
            result.setHealthScore(5);

            return result;
        }

        // ==========================
        // HYPERTENSIVE CRISIS
        // ==========================

        if (systolicBP > 180) {

            result.setRiskLevel("CRITICAL");

            result.setDiagnosis(
                    "Severely elevated blood pressure detected"
            );

            result.setRecommendation(
                    "Immediate medical evaluation required"
            );

            result.setRiskPercentage(95.0);
            result.setHealthScore(5);

            return result;
        }

        // ==========================
        // HIGH FEVER
        // ==========================

        if (temperature > 39) {

            result.setDiagnosis(
                    "High fever detected"
            );

            if (!"CRITICAL".equals(result.getRiskLevel())) {
                result.setRiskLevel("HIGH");
            }

            result.setRecommendation(
                    "Medical review recommended"
            );
        }

        // ==========================
        // ELDERLY + ABNORMAL HR
        // ==========================

        if (age > 65 &&
                (heartRate > 120 || heartRate < 50)) {

            if (!"CRITICAL".equals(result.getRiskLevel())) {

                result.setRiskLevel("HIGH");

                result.setDiagnosis(
                        "Elevated cardiovascular risk detected"
                );

                result.setRecommendation(
                        "Doctor review recommended"
                );
            }
        }

        return result;
    }
}