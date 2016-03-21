from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^$', views.novinky),
    url(r'^skolne/$',views.skolne),
    url(r'^skolne/(?P<id>[0-9]+)', views.skolne_detail),
    url(r'^kredity/$',views.kredity),
    url(r'^kredity/(?P<id>[0-9]+)', views.kredity_detail),

    url(r'^kontakty/$',views.kontakty),

    url(r'^aktivity/$',views.aktivity),
    url(r'^aktivity/(?P<id>[0-9]+)', views.aktivita_detail),

]