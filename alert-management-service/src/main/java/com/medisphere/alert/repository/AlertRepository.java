package com.medisphere.alert.repository;

import com.medisphere.alert.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {

    List<Alert> findByRiskLevel(String riskLevel);

    List<Alert> findByStatus(String status);

    List<Alert> findByAcknowledged(boolean acknowledged);

    List<Alert> findByPatientId(String patientId);

    List<Alert> findByAssignedDoctor(String assignedDoctor);

    List<Alert> findByAlertType(String alertType);

    List<Alert> findByPatientIdAndStatus(
            String patientId,
            String status
    );
}