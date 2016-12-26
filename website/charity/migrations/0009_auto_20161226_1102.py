# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0008_charitydata_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrole',
            name='name',
            field=models.CharField(choices=[('user', 'user'), ('charity', 'charity')], max_length=100),
        ),
    ]
