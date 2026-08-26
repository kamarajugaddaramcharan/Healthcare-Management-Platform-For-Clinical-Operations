package com.infosys.ConsentService.controller;

import com.infosys.ConsentService.model.Consent;
import com.infosys.ConsentService.service.ConsentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/consents")
public class ConsentController {

    @Autowired
    private ConsentService consentService;

    @PostMapping
    public Consent saveConsent(@RequestBody Consent consent) {
        return consentService.saveConsent(consent);
    }

    @GetMapping
    public List<Consent> getAllConsents() {
        return consentService.getAllConsents();
    }

    @GetMapping("/{id}")
    public Consent getConsentById(@PathVariable String id) {
        return consentService.getConsentById(id);
    }

    @PutMapping("/{id}")
    public Consent updateConsent(@PathVariable String id,
                                 @RequestBody Consent consent) {
        return consentService.updateConsent(id, consent);
    }

    @DeleteMapping("/{id}")
    public void deleteConsent(@PathVariable String id) {
        consentService.deleteConsent(id);
    }
}