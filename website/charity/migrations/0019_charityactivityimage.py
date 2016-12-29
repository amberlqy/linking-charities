# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import charity.models.charity_activity_image


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0018_auto_20161229_2204'),
    ]

    operations = [
        migrations.CreateModel(
            name='CharityActivityImage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('image', models.FileField(upload_to=charity.models.charity_activity_image.content_file_name, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('charity_activity', models.ForeignKey(related_name='images', to='charity.CharityActivity')),
            ],
        ),
    ]
