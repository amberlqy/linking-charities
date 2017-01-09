# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0026_charityprofile_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='charityprofile',
            name='website',
            field=models.CharField(null=True, max_length=255),
        ),
    ]
