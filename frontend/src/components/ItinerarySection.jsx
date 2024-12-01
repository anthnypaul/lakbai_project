"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ItineraryForm from './ItineraryForm';
import ItineraryDisplay from './ItineraryDisplay';

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

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/generateItinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchState),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary');
      }

      const data = await response.json();
      setItinerary(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while planning your trip');
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