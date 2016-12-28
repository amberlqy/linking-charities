# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('charity', '0015_auto_20161228_2113'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharityRating',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('rate_by_user', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('charity_profile', models.OneToOneField(related_name='ratings', to='charity.CharityProfile')),
                ('user', models.OneToOneField(related_name='ratings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('charity', 'charity'), ('user', 'user')], max_length=100),
        ),
    ]
