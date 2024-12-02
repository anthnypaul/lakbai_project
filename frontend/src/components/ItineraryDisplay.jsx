"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ItineraryDisplay = ({ itinerary }) => {
  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#333333]">
            Your Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {itinerary?.days.map((day) => (
            <div key={day.day} className="space-y-4">
              <h3 className="text-xl font-medium text-[#333333]">Day {day.day}</h3>
              
              <Card className="border border-[#E0E0E0]">
                <CardContent className="grid gap-4 p-6">
                  {/* Morning */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg text-[#4DB6AC]">Morning</h4>
                    <div className="ml-4 space-y-2">
                      <p className="text-[#333333]">
                        <span className="font-medium">Activity: </span>
                        {day.schedule.morning.activity}
                      </p>
                      <p className="text-[#666666]">
                        <span className="font-medium text-[#333333]">Dining: </span>
                        {day.schedule.morning.dining}
                      </p>
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg text-[#4DB6AC]">Afternoon</h4>
                    <div className="ml-4 space-y-2">
                      <p className="text-[#333333]">
                        <span className="font-medium">Activity: </span>
                        {day.schedule.afternoon.activity}
                      </p>
                      <p className="text-[#666666]">
                        <span className="font-medium text-[#333333]">Dining: </span>
                        {day.schedule.afternoon.dining}
                      </p>
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-lg text-[#4DB6AC]">Evening</h4>
                    <div className="ml-4 space-y-2">
                      <p className="text-[#333333]">
                        <span className="font-medium">Activity: </span>
                        {day.schedule.evening.activity}
                      </p>
                      <p className="text-[#666666]">
                        <span className="font-medium text-[#333333]">Dining: </span>
                        {day.schedule.evening.dining}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryDisplay;