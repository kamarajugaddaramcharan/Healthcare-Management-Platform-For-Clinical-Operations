package com.infosys.VitalsService.scheduler;

import com.infosys.VitalsService.service.VitalService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class VitalScheduler {

    private final VitalService vitalService;

    public VitalScheduler(VitalService vitalService) {
        this.vitalService = vitalService;
    }

    // Generate vitals every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void generateVitals() {

        System.out.println("\nGenerating Live Vitals...");

        vitalService.generateRandomVitals();

    }

}