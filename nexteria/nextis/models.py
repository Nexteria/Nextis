from django.db import models
from django.core.validators import  RegexValidator
from datetime import datetime
from ckeditor.fields import RichTextField
from nexteria.events.models import Event
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile', null=False)
    
    telefon_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    telefon_cislo = models.CharField(validators=[telefon_regex], blank=True, null=True, max_length=25)  # validators should be a list
    viditelne_kontakty = models.BooleanField(default=False)

    datum_nar = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.user.username + '`s profil'


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


#  este je mozno otazka ci nepouzivat django user model.. ale podla mna user != clovek v tomto ponimani..
class Clovek(models.Model):

    meno = models.CharField(max_length=100)
    priezvisko = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    telefon_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    telefon_cislo = models.CharField(validators=[telefon_regex], blank=True, max_length=25)  # validators should be a list

    #role = models.ManyToManyField('Rola', blank=True, null=True)  # clovek ma viac roli..

    def __str__(self):
        return self.meno + ' ' + self.priezvisko

    class Meta:
        verbose_name_plural = "   Ludia"

    def get_name(self):
        return self.meno + ' ' + self.priezvisko

    get_name.short_description = 'Meno'


LEVELY = (('1','1'), ('2','2'), ('3','3'), ('alumni','alumni'))
# bud takto, alebo ako vlastna classa a bolo by to nejako po rocnikoch, ze nie len alumni, ale vyslovene roky..

class Level(models.Model):
    stav = models.CharField(max_length=6, choices=LEVELY)
    zaciatok_rok = models.IntegerField()

    def __str__(self):
        return self.stav + ' (rok ' + str(self.zaciatok_rok) +')'

    def get_students(self):
        return Student.objects.filter(level=self)



class Rola(models.Model):

    pass


#"skupiny" v akych moze byt clovek?? takto ci inak ??
class Student(Rola):
    user = models.OneToOneField(User)
    fakulta = models.ForeignKey(Fakulta, null=True, blank=True)
    skola = models.ForeignKey(Skola, null=True, blank=True)
    #  level = models.CharField(max_length=2, choices=LEVELY)
    rok_zaciatku = models.DateField()
    level = models.ForeignKey(Level)

    skolne = models.OneToOneField('skolne.Skolne', null=True, blank=True)


    def __str__(self):
        return self.user.__str__()

    class Meta:
        verbose_name_plural = "   Studenti"


    def get_email(self):
        return self.user.email

    get_email.short_description = 'Email'

    def get_telefon(self):
        return self.user.profile.telefon_cislo

    get_telefon.short_description = 'Telefon'

    def get_level_stav(self):
        return self.level.stav

    def get_kredity(self):
        evs = Event.objects.filter(feedbacky__student=self)
        kredity = 0
        for e in evs:
            kredity += e.pocet_kreditov

        return kredity





class Lektor(Rola):
    popis = models.TextField()
    clovek = models.ForeignKey(Clovek, null=True)



    def get_email(self):
        return self.clovek.email

    get_email.short_description = 'Email'

    def get_telefon(self):
        return self.clovek.telefon_cislo

    get_telefon.short_description = 'Telefon'


    def __str__(self):
        return self.clovek.__str__()

    class Meta:
        verbose_name_plural = "   Lektori"
#class Autor(Rola):




class BuddyVztah(models.Model):
    student = models.ForeignKey(Student, related_name='buddy_student')
    mentor = models.ForeignKey(Student, related_name='buddy_buddy')
    zaciatok = models.DateField()
    koniec = models.DateField()

    def __str__(self):
        k = ' do ' + str(self.koniec)
        if self.koniec > datetime.date(datetime.now()):
            k=' dodnes'
        return str(self.mentor) + ' >> ' + str(self.student.clovek) + ' od ' + str(self.zaciatok) + k

    def get_koniec(self):
        k = str(self.koniec)
        if self.koniec > datetime.date(datetime.now()):
            k='Dodnes'
        return k

    get_koniec.short_description = 'Koniec'

    class Meta:
        verbose_name_plural = "  Buddy Vztahy"

class GuideVztah(models.Model):
    student = models.ForeignKey(Student)
    mentor = models.ForeignKey(Clovek)
    zaciatok = models.DateField()
    koniec = models.DateField()

    def __str__(self):
        k = ' do ' + str(self.koniec)
        if self.koniec > datetime.date(datetime.now()):
            k=' dodnes'
        return str(self.mentor) + ' >> ' + str(self.student.clovek) + ' od ' + str(self.zaciatok) + k

    def get_koniec(self):
        k = str(self.koniec)
        if self.koniec > datetime.date(datetime.now()):
            k='Dodnes'
        return k

    get_koniec.short_description = 'Koniec'

    class Meta:
        verbose_name_plural = "  Guide Vztahy"


#  iba basic blog
class Novinka(models.Model):
    nazov = models.CharField(max_length=200)
    text = RichTextField()
    autor = models.ForeignKey(Clovek)
    vytvorene = models.DateTimeField(auto_now_add=True)
    upravene = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nazov + ' (' + str(self.autor) + ')'

    class Meta:
        verbose_name_plural = "     Novinky"




