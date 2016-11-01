# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0004_auto_20161030_1653'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharityActivity',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=255, null=True)),
                ('start_time', models.DateTimeField(null=True)),
                ('end_time', models.DateTimeField(null=True)),
                ('image', models.FileField(upload_to='charity/activity_images/', null=True)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('charity_profile', models.ForeignKey(to='charity.CharityProfile')),
            ],
        ),
    ]
