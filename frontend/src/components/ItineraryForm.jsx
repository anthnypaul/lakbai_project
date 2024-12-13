"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Utensils, Coffee, Waves, TreePine, Music, Camera, Building2, ShoppingBag, MapPin, Calendar, Wallet } from 'lucide-react';

const budgetOptions = [
  { value: 1, label: '$', description: 'Budget' },
  { value: 2, label: '$$', description: 'Moderate' },
  { value: 3, label: '$$$', description: 'Luxury' },
  { value: 4, label: '$$$$', description: 'Ultra' }
];

const daysOptions = [...Array(7)].map((_, i) => ({
  value: i + 1,
  label: `${i + 1} ${i === 0 ? 'Day' : 'Days'}`
}));

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
    <Card className="border-2 border-[#66B2AB]/20 bg-white">
      <CardContent className="p-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-[#66B2AB]" />
            <h2 className="text-xl font-semibold text-gray-800">Destination</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Country</label>
              <Input
                type="text"
                placeholder="Where to?"
                value={searchState.country}
                onChange={(e) => setSearchState(prev => ({ ...prev, country: e.target.value }))}
                className="w-full transition-all duration-200 border-gray-200 focus:border-[#66B2AB] focus:ring-[#66B2AB]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">City</label>
              <Input
                type="text"
                placeholder="Which city?"
                value={searchState.city}
                onChange={(e) => setSearchState(prev => ({ ...prev, city: e.target.value }))}
                className="w-full transition-all duration-200 border-gray-200 focus:border-[#66B2AB] focus:ring-[#66B2AB]"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-[#66B2AB]" />
            <h2 className="text-xl font-semibold text-gray-800">Trip Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Duration</label>
              <Select
                value={searchState.days?.toString()}
                onValueChange={(value) => setSearchState(prev => ({...prev, days: parseInt(value)}))}
              >
                <SelectTrigger className="w-full border-gray-200 focus:border-[#66B2AB]">
                  <SelectValue placeholder="How long?" />
                </SelectTrigger>
                <SelectContent>
                  {daysOptions.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-[#66B2AB]" />
                <label className="text-sm font-medium text-gray-600">Budget Level</label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {budgetOptions.map((option) => {
                  const isSelected = searchState.budget === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      className={`flex flex-col items-center py-2 h-16 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-[#66B2AB] hover:bg-[#5BA39D] text-white' 
                          : 'border-gray-200 hover:border-[#66B2AB] hover:text-[#66B2AB]'
                      }`}
                      onClick={() => setSearchState(prev => ({ ...prev, budget: option.value }))}
                    >
                      <span className="text-lg font-semibold">{option.label}</span>
                      <span className="text-[10px] mt-1">{option.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-[#66B2AB]" />
              <h2 className="text-xl font-semibold text-gray-800">Activities</h2>
            </div>
            <span className="text-sm text-[#66B2AB] bg-[#66B2AB]/10 px-3 py-1 rounded-full">
              {searchState.preferred_activities.length}/8 selected
            </span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {activityOptions.map(({ icon: Icon, label, value }) => {
              const isSelected = searchState.preferred_activities.includes(value);
              return (
                <Button
                  key={value}
                  variant={isSelected ? "default" : "outline"}
                  className={`flex flex-col items-center p-2 h-auto aspect-square transition-all duration-200 ${
                    isSelected 
                      ? 'bg-[#66B2AB] hover:bg-[#5BA39D] text-white' 
                      : 'border-gray-200 hover:border-[#66B2AB] hover:text-[#66B2AB] bg-white'
                  }`}
                  onClick={() => toggleActivity(value)}
                >
                  <Icon className={`h-6 w-6 mb-1 ${isSelected ? 'text-white' : 'text-[#66B2AB]'}`} />
                  <span className="text-xs text-center line-clamp-1">{label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <Button 
          onClick={onSubmit}
          disabled={loading}
          className="w-full h-14 text-lg font-medium bg-[#66B2AB] hover:bg-[#5BA39D] transition-all duration-200
            shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Crafting your perfect trip...
            </>
          ) : 'Start Planning →'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ItineraryForm;