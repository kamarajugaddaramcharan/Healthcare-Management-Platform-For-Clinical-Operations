package com.infosys.VitalsService.producer;

import com.infosys.VitalsService.model.Vital;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class VitalProducer {

    private final KafkaTemplate<String, Vital> kafkaTemplate;

    @Value("${kafka.topic.vitals}")
    private String topic;

    public VitalProducer(KafkaTemplate<String, Vital> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendVital(Vital vital) {

        kafkaTemplate.send(topic, vital);

        System.out.println("\n========== Kafka Producer ==========");
        System.out.println("Patient ID   : " + vital.getPatientId());
        System.out.println("Heart Rate   : " + vital.getHeartRate());
        System.out.println("BloodPressure: " + vital.getBloodPressure());
        System.out.println("Temperature  : " + vital.getTemperature());
        System.out.println("SpO₂         : " + vital.getOxygenLevel());
        System.out.println("Published To : " + topic);
        System.out.println("====================================");
    }
}