package com.medisphere.alert.controller;

import com.medisphere.alert.model.Alert;
import com.medisphere.alert.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // Create Alert
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Alert createAlert(@RequestBody Alert alert) {

        System.out.println("======================================");
        System.out.println("NEW ALERT RECEIVED");
        System.out.println("Prediction ID : " + alert.getPredictionId());
        System.out.println("Patient ID    : " + alert.getPatientId());
        System.out.println("Patient Name  : " + alert.getPatientName());
        System.out.println("Risk Level    : " + alert.getRiskLevel());
        System.out.println("======================================");

        return alertService.createAlert(alert);
    }

    // Get All Alerts
    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    // Get Alert By ID
    @GetMapping("/{id}")
    public Alert getAlertById(@PathVariable String id) {
        return alertService.getAlertById(id);
    }

    // Get Critical Alerts
    @GetMapping("/critical")
    public List<Alert> getCriticalAlerts() {
        return alertService.getCriticalAlerts();
    }

    // Get Alerts By Patient
    @GetMapping("/patient/{patientId}")
    public List<Alert> getPatientAlerts(@PathVariable String patientId) {
        return alertService.getPatientAlerts(patientId);
    }

    // Get Alerts By Doctor
    @GetMapping("/doctor/{doctorName}")
    public List<Alert> getDoctorAlerts(@PathVariable String doctorName) {
        return alertService.getDoctorAlerts(doctorName);
    }

    // Get Alerts By Status
    @GetMapping("/status/{status}")
    public List<Alert> getAlertsByStatus(@PathVariable String status) {
        return alertService.getAlertsByStatus(status);
    }

    // Acknowledge Alert
    @PutMapping("/{id}/acknowledge")
    public Alert acknowledgeAlert(@PathVariable String id) {
        return alertService.acknowledgeAlert(id);
    }

    // Resolve Alert
    @PutMapping("/{id}/resolve")
    public Alert resolveAlert(@PathVariable String id) {
        return alertService.resolveAlert(id);
    }

    // Delete Alert
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAlert(@PathVariable String id) {
        alertService.deleteAlert(id);
    }

    // Dashboard Statistics
    @GetMapping("/statistics")
    public Map<String, Long> getStatistics() {

        return Map.of(
                "totalAlerts", alertService.totalAlerts(),
                "criticalAlerts", alertService.totalCriticalAlerts(),
                "activeAlerts", alertService.totalActiveAlerts(),
                "acknowledgedAlerts", alertService.totalAcknowledgedAlerts()
        );
    }
}