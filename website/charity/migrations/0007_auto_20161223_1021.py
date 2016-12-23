# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0006_auto_20161113_2124'),
    ]

    operations = [
        migrations.AddField(
            model_name='charityprofile',
            name='verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(max_length=100, choices=[('charity', 'charity'), ('user', 'user')]),
        ),
    ]
