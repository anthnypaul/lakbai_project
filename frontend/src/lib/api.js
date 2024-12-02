// lib/api.js
import axios from 'axios';

// Convert frontend budget format to backend format
const convertBudgetToNumber = (budget) => {
    return {
        '$': 1,
        '$$': 2,
        '$$$': 3,
        '$$$$': 4
    }[budget] || 2; // Default to moderate if invalid
};

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const generateItinerary = async (formData) => {
    const requestData = {
        city: formData.city.trim(),
        country: formData.country.trim(),
        days: parseInt(formData.days),
        budget: convertBudgetToNumber(formData.budget),
        preferred_activities: formData.preferred_activities
    };

    try {
        const response = await api.post('/generate-itinerary/', requestData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.detail || 'Failed to generate itinerary';
        throw new Error(errorMessage);
    }
};