# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-20 07:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nextis', '0005_auto_20160120_0717'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='feedback',
            options={'verbose_name_plural': '   Feedbacky'},
        ),
        migrations.AddField(
            model_name='feedback',
            name='cas',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='event',
            name='feedbacky',
            field=models.ManyToManyField(blank=True, to='nexteria.nextis.Feedback'),
        ),
    ]
