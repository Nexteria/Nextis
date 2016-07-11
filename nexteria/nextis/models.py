from django.db import models
from django.core.validators import  RegexValidator
from datetime import datetime
from ckeditor.fields import RichTextField
from nexteria.events.models import Event
from django.contrib.auth.models import User, Group

class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='profile', null=False)
    
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], blank=True, null=True, max_length=25)  # validators should be a list
    visible_contacts = models.BooleanField(default=False)

    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.user.username + '`s profil'

class GroupDescription(models.Model):
    group = models.OneToOneField(Group, related_name='description', null=False)

    description = models.CharField(max_length=300)
    #TODO mozno nejake dalsie vlastnosti


class School(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    acronym = models.CharField(max_length=10)

    def __str__(self):
        return self.acronym

class Faculty(models.Model):
    name = models.CharField(max_length=100)
    acronym = models.CharField(max_length=10)
    school = models.ForeignKey(School)

    def __str__(self):
        return self.school.acronym + ' ' + self.acronym


'''
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
'''

'''
LEVELY = (('1','1'), ('2','2'), ('3','3'), ('alumni','alumni'))
# bud takto, alebo ako vlastna classa a bolo by to nejako po rocnikoch, ze nie len alumni, ale vyslovene roky..

class Level(models.Model):
    stav = models.CharField(max_length=6, choices=LEVELY)
    zaciatok_rok = models.IntegerField()

    def __str__(self):
        return self.stav + ' (rok ' + str(self.zaciatok_rok) +')'

    def get_students(self):
        return Student.objects.filter(level=self)
'''


class Role(models.Model):
    pass


#"skupiny" v akych moze byt clovek?? takto ci inak ??
class Student(Role):
    user = models.OneToOneField(User)
    faculty = models.ForeignKey(Faculty, null=True, blank=True)
    school = models.ForeignKey(School, null=True, blank=True)
    
    start_year = models.DateField()
    

    tuition = models.OneToOneField('tuition.Tuition', null=True, blank=True)

    def get_email(self):
        return self.user.get_email()

    get_email.short_description = 'Email'

    def get_phone(self):
        return self.user.profile.phone_number

    get_phone.short_description = 'Phone'


    def __str__(self):
        return self.user.__str__()

    class Meta:
        verbose_name_plural = "Students"


class Lector(Role):
    user = models.OneToOneField(User)
    description = models.TextField()

    
    class Meta:
        verbose_name_plural = "Lectors"


'''
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
'''

'''
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
'''

#  iba basic blog
class News(models.Model):
    title = models.CharField(max_length=200)
    text = RichTextField()
    author = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title + ' (' + str(self.author) + ')'

    class Meta:
        verbose_name_plural = "News"




