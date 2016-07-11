from django.db import models
from datetime import datetime
from django.contrib.auth.models import User, Group
# Create your models here.

class Location(models.Model):
    name = models.CharField(max_length=200)
    google_map = models.CharField(max_length=500, blank=True)
    #TODO fotka mozno

    def __str__(self):
        return self.name

class Feedback(models.Model):
    student = models.ForeignKey('nextis.Student')
    feedback = models.TextField()
    time = models.DateTimeField(auto_now=True, null=True)

    def get_length(self):
        return len(self.feedback)

    class Meta:
        verbose_name_plural = "Feedbacks"

    def __str__(self):
        return str(self.student)

EVENT_TYPES = (('ik', 'IK'), ('dbk', 'DBK'),('for', 'Formalna udalost'), ('ine', 'Ine'))
# alebo preco to actual value nemoze byt hocico ine ? napr. samotne ik a dbk

class Event(models.Model):
    name = models.CharField(max_length=100)
    lectors = models.ManyToManyField('nextis.Lector', blank=True)
    point_reward = models.IntegerField()
    
    groups = models.ManyToManyField(Group)
    type = models.CharField(max_length=3,choices=EVENT_TYPES)
    description = models.TextField(blank=True)
    
    registered = models.ManyToManyField('nextis.Student', blank=True, related_name='registered')
    present = models.ManyToManyField('nextis.Student', blank=True, related_name='present')
    feedbacks = models.ManyToManyField(Feedback, blank=True)

    capacity = models.IntegerField(blank=True)

    start_time = models.DateTimeField(blank=True)
    end_time = models.DateTimeField(blank=True)
    location = models.ForeignKey(Location, blank=True)

    parent_event = models.ForeignKey('Event', blank=True)

    def __str__(self):
        return '['+self.type+'] '+ self.name + ' (' + str(self.lectors)+')'

    class Meta:
        verbose_name_plural = "Events"

    def get_lectors(self):
        lek = self.lectors.all()
        try:
            s = str(lek[0].user)
        except:
            s = 'No lectors'
        for i in range(1,len(lek)):
            s += ','+ str(lek[i].user)
        return s

    def get_registered_count(self):
        return len(self.registered.all())

    def get_starttime(self):
        return self.start_time

    def get_endtime(self):
        return self.end_time

    def has_ended(self):
        return self.get_endtime() < datetime.now()