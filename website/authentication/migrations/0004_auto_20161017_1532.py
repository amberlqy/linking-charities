# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_auto_20161017_1531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charityprofile',
            name='likes',
            field=models.ManyToManyField(to='authentication.UserProfile', related_name='likes'),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('charity', 'charity'), ('user', 'user')], max_length=100),
        ),
    ]
