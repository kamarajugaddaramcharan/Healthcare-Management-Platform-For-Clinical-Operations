package com.infosys.CarePlanService.repository;

import com.infosys.CarePlanService.model.CarePlan;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CarePlanRepository
        extends MongoRepository<CarePlan, String> {

    List<CarePlan> findByPatientId(String patientId);

    List<CarePlan> findByDoctorId(String doctorId);

    Optional<CarePlan>
    findFirstByPatientIdAndStatusOrderByUpdatedAtDesc(
            String patientId,
            String status
    );
}