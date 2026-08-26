package com.infosys.modelservice.controller;

import com.infosys.modelservice.model.AIModel;
import com.infosys.modelservice.service.ModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/models")
public class ModelController {

    @Autowired
    private ModelService service;

    @PostMapping
    public AIModel saveModel(@RequestBody AIModel model) {
        return service.saveModel(model);
    }

    @GetMapping
    public List<AIModel> getAllModels() {
        return service.getAllModels();
    }

    @GetMapping("/{id}")
    public AIModel getModelById(@PathVariable String id) {
        return service.getModelById(id);
    }

    @PutMapping("/{id}")
    public AIModel updateModel(@PathVariable String id,
                               @RequestBody AIModel model) {
        return service.updateModel(id, model);
    }

    @DeleteMapping("/{id}")
    public void deleteModel(@PathVariable String id) {
        service.deleteModel(id);
    }
}