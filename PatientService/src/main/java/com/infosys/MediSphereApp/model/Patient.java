package com.infosys.MediSphereApp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "patients")
public class Patient {

    @Id
    private String id;

    private String patientId;
    private String name;          // Full name of the patient
    private int age;
    private String gender;
    private String medicalCondition;
    private String treatment;
    private String outcome;
    private String insuranceType;
    private double income;
    private String region;
    private String smokingStatus;
    private String admissionType;
    private String hospitalId;
    private int lengthOfStay;

    // Doctor assignment
    private String doctorId;
    private String doctorName;

    // Keycloak patient account mapping
    private String keycloakId;
    private String keycloakUsername;

    public Patient() {
    }

    public Patient(
            String id,
            String patientId,
            String name,
            int age,
            String gender,
            String medicalCondition,
            String treatment,
            String outcome,
            String insuranceType,
            double income,
            String region,
            String smokingStatus,
            String admissionType,
            String hospitalId,
            int lengthOfStay,
            String doctorId,
            String doctorName,
            String keycloakId,
            String keycloakUsername
    ) {
        this.id = id;
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.medicalCondition = medicalCondition;
        this.treatment = treatment;
        this.outcome = outcome;
        this.insuranceType = insuranceType;
        this.income = income;
        this.region = region;
        this.smokingStatus = smokingStatus;
        this.admissionType = admissionType;
        this.hospitalId = hospitalId;
        this.lengthOfStay = lengthOfStay;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.keycloakId = keycloakId;
        this.keycloakUsername = keycloakUsername;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getMedicalCondition() {
        return medicalCondition;
    }

    public void setMedicalCondition(String medicalCondition) {
        this.medicalCondition = medicalCondition;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getInsuranceType() {
        return insuranceType;
    }

    public void setInsuranceType(String insuranceType) {
        this.insuranceType = insuranceType;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getSmokingStatus() {
        return smokingStatus;
    }

    public void setSmokingStatus(String smokingStatus) {
        this.smokingStatus = smokingStatus;
    }

    public String getAdmissionType() {
        return admissionType;
    }

    public void setAdmissionType(String admissionType) {
        this.admissionType = admissionType;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public int getLengthOfStay() {
        return lengthOfStay;
    }

    public void setLengthOfStay(int lengthOfStay) {
        this.lengthOfStay = lengthOfStay;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    // ================================
    // KEYCLOAK MAPPING
    // ================================

    public String getKeycloakId() {
        return keycloakId;
    }

    public void setKeycloakId(String keycloakId) {
        this.keycloakId = keycloakId;
    }

    public String getKeycloakUsername() {
        return keycloakUsername;
    }

    public void setKeycloakUsername(String keycloakUsername) {
        this.keycloakUsername = keycloakUsername;
    }

    @Override
    public String toString() {
        return "Patient{" +
                "id='" + id + '\'' +
                ", patientId='" + patientId + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", medicalCondition='" + medicalCondition + '\'' +
                ", treatment='" + treatment + '\'' +
                ", outcome='" + outcome + '\'' +
                ", insuranceType='" + insuranceType + '\'' +
                ", income=" + income +
                ", region='" + region + '\'' +
                ", smokingStatus='" + smokingStatus + '\'' +
                ", admissionType='" + admissionType + '\'' +
                ", hospitalId='" + hospitalId + '\'' +
                ", lengthOfStay=" + lengthOfStay +
                ", doctorId='" + doctorId + '\'' +
                ", doctorName='" + doctorName + '\'' +
                ", keycloakId='" + keycloakId + '\'' +
                ", keycloakUsername='" + keycloakUsername + '\'' +
                '}';
    }
}