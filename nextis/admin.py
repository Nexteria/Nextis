from django.contrib import admin

from nextis.models import *
# Register your models here.

# TODO super user zajozor, rootroot


class ClovekAdmin(admin.ModelAdmin):
    pass

admin.site.register(Clovek, ClovekAdmin)