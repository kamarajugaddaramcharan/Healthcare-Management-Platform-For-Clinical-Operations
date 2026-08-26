package com.infosys.MediSphereApp.util;

import com.infosys.MediSphereApp.model.Patient;
import com.infosys.MediSphereApp.repository.PatientRepository;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.IOException;

@Component
public class CsvPatientLoader implements CommandLineRunner {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public void run(String... args) {

        try {

            // Skip import if data already exists
            if (patientRepository.count() > 0) {
                System.out.println("Patients already exist. Skipping import...");
                return;
            }

            ClassPathResource resource = new ClassPathResource("patients.csv");

            try (CSVReader csvReader = new CSVReaderBuilder(new InputStreamReader(resource.getInputStream()))
                    .withCSVParser(
                            new CSVParserBuilder()
                                    .withSeparator('\t')
                                    .build())
                    .build()) {

                String[] row;

                // Skip header row
                csvReader.readNext();

                int count = 0;

                while ((row = csvReader.readNext()) != null) {

                    Patient patient = new Patient();

                    patient.setPatientId(row[0]);
                    patient.setAge(Integer.parseInt(row[1]));
                    patient.setGender(row[2]);
                    patient.setMedicalCondition(row[3]);
                    patient.setTreatment(row[4]);
                    patient.setOutcome(row[5]);
                    patient.setInsuranceType(row[6]);
                    patient.setIncome(Double.parseDouble(row[7]));
                    patient.setRegion(row[8]);
                    patient.setSmokingStatus(row[9]);
                    patient.setAdmissionType(row[10]);
                    patient.setHospitalId(row[11]);
                    patient.setLengthOfStay(Integer.parseInt(row[12]));

                    patientRepository.save(patient);

                    count++;
                }

                System.out.println("=====================================");
                System.out.println("Imported " + count + " Patients Successfully");
                System.out.println("=====================================");

            }

        } catch (IOException | CsvValidationException e) {
            e.printStackTrace();
        }

    }
}