# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CharityProfile',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('location', models.CharField(null=True, max_length=100)),
                ('goal', models.CharField(null=True, max_length=255)),
                ('description', models.TextField(null=True, max_length=1000)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, related_name='charity_profile')),
            ],
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', auto_created=True, serialize=False)),
                ('name', models.CharField(max_length=100, choices=[('user', 'user'), ('charity', 'charity')])),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, related_name='role')),
            ],
        ),
    ]
