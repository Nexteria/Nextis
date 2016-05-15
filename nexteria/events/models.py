from django.db import models
from datetime import datetime
# Create your models here.

class Miesto(models.Model):
    nazov = models.CharField(max_length=200)
    google_mapa = models.CharField(max_length=500, blank=True)
    #TODO fotka mozno

    def __str__(self):
        return self.nazov

class Stretnutie(models.Model):
    zaciatok = models.DateTimeField()
    koniec = models.DateTimeField()
    miesto = models.ForeignKey(Miesto, blank=True)

    def __str__(self):
        return 'Od: ' + str(self.zaciatok) + ' do: ' + str(self.koniec) + ' , ' + str(self.miesto)

EVENT_TYPES = (('ik', 'IK'), ('dbk', 'DBK'),('for', 'Formalna udalost'), ('ine', 'Ine'))
# alebo preco to actual value nemoze byt hocico ine ? napr. samotne ik a dbk

#viacdielne sakra ako ?
class Event(models.Model):  # nejaky event, teda DBK/IK, ako presne bude projekt ??
    nazov = models.CharField(max_length=100)
    lektori = models.ManyToManyField('nextis.Lektor', blank=True)
    pocet_kreditov = models.IntegerField()
    stretnutia = models.ManyToManyField(Stretnutie, blank=True)
    levely = models.ManyToManyField('nextis.Level')
    typ = models.CharField(max_length=3,choices=EVENT_TYPES)
    popis = models.TextField(blank=True)
    #ucastnici = models.ManyToManyField(Student, through='Prihlasenie')
    ucastnici = models.ManyToManyField('nextis.Student', blank=True)
    feedbacky = models.ManyToManyField('Feedback', blank=True)

    kapacita = models.IntegerField(blank=True)

    def __str__(self):
        return '['+self.typ+'] '+ self.nazov + ' (' + str(self.lektori)+')'

    class Meta:
        verbose_name_plural = "Eventy"

    def get_lektori(self):
        lek = self.lektori.all()
        try:
            s = str(lek[0].clovek)
        except:
            s = 'bez lektorov'
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

    def get_stretnutia(self):
        return '<br />'.join(map(str,self.stretnutia.all()))

    def get_objstretnutia(self):
        return self.stretnutia.all()

    def get_starttime(self):
        print('f')
        if self.stretnutia.count() > 0:
            print(self.stretnutia.order_by('-zaciatok').first())
            return self.stretnutia.order_by('-zaciatok').first().zaciatok
        return datetime.now()

    def get_endtime(self):
        print('e')
        if self.stretnutia.count() > 0:
            print(self.stretnutia.order_by('-koniec').last())
            return self.stretnutia.order_by('-koniec').last().koniec
        return datetime.now()

    def has_ended(self):
        print ('h')
        print( self.get_endtime() < datetime.now())
        return self.get_endtime() < datetime.now()

    get_stretnutia.allow_tags = True


class Feedback(models.Model):
    student = models.ForeignKey('nextis.Student')
    feedback = models.TextField()
    cas = models.DateTimeField(auto_now=True, null=True)

    def get_dlzka(self):
        return len(self.feedback)

    class Meta:
        verbose_name_plural = "Feedbacky"

    def __str__(self):
        return str(self.student)