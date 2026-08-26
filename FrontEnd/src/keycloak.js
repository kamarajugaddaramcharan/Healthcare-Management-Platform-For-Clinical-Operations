import Keycloak from "keycloak-js";


// =====================================================
// KEYCLOAK CONFIGURATION
// =====================================================

const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "MediSphere",
    clientId: "medisphere-frontend",
});


// =====================================================
// INITIALIZE
// =====================================================

export const initKeycloak = async () => {

    try {

        const authenticated =
            await keycloak.init({
                onLoad: "login-required",
                checkLoginIframe: false,
                pkceMethod: "S256",
            });


        console.log(
            "===================================="
        );

        console.log(
            "KEYCLOAK AUTHENTICATION"
        );

        console.log(
            "Authenticated:",
            authenticated
        );


        if (authenticated) {

            console.log(
                "Username:",
                keycloak.tokenParsed?.preferred_username
            );

            console.log(
                "Keycloak Name:",
                keycloak.tokenParsed?.name
            );

            console.log(
                "User ID:",
                keycloak.tokenParsed?.sub
            );

            console.log(
                "Roles:",
                keycloak.realmAccess?.roles
            );

            console.log(
                "Portal Doctor:",
                getDoctorName()
            );

            console.log(
                "Portal Doctor ID:",
                getDoctorId()
            );
        }


        console.log(
            "===================================="
        );


        return authenticated;

    } catch (error) {

        console.error(
            "Keycloak initialization failed:",
            error
        );

        throw error;
    }
};


// =====================================================
// ROLES
// =====================================================

export const getUserRoles = () => {

    return (
        keycloak.realmAccess?.roles || []
    ).map((role) =>
        String(role).toLowerCase()
    );

};


// =====================================================
// ADMIN
// =====================================================

export const isAdmin = () => {

    return getUserRoles().includes(
        "admin"
    );

};


// =====================================================
// DOCTOR
// =====================================================

export const isDoctor = () => {

    return getUserRoles().includes(
        "doctor"
    );

};


// =====================================================
// PATIENT
// =====================================================

export const isPatient = () => {

    return getUserRoles().includes(
        "patient"
    );

};


// =====================================================
// CURRENT ROLE
// =====================================================

export const getCurrentRole = () => {

    const roles =
        getUserRoles();


    if (
        roles.includes("admin")
    ) {

        return "admin";

    }


    if (
        roles.includes("doctor")
    ) {

        return "doctor";

    }


    if (
        roles.includes("patient")
    ) {

        return "patient";

    }


    return null;
};


// =====================================================
// USERNAME
// =====================================================

export const getUsername = () => {

    return (
        keycloak.tokenParsed
            ?.preferred_username || ""
    );

};


// =====================================================
// USER NAME
// =====================================================

export const getUserName = () => {

    if (isDoctor()) {

        return "Dr. Sarah Wilson";

    }


    if (isAdmin()) {

        return "Administrator";

    }


    if (isPatient()) {

        return "Patient";

    }


    return (
        keycloak.tokenParsed?.name ||
        keycloak.tokenParsed?.preferred_username ||
        "User"
    );
};


// =====================================================
// FIRST NAME
// =====================================================

export const getFirstName = () => {

    if (isDoctor()) {

        return "Sarah";

    }


    return (
        keycloak.tokenParsed?.given_name ||
        ""
    );

};


// =====================================================
// LAST NAME
// =====================================================

export const getLastName = () => {

    if (isDoctor()) {

        return "Wilson";

    }


    return (
        keycloak.tokenParsed?.family_name ||
        ""
    );

};


// =====================================================
// EMAIL
// =====================================================

export const getEmail = () => {

    return (
        keycloak.tokenParsed?.email ||
        ""
    );

};


// =====================================================
// USER ID
// =====================================================

export const getUserId = () => {

    return (
        keycloak.tokenParsed?.sub ||
        ""
    );

};


// =====================================================
// TOKEN
// =====================================================

export const getToken = () => {

    return (
        keycloak.token ||
        ""
    );

};


// =====================================================
// PARSED TOKEN
// =====================================================

export const getTokenParsed = () => {

    return (
        keycloak.tokenParsed ||
        null
    );

};


// =====================================================
// AUTHENTICATION
// =====================================================

export const isAuthenticated = () => {

    return Boolean(
        keycloak.authenticated
    );

};


// =====================================================
// DOCTOR ID
// =====================================================
//
// Current Doctor Portal:
//
// Dr. Sarah Wilson = D001
//
// =====================================================

export const getDoctorId = () => {

    if (isDoctor()) {

        return "D001";

    }

    return null;
};


// =====================================================
// DOCTOR NAME
// =====================================================
//
// Current Doctor Portal:
//
// D001 = Dr. Sarah Wilson
//
// =====================================================

export const getDoctorName = () => {

    if (isDoctor()) {

        return "Dr. Sarah Wilson";

    }

    return "";
};


// =====================================================
// DOCTOR OBJECT
// =====================================================

export const getDoctor = () => {

    if (!isDoctor()) {

        return null;

    }


    return {

        doctorId:
            "D001",

        doctorName:
            "Dr. Sarah Wilson",

        username:
            getUsername(),

        email:
            getEmail(),

        userId:
            getUserId(),

        role:
            "doctor",

    };

};


// =====================================================
// KEYCLOAK INSTANCE
// =====================================================

export const getKeycloak = () => {

    return keycloak;

};


// =====================================================
// LOGOUT
// =====================================================

export const logout = () => {

    keycloak.logout({

        redirectUri:
        window.location.origin,

    });

};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default keycloak;