from tastypie.resources import ModelResource
from nexteria.events.models import Event

class EventResource(ModelResource):
    class Meta:
        queryset = Event.objects.all()
        allowed_methods = ['get']