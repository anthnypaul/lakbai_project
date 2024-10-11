from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

class Activity(models.Model):
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Budget(models.Model):
    name = models.CharField(max_length=20, unique=True)
    icon = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Itinerary(models.Model):
    DURATION_CHOICES = [
        (1, '1 day'),
        (3, '3 days'),
        (5, '5 days'),
        (7, '7 days'),
        (14, '14 days'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = models.CharField(max_length=255)
    start_date = models.DateField()  
    duration = models.IntegerField(choices=DURATION_CHOICES)  
    preferred_activities = models.ManyToManyField(Activity)
    budget_levels = models.ManyToManyField(Budget)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def end_date(self):
        """Calculate end date based on start date and duration."""
        return self.start_date + timedelta(days=self.duration - 1)

    def __str__(self):
        return f"{self.user.username}'s itinerary to {self.destination}"
