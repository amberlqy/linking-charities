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
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('charity_name', models.CharField(null=True, max_length=100)),
                ('location', models.CharField(null=True, max_length=100)),
                ('goal', models.CharField(null=True, max_length=255)),
                ('address', models.CharField(null=True, max_length=255)),
                ('phone_number', models.CharField(null=True, max_length=255)),
                ('description', models.TextField(null=True, max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('introduction', models.TextField(null=True, max_length=1000)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, related_name='user_profile')),
            ],
        ),
        migrations.CreateModel(
            name='UserRole',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(choices=[('user', 'user'), ('charity', 'charity')], max_length=100)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, related_name='role')),
            ],
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='likes',
            field=models.ManyToManyField(to='charity.UserProfile', related_name='likes'),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='user',
            field=models.OneToOneField(to=settings.AUTH_USER_MODEL, related_name='charity_profile'),
        ),
    ]
