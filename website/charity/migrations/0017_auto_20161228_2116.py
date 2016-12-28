# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0016_auto_20161228_2114'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charityrating',
            name='charity_profile',
            field=models.ForeignKey(related_name='ratings', to='charity.CharityProfile'),
        ),
        migrations.AlterField(
            model_name='charityrating',
            name='user',
            field=models.ForeignKey(related_name='ratings', to=settings.AUTH_USER_MODEL),
        ),
    ]
