"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateItinerary } from '@/lib/api';
import ItineraryForm from '@/components/ItineraryForm';
import { LoadingBoat } from '@/components/LoadingBoat';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export default function GenerateItinerary() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchState, setSearchState] = useState({
        city: '',
        country: '',
        days: 1,
        budget: '$',
        preferred_activities: []
    });

    const handleSubmit = async () => {
        if (!searchState.city || !searchState.country || searchState.preferred_activities.length === 0) {
            setError('Please fill in all required fields and select at least one activity');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await generateItinerary({
                city: searchState.city,
                country: searchState.country,
                days: searchState.days,
                budget: searchState.budget,
                preferred_activities: searchState.preferred_activities
            });
            router.push('/saved');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingBoat />;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Create New Itinerary</h1>
            <Card>
                <CardContent className="pt-6">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <ItineraryForm 
                        searchState={searchState}
                        setSearchState={setSearchState}
                        loading={loading}
                        onSubmit={handleSubmit}
                    />
                </CardContent>
            </Card>
        </div>
    );
}