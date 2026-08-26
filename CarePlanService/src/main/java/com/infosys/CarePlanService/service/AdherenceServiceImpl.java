package com.infosys.CarePlanService.service;

import com.infosys.CarePlanService.model.AdherenceRecord;
import com.infosys.CarePlanService.model.CarePlan;
import com.infosys.CarePlanService.repository.AdherenceRecordRepository;
import com.infosys.CarePlanService.repository.CarePlanRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AdherenceServiceImpl implements AdherenceService {

    private final AdherenceRecordRepository adherenceRepository;
    private final CarePlanRepository carePlanRepository;

    public AdherenceServiceImpl(
            AdherenceRecordRepository adherenceRepository,
            CarePlanRepository carePlanRepository
    ) {
        this.adherenceRepository = adherenceRepository;
        this.carePlanRepository = carePlanRepository;
    }

    // =====================================================
    // UPDATE DAILY ADHERENCE
    // =====================================================

    @Override
    public AdherenceRecord updateAdherence(
            String carePlanId,
            String patientId,
            LocalDate date,
            List<String> completedActivities
    ) {

        // -------------------------------------------------
        // 1. Verify care plan exists
        // -------------------------------------------------

        CarePlan carePlan = carePlanRepository
                .findById(carePlanId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Care plan not found: " + carePlanId
                        )
                );

        // -------------------------------------------------
        // 2. Find adherence using PATIENT + DATE first
        //
        // This is important because a regenerated care plan
        // can have a different carePlanId.
        // -------------------------------------------------

        Optional<AdherenceRecord> existingRecord =
                adherenceRepository.findByPatientIdAndDate(
                        patientId,
                        date
                );

        // -------------------------------------------------
        // 3. Backward compatibility
        //
        // If an older record exists only against the
        // carePlanId, use that record.
        // -------------------------------------------------

        if (existingRecord.isEmpty()) {

            existingRecord =
                    adherenceRepository.findByCarePlanIdAndDate(
                            carePlanId,
                            date
                    );
        }

        // -------------------------------------------------
        // 4. Create new record if this is a new day
        // -------------------------------------------------

        AdherenceRecord record =
                existingRecord.orElseGet(
                        AdherenceRecord::new
                );

        // -------------------------------------------------
        // 5. Created timestamp
        // -------------------------------------------------

        if (record.getCreatedAt() == null) {

            record.setCreatedAt(
                    LocalDateTime.now()
            );
        }

        // -------------------------------------------------
        // 6. Store current patient/care-plan/date
        // -------------------------------------------------

        record.setCarePlanId(carePlanId);
        record.setPatientId(patientId);
        record.setDate(date);

        // -------------------------------------------------
        // 7. Prevent null activities
        // -------------------------------------------------

        List<String> activities =
                completedActivities == null
                        ? new ArrayList<>()
                        : new ArrayList<>(
                        completedActivities
                );

        // -------------------------------------------------
        // 8. Validate activities
        //
        // Only these four activities are allowed:
        //
        // VITALS
        // MEDICATION
        // EXERCISE
        // DIET
        // -------------------------------------------------

        List<String> validActivities =
                activities.stream()

                        .filter(
                                activity ->
                                        activity != null
                        )

                        .map(String::trim)

                        .map(String::toUpperCase)

                        .filter(
                                activity ->
                                        activity.equals("VITALS")
                                                || activity.equals("MEDICATION")
                                                || activity.equals("EXERCISE")
                                                || activity.equals("DIET")
                        )

                        // Prevent duplicates
                        .distinct()

                        .toList();

        // -------------------------------------------------
        // 9. Save completed activities
        // -------------------------------------------------

        record.setCompletedActivities(
                validActivities
        );

        // -------------------------------------------------
        // 10. Calculate adherence
        //
        // 4 activities = 100%
        //
        // 0 = 0%
        // 1 = 25%
        // 2 = 50%
        // 3 = 75%
        // 4 = 100%
        // -------------------------------------------------

        int totalActivities = 4;

        int completed =
                Math.min(
                        validActivities.size(),
                        totalActivities
                );

        int percentage =
                (completed * 100)
                        / totalActivities;

        record.setAdherencePercentage(
                percentage
        );

        // -------------------------------------------------
        // 11. Updated timestamp
        // -------------------------------------------------

        record.setUpdatedAt(
                LocalDateTime.now()
        );

        // -------------------------------------------------
        // 12. Save adherence record
        // -------------------------------------------------

        AdherenceRecord saved =
                adherenceRepository.save(record);

        // -------------------------------------------------
        // 13. Keep current care plan percentage updated
        //
        // This does NOT affect approval/rejection.
        // -------------------------------------------------

        carePlan.setAdherencePercentage(
                percentage
        );

        carePlan.setUpdatedAt(
                LocalDateTime.now()
        );

        carePlanRepository.save(carePlan);

        return saved;
    }

    // =====================================================
    // GET DAILY ADHERENCE
    // =====================================================

    @Override
    public AdherenceRecord getAdherence(
            String carePlanId,
            String patientId,
            LocalDate date
    ) {

        // -------------------------------------------------
        // 1. FIRST search by PATIENT + DATE
        //
        // This makes adherence survive care-plan
        // regeneration.
        // -------------------------------------------------

        Optional<AdherenceRecord> record =
                adherenceRepository.findByPatientIdAndDate(
                        patientId,
                        date
                );

        if (record.isPresent()) {

            return record.get();
        }

        // -------------------------------------------------
        // 2. Backward compatibility:
        // check old carePlanId + date record.
        // -------------------------------------------------

        record =
                adherenceRepository.findByCarePlanIdAndDate(
                        carePlanId,
                        date
                );

        if (record.isPresent()) {

            return record.get();
        }

        // -------------------------------------------------
        // 3. NEW DAY
        //
        // No record means:
        //
        // 0%
        // 0/4 completed
        // no ticks
        // -------------------------------------------------

        AdherenceRecord newRecord =
                new AdherenceRecord();

        newRecord.setCarePlanId(
                carePlanId
        );

        newRecord.setPatientId(
                patientId
        );

        newRecord.setDate(
                date
        );

        newRecord.setCompletedActivities(
                new ArrayList<>()
        );

        newRecord.setAdherencePercentage(
                0
        );

        LocalDateTime now =
                LocalDateTime.now();

        newRecord.setCreatedAt(now);
        newRecord.setUpdatedAt(now);

        return adherenceRepository.save(
                newRecord
        );
    }
}