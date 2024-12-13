import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Auth endpoints
export const loginUser = async (credentials) => {
    const formData = new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
    });

    try {
        const response = await api.post('/users/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Invalid credentials');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Registration failed';
        throw new Error(errorMessage);
    }
};

// Add auth header to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Convert budget format
const convertBudgetToNumber = (budget) => {
    return {
        '$': 1,
        '$$': 2,
        '$$$': 3,
        '$$$$': 4
    }[budget] || 2;
};

// Itinerary endpoints
export const generateItinerary = async (formData) => {
    try {
        const requestData = {
            city: formData.city.trim(),
            country: formData.country.trim(),
            days: parseInt(formData.days),
            budget: convertBudgetToNumber(formData.budget),
            preferred_activities: formData.preferred_activities
        };

        const response = await api.post('/itinerary/generate-itinerary/', requestData);
        
        if (!response.data.id) {
            console.warn('No itinerary ID in response:', response.data);
        }
        
        return {
            ...response.data,
            id: response.data.id 
        };
    } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Failed to generate itinerary';
        throw new Error(errorMessage);
    }
};

export const fetchItineraries = async () => {
    try {
        const response = await api.get('/itinerary/itineraries');
        if (!response.data || !Array.isArray(response.data)) {
            return [];
        }
        const itineraries = response.data.map(itinerary => ({
            ...itinerary,
            id: itinerary.id || itinerary.description?.id 
        }));
        return itineraries;
    } catch (error) {
        console.warn('Failed to fetch itineraries:', error);
        return [];
    }
};

export const deleteItinerary = async (id) => {
    if (!id) {
        throw new Error('Itinerary ID is required');
    }
    const numericId = !isNaN(id) ? Number(id) : id;
    
    try {
        const response = await api.delete(`/itinerary/itineraries/${numericId}`);
        if (response.status === 204 || response.status === 200) {
            return true;
        }
        throw new Error('Failed to delete itinerary');
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Itinerary not found');
        }
        const errorMessage = error.response?.data?.detail || 'Failed to delete itinerary';
        throw new Error(errorMessage);
    }
};