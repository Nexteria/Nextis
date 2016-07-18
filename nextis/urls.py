"""nexteria URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from adminplus.sites import AdminSitePlus
import django.contrib.auth.views as aviews

admin.site = AdminSitePlus()
admin.autodiscover()

from tastypie.api import Api
from nexteria.events.api.resources import EventResource

v1_api = Api(api_name='v1')
v1_api.register(EventResource())


urlpatterns = [
    url(r'^login/$', aviews.login, {'template_name':'registration/login.html'}, name='login'),
    url(r'^logout/$', aviews.logout, {'next_page': '/login/'}),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url(r'^admin/', admin.site.urls),
    url(r'', include('nexteria.nextis.urls')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
    url(r'^tinymce/', include('tinymce.urls')),
    url(r'^ckeditor/', include('ckeditor_uploader.urls')),

    url(r'^api/', include(v1_api.urls)),
]