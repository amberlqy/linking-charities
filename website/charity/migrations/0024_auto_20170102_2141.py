# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0023_auto_20170101_2058'),
    ]

    operations = [
        migrations.CreateModel(
            name='Volunteer',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, primary_key=True, verbose_name='ID')),
                ('date', models.IntegerField(null=True)),
                ('forename', models.CharField(max_length=255, null=True)),
                ('surname', models.CharField(max_length=255, null=True)),
                ('email', models.CharField(max_length=255, null=True)),
                ('phone', models.CharField(max_length=255, null=True)),
                ('charity_activity', models.ForeignKey(related_name='volunteers', to='charity.CharityActivity')),
            ],
        ),
        migrations.AlterField(
            model_name='charityrating',
            name='rate_by_user',
            field=models.FloatField(default=0.0),
        ),
    ]
