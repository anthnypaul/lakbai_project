"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateItinerary } from '@/lib/api';
import ItineraryForm from '@/components/ItineraryForm';
import { LoadingBoat } from '@/components/LoadingBoat';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane, MapPin, Calendar } from 'lucide-react';

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
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-[#66B2AB]/5">
                <LoadingBoat />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-[#66B2AB]/5">
            <div className="container mx-auto p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center gap-4 mb-4">
                            <Plane className="h-8 w-8 text-[#66B2AB]" />
                            <MapPin className="h-8 w-8 text-[#66B2AB]" />
                            <Calendar className="h-8 w-8 text-[#66B2AB]" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Plan Your Adventure
                        </h1>
                        <p className="text-gray-600">
                            Let's create your personalized travel itinerary
                        </p>
                    </div>

                    {/* Main Card */}
                    <Card className="border-2 border-[#66B2AB]/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-gray-800">
                                Itinerary Details
                            </CardTitle>
                            <CardDescription>
                                Fill in your preferences and we'll craft the perfect plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert 
                                    variant="destructive" 
                                    className="mb-6 border-red-200 bg-red-50"
                                >
                                    <AlertDescription className="text-red-800">
                                        {error}
                                    </AlertDescription>
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

                    {/* Footer Note */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        Your itinerary will be automatically saved to your account
                    </p>
                </div>
            </div>
        </div>
    );
}