package com.infosys.MediSphereApp.service;

import com.infosys.MediSphereApp.model.Doctor;

import java.util.List;

public interface DoctorService {

    // Create doctor
    Doctor saveDoctor(Doctor doctor);

    // Get all doctors
    List<Doctor> getAllDoctors();

    // Get doctor by database ID
    Doctor getDoctorById(String id);

    // Get doctor by Doctor ID
    Doctor getDoctorByDoctorId(String doctorId);

    // Get doctors by hospital
    List<Doctor> getDoctorsByHospital(String hospitalId);

    // Get active/inactive doctors
    List<Doctor> getDoctorsByActive(boolean active);

    // Update doctor
    Doctor updateDoctor(String id, Doctor doctor);

    // Delete doctor
    void deleteDoctor(String id);
}