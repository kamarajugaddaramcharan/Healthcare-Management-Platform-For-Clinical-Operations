package com.infosys.HealthTwinService.service.impl;

import com.infosys.HealthTwinService.model.HealthTwin;
import com.infosys.HealthTwinService.repository.HealthTwinRepository;
import com.infosys.HealthTwinService.service.HealthTwinService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthTwinServiceImpl implements HealthTwinService {

    @Autowired
    private HealthTwinRepository repository;

    @Override
    public HealthTwin save(HealthTwin twin) {
        return repository.save(twin);
    }

    @Override
    public List<HealthTwin> getAll() {
        return repository.findAll();
    }

    @Override
    public HealthTwin getById(String id) {
        HealthTwin twin = repository.findById(id).orElse(null);
        if (twin == null) {
            List<HealthTwin> twins = repository.findByPatientId(id);
            if (twins != null && !twins.isEmpty()) {
                twin = twins.get(0);
            }
        }
        return twin;
    }

    @Override
    public HealthTwin update(String id, HealthTwin twin) {

        HealthTwin existing = repository.findById(id).orElse(null);

        if (existing != null) {
            existing.setPatientId(twin.getPatientId());
            existing.setHeartRate(twin.getHeartRate());
            existing.setBloodPressure(twin.getBloodPressure());
            existing.setTemperature(twin.getTemperature());
            existing.setOxygenLevel(twin.getOxygenLevel());
            existing.setRiskScore(twin.getRiskScore());
            existing.setStatus(twin.getStatus());
            existing.setLastUpdated(twin.getLastUpdated());

            return repository.save(existing);
        }

        return null;
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }
}