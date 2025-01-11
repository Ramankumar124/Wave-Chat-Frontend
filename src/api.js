import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/', // Fallback to localhost for development
    withCredentials: true, // Ensures cookies are sent
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
