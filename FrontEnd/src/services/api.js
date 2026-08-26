import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8088",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
    (config) => {
        console.log(
            `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
        );

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
    (response) => {
        console.log(
            `[API RESPONSE] ${response.status} ${response.config.url}`
        );

        return response;
    },

    (error) => {

        if (error.response) {

            console.error(
                `API Error ${error.response.status}:`,
                error.response.data
            );

        } else if (error.request) {

            console.error(
                "API server is not reachable:",
                error.message
            );

        } else {

            console.error(
                "API request error:",
                error.message
            );
        }

        return Promise.reject(error);
    }
);

export default api;