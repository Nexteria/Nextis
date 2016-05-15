from django import forms


class EventPrihlasenieForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder':'Tvoj e-mail (pouzivany ako identifikator)'}))
    mozem = forms.BooleanField()