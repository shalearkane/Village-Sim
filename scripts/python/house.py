import json
import uuid
from pyproj import Transformer

houses = {}


with open("Builtup_Kalonda.geojson", "r") as f, open("house.json", "w") as h:
    data = json.load(f)
    crs = data["crs"]["properties"]["name"].split(":")[-1]
    transformer = Transformer.from_crs(f"EPSG:{crs}", "EPSG:4326")

    for f in data["features"]:
        avg_lon = 0
        avg_lat = 0
        count = len(f["geometry"]["coordinates"][0])
        for point in f["geometry"]["coordinates"][0]:
            lat, lon = transformer.transform(point[0], point[1])
            avg_lon += lon
            avg_lat += lat

        avg_lat = avg_lat / len(f["geometry"]["coordinates"][0])
        avg_lon = avg_lon / len(f["geometry"]["coordinates"][0])

        houses[str(uuid.uuid4())] = {
            "floors": f["properties"]["No_Floors"],
            "central_point": {"long": avg_lon, "lat": avg_lat},
        }

    json.dump(fp=h, obj=houses)
