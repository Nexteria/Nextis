from dal import autocomplete
from django import forms
from django.contrib import admin
from django.shortcuts import HttpResponse

# Register your models here.

# TODO super user zajozor, rootroot

from django.contrib.auth.models import User,Group

admin.site.register(User)
admin.site.register(Group)


class ClovekAdmin(admin.ModelAdmin):
    list_display = ['get_name','email','telefon_cislo']
    search_fields = ['meno','priezvisko','email','telefon_cislo']

admin.site.register(Clovek, ClovekAdmin)

#admin.site.register(Rola)

def export_student_list(modeladmin, request, queryset):
    import csv
    from django.utils.encoding import smart_str
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=nexteria_zoznam_studentov.csv'
    writer = csv.writer(response, csv.excel)
    response.write(u'\ufeff'.encode('utf8')) # BOM (optional...Excel needs it to open UTF-8 file properly)
    writer.writerow([
        smart_str(u"Meno"),
        smart_str(u"Priezvisko"),
        smart_str(u"Email"),
        smart_str(u"Telefon"),
        smart_str(u"Datum nar."),
        smart_str(u"Fakulta"),
        smart_str(u"Rok zaciatku"),
        smart_str(u"Level"),
        smart_str(u"Skolne"),
    ])

    for obj in queryset:
        writer.writerow([
            smart_str(obj.clovek.meno),
            smart_str(obj.clovek.priezvisko),
            smart_str(obj.clovek.email),
            smart_str(obj.clovek.telefon_cislo),
            smart_str(obj.datum_nar),
            smart_str(obj.fakulta),
            smart_str(obj.rok_zaciatku),
            smart_str(obj.level),
            smart_str(obj.skolne),
        ])
    return response
export_student_list.short_description = 'Exportuj vybratych studentov do zoznamu'

class StudentAdmin(admin.ModelAdmin):
    list_display = ['clovek','get_email','get_telefon','skolne','level','fakulta']
    list_filter = ['level','fakulta']

    actions = [export_student_list, ]

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