# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0022_auto_20170101_2048'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='gross',
            field=models.FloatField(),
        ),
    ]
