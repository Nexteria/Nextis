from django.contrib import admin
from django import forms
from nextis.models import *
# Register your models here.

# TODO super user zajozor, testtest


class ClovekAdmin(admin.ModelAdmin):
    list_display = ['get_name','email','telefon_cislo']
    search_fields = ['meno','priezvisko','email','telefon_cislo']

admin.site.register(Clovek, ClovekAdmin)

#admin.site.register(Rola)


class StudentAdmin(admin.ModelAdmin):
    list_display = ['clovek','get_email','get_telefon','skolne','level','fakulta']
    list_filter = ['level','fakulta']

admin.site.register(Student, StudentAdmin)

class LektorAdmin(admin.ModelAdmin):
    list_display = ['clovek','get_email','get_telefon']

admin.site.register(Lektor,LektorAdmin)

class GuideVztahAdmin(admin.ModelAdmin):
    list_display = ['mentor','student','zaciatok','get_koniec']

admin.site.register(GuideVztah, GuideVztahAdmin)

class BuddyVztahAdmin(admin.ModelAdmin):
    list_display = ['mentor','student','zaciatok','get_koniec']
admin.site.register(BuddyVztah,BuddyVztahAdmin)


admin.site.register(Skolne)

class LevelAdmin(admin.ModelAdmin):
    pass

admin.site.register(Level, LevelAdmin)


class EventAdmin(admin.ModelAdmin):
    list_display = ['nazov','get_lektori','pocet_kreditov','zaciatok','koniec','get_levely','miesto','typ']
    list_filter = ['zaciatok','typ','levely']

admin.site.register(Event, EventAdmin)


class NovinkaAdmin(admin.ModelAdmin):

    list_display = ['nazov','autor','vytvorene','upravene']
    list_filter = ['vytvorene']
    pass

admin.site.register(Novinka, NovinkaAdmin)

admin.site.register(Skola)
admin.site.register(Fakulta)

class PlatbaAdmin(admin.ModelAdmin):
    list_display = ['get_meno','suma','cas','vlastnik']
    list_filter = ['cas']

admin.site.register(Platba,PlatbaAdmin)

class VydavokAdmin(admin.ModelAdmin):
    list_display = ['get_meno','suma','ucel','splatnost','uhradene','vlastnik']
    list_filter = ['splatnost']
admin.site.register(Vydavok, VydavokAdmin)


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['student','cas','get_dlzka']
    list_filter = ['cas']

admin.site.register(Feedback,FeedbackAdmin)

class ParsedEmailAdmin(admin.ModelAdmin):
    list_display = ['nazov','datum', 'priradene']
    list_filter = ['datum']

admin.site.register(ParsedEmail, ParsedEmailAdmin)


class SkolneForm(forms.Form):
    ucel = forms.CharField()
    level = forms.ModelChoiceField(queryset=Level.objects.all(), empty_label=None)
    suma = forms.FloatField()
    splatnost = forms.DateField()

from django.shortcuts import render, HttpResponseRedirect
from django.core.urlresolvers import reverse
def level_skolne_view(req, *args, **kwargs):
    if req.method == "POST":
        form = SkolneForm(req.POST)
        if form.is_valid():
            level = form.cleaned_data['level']

            stud = Student.objects.filter(level=level)
            for s in stud:

                skolne = s.skolne
                vydavok = Vydavok.objects.create(ucel = form.cleaned_data['ucel'], suma= form.cleaned_data['suma'], splatnost = form.cleaned_data['splatnost'], uhradene = 0, vlastnik=skolne)
                vydavok.save()

            return HttpResponseRedirect(reverse('admin:index'))


    form = SkolneForm()
    return render(req, 'admin_skolne.html', context={'form':form})
admin.site.register_view('level_skolne', 'Pridat levelu skolne', view=level_skolne_view)