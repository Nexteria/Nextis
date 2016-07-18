# Create your views here.

# kontaktovnik

# prehlad kreditov

# prehlad platby skolneho

#zajozor
#rootroot

#TODO !! integracia platieb z emailov

#TODO maily filter cez levely, a filtre na maily
#TODO automaticke remindery o aktivitach a o platbach ?

#TODO prehlad aktivit cloveka a jeho info
#TODO login a osobna zona
#TODO uprava vlastnych udajov

#TODO hromadne pridelovanie platby skolneho

#TODO statistiky nejake zaujimave

#TODO posuvanie po semestri "zmrazovanie"

#TODO Prehlad feedbackov pre internych ludi
#TODO vyplnovanie feedbackov
#TODO feedback musi mat viac fieldov a tak..

#TODO prehlad buddykov
#TODO prehlad guide-ov
#TODO prehlad buddy a guide vztahov

#TODO ako projekty vo firmach?

#TODO prehlad po lektoroch

#TODO atraktivnejsie novinky


from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from . import forms
from .models import *

@login_required
def home(request):
    return render(request, 'base.html')

'''
def skolne(request):
    studenti = Student.objects.filter(level='1') | Student.objects.filter(level = '2') #.order_by('level')
    studenti = studenti.order_by('rok_zaciatku')
    return render(request, 'skolne.html', context={('studenti', studenti)})

def skolne_detail(request,id):
    student = Student.objects.get(id=id)
    skolne = student.skolne
    platby = Platba.objects.filter(vlastnik = skolne)
    vydavky = Vydavok.objects.filter(vlastnik = skolne)
    return render(request, 'skolne_detail.html', context={('student', student), ('platby', platby), ('vydavky', vydavky)})


def kredity(request):
    studenti = Student.objects.filter(level='1') | Student.objects.filter(level = '2') #.order_by('level')
    studenti = studenti.order_by('rok_zaciatku')
    return render(request, 'kredity.html', context = {('studenti', studenti)})

def kredity_detail(request,id):
    student = Student.objects.get(id=id)
    eventy = Event.objects.filter(feedbacky__student=student).order_by('-zaciatok')
    return render(request, 'kredity_detail.html', context={('student', student), ('eventy',eventy)})


def kontakty(request):
    studenti = Student.objects.all()
    return render(request, 'kontakty.html', context={('studenti',studenti)})


def cmp_evs_start(ev1, ev2):
    return ev1.get_starttime() > ev2.get_starttime()

def cmp_evs_end(ev1):
    return ev1.get_endtime()

def get_only_id(event):
    return event.id

def aktivity(request):
    preevs = [event.id for event in Event.objects.all() if event.has_ended]
    sorted_preevs = Event.objects.filter(id__in=preevs).order_by('stretnutia__zaciatok').values('id').distinct()
    #ppreevs = preev_ids.order_by('-stretnutia__zaciatok').values('id').distinct()
    preevs_f = Event.objects.filter(id__in=sorted_preevs)
    #filter(stretnutia__koniec__gt=datetime.now())

    postevs = [event.id for event in Event.objects.all() if not event.has_ended]
    #ppostevs = Eventpreev_ids.order_by('-stretnutia__zaciatok').values('id').distinct()
    #postevs = Event.objects.filter(id__in=ppreevs)
    postevs_f = Event.objects.filter(id__in=postevs)#.order_by('-stretnutia__zaciatok').distinct()
    #print(preevs)
    #print(postevs)
    return render(request, 'aktivity.html', context={'pre_eventy': preevs_f,'post_eventy':postevs_f})

def aktivita_detail(request, id):
    event = Event.objects.get(id=id)
    message = ''
    try:
        if request.GET['message']:
            message = request.GET['message']
    except:
        pass
    return render(request, 'aktivita_detail.html', context={'event':event, 'message':message, 'id':id})

def aktivita_prihlasovanie(request, id):
    event = Event.objects.get(id=id)


    if request.method == 'GET':
        form = forms.EventPrihlasenieForm()
        return render(request, 'aktivita_prihlasovanie.html', context={'event':event,'form':form})

    if request.method == 'POST':
        form = forms.EventPrihlasenieForm(request.POST)
        if form.is_valid():

            try:
                cl = Clovek.objects.get(email=form.cleaned_data['email'])
                stud = cl.student
                event.ucastnici.add(stud)
                event.save()
                return HttpResponseRedirect(reverse('aktivita_detail', args=[id])+'?message=Prihlasenie%20Uspesne')
            except:
                form.add_error(None, 'Nespravny email')
        return render(request, 'aktivita_prihlasovanie.html', context={'event':event,'form':form})

def aktivita_odhlasovanie(request, id):
    event = Event.objects.get(id=id)

    if request.method == 'GET':
        form = forms.EventPrihlasenieForm()
        return render(request, 'aktivita_odhlasovanie.html', context={'event':event,'form':form})

    if request.method == 'POST':
        form = forms.EventPrihlasenieForm(request.POST)
        if form.is_valid():

            try:
                cl = Clovek.objects.get(email=form.cleaned_data['email'])
                stud = cl.student
                event.ucastnici.remove(stud)
                event.save()
                return HttpResponseRedirect(reverse('aktivita_detail', args=[id])+'?message=Odhlasenie%20Uspesne')
            except:
                form.add_error(None, 'Nespravny email')
        return render(request, 'aktivita_odhlasovanie.html', context={'event':event,'form':form})

from nexteria.skolne.utility.processing_notifications import parse_email
'''
@csrf_exempt
def parse_payment(req):
    parsed = ParsedEmail.objects.create(name=req.POST['subject'], text=req.POST['body-plain'], paired=False)
    trans = parse_email(req.POST['body-plain'])
    if trans['transaction_type'] == 'kredit':
        try:
            owner = Tuition.objects.get(variable_symbol=trans['vs'])
            payment = Payment.objects.create(
                time=datetime.now(),
                amount=trans['amount']/100.0,
                note=trans['message'],
                account=trans['description'],
                owner = owner)

            owner.refresh_balance()

            parsed.paired = True

        except Tuition.DoesNotExist:
            parsed.paired = False
    parsed.save()

    print(trans)
    return HttpResponse('ok')


from dal import autocomplete

class StudentAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        # Don't forget to filter out results depending on the visitor !
        if not self.request.user.is_superuser:
            return Student.objects.none()

        qs = Student.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs

class LectorAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):
        # Don't forget to filter out results depending on the visitor !
        if not self.request.user.is_superuser:
            return Lektor.objects.none()

        qs = Lektor.objects.all()

        if self.q:
            qs = qs.filter(name__istartswith=self.q)

        return qs


def fake_me(request):
  return JsonResponse({"username": "johny.nexter","first_name": "Johny", "last_name": "Nexter", "email": "johny@nexteria.sk"})

