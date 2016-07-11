from django.db import models

from nexteria.nextis.models import Student
# Create your models here.

class Payment(models.Model):
    time = models.DateTimeField()
    amount = models.FloatField()
    note = models.CharField(max_length=200)
    account = models.CharField(max_length=50)
    owner = models.ForeignKey('Tuition')


    def __str__(self):
        name = Student.objects.get(tuition = self.owner)
        return str(self.amount) + 'e, ' + str(name.user)

    class Meta:
        verbose_name_plural = "Payments"

    def get_name(self):
        return str(Student.objects.get(tuition = self.owner).user)

    get_name.short_description = "Name"

class Expense(models.Model):
    #mozno v buducnosti class ? teda ze typy vydavkov budu..
    purpose = models.CharField(max_length=50)
    amount = models.FloatField()
    due_date = models.DateField()
    paid = models.FloatField()
    owner = models.ForeignKey('Tuition')

    class Meta:
        verbose_name_plural = "Expenses"

    def __str__(self):
        name = Student.objects.get(tuition = self.owner)
        return str(self.amount) + 'e, ' + self.purpose + ' - ' + str(name.user)

    def get_name(self):
        return str(Student.objects.get(tuition = self.owner).user)

    get_name.short_description = "Name"

class Tuition(models.Model):
    balance = models.FloatField(default=0)
    variable_symbol = models.IntegerField(unique=True)

    def refresh_balance(self):
        expenses = Payment.objects.filter(owner=self)
        payments = Expense.objects.filter(owner=self)
        balance = 0
        for v in expenses:
            balance -= v.amount
        for p in payments:
            balance += p.amount
        self.balance = balance


    def __str__(self):
        self.refresh_balance()
        try:
            name = Student.objects.get(tuition = self)
            return 'Stav: ' + str(self.balance) + ' (VS ' + str(self.variable_symbol) + ', ' + str(name.user)+ ' )'
        except:
            return 'Student k var. symbolu neexistuje, ' + 'Stav: ' + str(self.balance) + ' (VS ' + str(self.variable_symbol)+ ')'

    class Meta:
        verbose_name_plural = "Tuitions"


class ParsedEmail(models.Model):
    name = models.CharField(max_length=200)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    paired = models.BooleanField()

    def __str__(self):
        return self.name + ' - ' + str(self.date)