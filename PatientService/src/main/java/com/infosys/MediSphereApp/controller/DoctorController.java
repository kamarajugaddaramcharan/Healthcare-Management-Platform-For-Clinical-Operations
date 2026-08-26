package com.infosys.MediSphereApp.controller;

import com.infosys.MediSphereApp.model.Doctor;
import com.infosys.MediSphereApp.service.DoctorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService service;


    // =====================================================
    // CREATE DOCTOR
    // =====================================================

    @PostMapping
    public Doctor addDoctor(
            @RequestBody Doctor doctor
    ) {

        return service.saveDoctor(
                doctor
        );
    }


    // =====================================================
    // GET ALL DOCTORS
    // =====================================================

    @GetMapping
    public List<Doctor> getAllDoctors() {

        return service.getAllDoctors();
    }


    // =====================================================
    // GET DOCTOR BY DATABASE ID
    // =====================================================

    @GetMapping("/{id}")
    public Doctor getDoctorById(
            @PathVariable String id
    ) {

        return service.getDoctorById(
                id
        );
    }


    // =====================================================
    // GET DOCTOR BY DOCTOR ID
    // =====================================================

    @GetMapping("/doctor-id/{doctorId}")
    public Doctor getDoctorByDoctorId(
            @PathVariable String doctorId
    ) {

        return service.getDoctorByDoctorId(
                doctorId
        );
    }


    // =====================================================
    // GET DOCTORS BY HOSPITAL
    // =====================================================

    @GetMapping("/hospital/{hospitalId}")
    public List<Doctor> getDoctorsByHospital(
            @PathVariable String hospitalId
    ) {

        return service.getDoctorsByHospital(
                hospitalId
        );
    }


    // =====================================================
    // GET ACTIVE / INACTIVE DOCTORS
    // =====================================================

    @GetMapping("/active/{active}")
    public List<Doctor> getDoctorsByActive(
            @PathVariable boolean active
    ) {

        return service.getDoctorsByActive(
                active
        );
    }


    // =====================================================
    // UPDATE DOCTOR
    // =====================================================

    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable String id,
            @RequestBody Doctor doctor
    ) {

        return service.updateDoctor(
                id,
                doctor
        );
    }


    // =====================================================
    // DELETE DOCTOR
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteDoctor(
            @PathVariable String id
    ) {

        service.deleteDoctor(id);

        return "Doctor deleted successfully";
    }
}