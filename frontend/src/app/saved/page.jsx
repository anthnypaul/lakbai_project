"use client";

import { useEffect, useState } from 'react';
import { fetchItineraries } from '@/lib/api';
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2, MapPin, DollarSign, Calendar, List } from 'lucide-react';
import ItineraryDisplay from '../../components/ItineraryDisplay';

export default function SavedItineraries() {
    const router = useRouter();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadItineraries = async () => {
            try {
                const data = await fetchItineraries();
                setItineraries(data.reverse());
            } catch (err) {
                setError('Failed to load itineraries. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadItineraries();
    }, []);

    const getUniqueTotalCost = (itinerary) => {
        if (!itinerary?.description?.days) return 'N/A';

        const costs = new Set();
        itinerary.description.days.forEach(day => {
            if (!day?.schedule) return;
            Object.values(day.schedule).forEach(timeSlot => {
                if (timeSlot?.activity?.cost) costs.add(timeSlot.activity.cost);
                if (timeSlot?.dining?.price_range) costs.add(timeSlot.dining.price_range);
            });
        });

        return costs.size > 0 ? Array.from(costs).sort().join(' - ') : 'No cost info';
    };

    const getUniqueAreas = (itinerary) => {
        if (!itinerary?.description?.days) return [];

        const areas = new Set();
        itinerary.description.days.forEach(day => {
            if (!day?.schedule) return;
            Object.values(day.schedule).forEach(timeSlot => {
                if (timeSlot?.activity?.area) areas.add(timeSlot.activity.area);
                if (timeSlot?.dining?.area) areas.add(timeSlot.dining.area);
            });
        });

        return Array.from(areas);
    };

    const handleDelete = () => {
        loadItineraries(); 
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#66B2AB] mx-auto" />
                    <p className="text-gray-500">Loading your adventures...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-8">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-800">Your Adventures</h1>
                    <p className="text-gray-500">Explore your planned itineraries</p>
                </div>
                <Button 
                    onClick={() => router.push('/generate')}
                    className="bg-[#66B2AB] hover:bg-[#5BA39D] transition-all duration-200"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New
                </Button>
            </div>

            {itineraries.length === 0 ? (
                <Card className="p-8 border-2 border-[#66B2AB]/20">
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#66B2AB]/10 flex items-center justify-center">
                            <List className="h-8 w-8 text-[#66B2AB]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800">No Itineraries Yet</h3>
                            <p className="text-gray-500">Start planning your next adventure!</p>
                        </div>
                        <Button 
                            onClick={() => router.push('/generate')}
                            className="bg-[#66B2AB] hover:bg-[#5BA39D]"
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Your First Itinerary
                        </Button>
                    </div>
                </Card>
            ) : (
                <Accordion type="single" collapsible className="space-y-4">
                    {itineraries.map((itinerary, index) => (
                        <AccordionItem 
                            key={itinerary.id} 
                            value={`item-${index}`}
                            className="border-2 border-[#66B2AB]/20 rounded-lg px-6 hover:border-[#66B2AB]/40 transition-all duration-200"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex flex-col items-start text-left w-full">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {itinerary.city}, {itinerary.country}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="bg-[#66B2AB]/5 border-[#66B2AB]/20">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {itinerary?.description?.days?.length || 'N/A'} Days
                                        </Badge>
                                        <Badge variant="outline" className="bg-[#66B2AB]/5 border-[#66B2AB]/20">
                                            <DollarSign className="h-3 w-3 mr-1" />
                                            {getUniqueTotalCost(itinerary)}
                                        </Badge>
                                        <Badge variant="outline" className="bg-[#66B2AB]/5 border-[#66B2AB]/20">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {getUniqueAreas(itinerary).join(', ')}
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="py-4">
                                    <ItineraryDisplay itinerary={itinerary.description} onDelete={handleDelete} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}