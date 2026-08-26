package com.infosys.VitalsService.consumer;

import com.infosys.VitalsService.model.Vital;
import com.infosys.VitalsService.repository.VitalRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class VitalConsumer {

    private final VitalRepository repository;

    public VitalConsumer(VitalRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(
            topics = "patient-vitals",
            groupId = "vitals-group"
    )
    public void consume(Vital vital) {

        repository.save(vital);

        System.out.println("\n========== Kafka Consumer ==========");
        System.out.println("Patient ID      : " + vital.getPatientId());
        System.out.println("Heart Rate      : " + vital.getHeartRate());
        System.out.println("Blood Pressure  : " + vital.getBloodPressure());
        System.out.println("Temperature     : " + vital.getTemperature());
        System.out.println("Oxygen Level    : " + vital.getOxygenLevel());
        System.out.println("Saved to MongoDB");
        System.out.println("====================================");
    }
}