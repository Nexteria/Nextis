from django.contrib import admin
from .models import *
from dal import autocomplete
from django import forms



class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['student','time','get_length']
    list_filter = ['time']

admin.site.register(Feedback, FeedbackAdmin)
admin.site.register(Location)
'''
class UcastniciInline(admin.TabularInline):
    model = Event.ucastnici.through
    extra = 0
    '''


class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ('__all__')
        widgets = {
            'lectors': autocomplete.ModelSelect2Multiple(url='lector-autocomplete'),
            'registered': autocomplete.ModelSelect2Multiple(url='student-autocomplete'),
        }

class EventAdmin(admin.ModelAdmin):
    list_display = ['name','get_lectors','point_reward', 'type']
    list_filter = ['start_time','type','groups']
    form = EventForm

    #inlines = [UcastniciInline]


'''

class ProjectsInLine(admin.TabularInline):
    model = models.Project
    extra = 0


@admin.register(models.Profile)
class ProfileAdmin(admin.ModelAdmin):

    list_display = ("username", "interaction", "_projects")

    search_fields = ["user__username"]

    inlines = [
        ProjectsInLine
    ]

    def _projects(self, obj):
        return obj.projects.all().count()
'''
admin.site.register(Event, EventAdmin)