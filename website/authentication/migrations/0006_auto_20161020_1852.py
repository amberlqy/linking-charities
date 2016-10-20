# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_auto_20161019_1831'),
    ]

    operations = [
        migrations.AddField(
            model_name='charityprofile',
            name='address',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='charity_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='phone_number',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('charity', 'charity'), ('user', 'user')], max_length=100),
        ),
    ]
