# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0010_auto_20161226_1137'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='charityactivity',
            name='end_time',
        ),
        migrations.RemoveField(
            model_name='charityactivity',
            name='start_time',
        ),
        migrations.AddField(
            model_name='charityactivity',
            name='date',
            field=models.CharField(null=True, max_length=10),
        ),
    ]
