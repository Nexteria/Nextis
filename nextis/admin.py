from django.contrib import admin

from nextis.models import *
# Register your models here.

# TODO super user zajozor, rootroot


class ClovekAdmin(admin.ModelAdmin):
    pass

admin.site.register(Clovek, ClovekAdmin)

#admin.site.register(Rola)
admin.site.register(Student)
admin.site.register(Lektor)
admin.site.register(GuideVztah)
admin.site.register(BuddyVztah)


admin.site.register(Skolne)
class LevelAdmin(admin.ModelAdmin):
    pass

admin.site.register(Level, LevelAdmin)


class EventAdmin(admin.ModelAdmin):
    pass

admin.site.register(Event, EventAdmin)


class NovinkaAdmin(admin.ModelAdmin):
    pass

admin.site.register(Novinka, NovinkaAdmin)

admin.site.register(Skola)
admin.site.register(Fakulta)

