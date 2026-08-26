package com.infosys.aiprediction.service;

import com.infosys.aiprediction.model.RiskPrediction;

import java.util.List;

public interface PredictionService {

    RiskPrediction savePrediction(
            RiskPrediction prediction
    );

    List<RiskPrediction> getAllPredictions();

    RiskPrediction getPredictionById(
            String id
    );

    List<RiskPrediction> getPredictionsByPatientId(
            String patientId
    );

    RiskPrediction updatePrediction(
            String id,
            RiskPrediction prediction
    );

    void deletePrediction(
            String id
    );

    // ==========================================
    // GENERATE PREDICTION FROM LATEST VITALS
    // ==========================================

    RiskPrediction generatePredictionFromVitals(
            String patientId
    );
}