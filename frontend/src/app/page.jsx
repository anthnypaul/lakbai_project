"use client";

import { useEffect, useState } from "react";
import { fetchItineraries } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PlusCircle, Map } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [recentItineraries, setRecentItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentItineraries = async () => {
      try {
        const data = await fetchItineraries();
        // Get only the 3 most recent itineraries
        setRecentItineraries(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch recent itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentItineraries();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Welcome Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-6 w-6" />
              Welcome to LakbAI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Plan your perfect trip with AI-powered itinerary suggestions. Get started by generating a new itinerary or view your saved ones.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => router.push('/generate')}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Create New Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Itineraries Card */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Itineraries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading recent itineraries...</p>
            ) : recentItineraries.length > 0 ? (
              <div className="space-y-4">
                {recentItineraries.map((itinerary) => (
                  <div 
                    key={itinerary.id} 
                    className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => router.push('/saved')}
                  >
                    <div className="font-medium">{itinerary.city}, {itinerary.country}</div>
                    <div className="text-sm text-muted-foreground">
                      {itinerary.duration} days • Budget: {"$".repeat(itinerary.budget)}
                    </div>
                  </div>
                ))}
                {recentItineraries.length === 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/saved')}
                  >
                    View All Itineraries
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No itineraries yet. Create your first one!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}