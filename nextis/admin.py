from django.contrib import admin

from nextis.models import *
# Register your models here.

# TODO super user zajozor, rootroot


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