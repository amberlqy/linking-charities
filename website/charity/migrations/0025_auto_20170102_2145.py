# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0024_auto_20170102_2141'),
    ]

    operations = [
        migrations.AddField(
            model_name='charityactivity',
            name='spending',
            field=models.FloatField(null=True),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(max_length=100, choices=[('charity', 'charity'), ('user', 'user')]),
        ),
    ]
