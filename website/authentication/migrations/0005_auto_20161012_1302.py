# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_auto_20161012_1225'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('charity', 'charity'), ('user', 'user')], max_length=100),
        ),
    ]
