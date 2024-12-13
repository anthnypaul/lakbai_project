"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, MapPin, DollarSign, Utensils, Trash2, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteItinerary } from '@/lib/api';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const TimeBlock = ({ time, schedule }) => {
    if (!schedule) return null;

    const { activity, dining } = schedule;
    
    const timeIcons = {
        morning: <Sun className="h-4 w-4 text-[#66B2AB]" />,
        afternoon: <Sun className="h-4 w-4 text-[#66B2AB]" />,
        evening: <Moon className="h-4 w-4 text-[#66B2AB]" />
    };

    return (
        <div className="space-y-4 p-4 border border-[#66B2AB]/20 rounded-lg bg-[#66B2AB]/5">
            <div className="flex items-center gap-2">
                {timeIcons[time]}
                <h4 className="font-medium capitalize text-gray-800">{time}</h4>
            </div>

            {activity && (
                <div className="bg-white p-4 rounded-md border border-[#66B2AB]/10">
                    <h5 className="font-medium text-gray-900 mb-3">Activity</h5>
                    <div className="space-y-3">
                        <p className="font-medium text-gray-800">{activity.name}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-[#66B2AB]" />
                            {activity.area}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4 text-[#66B2AB]" />
                            {activity.cost}
                        </div>
                        {activity.notes && (
                            <p className="text-gray-600 bg-[#66B2AB]/5 p-2 rounded-md">
                                {activity.notes}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {dining && (
                <div className="bg-white p-4 rounded-md border border-[#66B2AB]/10">
                    <h5 className="font-medium text-gray-900 mb-3">Dining</h5>
                    <div className="space-y-3">
                        <p className="font-medium text-gray-800">{dining.name}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-[#66B2AB]" />
                            {dining.area}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4 text-[#66B2AB]" />
                            {dining.price_range}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Utensils className="h-4 w-4 text-[#66B2AB]" />
                            {dining.cuisine}
                        </div>
                        {dining.notes && (
                            <p className="text-gray-600 bg-[#66B2AB]/5 p-2 rounded-md">
                                {dining.notes}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ItineraryDisplay = ({ itinerary, onDelete }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        console.log('Itinerary data received:', itinerary);
    }, [itinerary]);

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            
            if (!itinerary) {
                throw new Error('No itinerary data available');
            }
            
            // Check for ID in all possible locations
            const itineraryId = itinerary.id || 
                              (itinerary.description && itinerary.description.id);
            
            if (!itineraryId) {
                console.error('Missing itinerary ID. Itinerary data:', itinerary);
                throw new Error('Unable to delete - missing itinerary ID');
            }
            
            await deleteItinerary(itineraryId);
            setIsDeleteDialogOpen(false);
            onDelete?.();
            toast.success('Itinerary deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (!itinerary || !Array.isArray(itinerary.days) || itinerary.days.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-[#66B2AB]/5 rounded-lg border border-[#66B2AB]/20">
                <p>Itinerary details are unavailable.</p>
            </div>
        );
    }

    const timeSlots = ['morning', 'afternoon', 'evening'];

    return (
        <div className="space-y-8">
            {itinerary.days.map((day, index) => (
                <Card key={index} className="border-2 border-[#66B2AB]/20">
                    <CardHeader className="border-b bg-[#66B2AB]/5">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-gray-800">Day {day.day || index + 1}</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="hover:bg-red-50 hover:text-red-500"
                            >
                                <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {timeSlots.map(time =>
                            day.schedule && day.schedule[time] ? (
                                <TimeBlock
                                    key={time}
                                    time={time}
                                    schedule={day.schedule[time]}
                                />
                            ) : null
                        )}
                    </CardContent>
                </Card>
            ))}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your itinerary.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ItineraryDisplay;