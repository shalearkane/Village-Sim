import json
import uuid

conversion = {
    "Electrification": "electric_facility",
    "Pond & Reservoir": "water_body",
    "Education Facilities": "school",
    "Medical & Health Facilities": "healthcare",
    "Buildings": "administrative",
    "Water Sources & Structures": "water_facility",
    "Sanitation & Sewerage Facilities": "sanitation",
    "Roads, Bridges & Culverts": "road",
}

facilities = {
    "administrative": {},
    "water_facility": {},
    "electric_facility": {},
    "healthcare": {},
    "sanitation": {},
    "school": {},
}

with open("landmark.json", "r") as f:
    data: dict = json.load(f)
    for d in data:
        key = conversion[d["ast_cat_name"]]
        if key in facilities.keys():
            facilities[key][str(uuid.uuid4())] = {
                "central_point": {
                    "long": float(d["longitude"]),
                    "lat": float(d["latitude"]),
                },
            }


with open("facilities.json", "w") as f:
    json.dump(fp=f, obj=facilities)
