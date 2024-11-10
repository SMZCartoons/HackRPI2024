from .models import Buildings, BuildingLotDistance, Lots, LotLotDistance


def get_closest_available_lots_building(building_id, count):
    try:
        building = Buildings.objects.get(id=building_id)

        # Query the BuildingLotDistance table to get lots ordered by distance, filtered by availability
        closest_lots = (
            BuildingLotDistance.objects.filter(
                building=building, lot__available__gt=0
            )  # Only available lots
            .order_by("distance")[:count]  # Sort by the closest distance
            .all()
        )

        return [entry.lot for entry in closest_lots]

    except Buildings.DoesNotExist:
        return None


def get_closest_available_lots_lot(lot_id, count):
    try:
        lot = Lots.objects.get(id=lot_id)

        # Query the LotLotDistance table to get lots ordered by distance, filtered by availability
        closest_lots = (
            LotLotDistance.objects.filter(
                lot1=lot, lot__available__gt=0
            )  # Only available lots
            .order_by("distance")[:count]  # Sort by the closest distance
            .all()
        )

        return [entry.lot2 for entry in closest_lots]

    except Buildings.DoesNotExist:
        return None
