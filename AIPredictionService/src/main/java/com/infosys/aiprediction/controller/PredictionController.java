package com.infosys.aiprediction.controller;

import com.infosys.aiprediction.model.RiskPrediction;
import com.infosys.aiprediction.service.PredictionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(
            PredictionService predictionService
    ) {
        this.predictionService = predictionService;
    }

    // =====================================================
    // GENERATE PREDICTION FROM LATEST PATIENT VITALS
    // =====================================================

    @PostMapping("/vitals/{patientId}")
    public RiskPrediction generatePredictionFromVitals(
            @PathVariable String patientId
    ) {

        return predictionService
                .generatePredictionFromVitals(
                        patientId
                );
    }

    // =====================================================
    // CVD / FLASK PREDICTION
    // =====================================================

    @PostMapping("/cvd")
    public RiskPrediction predictCVD(
            @RequestBody RiskPrediction prediction
    ) {

        return predictionService
                .savePrediction(
                        prediction
                );
    }

    // =====================================================
    // GET ALL PREDICTIONS
    // =====================================================

    @GetMapping
    public List<RiskPrediction> getAllPredictions() {

        return predictionService
                .getAllPredictions();
    }

    // =====================================================
    // GET PREDICTION BY ID
    // =====================================================

    @GetMapping("/{id}")
    public RiskPrediction getPredictionById(
            @PathVariable String id
    ) {

        return predictionService
                .getPredictionById(id);
    }

    // =====================================================
    // GET PATIENT PREDICTION HISTORY
    // =====================================================

    @GetMapping("/history/{patientId}")
    public List<RiskPrediction> getPredictionHistory(
            @PathVariable String patientId
    ) {

        return predictionService
                .getPredictionsByPatientId(
                        patientId
                );
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public RiskPrediction updatePrediction(
            @PathVariable String id,
            @RequestBody RiskPrediction prediction
    ) {

        return predictionService
                .updatePrediction(
                        id,
                        prediction
                );
    }

    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deletePrediction(
            @PathVariable String id
    ) {

        predictionService.deletePrediction(
                id
        );

        return "Prediction deleted successfully";
    }
}