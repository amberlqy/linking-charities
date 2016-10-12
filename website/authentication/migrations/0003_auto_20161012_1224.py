# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20161012_1209'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charityprofile',
            name='description',
            field=models.TextField(blank=True, max_length=1000),
        ),
        migrations.AlterField(
            model_name='charityprofile',
            name='goal',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='charityprofile',
            name='location',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
