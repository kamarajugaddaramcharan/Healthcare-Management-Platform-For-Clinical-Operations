package com.infosys.CarePlanService.service;

import com.infosys.CarePlanService.model.AdherenceRecord;

import java.time.LocalDate;
import java.util.List;

public interface AdherenceService {

    // =====================================================
    // UPDATE DAILY ADHERENCE
    // =====================================================

    AdherenceRecord updateAdherence(
            String carePlanId,
            String patientId,
            LocalDate date,
            List<String> completedActivities
    );

    // =====================================================
    // GET DAILY ADHERENCE
    // =====================================================

    AdherenceRecord getAdherence(
            String carePlanId,
            String patientId,
            LocalDate date
    );
}