# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0021_auto_20170101_2042'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='charity_profile',
        ),
        migrations.AddField(
            model_name='payment',
            name='charity_profile',
            field=models.ForeignKey(to='charity.CharityProfile', related_name='payments', default=999),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='payment',
            name='user_profile',
        ),
        migrations.AddField(
            model_name='payment',
            name='user_profile',
            field=models.ForeignKey(to='charity.UserProfile', null=True, related_name='payments'),
        ),
    ]
