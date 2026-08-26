package com.infosys.CarePlanService.repository;

import com.infosys.CarePlanService.model.AdherenceRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface AdherenceRecordRepository
        extends MongoRepository<AdherenceRecord, String> {

    // =====================================================
    // CURRENT CARE PLAN + DATE
    // =====================================================

    Optional<AdherenceRecord> findByCarePlanIdAndDate(
            String carePlanId,
            LocalDate date
    );

    // =====================================================
    // PATIENT + DATE
    //
    // This is the important one.
    //
    // Adherence belongs to the patient's daily activity,
    // not to a particular regenerated care-plan ID.
    // =====================================================

    Optional<AdherenceRecord> findByPatientIdAndDate(
            String patientId,
            LocalDate date
    );
}