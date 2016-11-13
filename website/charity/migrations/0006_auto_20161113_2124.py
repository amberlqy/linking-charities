# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0005_charityactivity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='charityprofile',
            name='location',
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='city',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='country',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='email',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='postcode',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='charityactivity',
            name='charity_profile',
            field=models.ForeignKey(related_name='activities', to='charity.CharityProfile'),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(max_length=100, choices=[('user', 'user'), ('charity', 'charity')]),
        ),
    ]
