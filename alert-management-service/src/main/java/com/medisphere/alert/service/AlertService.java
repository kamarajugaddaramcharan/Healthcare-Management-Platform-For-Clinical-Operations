package com.medisphere.alert.service;

import com.medisphere.alert.model.Alert;
import com.medisphere.alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    // Create Alert
    public Alert createAlert(Alert alert) {

        alert.setCreatedAt(LocalDateTime.now());
        alert.setUpdatedAt(LocalDateTime.now());

        if (alert.getStatus() == null) {
            alert.setStatus("ACTIVE");
        }

        alert.setAcknowledged(false);

        return alertRepository.save(alert);
    }

    // Get All Alerts
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    // Get Alert By ID
    public Alert getAlertById(String id) {
        return alertRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found with ID: " + id));
    }

    // Get Critical Alerts
    public List<Alert> getCriticalAlerts() {
        return alertRepository.findByRiskLevel("CRITICAL");
    }

    // Get Alerts By Patient
    public List<Alert> getPatientAlerts(String patientId) {
        return alertRepository.findByPatientId(patientId);
    }

    // Get Alerts By Doctor
    public List<Alert> getDoctorAlerts(String doctor) {
        return alertRepository.findByAssignedDoctor(doctor);
    }

    // Get Alerts By Status
    public List<Alert> getAlertsByStatus(String status) {
        return alertRepository.findByStatus(status);
    }

    // Acknowledge Alert
    public Alert acknowledgeAlert(String id) {

        Alert alert = getAlertById(id);

        alert.setAcknowledged(true);
        alert.setStatus("ACKNOWLEDGED");
        alert.setUpdatedAt(LocalDateTime.now());

        return alertRepository.save(alert);
    }

    // Resolve Alert
    public Alert resolveAlert(String id) {

        Alert alert = getAlertById(id);

        alert.setStatus("RESOLVED");
        alert.setUpdatedAt(LocalDateTime.now());

        return alertRepository.save(alert);
    }

    // Delete Alert
    public void deleteAlert(String id) {
        alertRepository.deleteById(id);
    }

    // Dashboard Statistics
    public long totalAlerts() {
        return alertRepository.count();
    }

    public long totalCriticalAlerts() {
        return alertRepository.findByRiskLevel("CRITICAL").size();
    }

    public long totalActiveAlerts() {
        return alertRepository.findByStatus("ACTIVE").size();
    }

    public long totalAcknowledgedAlerts() {
        return alertRepository.findByAcknowledged(true).size();
    }

}