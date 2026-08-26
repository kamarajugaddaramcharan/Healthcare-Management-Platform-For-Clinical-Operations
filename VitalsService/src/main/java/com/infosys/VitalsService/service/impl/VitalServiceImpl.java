package com.infosys.VitalsService.service.impl;

import com.infosys.VitalsService.model.Vital;
import com.infosys.VitalsService.producer.VitalProducer;
import com.infosys.VitalsService.repository.VitalRepository;
import com.infosys.VitalsService.service.VitalService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Random;

@Service
public class VitalServiceImpl implements VitalService {

    private final VitalRepository repository;
    private final VitalProducer vitalProducer;

    private final Random random = new Random();

    public VitalServiceImpl(
            VitalRepository repository,
            VitalProducer vitalProducer) {

        this.repository = repository;
        this.vitalProducer = vitalProducer;
    }

    // =========================================================
    // SAVE VITAL
    // =========================================================

    @Override
    public Vital saveVital(Vital vital) {

        if (vital.getTimestamp() == null) {
            vital.setTimestamp(LocalDateTime.now());
        }

        Vital savedVital = repository.save(vital);

        // Send live vital to Kafka
        vitalProducer.sendVital(savedVital);

        return savedVital;
    }

    // =========================================================
    // GET ALL VITALS
    // =========================================================

    @Override
    public List<Vital> getAllVitals() {

        return repository.findAll();
    }

    // =========================================================
    // GET VITAL BY ID
    // =========================================================

    @Override
    public Vital getVitalById(String id) {

        return repository.findById(id).orElse(null);
    }

    // =========================================================
    // UPDATE VITAL
    // =========================================================

    @Override
    public Vital updateVital(String id, Vital vital) {

        Vital existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setPatientId(vital.getPatientId());
        existing.setHeartRate(vital.getHeartRate());
        existing.setBloodPressure(vital.getBloodPressure());
        existing.setTemperature(vital.getTemperature());
        existing.setOxygenLevel(vital.getOxygenLevel());
        existing.setTimestamp(LocalDateTime.now());

        Vital updatedVital = repository.save(existing);

        // Publish updated vital
        vitalProducer.sendVital(updatedVital);

        return updatedVital;
    }

    // =========================================================
    // DELETE VITAL
    // =========================================================

    @Override
    public void deleteVital(String id) {

        repository.deleteById(id);
    }

    // =========================================================
    // RANDOM LIVE VITAL GENERATOR
    // =========================================================

    @Override
    public void generateRandomVitals() {

        // Generate patient number from 1 to 10
        int patientNo = random.nextInt(10) + 1;

        // P001, P002, ... P010
        String patientId = String.format("P%03d", patientNo);

        // Get latest vital for this patient
        Vital vital = getLatestVital(patientId);

        if (vital == null) {

            vital = new Vital();

            vital.setPatientId(patientId);
        }

        // =====================================================
        // HEART RATE
        // 60 - 150 BPM
        // =====================================================

        int heartRate =
                60 + random.nextInt(91);

        vital.setHeartRate(heartRate);

        // =====================================================
        // BLOOD PRESSURE
        // =====================================================

        int systolic =
                90 + random.nextInt(60);

        int diastolic =
                60 + random.nextInt(30);

        vital.setBloodPressure(
                systolic + "/" + diastolic
        );

        // =====================================================
        // TEMPERATURE
        // 36.0 - 40.0 °C
        // =====================================================

        double temperature =
                Math.round(
                        (36 + random.nextDouble() * 4)
                                * 10.0
                ) / 10.0;

        vital.setTemperature(temperature);

        // =====================================================
        // OXYGEN
        // 85 - 100 %
        // =====================================================

        double oxygenLevel =
                Math.round(
                        (85 + random.nextDouble() * 15)
                                * 10.0
                ) / 10.0;

        vital.setOxygenLevel(oxygenLevel);

        // =====================================================
        // TIMESTAMP
        // =====================================================

        vital.setTimestamp(LocalDateTime.now());

        // =====================================================
        // SAVE TO MONGODB
        // =====================================================

        Vital savedVital =
                repository.save(vital);

        // =====================================================
        // SEND TO KAFKA
        // =====================================================

        vitalProducer.sendVital(savedVital);

        // =====================================================
        // CALCULATE LOCAL RISK FOR LOGGING
        // =====================================================

        String risk =
                calculateRisk(savedVital);

        System.out.println();
        System.out.println("========================================");
        System.out.println("        LIVE VITAL GENERATED");
        System.out.println("========================================");
        System.out.println(
                "Patient ID     : "
                        + savedVital.getPatientId()
        );
        System.out.println(
                "Heart Rate     : "
                        + savedVital.getHeartRate()
                        + " BPM"
        );
        System.out.println(
                "Blood Pressure : "
                        + savedVital.getBloodPressure()
        );
        System.out.println(
                "Temperature    : "
                        + savedVital.getTemperature()
                        + " °C"
        );
        System.out.println(
                "Oxygen Level   : "
                        + savedVital.getOxygenLevel()
                        + " %"
        );
        System.out.println(
                "Risk Level     : "
                        + risk
        );
        System.out.println(
                "Timestamp      : "
                        + savedVital.getTimestamp()
        );
        System.out.println("========================================");

        if (isCritical(savedVital)) {

            System.out.println();
            System.out.println(
                    "🚨🚨🚨 CRITICAL VITAL DETECTED 🚨🚨🚨"
            );
            System.out.println(
                    "Patient : "
                            + savedVital.getPatientId()
            );
            System.out.println(
                    "Risk    : "
                            + risk
            );
            System.out.println(
                    "Heart Rate : "
                            + savedVital.getHeartRate()
            );
            System.out.println(
                    "Temperature : "
                            + savedVital.getTemperature()
            );
            System.out.println(
                    "SpO2 : "
                            + savedVital.getOxygenLevel()
            );
            System.out.println();
        }
    }

    // =========================================================
    // RISK CALCULATION
    // =========================================================

    @Override
    public String calculateRisk(Vital vital) {

        if (vital == null) {
            return "LOW";
        }

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

    // =========================================================
    // CRITICAL CHECK
    // =========================================================

    @Override
    public boolean isCritical(Vital vital) {

        if (vital == null) {
            return false;
        }

        return vital.getHeartRate() > 140
                || vital.getTemperature() > 39.5
                || vital.getOxygenLevel() < 88;
    }

    // =========================================================
    // GET VITALS BY PATIENT
    // =========================================================

    @Override
    public List<Vital> getVitalsByPatient(String patientId) {

        return repository.findByPatientId(patientId);
    }

    // =========================================================
    // GET LATEST VITAL
    // =========================================================

    @Override
    public Vital getLatestVital(String patientId) {

        List<Vital> vitals =
                repository.findByPatientId(patientId);

        if (vitals == null || vitals.isEmpty()) {
            return null;
        }

        /*
         * IMPORTANT:
         * Some old MongoDB records may have timestamp = null.
         * Ignore those records when finding the latest vital.
         */

        return vitals.stream()
                .filter(vital -> vital != null)
                .filter(vital -> vital.getTimestamp() != null)
                .max(
                        Comparator.comparing(
                                Vital::getTimestamp
                        )
                )
                .orElseGet(() -> {

                    /*
                     * If all old records have null timestamps,
                     * use the first record instead of crashing.
                     */

                    return vitals.stream()
                            .filter(vital -> vital != null)
                            .findFirst()
                            .orElse(null);
                });
    }
}