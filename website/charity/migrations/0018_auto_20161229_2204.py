# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0017_auto_20161228_2116'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='charityactivity',
            name='image',
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(max_length=100, choices=[('user', 'user'), ('charity', 'charity')]),
        ),
    ]
