from django.db import models

from nexteria.nextis.models import Student
# Create your models here.

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
        verbose_name_plural = "Platby"

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
        verbose_name_plural = "Vydavky"

    def __str__(self):
        meno = Student.objects.get(skolne = self.vlastnik)
        return str(self.suma) + 'e, ' + self.ucel + ' - ' + str(meno.clovek)

    def get_meno(self):
        return str(Student.objects.get(skolne = self.vlastnik).clovek)

    get_meno.short_description = "Meno"

class Skolne(models.Model):
    balance = models.FloatField(default=0)
    variabilny_symbol = models.IntegerField(unique=True)
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
        verbose_name_plural = "Skolne"


class ParsedEmail(models.Model):
    nazov = models.CharField(max_length=200)
    text = models.TextField()
    datum = models.DateTimeField(auto_now_add=True)
    priradene = models.BooleanField()

    def __str__(self):
        return self.nazov + ' - ' + str(self.datum)