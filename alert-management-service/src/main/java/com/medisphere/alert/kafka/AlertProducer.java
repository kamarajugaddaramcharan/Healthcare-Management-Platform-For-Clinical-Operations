package com.medisphere.alert.kafka;

import com.medisphere.alert.model.Alert;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertProducer {

    private static final String TOPIC = "alerts-stream";

    private final KafkaTemplate<String, Alert> kafkaTemplate;

    public void sendAlert(Alert alert) {

        log.info("Publishing Alert to Kafka: {}", alert.getPatientId());

        kafkaTemplate.send(TOPIC, alert);

    }

}