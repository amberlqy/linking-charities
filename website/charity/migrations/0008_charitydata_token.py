# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0007_auto_20161223_1021'),
    ]

    operations = [
        migrations.AddField(
            model_name='charitydata',
            name='token',
            field=models.CharField(null=True, max_length=255),
        ),
    ]
