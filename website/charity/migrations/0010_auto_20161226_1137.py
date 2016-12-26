# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('charity', '0009_auto_20161226_1102'),
    ]

    operations = [
        migrations.AddField(
            model_name='charityprofile',
            name='paypal_email',
            field=models.CharField(null=True, max_length=255),
        ),
        migrations.AddField(
            model_name='charityprofile',
            name='paypal_identity_token',
            field=models.CharField(null=True, max_length=255),
        ),
    ]
