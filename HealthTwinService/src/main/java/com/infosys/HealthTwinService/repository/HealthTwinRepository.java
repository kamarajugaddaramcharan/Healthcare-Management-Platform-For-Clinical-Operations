package com.infosys.HealthTwinService.repository;

import com.infosys.HealthTwinService.model.HealthTwin;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface HealthTwinRepository extends MongoRepository<HealthTwin, String> {

    java.util.List<HealthTwin> findByPatientId(String patientId);

}