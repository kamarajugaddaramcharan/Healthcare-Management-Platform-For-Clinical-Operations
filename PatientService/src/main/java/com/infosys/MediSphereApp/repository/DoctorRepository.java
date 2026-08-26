package com.infosys.MediSphereApp.repository;

import com.infosys.MediSphereApp.model.Doctor;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository
        extends MongoRepository<Doctor, String> {

    Optional<Doctor> findByDoctorId(
            String doctorId
    );

    List<Doctor> findByHospitalId(
            String hospitalId
    );

    List<Doctor> findByActive(
            boolean active
    );
}