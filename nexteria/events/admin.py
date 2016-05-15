from django.contrib import admin
from .models import *
from dal import autocomplete
from django import forms
# Register your models here.
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['student','cas','get_dlzka']
    list_filter = ['cas']

admin.site.register(Feedback,FeedbackAdmin)


class UcastniciInline(admin.TabularInline):
    model = Event.ucastnici.through
    extra = 0

admin.site.register(Miesto)
admin.site.register(Stretnutie)

class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ('__all__')
        widgets = {
            'lektori': autocomplete.ModelSelect2Multiple(url='lektor-autocomplete'),
            'ucastnici': autocomplete.ModelSelect2Multiple(url='student-autocomplete'),
        }

class EventAdmin(admin.ModelAdmin):
    list_display = ['nazov','get_lektori','pocet_kreditov','get_stretnutia','get_levely','typ']
    list_filter = ['stretnutia__zaciatok','typ','levely']
    form = EventForm

    inlines = [UcastniciInline]


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