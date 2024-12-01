"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Utensils, Coffee, Waves, TreePine, Music, Camera, Building2, ShoppingBag } from 'lucide-react';

const budgetOptions = [
  { value: '$', label: 'Budget' },
  { value: '$$', label: 'Moderate' },
  { value: '$$$', label: 'High-End' },
  { value: '$$$$', label: 'Luxury' }
];

const daysOptions = Array.from({ length: 7 }, (_, i) => i + 1);

const activityOptions = [
  { icon: Utensils, label: 'Dining', value: 'dining' },
  { icon: Coffee, label: 'Cafes', value: 'cafes' },
  { icon: Waves, label: 'Beach', value: 'beach' },
  { icon: TreePine, label: 'Outdoors', value: 'outdoors' },
  { icon: Music, label: 'Nightlife', value: 'nightlife' },
  { icon: Camera, label: 'Sightseeing', value: 'sightseeing' },
  { icon: Building2, label: 'Culture', value: 'culture' },
  { icon: ShoppingBag, label: 'Shopping', value: 'shopping' }
];

const ItineraryForm = ({ searchState, setSearchState, loading, onSubmit }) => {
  const toggleActivity = (value) => {
    setSearchState(prev => ({
      ...prev,
      preferred_activities: prev.preferred_activities.includes(value)
        ? prev.preferred_activities.filter(a => a !== value)
        : prev.preferred_activities.length < 8
          ? [...prev.preferred_activities, value]
          : prev.preferred_activities
    }));
  };

  return (
    <div className="space-y-8">
      {/* Location Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-[#333333]">Where do you want to go?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#333333]">City</label>
            <Input
              placeholder="Enter city"
              value={searchState.city}
              onChange={(e) => setSearchState(prev => ({...prev, city: e.target.value}))}
              className="border-[#E0E0E0] focus:border-[#4DB6AC]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#333333]">Country</label>
            <Input
              placeholder="Enter country"
              value={searchState.country}
              onChange={(e) => setSearchState(prev => ({...prev, country: e.target.value}))}
              className="border-[#E0E0E0] focus:border-[#4DB6AC]"
            />
          </div>
        </div>
      </div>

      {/* Trip Details Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-[#333333]">Trip Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#333333]">Duration</label>
            <Select
              value={searchState.days.toString()}
              onValueChange={(value) => setSearchState(prev => ({...prev, days: parseInt(value)}))}
            >
              <SelectTrigger className="w-full border-[#E0E0E0] focus:border-[#4DB6AC]">
                <SelectValue placeholder="Select number of days" />
              </SelectTrigger>
              <SelectContent>
                {daysOptions.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day} {day === 1 ? 'day' : 'days'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#333333]">Budget Range</label>
            <div className="grid grid-cols-4 gap-2">
              {budgetOptions.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={searchState.budget === value ? "default" : "outline"}
                  className={`w-full h-full min-h-[2.5rem] ${
                    searchState.budget === value 
                      ? 'bg-[#4DB6AC] hover:bg-[#2979FF]' 
                      : 'border-[#E0E0E0] hover:border-[#4DB6AC] hover:text-[#4DB6AC]'
                  }`}
                  onClick={() => setSearchState(prev => ({...prev, budget: value}))}
                >
                  <span className="font-mono text-base">{value}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#333333]">Preferred Activities</h2>
          <span className="text-sm text-[#666666]">Select up to 8</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {activityOptions.map(({ icon: Icon, label, value }) => {
            const isSelected = searchState.preferred_activities.includes(value);
            return (
              <Button
                key={value}
                variant={isSelected ? "default" : "outline"}
                className={`flex flex-col items-center p-3 h-auto aspect-square ${
                  isSelected 
                    ? 'bg-[#4DB6AC] hover:bg-[#2979FF]' 
                    : 'border-[#E0E0E0] hover:border-[#4DB6AC] hover:text-[#4DB6AC]'
                }`}
                onClick={() => toggleActivity(value)}
              >
                <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-white' : ''}`} />
                <span className="text-xs text-center line-clamp-1">{label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        onClick={onSubmit}
        disabled={loading}
        className="w-full h-12 text-base font-medium bg-[#4DB6AC] hover:bg-[#2979FF]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Planning your trip...
          </>
        ) : 'Plan My Trip'}
      </Button>
    </div>
  );
};

export default ItineraryForm;