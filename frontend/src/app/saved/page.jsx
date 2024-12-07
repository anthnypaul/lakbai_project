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
import { PlusCircle, Loader2 } from 'lucide-react';

export default function SavedItineraries() {
    const router = useRouter();
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const timeSlotOrder = ['morning', 'afternoon', 'evening'];

    useEffect(() => {
        loadItineraries();
    }, []);

    const loadItineraries = async () => {
        try {
            const data = await fetchItineraries();
            setItineraries(data.reverse());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#4DB6AC]" />
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Itineraries</h1>
                <Button 
                    onClick={() => router.push('/generate')}
                    className="bg-[#4DB6AC] hover:bg-[#2979FF]"
                >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New
                </Button>
            </div>

            {itineraries.length === 0 ? (
                <Card className="p-6">
                    <div className="text-center space-y-4">
                        <p className="text-gray-500">No itineraries found.</p>
                        <Button 
                            onClick={() => router.push('/generate')}
                            className="bg-[#4DB6AC] hover:bg-[#2979FF]"
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
                            className="border rounded-lg px-6"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex flex-col items-start text-left">
                                    <div className="text-lg font-semibold">
                                        {itinerary.city}, {itinerary.country}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline">
                                            {itinerary.duration} Days
                                        </Badge>
                                        <Badge variant="outline">
                                            Budget: {"$".repeat(itinerary.budget)}
                                        </Badge>
                                        <Badge variant="outline" className="bg-[#4DB6AC] text-white">
                                            {itinerary.preferences.length} Activities
                                        </Badge>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {itinerary.preferences.map((pref, i) => (
                                            <Badge key={i} variant="secondary">
                                                {pref}
                                            </Badge>
                                        ))}
                                    </div>
                                    {itinerary.description.days.map((day, dayIndex) => (
                                        <div key={dayIndex} className="space-y-4">
                                            <h3 className="font-semibold text-lg border-b pb-2">
                                                Day {day.day}
                                            </h3>
                                            {timeSlotOrder.map((time) => (
                                                day.schedule[time] && (
                                                    <div key={time} className="space-y-2">
                                                        <h4 className="font-medium capitalize text-[#4DB6AC]">
                                                            {time}
                                                        </h4>
                                                        <div className="ml-4 space-y-1">
                                                            <p><span className="font-medium">Activity:</span> {day.schedule[time].activity}</p>
                                                            <p><span className="font-medium">Dining:</span> {day.schedule[time].dining}</p>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}