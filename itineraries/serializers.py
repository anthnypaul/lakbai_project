from rest_framework import serializers
from .models import Itinerary, Activity, Budget

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'name', 'icon', 'description']

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', 'icon']

class ItinerarySerializer(serializers.ModelSerializer):
    preferred_activities = ActivitySerializer(many=True)
    budget_levels = BudgetSerializer(many=True)
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = Itinerary
        fields = ['id', 'user', 'destination', 'start_date', 'duration', 'end_date', 'preferred_activities', 'budget_levels', 'created_at', 'updated_at']

    def get_end_date(self, obj):
        return obj.end_date
