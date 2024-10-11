from django.contrib import admin
from .models import Itinerary, Activity, Budget

@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ['user', 'destination', 'start_date', 'duration', 'end_date']
    list_filter = ['start_date', 'user']

    def end_date(self, obj):
        return obj.end_date

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon']

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'description']
