from django.db import models
from django.core.validators import  RegexValidator
#from annoying.fields import AutoOneToOneField

###                 skoly
class Skola(models.Model):
    nazov = models.CharField(max_length=100)
    mesto = models.CharField(max_length=100)
    skratka = models.CharField(max_length=10)

    def __str__(self):
        return self.skratka

class Fakulta(models.Model):
    nazov = models.CharField(max_length=100)
    skratka = models.CharField(max_length=10)
    skola = models.ForeignKey(Skola)

    def __str__(self):
        return self.skola.skratka + ' ' +self.skratka

###                 skolne
class Platba(models.Model):
    cas = models.DateTimeField()
    suma = models.FloatField()
    poznamka = models.CharField(max_length=200)
    ucet = models.CharField(max_length=50)
    datum = models.DateField()
    vlastnik = models.ForeignKey('Skolne')

class Vydavok(models.Model):
    ucel = models.CharField(max_length=50)#mozno v buducnosti class ? teda ze typy vydavkov budu..
    suma = models.FloatField()
    splatnost = models.DateField()
    uhradene = models.FloatField()
    vlastnik = models.ForeignKey('Skolne')

class Skolne(models.Model):
    balance = models.FloatField()
    variabilny_symbol = models.IntegerField()
    #platby = models.ForeignKey(Platba, null=True, blank=True)  # platba a vydavok maju len jedneho cloveka
    #vydavky = models.ForeignKey(Vydavok, null=True, blank=True) # tento vztah je naopak platby a vydavky patria do skolneho..

    def __str__(self):
        return 'Stav: ' + str(self.balance) + ' (VS ' + str(self.variabilny_symbol) + ')'



#  este je mozno otazka ci nepouzivat django user model.. ale podla mna user != clovek v tomto ponimani..
class Clovek(models.Model):

    meno = models.CharField(max_length=100)
    priezvisko = models.CharField(max_length=100)
    email = models.EmailField()

    telefon_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    telefon_cislo = models.CharField(validators=[telefon_regex], blank=True, max_length=25)  # validators should be a list

    #role = models.ManyToManyField('Rola', blank=True, null=True)  # clovek ma viac roli..

    def __str__(self):
        return self.meno + ' ' + self.priezvisko


LEVELY = (('1','1'), ('2','2'), ('3','3'), ('alumni','alumni'))
# bud takto, alebo ako vlastna classa a bolo by to nejako po rocnikoch, ze nie len alumni, ale vyslovene roky..

class Level(models.Model):
    stav = models.CharField(max_length=6, choices=LEVELY)
    zaciatok_rok = models.IntegerField()

    def __str__(self):
        return self.stav + '(rok ' + str(self.zaciatok_rok) +')'

class Rola(models.Model):

    pass


#"skupiny" v akych moze byt clovek?? takto ci inak ??
class Student(Rola):
    datum_nar = models.DateField()
    fakulta = models.ForeignKey(Fakulta)
    #  level = models.CharField(max_length=2, choices=LEVELY)
    level = models.ForeignKey(Level)
    rok_zaciatku = models.IntegerField()
    skolne = models.OneToOneField(Skolne)
    clovek = models.OneToOneField(Clovek, null=True)

    def __str__(self):
        return self.clovek.__str__()


class Lektor(Rola):
    popis = models.TextField()
    clovek = models.ForeignKey(Clovek, null=True)


    def __str__(self):
        return self.clovek.__str__()




EVENT_TYPES = (('ik', 'IK'), ('dbk', 'DBK'), ('ine', 'Ine'))
# alebo preco to actual value nemoze byt hocico ine ? napr. samotne ik a dbk


class Event(models.Model):  # nejaky event, teda DBK/IK, ako presne bude projekt ??
    nazov = models.CharField(max_length=100)
    lektori = models.ManyToManyField(Lektor, null=True, blank=True)
    pocet_kreditov = models.IntegerField()
    zaciatok = models.DateTimeField()
    koniec = models.DateTimeField()
    #  levely = ArrayField(models.CharField(max_length=2, choices=LEVELY))
    levely = models.ManyToManyField(Level)
    miesto = models.CharField(max_length=100)
    typ = models.CharField(max_length=3,choices=EVENT_TYPES)
    popis = models.TextField()
    ucastnici = models.ManyToManyField(Student, through='Prihlasenie')

    def __str__(self):
        return '['+self.typ+'] '+ self.nazov + ' (' + str(self.lektori)+')'


#                 Vztahy
class Prihlasenie(models.Model):  # studenta na event
    student = models.ForeignKey(Student)
    event = models.ForeignKey(Event)
    doodle = models.BooleanField()
    prisiel = models.BooleanField()
    feedback = models.BooleanField()
    poznamka = models.CharField(max_length=500)
    pass


class BuddyVztah(models.Model):
    student = models.ForeignKey(Student)
    mentor = models.ForeignKey(Clovek)
    zaciatok = models.DateField()
    koniec = models.DateField()


class GuideVztah(models.Model):
    student = models.ForeignKey(Student)
    mentor = models.ForeignKey(Clovek)
    zaciatok = models.DateField()
    koniec = models.DateField()


#  iba basic blog
class Novinka(models.Model):
    nazov = models.CharField(max_length=200)
    text = models.TextField()
    autor = models.ForeignKey(Clovek)
    vytvorene = models.DateTimeField(auto_now_add=True)
    upravene = models.DateTimeField(auto_now=True)
