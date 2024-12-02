import axios from 'axios';

const API_URL = 'http://192.168.5.93:5000';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const register = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const encryptData = async (data, token) => {
    try {
        const response = await axios.post(`${API_URL}/send`,
            { data },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const retrieveData = async (recordId, token) => {
    try {
        const response = await axios.post(`${API_URL}/retrieve`,
            { record_id: recordId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const messagesData = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/messages`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};