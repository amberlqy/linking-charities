# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authentication', '0002_auto_20161016_1110'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('introduction', models.TextField(null=True, max_length=1000)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL, related_name='user_profile')),
            ],
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='likes',
            field=models.ManyToManyField(related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('user', 'user'), ('charity', 'charity')], max_length=100),
        ),
    ]
