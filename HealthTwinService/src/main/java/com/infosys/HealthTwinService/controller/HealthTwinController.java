package com.infosys.HealthTwinService.controller;

import com.infosys.HealthTwinService.model.HealthTwin;
import com.infosys.HealthTwinService.service.HealthTwinService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/healthtwins")
public class HealthTwinController {

    @Autowired
    private HealthTwinService service;


    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public HealthTwin addHealthTwin(
            @RequestBody HealthTwin healthTwin) {

        return service.save(healthTwin);
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public List<HealthTwin> getAllHealthTwins() {

        return service.getAll();
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @GetMapping("/{id}")
    public HealthTwin getHealthTwinById(
            @PathVariable String id) {

        return service.getById(id);
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public HealthTwin updateHealthTwin(
            @PathVariable String id,
            @RequestBody HealthTwin healthTwin) {

        return service.update(id, healthTwin);
    }


    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteHealthTwin(
            @PathVariable String id) {

        service.delete(id);

        return "Health Twin deleted successfully";
    }
}