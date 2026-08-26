import axios from "axios";

const API_URL = "http://localhost:8088/api/alerts";

export const getAllAlerts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getCriticalAlerts = async () => {
    const response = await axios.get(`${API_URL}/critical`);
    return response.data;
};

export const getAlertById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const acknowledgeAlert = async (id) => {
    const response = await axios.put(
        `${API_URL}/${id}/acknowledge`
    );
    return response.data;
};

export const resolveAlert = async (id) => {
    const response = await axios.put(
        `${API_URL}/${id}/resolve`
    );
    return response.data;
};

export const deleteAlert = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const getAlertStatistics = async () => {
    const response = await axios.get(
        `${API_URL}/statistics`
    );
    return response.data;
};