package com.medisphere.alert.kafka;

import com.medisphere.alert.model.VitalMessage;
import com.medisphere.alert.model.Alert;
import com.medisphere.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class VitalAlertConsumer {

    private final AlertService alertService;

    @KafkaListener(
            topics = "vitals-topic",
            groupId = "alert-vital-group",
            containerFactory = "vitalKafkaListenerContainerFactory"
    )
    public void consume(VitalMessage vital) {

        log.info("========== VITAL RECEIVED ==========");
        log.info("Patient ID    : {}", vital.getPatientId());
        log.info("Heart Rate    : {}", vital.getHeartRate());
        log.info("Blood Pressure: {}", vital.getBloodPressure());
        log.info("Temperature   : {}", vital.getTemperature());
        log.info("SpO2          : {}", vital.getOxygenLevel());

        String riskLevel = calculateRisk(vital);

        log.info("Risk Level    : {}", riskLevel);

        if ("HIGH".equals(riskLevel) || "CRITICAL".equals(riskLevel)) {

            Alert alert = new Alert();

            alert.setPatientId(vital.getPatientId());
            alert.setPatientName("Unknown Patient");
            alert.setAlertType("VITAL_ALERT");
            alert.setRiskLevel(riskLevel);

            alert.setRiskPercentage(
                    calculateRiskPercentage(vital, riskLevel)
            );

            alert.setMessage(
                    buildAlertMessage(vital)
            );

            alert.setAssignedDoctor("Dr. Sarah Wilson");
            alert.setPredictionId(null);

            alertService.createAlert(alert);

            log.warn(
                    "🚨 {} ALERT CREATED FOR PATIENT {}",
                    riskLevel,
                    vital.getPatientId()
            );
        }
    }

    private String calculateRisk(VitalMessage vital) {

        if (vital.getHeartRate() > 140
                || vital.getOxygenLevel() < 88
                || vital.getTemperature() > 39.5) {

            return "CRITICAL";
        }

        if (vital.getHeartRate() > 120
                || vital.getOxygenLevel() < 92
                || vital.getTemperature() > 38.5) {

            return "HIGH";
        }

        if (vital.getHeartRate() > 100
                || vital.getTemperature() > 37.8) {

            return "MEDIUM";
        }

        return "LOW";
    }

    private double calculateRiskPercentage(
            VitalMessage vital,
            String riskLevel) {

        if ("CRITICAL".equals(riskLevel)) {
            return 98.5;
        }

        if ("HIGH".equals(riskLevel)) {
            return 85.0;
        }

        return 20.0;
    }

    private String buildAlertMessage(VitalMessage vital) {

        if (vital.getHeartRate() > 140) {
            return "Heart rate exceeded critical threshold";
        }

        if (vital.getOxygenLevel() < 88) {
            return "Oxygen level dropped below critical threshold";
        }

        if (vital.getTemperature() > 39.5) {
            return "Body temperature exceeded critical threshold";
        }

        if (vital.getHeartRate() > 120) {
            return "Heart rate exceeded high-risk threshold";
        }

        if (vital.getOxygenLevel() < 92) {
            return "Oxygen level dropped below high-risk threshold";
        }

        if (vital.getTemperature() > 38.5) {
            return "Body temperature exceeded high-risk threshold";
        }

        return "Abnormal vital signs detected";
    }
}