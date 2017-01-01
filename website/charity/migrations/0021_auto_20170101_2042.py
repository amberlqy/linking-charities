# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0020_auto_20170101_2028'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('gross', models.IntegerField()),
                ('currency', models.CharField(max_length=10, null=True)),
                ('txn_id', models.CharField(max_length=100)),
                ('charity_profile', models.ManyToManyField(related_name='payments', to='charity.CharityProfile')),
                ('user_profile', models.ManyToManyField(related_name='payments', to='charity.UserProfile', null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('user', 'user'), ('charity', 'charity')], max_length=100),
        ),
    ]
