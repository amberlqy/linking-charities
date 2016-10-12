# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharityProfile',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', primary_key=True, auto_created=True)),
                ('location', models.CharField(max_length=100)),
                ('goal', models.CharField(max_length=255)),
                ('description', models.TextField(max_length=1000)),
                ('user', models.OneToOneField(related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(max_length=100, choices=[('user', 'user'), ('charity', 'charity')]),
        ),
    ]
