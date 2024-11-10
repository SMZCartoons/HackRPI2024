from django.core.management.base import BaseCommand

from park_smart_analytics.models import (
    Lots,
    Buildings,
    BuildingLotDistance,
    LotLotDistance,
)
import os
import json


class Command(BaseCommand):
    help = "Add initial data to the Lots table"

    def add_arguments(self, parser):
        # Add a folder argument to specify the path to the folder
        parser.add_argument(
            "folder", type=str, help="The path to the folder containing JSON files"
        )

    def handle(self, *args, **options):
        folder_path = options["folder"]

        if not os.path.isdir(folder_path):
            self.stdout.write(
                self.style.ERROR(f"{folder_path} is not a valid directory")
            )
            return

        # Check if data already exists to prevent duplicate entries
        if not Lots.objects.exists():

            with open(os.path.join(folder_path, "lot_data.json")) as f:
                lots_data = json.load(f)

            for lot_data in lots_data:
                _, created = Lots.objects.get_or_create(**lot_data)
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Added {lot_data["name"]}"))

        if not Buildings.objects.exists():
            with open(os.path.join(folder_path, "buildings.json")) as f:
                buildings_data = json.load(f)

            for building_data in buildings_data:
                _, created = Buildings.objects.get_or_create(
                    name=building_data["name"].title()
                )
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"Added {building_data["name"].title()}")
                    )

        if not BuildingLotDistance.objects.exists():
            with open(os.path.join(folder_path, "building_lot_distances.json")) as f:
                building_lot_distance_data = json.load(f)

            for distance_data in building_lot_distance_data:
                try:
                    lot = None
                    if distance_data["lot_name"] == "as&rc lot":
                        lot = Lots.objects.get(name="AS&RC Lot")
                    else:
                        lot = Lots.objects.get(name=distance_data["lot_name"].title())
                    building = Buildings.objects.get(
                        name=distance_data["building_name"].title()
                    )

                    building_lot_distance, created = (
                        BuildingLotDistance.objects.get_or_create(
                            building=building,
                            lot=lot,
                            distance=distance_data["distance"],
                        )
                    )
                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f"Added {building_lot_distance}")
                        )
                except Lots.DoesNotExist:
                    continue

        if not LotLotDistance.objects.exists():
            with open(os.path.join(folder_path, "lot_lot_distances.json")) as f:
                lot_lot_distance_data = json.load(f)

            for distance_data in lot_lot_distance_data:
                try:
                    lot1 = Lots.objects.get(name=distance_data["lot1"].title())
                    lot2 = Lots.objects.get(name=distance_data["lot2"].title())
                    lot_lot_distance, created = LotLotDistance.objects.get_or_create(
                        lot1=lot1, lot2=lot2, distance=distance_data["distance"]
                    )

                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f"Added {lot_lot_distance}")
                        )
                except Lots.DoesNotExist:
                    continue

        self.stdout.write(self.style.SUCCESS("Initial data added successfully"))
