# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0002_auto_20161026_1759'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharityData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('regno', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(max_length=100, choices=[('user', 'user'), ('charity', 'charity')]),
        ),
    ]
