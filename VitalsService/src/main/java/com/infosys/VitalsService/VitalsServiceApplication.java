package com.infosys.VitalsService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VitalsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(VitalsServiceApplication.class, args);
	}

}