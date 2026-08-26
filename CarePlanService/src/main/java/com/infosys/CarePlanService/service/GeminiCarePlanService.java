package com.infosys.CarePlanService.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiCarePlanService {

    // =====================================================
    // GEMINI CONFIGURATION
    // =====================================================

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    // =====================================================
    // OBJECTS
    // =====================================================

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiCarePlanService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // =====================================================
    // GENERATE CARE PLAN
    // =====================================================

    public Map<String, Object> generateCarePlan(
            String patientId,
            Map<String, Object> patientData) throws Exception {

        // -------------------------------------------------
        // 1. VALIDATE API KEY
        // -------------------------------------------------

        if (geminiApiKey == null
                || geminiApiKey.isBlank()
                || geminiApiKey.startsWith("YOUR_")
                || geminiApiKey.startsWith("PASTE_")) {

            throw new RuntimeException(
                    "Gemini API key is missing. Check application.properties."
            );
        }

        // -------------------------------------------------
        // 2. VALIDATE URL
        // -------------------------------------------------

        if (geminiApiUrl == null
                || geminiApiUrl.isBlank()) {

            throw new RuntimeException(
                    "Gemini API URL is missing. Check application.properties."
            );
        }

        // -------------------------------------------------
        // 3. BUILD PROMPT
        // -------------------------------------------------

        String prompt = buildPrompt(
                patientId,
                patientData
        );

        System.out.println();
        System.out.println("======================================");
        System.out.println("GEMINI CARE PLAN REQUEST");
        System.out.println("======================================");
        System.out.println("Patient ID: " + patientId);
        System.out.println("Patient Data: " + patientData);
        System.out.println("======================================");

        // -------------------------------------------------
        // 4. REQUEST BODY
        // -------------------------------------------------

        Map<String, Object> textPart =
                new LinkedHashMap<>();

        textPart.put(
                "text",
                prompt
        );

        Map<String, Object> content =
                new LinkedHashMap<>();

        content.put(
                "parts",
                List.of(textPart)
        );

        Map<String, Object> requestBody =
                new LinkedHashMap<>();

        requestBody.put(
                "contents",
                List.of(content)
        );

        // -------------------------------------------------
        // 5. HEADERS
        // -------------------------------------------------

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.set(
                "x-goog-api-key",
                geminiApiKey.trim()
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(
                        requestBody,
                        headers
                );

        // -------------------------------------------------
        // 6. CALL GEMINI
        // -------------------------------------------------

        try {

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            geminiApiUrl,
                            HttpMethod.POST,
                            request,
                            String.class
                    );

            // -------------------------------------------------
            // 7. CHECK RESPONSE
            // -------------------------------------------------

            if (!response.getStatusCode()
                    .is2xxSuccessful()) {

                throw new RuntimeException(
                        "Gemini API returned HTTP "
                                + response.getStatusCode().value()
                                + ": "
                                + response.getBody()
                );
            }

            String responseBody =
                    response.getBody();

            if (responseBody == null
                    || responseBody.isBlank()) {

                throw new RuntimeException(
                        "Gemini returned an empty response."
                );
            }

            // -------------------------------------------------
            // 8. RAW RESPONSE
            // -------------------------------------------------

            System.out.println();
            System.out.println("======================================");
            System.out.println("RAW GEMINI RESPONSE");
            System.out.println("======================================");
            System.out.println(responseBody);
            System.out.println("======================================");

            // -------------------------------------------------
            // 9. PARSE GEMINI RESPONSE
            // -------------------------------------------------

            JsonNode root =
                    objectMapper.readTree(
                            responseBody
                    );

            JsonNode candidates =
                    root.path("candidates");

            if (!candidates.isArray()
                    || candidates.isEmpty()) {

                throw new RuntimeException(
                        "Gemini returned no candidates. "
                                + responseBody
                );
            }

            JsonNode textNode =
                    candidates
                            .path(0)
                            .path("content")
                            .path("parts")
                            .path(0)
                            .path("text");

            if (textNode.isMissingNode()
                    || textNode.isNull()
                    || textNode.asText().isBlank()) {

                throw new RuntimeException(
                        "Gemini returned no generated text. "
                                + responseBody
                );
            }

            String generatedText =
                    textNode.asText();

            // -------------------------------------------------
            // 10. GENERATED CARE PLAN
            // -------------------------------------------------

            System.out.println();
            System.out.println("======================================");
            System.out.println("GENERATED CARE PLAN");
            System.out.println("======================================");
            System.out.println(generatedText);
            System.out.println("======================================");

            // -------------------------------------------------
            // 11. PARSE CARE PLAN
            // -------------------------------------------------

            return parseCarePlan(
                    generatedText
            );

        } catch (HttpClientErrorException e) {

            System.err.println();
            System.err.println("======================================");
            System.err.println("GEMINI API ERROR");
            System.err.println("======================================");

            System.err.println(
                    "HTTP STATUS: "
                            + e.getStatusCode()
            );

            System.err.println(
                    "RESPONSE: "
                            + e.getResponseBodyAsString()
            );

            System.err.println("======================================");

            throw new RuntimeException(
                    "Gemini API error "
                            + e.getStatusCode().value()
                            + ": "
                            + e.getResponseBodyAsString(),
                    e
            );

        } catch (Exception e) {

            System.err.println();
            System.err.println("======================================");
            System.err.println("CARE PLAN GENERATION ERROR");
            System.err.println("======================================");

            System.err.println(
                    e.getMessage()
            );

            System.err.println("======================================");

            throw e;
        }
    }

    // =====================================================
    // BUILD GEMINI PROMPT
    // =====================================================

    private String buildPrompt(
            String patientId,
            Map<String, Object> patientData) {

        return """
                You are an AI healthcare care-plan assistant.

                Generate a structured DRAFT care plan for a doctor
                to review and approve.

                IMPORTANT SAFETY RULES:

                - Do not claim to replace a doctor.
                - Do not create definitive medical orders.
                - Do not invent patient information.
                - Use ONLY the supplied patient data.
                - Do not diagnose a disease unless the supplied data
                  clearly supports it.
                - If a diagnosis cannot safely be determined from
                  the supplied data, return "Not available".
                - Do not prescribe medication.
                - Recommendations are for clinician review.

                Patient ID:
                %s

                REAL PATIENT VITALS:
                %s

                Analyze the supplied vital signs carefully.

                Return ONLY valid JSON.
                Do not use markdown.
                Do not use ```json.
                Do not add explanations before or after the JSON.

                Return EXACTLY this structure:

                {
                  "diagnosis": "Not available",
                  "riskLevel": "LOW",
                  "riskPercentage": 5.0,
                  "previousRiskPercentage": null,
                  "currentRiskPercentage": 5.0,
                  "healthScore": 100,

                  "medications": [],
                  "dietRecommendations": [],
                  "exerciseRecommendations": [],
                  "lifestyleRecommendations": [],

                  "dailyWaterTarget": 2.5,
                  "sleepRecommendation": "Aim for 7 to 9 hours of sleep per night.",

                  "treatmentGoals": [],
                  "monitoringPlan": [],

                  "followUp": "Routine physician review as recommended.",

                  "doctorNotes": "Draft care plan generated for clinician review."
                }

                RULES:

                riskLevel:
                Must be exactly one of:
                LOW
                MODERATE
                HIGH
                CRITICAL
                Not available

                riskPercentage:
                - Estimate conservatively from the supplied vital signs.
                - Do not invent medical history.
                - For clearly normal vitals, use a low percentage.

                healthScore:
                - Integer from 0 to 100.
                - Base it ONLY on supplied vital signs.

                previousRiskPercentage:
                - Always return null because historical risk data
                  was not supplied.

                currentRiskPercentage:
                - Must equal riskPercentage.

                dailyWaterTarget:
                - MUST be a NUMBER.
                - Do NOT include "liters".
                - Do NOT return a string.
                - Example: 2.5
                - For normal adult vitals with no contraindicating
                  information supplied, use 2.5.

                sleepRecommendation:
                - General recommendation of 7 to 9 hours.
                - Do not invent sleep problems.

                medications:
                - Return [] unless medication information was
                  explicitly supplied.

                dietRecommendations:
                - Give general healthy-diet recommendations.
                - Do not invent diseases.

                exerciseRecommendations:
                - Give general safe activity recommendations.
                - Do not prescribe exercise for an unknown condition.

                lifestyleRecommendations:
                - Give practical general lifestyle recommendations.

                treatmentGoals:
                - Give practical goals related to maintaining
                  healthy vital signs.

                monitoringPlan:
                - Specify which supplied vital signs should be monitored.

                followUp:
                - Give a general doctor-review recommendation.

                doctorNotes:
                - Concise notes for clinician review.
                - Do not invent patient history.

                IMPORTANT:
                nextReviewDate is NOT generated by Gemini.
                The Java backend will calculate it based on risk level.

                Patient data must never be fabricated.
                """.formatted(
                patientId,
                patientData
        );
    }

    // =====================================================
    // PARSE GEMINI RESPONSE
    // =====================================================

    private Map<String, Object> parseCarePlan(
            String generatedText) throws Exception {

        // -------------------------------------------------
        // CLEAN MARKDOWN
        // -------------------------------------------------

        String cleaned =
                generatedText
                        .replace("```json", "")
                        .replace("```JSON", "")
                        .replace("```", "")
                        .trim();

        // -------------------------------------------------
        // FIND JSON
        // -------------------------------------------------

        int firstBrace =
                cleaned.indexOf("{");

        int lastBrace =
                cleaned.lastIndexOf("}");

        if (firstBrace >= 0
                && lastBrace >= 0
                && lastBrace > firstBrace) {

            cleaned =
                    cleaned.substring(
                            firstBrace,
                            lastBrace + 1
                    );
        }

        // -------------------------------------------------
        // PARSE JSON
        // -------------------------------------------------

        JsonNode json;

        try {

            json =
                    objectMapper.readTree(
                            cleaned
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gemini did not return valid JSON. "
                            + "Response was: "
                            + generatedText,
                    e
            );
        }

        // -------------------------------------------------
        // RESULT
        // -------------------------------------------------

        Map<String, Object> result =
                new LinkedHashMap<>();

        // =================================================
        // BASIC INFORMATION
        // =================================================

        result.put(
                "diagnosis",
                getText(
                        json,
                        "diagnosis",
                        "Not available"
                )
        );

        result.put(
                "riskLevel",
                getText(
                        json,
                        "riskLevel",
                        "Not available"
                )
        );

        Double riskPercentage =
                getDoubleOrNull(
                        json,
                        "riskPercentage"
                );

        result.put(
                "riskPercentage",
                riskPercentage
        );

        result.put(
                "previousRiskPercentage",
                getDoubleOrNull(
                        json,
                        "previousRiskPercentage"
                )
        );

        Double currentRiskPercentage =
                getDoubleOrNull(
                        json,
                        "currentRiskPercentage"
                );

        if (currentRiskPercentage == null) {
            currentRiskPercentage =
                    riskPercentage;
        }

        result.put(
                "currentRiskPercentage",
                currentRiskPercentage
        );

        result.put(
                "healthScore",
                getIntegerOrNull(
                        json,
                        "healthScore"
                )
        );

        // =================================================
        // MEDICATIONS
        // =================================================

        result.put(
                "medications",
                toList(
                        json.path("medications")
                )
        );

        // =================================================
        // DIET
        // =================================================

        result.put(
                "dietRecommendations",
                toList(
                        json.path("dietRecommendations")
                )
        );

        // =================================================
        // EXERCISE
        // =================================================

        result.put(
                "exerciseRecommendations",
                toList(
                        json.path("exerciseRecommendations")
                )
        );

        // =================================================
        // LIFESTYLE
        // =================================================

        result.put(
                "lifestyleRecommendations",
                toList(
                        json.path("lifestyleRecommendations")
                )
        );

        // =================================================
        // WATER TARGET
        // =================================================

        Double dailyWaterTarget =
                getDoubleOrNull(
                        json,
                        "dailyWaterTarget"
                );

        if (dailyWaterTarget == null) {
            dailyWaterTarget = 2.5;
        }

        result.put(
                "dailyWaterTarget",
                dailyWaterTarget
        );

        // =================================================
        // SLEEP
        // =================================================

        result.put(
                "sleepRecommendation",
                getText(
                        json,
                        "sleepRecommendation",
                        "Aim for 7 to 9 hours of sleep per night."
                )
        );

        // =================================================
        // TREATMENT GOALS
        // =================================================

        result.put(
                "treatmentGoals",
                toList(
                        json.path("treatmentGoals")
                )
        );

        // =================================================
        // MONITORING
        // =================================================

        result.put(
                "monitoringPlan",
                toList(
                        json.path("monitoringPlan")
                )
        );

        // =================================================
        // FOLLOW UP
        // =================================================

        result.put(
                "followUp",
                getText(
                        json,
                        "followUp",
                        "Routine physician review as recommended."
                )
        );

        // =================================================
        // DOCTOR NOTES
        // =================================================

        result.put(
                "doctorNotes",
                getText(
                        json,
                        "doctorNotes",
                        "Draft care plan generated for clinician review."
                )
        );

        // =================================================
        // NEXT REVIEW
        //
        // Intentionally NOT generated by Gemini.
        // CarePlanServiceImpl calculates it.
        // =================================================

        result.put(
                "nextReviewDate",
                null
        );

        // =================================================
        // DEBUG
        // =================================================

        System.out.println();
        System.out.println("======================================");
        System.out.println("PARSED CARE PLAN");
        System.out.println("======================================");
        System.out.println(result);
        System.out.println("======================================");

        return result;
    }

    // =====================================================
    // GET TEXT
    // =====================================================

    private String getText(
            JsonNode json,
            String field,
            String defaultValue) {

        JsonNode node =
                json.path(field);

        if (node.isMissingNode()
                || node.isNull()) {

            return defaultValue;
        }

        String value =
                node.asText();

        if (value == null
                || value.isBlank()
                || value.equalsIgnoreCase("null")) {

            return defaultValue;
        }

        return value.trim();
    }

    // =====================================================
    // GET DOUBLE
    // =====================================================

    private Double getDoubleOrNull(
            JsonNode json,
            String field) {

        JsonNode node =
                json.path(field);

        if (node.isNumber()) {
            return node.asDouble();
        }

        if (node.isTextual()) {

            try {

                return Double.parseDouble(
                        node.asText().trim()
                );

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // =====================================================
    // GET INTEGER
    // =====================================================

    private Integer getIntegerOrNull(
            JsonNode json,
            String field) {

        JsonNode node =
                json.path(field);

        if (node.isNumber()) {
            return node.asInt();
        }

        if (node.isTextual()) {

            try {

                return Integer.parseInt(
                        node.asText().trim()
                );

            } catch (Exception ignored) {
            }
        }

        return null;
    }

    // =====================================================
    // JSON ARRAY -> LIST
    // =====================================================

    private List<String> toList(
            JsonNode node) {

        List<String> values =
                new ArrayList<>();

        if (node != null
                && node.isArray()) {

            for (JsonNode item : node) {

                if (!item.isNull()) {

                    String value =
                            item.asText();

                    if (value != null
                            && !value.isBlank()) {

                        values.add(
                                value.trim()
                        );
                    }
                }
            }
        }

        return values;
    }
}