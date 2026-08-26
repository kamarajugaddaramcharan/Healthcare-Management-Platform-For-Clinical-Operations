package com.infosys.FHIRService.controller;

import com.infosys.FHIRService.model.FhirRecord;
import com.infosys.FHIRService.service.FhirService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fhir")
public class FhirController {
    @Autowired
    private FhirService service;

    @PostMapping
    public FhirRecord save(@RequestBody FhirRecord record) {
        return service.save(record);
    }

    @GetMapping
    public List<FhirRecord> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public FhirRecord getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public FhirRecord update(@PathVariable String id,
                             @RequestBody FhirRecord record) {
        return service.update(id, record);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}