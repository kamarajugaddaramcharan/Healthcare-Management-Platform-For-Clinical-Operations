package com.infosys.explainability.controller;

import com.infosys.explainability.model.Explanation;
import com.infosys.explainability.service.ExplanationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/explanations")
public class ExplanationController {

    @Autowired
    private ExplanationService service;

    @PostMapping("/{patientId}")
    public Explanation generateExplanation(@PathVariable String patientId) {
        return service.generateExplanation(patientId);
    }

    @GetMapping("/{patientId}")
    public Explanation getExplanation(@PathVariable String patientId) {
        return service.getExplanation(patientId);
    }

    @GetMapping
    public List<Explanation> getAllExplanations() {
        return service.getAllExplanations();
    }

    @DeleteMapping("/{patientId}")
    public void deleteExplanation(@PathVariable String patientId) {
        service.deleteExplanation(patientId);
    }
}