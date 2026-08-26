package com.infosys.MediSphereApp.service;

import com.infosys.MediSphereApp.model.Doctor;
import com.infosys.MediSphereApp.repository.DoctorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl
        implements DoctorService {

    @Autowired
    private DoctorRepository repository;


    // =====================================================
    // CREATE DOCTOR
    // =====================================================

    @Override
    public Doctor saveDoctor(
            Doctor doctor
    ) {

        return repository.save(doctor);
    }


    // =====================================================
    // GET ALL DOCTORS
    // =====================================================

    @Override
    public List<Doctor> getAllDoctors() {

        return repository.findAll();
    }


    // =====================================================
    // GET BY DATABASE ID
    // =====================================================

    @Override
    public Doctor getDoctorById(
            String id
    ) {

        return repository
                .findById(id)
                .orElse(null);
    }


    // =====================================================
    // GET BY DOCTOR ID
    // =====================================================

    @Override
    public Doctor getDoctorByDoctorId(
            String doctorId
    ) {

        if (
                doctorId == null ||
                        doctorId.trim().isEmpty()
        ) {

            return null;
        }

        return repository
                .findByDoctorId(doctorId)
                .orElse(null);
    }


    // =====================================================
    // GET DOCTORS BY HOSPITAL
    // =====================================================

    @Override
    public List<Doctor> getDoctorsByHospital(
            String hospitalId
    ) {

        return repository
                .findByHospitalId(hospitalId);
    }


    // =====================================================
    // GET ACTIVE / INACTIVE DOCTORS
    // =====================================================

    @Override
    public List<Doctor> getDoctorsByActive(
            boolean active
    ) {

        return repository
                .findByActive(active);
    }


    // =====================================================
    // UPDATE DOCTOR
    // =====================================================

    @Override
    public Doctor updateDoctor(
            String id,
            Doctor doctor
    ) {

        Doctor existing =
                repository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setDoctorId(
                doctor.getDoctorId()
        );

        existing.setDoctorName(
                doctor.getDoctorName()
        );

        existing.setSpecialization(
                doctor.getSpecialization()
        );

        existing.setEmail(
                doctor.getEmail()
        );

        existing.setPhone(
                doctor.getPhone()
        );

        existing.setHospitalId(
                doctor.getHospitalId()
        );

        existing.setActive(
                doctor.isActive()
        );

        return repository.save(
                existing
        );
    }


    // =====================================================
    // DELETE DOCTOR
    // =====================================================

    @Override
    public void deleteDoctor(
            String id
    ) {

        repository.deleteById(id);
    }
}