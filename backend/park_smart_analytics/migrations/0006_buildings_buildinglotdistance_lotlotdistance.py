# Generated by Django 5.1.3 on 2024-11-10 00:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("park_smart_analytics", "0005_alter_lots_id"),
    ]

    operations = [
        migrations.CreateModel(
            name="Buildings",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "building_id",
                    models.CharField(editable=False, max_length=20, unique=True),
                ),
                ("name", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="BuildingLotDistance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("distance", models.FloatField()),
                (
                    "lot",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="building_distances",
                        to="park_smart_analytics.lots",
                    ),
                ),
                (
                    "building",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="lot_distances",
                        to="park_smart_analytics.buildings",
                    ),
                ),
            ],
            options={
                "unique_together": {("building", "lot")},
            },
        ),
        migrations.CreateModel(
            name="LotLotDistance",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("distance", models.FloatField()),
                (
                    "lot1",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="lot1_distances",
                        to="park_smart_analytics.lots",
                    ),
                ),
                (
                    "lot2",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="lot2_distances",
                        to="park_smart_analytics.lots",
                    ),
                ),
            ],
            options={
                "unique_together": {("lot1", "lot2")},
            },
        ),
    ]
