from django.db import models
from django.core.validators import  RegexValidator
from datetime import datetime
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
    vlastnik = models.ForeignKey('Skolne')

    def __str__(self):
        meno = Student.objects.get(skolne = self.vlastnik)
        return str(self.suma) + 'e, ' + str(meno.clovek)

    class Meta:
        verbose_name_plural = " Platby"

    def get_meno(self):
        return str(Student.objects.get(skolne = self.vlastnik).clovek)

    get_meno.short_description = "Meno"

class Vydavok(models.Model):
    ucel = models.CharField(max_length=50)#mozno v buducnosti class ? teda ze typy vydavkov budu..
    suma = models.FloatField()
    splatnost = models.DateField()
    uhradene = models.FloatField()
    vlastnik = models.ForeignKey('Skolne')

    class Meta:
        verbose_name_plural = " Vydavky"

    def __str__(self):
        meno = Student.objects.get(skolne = self.vlastnik)
        return str(self.suma) + 'e, ' + self.ucel + ' - ' + str(meno.clovek)

    def get_meno(self):
        return str(Student.objects.get(skolne = self.vlastnik).clovek)

    get_meno.short_description = "Meno"

class Skolne(models.Model):
    balance = models.FloatField()
    variabilny_symbol = models.IntegerField()
    #platby = models.ForeignKey(Platba, null=True, blank=True)  # platba a vydavok maju len jedneho cloveka
    #vydavky = models.ForeignKey(Vydavok, null=True, blank=True) # tento vztah je naopak platby a vydavky patria do skolneho..

    def refresh_balance(self):
        vydavky = Platba.objects.filter(vlastnik=self)
        platby = Vydavok.objects.filter(vlastnik=self)
        balance = 0
        for v in vydavky:
            balance -= v.suma
        for p in platby:
            balance += p.suma
        self.balance = balance


    def __str__(self):
        self.refresh_balance()
        try:
            meno = Student.objects.get(skolne = self)
            return 'Stav: ' + str(self.balance) + ' (VS ' + str(self.variabilny_symbol) + ', ' + str(meno.clovek)+ ' )'
        except:
            return 'Student zatial nie je, ' + 'Stav: ' + str(self.balance) + ' (VS ' + str(self.variabilny_symbol)+ ')'

    class Meta:
        verbose_name_plural = " Skolne"



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
        return self.stav + '(rok ' + str(self.zaciatok_rok) +')'

    def get_students(self):
        return Student.objects.filter(level=self)



class Rola(models.Model):

    pass


#"skupiny" v akych moze byt clovek?? takto ci inak ??
class Student(Rola):
    clovek = models.OneToOneField(Clovek, null=True)
    datum_nar = models.DateField()
    fakulta = models.ForeignKey(Fakulta)
    #  level = models.CharField(max_length=2, choices=LEVELY)
    rok_zaciatku = models.IntegerField()
    level = models.ForeignKey(Level)

    skolne = models.OneToOneField(Skolne)


    def __str__(self):
        return self.clovek.__str__()

    class Meta:
        verbose_name_plural = "   Studenti"


    def get_email(self):
        return self.clovek.email

    get_email.short_description = 'Email'

    def get_telefon(self):
        return self.clovek.telefon_cislo

    get_telefon.short_description = 'Telefon'

    def get_level_stav(self):
        return self.level.stav

    def get_kredity(self):
        evs = Event.objects.filter(ucastnici=self)
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





EVENT_TYPES = (('ik', 'IK'), ('dbk', 'DBK'), ('ine', 'Ine'))
# alebo preco to actual value nemoze byt hocico ine ? napr. samotne ik a dbk


class Event(models.Model):  # nejaky event, teda DBK/IK, ako presne bude projekt ??
    nazov = models.CharField(max_length=100)
    lektori = models.ManyToManyField(Lektor, blank=True)
    pocet_kreditov = models.IntegerField()
    zaciatok = models.DateTimeField()
    koniec = models.DateTimeField()
    #  levely = ArrayField(models.CharField(max_length=2, choices=LEVELY))
    levely = models.ManyToManyField(Level)
    miesto = models.CharField(max_length=100)
    typ = models.CharField(max_length=3,choices=EVENT_TYPES)
    popis = models.TextField()
    #ucastnici = models.ManyToManyField(Student, through='Prihlasenie')
    ucastnici = models.ManyToManyField(Student, blank=True)
    feedbacky = models.ManyToManyField('Feedback', blank=True)

    def __str__(self):
        return '['+self.typ+'] '+ self.nazov + ' (' + str(self.lektori)+')'

    class Meta:
        verbose_name_plural = "    Eventy"

    def get_lektori(self):
        lek = self.lektori.all()
        s = str(lek[0].clovek)
        for i in range(1,len(lek)):
            s += ','+ str(lek[i].clovek)
        return s


    def get_levely(self):
        lev = self.levely.all()
        s = str(lev[0])
        for i in range(1,len(lev)):
            s += ','+ str(lev[i])
        return s

    def get_short_levely(self):
        pass


    def get_pocet_ucastnikov(self):
        return len(self.ucastnici.all())


class Feedback(models.Model):
    student = models.ForeignKey(Student)
    feedback = models.TextField()
    cas = models.DateTimeField(auto_now=True, null=True)

    def get_dlzka(self):
        return len(self.feedback)

    class Meta:
        verbose_name_plural = "   Feedbacky"

    def __str__(self):
        return str(self.student)
#                 Vztahy
#class Prihlasenie(models.Model):  # studenta na event
#    student = models.ForeignKey(Student)
#    event = models.ForeignKey(Event)
#    doodle = models.BooleanField()
#    prisiel = models.BooleanField()
#    feedback = models.BooleanField()
#    poznamka = models.CharField(max_length=500)
#    pass


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
    text = models.TextField()
    autor = models.ForeignKey(Clovek)
    vytvorene = models.DateTimeField(auto_now_add=True)
    upravene = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nazov + ' (' + str(self.autor) + ')'

    class Meta:
        verbose_name_plural = "     Novinky"


