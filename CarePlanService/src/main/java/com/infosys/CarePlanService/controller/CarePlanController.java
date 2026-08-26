package com.infosys.CarePlanService.controller;

import com.infosys.CarePlanService.model.CarePlan;
import com.infosys.CarePlanService.service.CarePlanService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/careplans")
public class CarePlanController {

    private final CarePlanService carePlanService;

    public CarePlanController(
            CarePlanService carePlanService
    ) {

        this.carePlanService =
                carePlanService;
    }

    // =========================================
    // GENERATE AI CARE PLAN
    // =========================================

    @PostMapping("/generate/{patientId}")
    public ResponseEntity<CarePlan>
    generateAICarePlan(
            @PathVariable String patientId
    ) {

        CarePlan carePlan =
                carePlanService
                        .generateAICarePlan(
                                patientId
                        );

        return ResponseEntity.ok(
                carePlan
        );
    }

    // =========================================
    // CREATE
    // =========================================

    @PostMapping
    public ResponseEntity<CarePlan>
    createCarePlan(
            @RequestBody CarePlan carePlan
    ) {

        return ResponseEntity.ok(
                carePlanService
                        .createCarePlan(
                                carePlan
                        )
        );
    }

    // =========================================
    // GET ALL
    // =========================================

    @GetMapping
    public ResponseEntity<List<CarePlan>>
    getAllCarePlans() {

        return ResponseEntity.ok(
                carePlanService
                        .getAllCarePlans()
        );
    }

    // =========================================
    // GET BY ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<CarePlan>
    getCarePlanById(
            @PathVariable String id
    ) {

        CarePlan carePlan =
                carePlanService
                        .getCarePlanById(id);

        if (carePlan == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                carePlan
        );
    }

    // =========================================
    // PATIENT CARE PLANS
    // =========================================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<CarePlan>>
    getByPatient(
            @PathVariable String patientId
    ) {

        return ResponseEntity.ok(
                carePlanService
                        .getCarePlansByPatientId(
                                patientId
                        )
        );
    }

    // =========================================
    // LATEST
    // =========================================

    @GetMapping("/patient/{patientId}/latest")
    public ResponseEntity<CarePlan>
    getLatestCarePlan(
            @PathVariable String patientId
    ) {

        CarePlan carePlan =
                carePlanService
                        .getLatestCarePlan(
                                patientId
                        );

        if (carePlan == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                carePlan
        );
    }

    // =========================================
    // STATUS
    // =========================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CarePlan>>
    getByStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                carePlanService
                        .getCarePlansByStatus(
                                status
                        )
        );
    }

    // =========================================
    // DOCTOR
    // =========================================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<CarePlan>>
    getByDoctor(
            @PathVariable String doctorId
    ) {

        return ResponseEntity.ok(
                carePlanService
                        .getCarePlansByDoctorId(
                                doctorId
                        )
        );
    }

    // =========================================
    // RISK
    // =========================================

    @GetMapping("/risk/{riskLevel}")
    public ResponseEntity<List<CarePlan>>
    getByRiskLevel(
            @PathVariable String riskLevel
    ) {

        return ResponseEntity.ok(
                carePlanService
                        .getCarePlansByRiskLevel(
                                riskLevel
                        )
        );
    }

    // =========================================
    // UPDATE
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<CarePlan>
    updateCarePlan(
            @PathVariable String id,
            @RequestBody CarePlan carePlan
    ) {

        CarePlan updated =
                carePlanService
                        .updateCarePlan(
                                id,
                                carePlan
                        );

        if (updated == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                updated
        );
    }

    // =========================================
    // APPROVE
    // =========================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<CarePlan>
    approveCarePlan(
            @PathVariable String id,
            @RequestParam String doctorId,
            @RequestParam String doctorName,
            @RequestParam(required = false)
            String doctorNotes
    ) {

        CarePlan approved =
                carePlanService
                        .approveCarePlan(
                                id,
                                doctorId,
                                doctorName,
                                doctorNotes
                        );

        if (approved == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                approved
        );
    }

    // =========================================
    // REJECT
    // =========================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<CarePlan>
    rejectCarePlan(
            @PathVariable String id,
            @RequestParam String doctorId,
            @RequestParam String doctorName,
            @RequestParam(required = false)
            String doctorNotes
    ) {

        CarePlan rejected =
                carePlanService
                        .rejectCarePlan(
                                id,
                                doctorId,
                                doctorName,
                                doctorNotes
                        );

        if (rejected == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                rejected
        );
    }

    // =========================================
    // ADHERENCE
    // =========================================

    @PutMapping("/{id}/adherence")
    public ResponseEntity<CarePlan>
    updateAdherence(
            @PathVariable String id,
            @RequestParam Integer percentage
    ) {

        CarePlan updated =
                carePlanService
                        .updateAdherence(
                                id,
                                percentage
                        );

        if (updated == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                updated
        );
    }

    // =========================================
    // OUTCOME
    // =========================================

    @PutMapping("/{id}/outcome")
    public ResponseEntity<CarePlan>
    updateOutcome(
            @PathVariable String id,
            @RequestParam Double currentRiskPercentage,
            @RequestParam String outcome
    ) {

        CarePlan updated =
                carePlanService
                        .updateOutcome(
                                id,
                                currentRiskPercentage,
                                outcome
                        );

        if (updated == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                updated
        );
    }

    // =========================================
    // DELETE
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteCarePlan(
            @PathVariable String id
    ) {

        CarePlan existing =
                carePlanService
                        .getCarePlanById(id);

        if (existing == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        carePlanService.deleteCarePlan(id);

        return ResponseEntity.ok(
                "Care plan deleted successfully"
        );
    }
}