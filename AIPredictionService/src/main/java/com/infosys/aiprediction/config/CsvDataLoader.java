package com.infosys.aiprediction.config;

import com.infosys.aiprediction.model.RiskPrediction;
import com.infosys.aiprediction.repository.PredictionRepository;
import com.opencsv.CSVReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.time.LocalDateTime;

@Component
public class CsvDataLoader implements CommandLineRunner {

    @Autowired
    private PredictionRepository predictionRepository;

    @Override
    public void run(String... args) throws Exception {

        // Don't import again if data already exists
        if (predictionRepository.count() > 0) {
            System.out.println("Dataset already imported.");
            return;
        }

        CSVReader reader = new CSVReader(
                new InputStreamReader(
                        new ClassPathResource("dataset/heart_disease_cleveland.csv")
                                .getInputStream()
                )
        );

        // Skip CSV header
        reader.readNext();

        String[] row;
        int patientNo = 101;

        while ((row = reader.readNext()) != null) {

            RiskPrediction prediction = new RiskPrediction();

            prediction.setPatientId("PAT" + patientNo++);

            // Dataset Features
            prediction.setAge(parseInt(row[0]));
            prediction.setSex(parseInt(row[1]));
            prediction.setChestPainType(parseInt(row[2]));
            prediction.setRestingBloodPressure(parseInt(row[3]));
            prediction.setCholesterol(parseInt(row[4]));
            prediction.setFastingBloodSugar(parseInt(row[5]));
            prediction.setRestingECG(parseInt(row[6]));
            prediction.setMaxHeartRate(parseInt(row[7]));
            prediction.setExerciseInducedAngina(parseInt(row[8]));
            prediction.setOldPeak(parseDouble(row[9]));
            prediction.setSlope(parseInt(row[10]));
            prediction.setMajorVessels(parseInt(row[11]));
            prediction.setThal(parseInt(row[12]));
            prediction.setTarget(parseInt(row[13]));

            // Temporary Risk Logic
            if (prediction.getTarget() == 1) {
                prediction.setRiskLevel("HIGH");
                prediction.setRiskPercentage(90.0);
            } else {
                prediction.setRiskLevel("LOW");
                prediction.setRiskPercentage(20.0);
            }

            prediction.setConfidence(95.0);

            // Save current date & time
            prediction.setPredictionDate(LocalDateTime.now());

            prediction.setModelVersion("AI Model v1.0");

            predictionRepository.save(prediction);
        }

        reader.close();

        System.out.println("=========================================");
        System.out.println(" Heart Disease Dataset Imported Successfully ");
        System.out.println("=========================================");
    }

    private Integer parseInt(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0;
        }
        return (int) Double.parseDouble(value);
    }

    private Double parseDouble(String value) {
        if (value == null || value.trim().isEmpty()) {
            return 0.0;
        }
        return Double.parseDouble(value);
    }
}