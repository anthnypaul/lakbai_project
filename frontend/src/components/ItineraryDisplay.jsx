import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ItineraryDisplay = ({ itinerary }) => {
  if (!itinerary) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {itinerary.days?.map((day, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <h3 className="font-semibold mb-4">Day {index + 1}</h3>
              <div className="space-y-3">
                {Object.entries(day).map(([time, activity]) => (
                  <div key={time} className="flex">
                    <span className="font-medium text-primary w-24">{time}:</span>
                    <span>{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryDisplay;