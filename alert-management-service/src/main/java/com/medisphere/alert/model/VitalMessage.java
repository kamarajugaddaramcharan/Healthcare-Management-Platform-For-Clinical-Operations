package com.medisphere.alert.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VitalMessage {

    private String id;

    private String patientId;

    private int heartRate;

    private String bloodPressure;

    private double temperature;

    private double oxygenLevel;

    private LocalDateTime timestamp;
}