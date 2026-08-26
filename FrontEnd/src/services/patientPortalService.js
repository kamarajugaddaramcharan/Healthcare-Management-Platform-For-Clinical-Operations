import { getAllPatients } from "./patientService";

import {
    getUserId,
    getUsername,
    getUserName,
} from "../keycloak";

export const getCurrentPatient = async () => {

    const patients = await getAllPatients();

    // =====================================================
    // CHECK PATIENT DATA
    // =====================================================

    if (
        !Array.isArray(patients) ||
        patients.length === 0
    ) {
        throw new Error("No patients found");
    }

    // =====================================================
    // GET CURRENT KEYCLOAK USER
    // =====================================================

    const keycloakId =
        String(getUserId() || "")
            .trim()
            .toLowerCase();

    const username =
        String(getUsername() || "")
            .trim()
            .toLowerCase();

    const name =
        String(getUserName() || "")
            .trim()
            .toLowerCase();

    // =====================================================
    // DEBUG INFORMATION
    // =====================================================

    console.log(
        "========== PATIENT DEBUG =========="
    );

    console.log(
        "Keycloak ID:",
        getUserId()
    );

    console.log(
        "Keycloak Username:",
        getUsername()
    );

    console.log(
        "Keycloak Name:",
        getUserName()
    );

    console.log(
        "First patient:",
        JSON.stringify(
            patients[0],
            null,
            2
        )
    );

    console.log(
        "Second patient:",
        JSON.stringify(
            patients[1],
            null,
            2
        )
    );

    console.log(
        "Patient object fields:",
        Object.keys(
            patients[0] || {}
        )
    );

    console.log(
        "Total patients:",
        patients.length
    );

    console.log(
        "==================================="
    );

    // =====================================================
    // FIND CURRENT PATIENT
    // =====================================================

    const patient = patients.find(
        (p) => {

            // ---------------------------------------------
            // KEYCLOAK ID
            // ---------------------------------------------

            const patientKeycloakId =
                String(
                    p.keycloakId ||
                    p.keycloakUserId ||
                    p.userId ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            // ---------------------------------------------
            // USERNAME / EMAIL
            // ---------------------------------------------

            const patientUsername =
                String(
                    p.username ||
                    p.email ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            // ---------------------------------------------
            // PATIENT NAME
            // ---------------------------------------------

            const patientName =
                String(
                    p.name ||
                    p.fullName ||
                    ""
                )
                    .trim()
                    .toLowerCase();

            // ---------------------------------------------
            // DEBUG MATCHING
            // ---------------------------------------------

            const keycloakMatch =
                Boolean(
                    keycloakId &&
                    patientKeycloakId &&
                    patientKeycloakId ===
                    keycloakId
                );

            const usernameMatch =
                Boolean(
                    username &&
                    patientUsername &&
                    patientUsername ===
                    username
                );

            const nameMatch =
                Boolean(
                    name &&
                    patientName &&
                    patientName ===
                    name
                );

            // Uncomment if we need to inspect
            // every patient's matching values.
            /*
            console.log({
                patientId:
                    p.patientId || p.id,
                patientKeycloakId,
                patientUsername,
                patientName,
                keycloakMatch,
                usernameMatch,
                nameMatch
            });
            */

            return (
                keycloakMatch ||
                usernameMatch ||
                nameMatch
            );
        }
    );

    // =====================================================
    // PATIENT NOT FOUND
    // =====================================================

    if (!patient) {

        console.error(
            "❌ No patient matched the Keycloak account."
        );

        console.error(
            "Keycloak identity:",
            {
                keycloakId,
                username,
                name,
            }
        );

        console.error(
            "Available patients:",
            patients
        );

        throw new Error(
            "No patient record is linked to this Keycloak account."
        );
    }

    // =====================================================
    // PATIENT FOUND
    // =====================================================

    console.log(
        "✅ CURRENT PATIENT FOUND:",
        patient
    );

    console.log(
        "Patient ID:",
        patient.patientId ||
        patient.id
    );

    console.log(
        "Patient Name:",
        patient.name ||
        patient.fullName
    );

    return patient;
};