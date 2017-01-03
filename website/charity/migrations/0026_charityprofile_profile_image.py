# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import charity.models.charity_profile


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0025_auto_20170102_2145'),
    ]

    operations = [
        migrations.AddField(
            model_name='charityprofile',
            name='profile_image',
            field=models.FileField(null=True, upload_to=charity.models.charity_profile.content_file_name),
        ),
    ]
