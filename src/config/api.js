// Centralny plik konfiguracji API
// export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_URL = process.env.REACT_APP_API_URL || 'https://backend-production-3aa9.up.railway.app/api';

console.log(' API_URL załadowany:', API_URL);

// Funkcja pomocnicza do fetch z automatycznym dodawaniem credentials
export const fetchAPI = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
        ...options,
    };

    console.log(' API Request do:', url);

    try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        
        console.log(' API Response:', response.status, data);
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }
        
        return { response, data };
    } catch (error) {
        console.error(' API Error:', error);
        throw error;
    }
};