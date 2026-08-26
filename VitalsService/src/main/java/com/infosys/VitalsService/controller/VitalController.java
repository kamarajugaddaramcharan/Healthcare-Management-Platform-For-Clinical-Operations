package com.infosys.VitalsService.controller;

import com.infosys.VitalsService.model.Vital;
import com.infosys.VitalsService.service.VitalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vitals")
public class VitalController {

    @Autowired
    private VitalService vitalService;

    // =====================================================
    // SAVE VITAL
    // =====================================================

    @PostMapping
    public Vital saveVital(@RequestBody Vital vital) {
        return vitalService.saveVital(vital);
    }

    // =====================================================
    // GET ALL VITALS
    // =====================================================

    @GetMapping
    public List<Vital> getAllVitals() {
        return vitalService.getAllVitals();
    }

    // =====================================================
    // GET VITALS BY PATIENT
    // =====================================================

    @GetMapping("/patient/{patientId}")
    public List<Vital> getVitalsByPatient(
            @PathVariable String patientId) {

        return vitalService.getVitalsByPatient(patientId);
    }

    // =====================================================
    // GET LATEST VITAL BY PATIENT
    // =====================================================

    @GetMapping("/patient/{patientId}/latest")
    public Vital getLatestVital(
            @PathVariable String patientId) {

        return vitalService.getLatestVital(patientId);
    }

    // =====================================================
    // GET VITAL BY DATABASE ID
    // =====================================================

    @GetMapping("/{id}")
    public Vital getVitalById(
            @PathVariable String id) {

        return vitalService.getVitalById(id);
    }

    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public Vital updateVital(
            @PathVariable String id,
            @RequestBody Vital vital) {

        return vitalService.updateVital(id, vital);
    }

    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public void deleteVital(
            @PathVariable String id) {

        vitalService.deleteVital(id);
    }
}