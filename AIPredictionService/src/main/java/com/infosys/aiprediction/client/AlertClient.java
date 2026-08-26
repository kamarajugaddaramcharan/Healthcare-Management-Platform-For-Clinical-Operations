package com.infosys.aiprediction.client;

import com.infosys.aiprediction.dto.AlertDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ALERT-MANAGEMENT-SERVICE")
public interface AlertClient {

    @PostMapping("/api/alerts")
    void createAlert(@RequestBody AlertDTO alertDTO);

}