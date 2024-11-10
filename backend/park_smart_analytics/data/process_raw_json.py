import json
from geopy.distance import geodesic

with open("raw_location_data.json", "r") as raw_data_file:
    raw_data = json.load(raw_data_file)

buildings = []
lots = []

for location in raw_data["elements"]:
    name = location.get("tags", {}).get("name", "").lower()
    lat = round(
        (
            float(location.get("bounds", {}).get("minlat", 0.0))
            + float(location.get("bounds", {}).get("maxlat", 0.0))
        )
        / 2.0,
        5,
    )
    lon = round(
        (
            float(location.get("bounds", {}).get("minlon", 0.0))
            + float(location.get("bounds", {}).get("maxlon", 0.0))
        )
        / 2.0,
        5,
    )
    data = {
        "name": name,
        "lat": lat,
        "lon": lon,
    }
    if "lot" in name:
        lots.append(data)
    else:
        buildings.append(data)

with open("buildings.json", "w") as buildings_file:
    json.dump(buildings, buildings_file)

with open("lots.json", "w") as lots_file:
    json.dump(lots, lots_file)

building_lot_distances = []

for building in buildings:
    for lot in lots:
        distance = round(
            geodesic(
                (building["lat"], building["lon"]), (lot["lat"], lot["lon"])
            ).meters,
            4,
        )
        if distance > 700:
            continue
        data = {
            "building_name": building["name"],
            "lot_name": lot["name"],
            "distance": distance,
        }

        building_lot_distances.append(data)

with open("building_lot_distances.json", "w") as building_lot_distances_file:
    json.dump(building_lot_distances, building_lot_distances_file)


lot_lot_distances = []

for lot1 in lots:
    for lot2 in lots:
        distance = round(
            geodesic((lot1["lat"], lot1["lon"]), (lot2["lat"], lot2["lon"])).meters,
            4,
        )
        if distance > 600 or lot1["name"] == lot2["name"]:
            continue
        data = {
            "lot1": lot1["name"],
            "lot2": lot2["name"],
            "distance": distance,
        }

        lot_lot_distances.append(data)

with open("lot_lot_distances.json", "w") as lot_lot_distances_file:
    json.dump(lot_lot_distances, lot_lot_distances_file)
