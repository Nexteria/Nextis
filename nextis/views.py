from django.shortcuts import render

# Create your views here.

# kontaktovnik

# prehlad kreditov

# prehlad platby skolneho

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


from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from nextis.models import *
from . import forms
from django.core.urlresolvers import reverse


from django.views.decorators.csrf import csrf_exempt

def novinky (request):
    posledne = Novinka.objects.order_by('vytvorene')[:3]
    return render(request, 'novinky.html', context={('posledne',posledne)})

def skolne(request):
    studenti = Student.objects.filter(level='1') | Student.objects.filter(level = '2') #.order_by('level')
    studenti = studenti.order_by('rok_zaciatku')
    return render(request, 'skolne.html', context = {('studenti', studenti)})

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
    levely = Level.objects.all()
    return render(request, 'kontakty.html', context={('levely',levely)})

def aktivity(request):
    preevs = Event.objects.filter(koniec__lt=datetime.now()).order_by('-zaciatok')
    postevs = Event.objects.filter(koniec__gt=datetime.now()).order_by('-zaciatok')
    return render(request, 'aktivity.html', context={'pre_eventy': preevs, 'post_eventy':postevs})

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

from processing_notifications import parse_email

@csrf_exempt
def parse_platba(req):
    parsed = ParsedEmail.objects.create(nazov=req.POST['subject'], text=req.POST['body-plain'], priradene = False)
    trans = parse_email(req.POST['body-plain'])
    if trans['transaction_type'] == 'kredit':
        try:
            vlastnik = Skolne.objects.get(variabilny_symbol=trans['vs'])
            platba = Platba.objects.create(cas=datetime.now(), suma=trans['amount']/100.0, poznamka=trans['message'], ucet=trans['description'], vlastnik = vlastnik)

            vlastnik.refresh_balance()

            parsed.priradene = True

        except Skolne.DoesNotExist:
            parsed.priradene = False
    parsed.save()

    print(trans)
    return HttpResponse('ok')


