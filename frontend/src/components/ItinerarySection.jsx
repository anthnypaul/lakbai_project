"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ItineraryForm from './ItineraryForm';
import ItineraryDisplay from './ItineraryDisplay';
import { generateItinerary } from '@/lib/api';

const ItinerarySection = () => {
    const [searchState, setSearchState] = useState({
        city: '',
        country: '',
        days: 3, 
        budget: '$$',
        preferred_activities: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [itinerary, setItinerary] = useState(null);

    const validateForm = () => {
        if (!searchState.city.trim()) {
            throw new Error('Please enter a city');
        }
        if (!searchState.country.trim()) {
            throw new Error('Please enter a country');
        }
        if (!searchState.days || searchState.days < 1) {
            throw new Error('Please select number of days');
        }
        if (!searchState.budget) {
            throw new Error('Please select a budget range');
        }
        if (searchState.preferred_activities.length === 0) {
            throw new Error('Please select at least one activity');
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setError('');
            setItinerary(null);

            // Validate form
            validateForm();

            // Generate itinerary
            const result = await generateItinerary(searchState);
            setItinerary(result);
        } catch (err) {
            // Using optional chaining for safer error handling
            const errorMessage = err?.message || 'An error occurred while planning your trip';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto bg-white shadow-md">
            <CardHeader className="border-b border-[#E0E0E0]">
                <CardTitle className="text-[#333333] text-2xl font-semibold">
                    Plan Your Perfect Trip
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <ItineraryForm
                    searchState={searchState}
                    setSearchState={setSearchState}
                    loading={loading}
                    onSubmit={handleSearch}
                />
                {error && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                )}
                {itinerary && <ItineraryDisplay itinerary={itinerary} />}
            </CardContent>
        </Card>
    );
};

export default ItinerarySection;