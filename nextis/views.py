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


from django.shortcuts import render
from nextis.models import Novinka, Student, Platba, Vydavok, Event, Level
from django.db.models import Q


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
    eventy = Event.objects.filter(ucastnici=student).order_by('-zaciatok')
    return render(request, 'kredity_detail.html', context={('student', student), ('eventy',eventy)})


def kontakty(request):
    levely = Level.objects.all()
    return render(request, 'kontakty.html', context={('levely',levely)})

def aktivity(request):
    evs = Event.objects.all().order_by('-zaciatok')
    return render(request, 'aktivity.html', context={('eventy', evs)})

def aktivita_detail(request, id):
    event = Event.objects.get(id=id)
    return render(request, 'aktivita_detail.html', context={('event',event)})



