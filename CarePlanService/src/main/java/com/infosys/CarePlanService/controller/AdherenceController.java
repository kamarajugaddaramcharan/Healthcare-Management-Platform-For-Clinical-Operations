package com.infosys.CarePlanService.controller;

import com.infosys.CarePlanService.model.AdherenceRecord;
import com.infosys.CarePlanService.service.AdherenceService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/adherence")
public class AdherenceController {

    private final AdherenceService adherenceService;

    public AdherenceController(
            AdherenceService adherenceService
    ) {
        this.adherenceService = adherenceService;
    }

    // =====================================================
    // UPDATE DAILY ADHERENCE
    // =====================================================

    @PutMapping("/{carePlanId}")
    public AdherenceRecord updateAdherence(
            @PathVariable String carePlanId,

            @RequestParam String patientId,

            @RequestParam LocalDate date,

            @RequestBody List<String> completedActivities
    ) {

        return adherenceService.updateAdherence(
                carePlanId,
                patientId,
                date,
                completedActivities
        );
    }

    // =====================================================
    // GET DAILY ADHERENCE
    // =====================================================

    @GetMapping("/{carePlanId}")
    public AdherenceRecord getAdherence(
            @PathVariable String carePlanId,

            @RequestParam String patientId,

            @RequestParam LocalDate date
    ) {

        return adherenceService.getAdherence(
                carePlanId,
                patientId,
                date
        );
    }
}