package com.infosys.aiprediction.service;

import com.infosys.aiprediction.client.AlertClient;
import com.infosys.aiprediction.dto.AlertDTO;
import com.infosys.aiprediction.model.PredictionResult;
import com.infosys.aiprediction.model.RiskPrediction;
import com.infosys.aiprediction.repository.PredictionRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PredictionServiceImpl implements PredictionService {

    private final PredictionRepository predictionRepository;
    private final RestTemplate restTemplate;
    private final AlertClient alertClient;
    private final AIAnomalyService aiAnomalyService;
    private final ClinicalRuleEngine clinicalRuleEngine;

    @Value("${flask.api.url}")
    private String flaskUrl;

    @Value("${vitals.api.url}")
    private String vitalsApiUrl;

    public PredictionServiceImpl(
            PredictionRepository predictionRepository,
            RestTemplate restTemplate,
            AlertClient alertClient,
            AIAnomalyService aiAnomalyService,
            ClinicalRuleEngine clinicalRuleEngine) {

        this.predictionRepository = predictionRepository;
        this.restTemplate = restTemplate;
        this.alertClient = alertClient;
        this.aiAnomalyService = aiAnomalyService;
        this.clinicalRuleEngine = clinicalRuleEngine;
    }

    // =====================================================
    // CVD / FLASK PREDICTION
    // =====================================================

    @Override
    public RiskPrediction savePrediction(
            RiskPrediction prediction) {

        try {

            double[] features = {
                    prediction.getAge() == null
                            ? 0
                            : prediction.getAge(),

                    prediction.getSex() == null
                            ? 0
                            : prediction.getSex(),

                    prediction.getChestPainType() == null
                            ? 0
                            : prediction.getChestPainType(),

                    prediction.getRestingBloodPressure() == null
                            ? 0
                            : prediction.getRestingBloodPressure(),

                    prediction.getCholesterol() == null
                            ? 0
                            : prediction.getCholesterol(),

                    prediction.getFastingBloodSugar() == null
                            ? 0
                            : prediction.getFastingBloodSugar(),

                    prediction.getRestingECG() == null
                            ? 0
                            : prediction.getRestingECG(),

                    prediction.getMaxHeartRate() == null
                            ? 0
                            : prediction.getMaxHeartRate(),

                    prediction.getExerciseInducedAngina() == null
                            ? 0
                            : prediction.getExerciseInducedAngina(),

                    prediction.getOldPeak() == null
                            ? 0
                            : prediction.getOldPeak(),

                    prediction.getSlope() == null
                            ? 0
                            : prediction.getSlope(),

                    prediction.getMajorVessels() == null
                            ? 0
                            : prediction.getMajorVessels(),

                    prediction.getThal() == null
                            ? 0
                            : prediction.getThal()
            };

            Map<String, Object> request =
                    new HashMap<>();

            request.put(
                    "features",
                    features
            );

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setContentType(
                    MediaType.APPLICATION_JSON
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(
                            request,
                            headers
                    );

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(
                            flaskUrl,
                            entity,
                            Map.class
                    );

            Map<?, ?> body =
                    response.getBody();

            if (body != null) {

                double probability =
                        Double.parseDouble(
                                body.get(
                                        "probability"
                                ).toString()
                        );

                double percentage =
                        probability * 100;

                prediction.setRiskPercentage(
                        percentage
                );

                prediction.setConfidence(
                        percentage
                );

                if (percentage >= 90) {

                    prediction.setRiskLevel(
                            "CRITICAL"
                    );

                } else if (percentage >= 70) {

                    prediction.setRiskLevel(
                            "HIGH"
                    );

                } else if (percentage >= 40) {

                    prediction.setRiskLevel(
                            "MEDIUM"
                    );

                } else {

                    prediction.setRiskLevel(
                            "LOW"
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "Flask API Error : "
                            + e.getMessage()
            );

            prediction.setRiskPercentage(
                    0.0
            );

            prediction.setConfidence(
                    0.0
            );

            prediction.setRiskLevel(
                    "UNKNOWN"
            );
        }

        // =====================================================
        // EXISTING ANOMALY ANALYSIS
        // =====================================================

        PredictionResult result =
                aiAnomalyService.analyzePatient(

                        prediction.getAge() == null
                                ? 0
                                : prediction.getAge(),

                        prediction.getMaxHeartRate() == null
                                ? 0
                                : prediction.getMaxHeartRate(),

                        98,

                        37.0,

                        prediction.getRestingBloodPressure() == null
                                ? 0
                                : prediction.getRestingBloodPressure()
                );

        result =
                clinicalRuleEngine.applyClinicalRules(

                        prediction.getAge() == null
                                ? 0
                                : prediction.getAge(),

                        prediction.getMaxHeartRate() == null
                                ? 0
                                : prediction.getMaxHeartRate(),

                        98,

                        37.0,

                        prediction.getRestingBloodPressure() == null
                                ? 0
                                : prediction.getRestingBloodPressure(),

                        result
                );

        prediction.setRiskLevel(
                result.getRiskLevel()
        );

        prediction.setRiskPercentage(
                result.getRiskPercentage()
        );

        prediction.setConfidence(
                result.getConfidence()
        );

        prediction.setDiagnosis(
                result.getDiagnosis()
        );

        prediction.setRecommendation(
                result.getRecommendation()
        );

        prediction.setHealthScore(
                result.getHealthScore()
        );

        prediction.setPredictionDate(
                LocalDateTime.now()
        );

        // =====================================================
        // SAVE
        // =====================================================

        RiskPrediction savedPrediction =
                predictionRepository.save(
                        prediction
                );

        // =====================================================
        // CREATE ALERT
        // =====================================================

        if (
                "HIGH".equals(
                        savedPrediction.getRiskLevel()
                )
                        ||
                        "CRITICAL".equals(
                                savedPrediction.getRiskLevel()
                        )
        ) {

            try {

                AlertDTO alert =
                        AlertDTO.builder()

                                .predictionId(
                                        savedPrediction.getId()
                                )

                                .patientId(
                                        savedPrediction.getPatientId()
                                )

                                .patientName(
                                        savedPrediction.getPatientId()
                                )

                                .alertType(
                                        "Heart Disease Prediction"
                                )

                                .riskLevel(
                                        savedPrediction.getRiskLevel()
                                )

                                .riskPercentage(
                                        savedPrediction
                                                .getRiskPercentage()
                                )

                                .message(
                                        "AI detected "
                                                + savedPrediction
                                                .getRiskLevel()
                                                + " heart disease risk."
                                )

                                .assignedDoctor(
                                        "Doctor"
                                )

                                .build();

                System.out.println(
                        "===================================="
                );

                System.out.println(
                        "Saved Prediction ID : "
                                + savedPrediction.getId()
                );

                System.out.println(
                        "Patient ID          : "
                                + savedPrediction.getPatientId()
                );

                System.out.println(
                        "Risk Level          : "
                                + savedPrediction.getRiskLevel()
                );

                System.out.println(
                        "Alert DTO           : "
                                + alert
                );

                System.out.println(
                        "===================================="
                );

                alertClient.createAlert(
                        alert
                );

                System.out.println(
                        "Alert created successfully."
                );

            } catch (Exception ex) {

                System.out.println(
                        "Alert Service Error : "
                                + ex.getMessage()
                );
            }
        }

        return savedPrediction;
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    public List<RiskPrediction> getAllPredictions() {

        return predictionRepository.findAll();
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    @Override
    public RiskPrediction getPredictionById(
            String id) {

        return predictionRepository
                .findById(id)
                .orElse(null);
    }

    // =====================================================
    // GET BY PATIENT
    // =====================================================

    @Override
    public List<RiskPrediction> getPredictionsByPatientId(
            String patientId) {

        return predictionRepository
                .findByPatientId(patientId);
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @Override
    public RiskPrediction updatePrediction(
            String id,
            RiskPrediction prediction) {

        RiskPrediction existing =
                predictionRepository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {
            return null;
        }

        prediction.setId(
                existing.getId()
        );

        return savePrediction(
                prediction
        );
    }

    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void deletePrediction(
            String id) {

        predictionRepository.deleteById(
                id
        );
    }

    // =====================================================
    // GENERATE PREDICTION FROM LATEST VITALS
    // =====================================================

    @Override
    public RiskPrediction generatePredictionFromVitals(
            String patientId) {

        // -------------------------------------------------
        // GET LATEST VITAL FROM VITALS SERVICE
        // -------------------------------------------------

        String url =
                vitalsApiUrl
                        + "/vitals/patient/"
                        + patientId
                        + "/latest";

        ResponseEntity<Map> response =
                restTemplate.getForEntity(
                        url,
                        Map.class
                );

        Map<?, ?> vital =
                response.getBody();

        if (vital == null) {

            throw new RuntimeException(
                    "No latest vitals found for patient "
                            + patientId
            );
        }

        // -------------------------------------------------
        // READ HEART RATE
        // -------------------------------------------------

        double heartRate =
                Double.parseDouble(
                        vital.get(
                                "heartRate"
                        ).toString()
                );

        // -------------------------------------------------
        // READ SPO2
        // -------------------------------------------------

        double spo2 =
                Double.parseDouble(
                        vital.get(
                                "oxygenLevel"
                        ).toString()
                );

        // -------------------------------------------------
        // READ TEMPERATURE
        // -------------------------------------------------

        double temperature =
                Double.parseDouble(
                        vital.get(
                                "temperature"
                        ).toString()
                );

        // -------------------------------------------------
        // READ BLOOD PRESSURE
        // -------------------------------------------------

        String bloodPressure =
                vital.get(
                        "bloodPressure"
                ).toString();

        double systolicBP =
                Double.parseDouble(
                        bloodPressure
                                .split("/")[0]
                );

        // -------------------------------------------------
        // AGE
        // -------------------------------------------------
        //
        // Temporary value.
        // We will connect this to Patient Service later.
        //

        int age = 0;

        // -------------------------------------------------
        // AI ANOMALY ANALYSIS
        // -------------------------------------------------

        PredictionResult result =
                aiAnomalyService.analyzePatient(

                        age,

                        heartRate,

                        spo2,

                        temperature,

                        systolicBP
                );

        // -------------------------------------------------
        // CLINICAL RULE ENGINE
        // -------------------------------------------------

        result =
                clinicalRuleEngine.applyClinicalRules(

                        age,

                        heartRate,

                        spo2,

                        temperature,

                        systolicBP,

                        result
                );

        // -------------------------------------------------
        // CREATE PREDICTION
        // -------------------------------------------------

        RiskPrediction prediction =
                new RiskPrediction();

        prediction.setPatientId(
                patientId
        );

        prediction.setMaxHeartRate(
                (int) heartRate
        );

        prediction.setRestingBloodPressure(
                (int) systolicBP
        );

        prediction.setRiskLevel(
                result.getRiskLevel()
        );

        prediction.setRiskPercentage(
                result.getRiskPercentage()
        );

        prediction.setConfidence(
                result.getConfidence()
        );

        prediction.setDiagnosis(
                result.getDiagnosis()
        );

        prediction.setRecommendation(
                result.getRecommendation()
        );

        prediction.setHealthScore(
                result.getHealthScore()
        );

        prediction.setPredictionDate(
                LocalDateTime.now()
        );

        prediction.setModelVersion(
                "Vitals-AI-v1"
        );

        // -------------------------------------------------
        // SAVE TO MONGODB
        // -------------------------------------------------

        return predictionRepository.save(
                prediction
        );
    }
}