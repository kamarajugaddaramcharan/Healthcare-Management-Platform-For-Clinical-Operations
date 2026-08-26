package com.medisphere.alert.kafka;

import com.medisphere.alert.model.Alert;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AlertConsumer {

    @KafkaListener(
            topics = "alerts-stream",
            groupId = "alert-group",
            containerFactory = "alertKafkaListenerContainerFactory"
    )
    public void consume(Alert alert) {

        log.info(
                "Alert Received : {} - {}",
                alert.getPatientId(),
                alert.getRiskLevel()
        );

    }

}