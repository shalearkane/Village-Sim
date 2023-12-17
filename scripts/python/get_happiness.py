# TODO:
# happiness_factor -> Dynamic
# Max_dis
# Call Magic Soumik code for min_dist
import json
import numpy as np
import osmnx as ox
import networkx as nx
from geopandas import GeoSeries
from shapely.geometry import Point
from math import acos, sin, cos, radians
from typing import List, Tuple

MAX_HAPPINESS = 2
np.random.seed(0)
ox.__version__
ox.settings.use_cache = True
ox.settings.log_console = True

G = ox.graph_from_bbox(
    north=28.65, south=28.45, east=77.8, west=77.6, network_type="all"
)
Gp = ox.project_graph(G)
Gc = ox.consolidate_intersections(Gp, rebuild_graph=True, tolerance=20, dead_ends=False)

max_dist = ox.stats.edge_length_total(Gc)

facilities = {
    "administrative": [10, 1],
    "road": [10, 1],
    "school": [15, 1],
    "healthcare": [12, 1],
    "haat_shop_csc": [13, 1],
    "water_facility": [13, 1],
    "electric_facility": [15, 1],
    "solar_plant": [13, -1],
    "biogas": [12, -1],
    "windmill": [13, -1],
    "sanitation": [10, -1],
}


def dist_road(point1: Point, point2: Point) -> float:
    print("Point1: ", point1)
    print("Point2: ", point2)
    long_lats = [point1, point2]
    points = GeoSeries(long_lats, crs="wgs84")
    points_proj = points.to_crs(epsg="32643")
    nodes = []
    for pt in points_proj:
        nodes.append(ox.nearest_nodes(Gc, pt.x, pt.y))
    print(nodes)
    # route = ox.shortest_path(Gc, nodes[0], nodes[1], weight="length")
    route_length = nx.shortest_path_length(
        G=Gc, source=nodes[0], target=nodes[1], weight="length"
    )
    print(route_length)
    return route_length


def dist_euclidean(point1 : Point, point2 : Point) -> float:
    Lon1 = point1.x
    Lon2 = point2.x
    Lat1 = point1.y
    Lat2 = point2.y
    distance = acos((sin(radians(Lat1)) * sin(radians(Lat2))) + (cos(radians(Lat1)) * cos(radians(Lat2))) * (cos(radians(Lon2) - radians(Lon1)))) * 6371000
    return distance


def get_initial_happiness(initial_data):
    houses_coord = initial_data["old"]["houses"]

    if len(houses_coord) == 0:
        return 0
    
    facilities_coord = initial_data["old"]["facilities"]

    happiness = {}
    for facility in facilities.keys():
        happiness[facility] = 0
    avg_happiness = 0

    for house_uuid in houses_coord.keys():
        nearest_dist = []
        for facility in facilities_coord.keys():
            distance = float("inf")
            uuid = ""

            for facility_uuid in facilities_coord[facility].keys():
                if facilities[facility][1]:
                    point1 = Point(
                        houses_coord[house_uuid]["central_point"]["long"],
                        houses_coord[house_uuid]["central_point"]["lat"],
                    )
                    point2 = Point(
                        facilities_coord[facility][facility_uuid]["central_point"][
                            "long"
                        ],
                        facilities_coord[facility][facility_uuid]["central_point"][
                            "lat"
                        ],
                    )
                    new_distance = dist_road(point1, point2)

                    if new_distance < distance:
                        distance = new_distance
                        uuid = facility_uuid

                else:
                    point1 = Point(
                        houses_coord[house_uuid]["central_point"]["long"],
                        houses_coord[house_uuid]["central_point"]["lat"],
                    )
                    point2 = Point(
                        facilities_coord[facility][facility_uuid]["central_point"][
                            "long"
                        ],
                        facilities_coord[facility][facility_uuid]["central_point"][
                            "lat"
                        ],
                    )
                    new_distance = dist_euclidean(point1, point2)

                    if new_distance < distance:
                        distance = new_distance
                        uuid = facility_uuid

            nearest_dist.append(
                {"facility_type": facility, "id": uuid, "dist": distance}
            )

            if distance != float("inf"):
                if facilities[facility][1]:
                    if distance > 0:
                        happiness[facility] += facilities[facility][0] / distance
                    else:
                        happiness[facility] = MAX_HAPPINESS
                else:
                    happiness[facility] += facilities[facility][0] * distance / max_dist

        initial_data["old"]["houses"][house_uuid]["nearest_dist"] = nearest_dist

    for facility in happiness.keys():
        avg_happiness += happiness[facility]

    avg_happiness = avg_happiness / (len(happiness) * len(houses_coord))

    return happiness, avg_happiness, initial_data


def get_updated_happiness_on_adding_facility(data, happiness) -> Tuple[dict, float, dict]:
    houses_coord = data["old"]["houses"]
    facilities_coord = data["old"]["facilities"]

    new_building = data["new"]["facility_type"]
    new_building_coord = Point(
        data["new"]["central_point"]["long"], data["new"]["central_point"]["lat"]
    )

    if len(houses_coord) == 0:
        return 0
    for house_uuid in houses_coord.keys():
        curr_house_coordinates = Point(
            houses_coord[house_uuid]["central_point"]["long"],
            houses_coord[house_uuid]["central_point"]["lat"],
        )

        if facilities[new_building][1]:
            new_distance = dist_road(new_building_coord, curr_house_coordinates)
            old_distance = 0

            for i in range(len(houses_coord[house_uuid]["nearest_dist"])):
                if (
                    houses_coord[house_uuid]["nearest_dist"][i]["facility_type"]
                    == new_building
                ):
                    old_distance = houses_coord[house_uuid]["nearest_dist"][i][
                        "dist"
                    ]
                    data["old"]["houses"][house_uuid]["nearest_dist"][i][
                        "dist"
                    ] = new_distance
                    break

            if new_distance < old_distance:
                if old_distance != float("inf"):
                    if old_distance > 0:
                        happiness[new_building] -= (
                            facilities[new_building][0] / old_distance
                        )
                    else:
                        happiness[new_building] -= MAX_HAPPINESS
                if new_distance > 0:
                    happiness[new_building] += (
                        facilities[new_building][0] / new_distance
                    )
                else:
                    happiness[new_building] += MAX_HAPPINESS

        else:
            new_distance = dist_euclidean(
                new_building_coord, curr_house_coordinates
            )
            old_distance = 0

            for i in range(len(houses_coord[house_uuid]["nearest_dist"])):
                if (
                    houses_coord[house_uuid]["nearest_dist"][i]["facility_type"]
                    == new_building
                ):
                    old_distance = houses_coord[house_uuid]["nearest_dist"][i][
                        "dist"
                    ]
                    data["old"]["houses"][house_uuid]["nearest_dist"][i][
                        "dist"
                    ] = new_distance
                    break

            if new_distance < old_distance:
                if old_distance != float("inf"):
                    happiness[new_building] -= (
                        facilities[new_building][0] * old_distance / max_dist
                    )
                happiness[new_building] += (
                    facilities[new_building][0] * new_distance / max_dist
                )

    avg_happiness = 0
    for facility in happiness.keys():
        avg_happiness += happiness[facility]

    avg_happiness = avg_happiness / (len(happiness) * len(houses_coord))

    return happiness, avg_happiness, data


def get_updated_happiness_on_adding_house(data : dict, happiness : dict) -> Tuple[dict, float, List]:
    houses_coord = data["old"]["houses"]
    facilities_coord = data["old"]["facilities"]

    new_building = data["new"]["facility_type"]
    new_building_coord = Point(
        data["new"]["central_point"]["long"], data["new"]["central_point"]["lat"]
    )

    nearest_distances = []
    for facility in facilities_coord.keys():
        if facilities[facility][1]:
            distance = float("inf")
            for facility_uuid in facilities_coord[facility].keys():
                curr_facility_coordinates = Point(
                    facilities_coord[facility][facility_uuid]["central_point"][
                        "long"
                    ],
                    facilities_coord[facility][facility_uuid]["central_point"][
                        "lat"
                    ],
                )
                distance = min(
                    dist_road(new_building_coord, curr_facility_coordinates),
                    distance,
                )
            if distance > 0:
                happiness[facility] += facilities[facility][0] / distance
            else:
                happiness[facility] += MAX_HAPPINESS
            
        else:
            distance = float("inf")
            for facility_uuid in facilities_coord[facility].keys():
                curr_facility_coordinates = Point(
                    facilities_coord[facility][facility_uuid]["central_point"][
                        "long"
                    ],
                    facilities_coord[facility][facility_uuid]["central_point"][
                        "lat"
                    ],
                )
                distance = min(
                    dist_euclidean(new_building_coord, curr_facility_coordinates),
                    distance,
                )
            happiness[facility] += facilities[facility][0] * distance / max_dist

        nearest_distances.append({"facility_type": facility, "dist": distance})

    avg_happiness = 0
    for facility in happiness.keys():
        avg_happiness += happiness[facility]

    avg_happiness = avg_happiness / (len(happiness) * len(houses_coord))

    return happiness, avg_happiness, nearest_distances


with open("facilities-mini.json", "r") as f, open("house-mini.json", "r") as h:
    facilities_coord = json.load(f)
    houses_coord = json.load(h)

    d = {"old": {"houses": houses_coord, "facilities": facilities_coord}, "new": {}}

    happiness, avg_happiness, d = get_initial_happiness(d)
    print(happiness)
    print(avg_happiness)
    print(d)

    d["new"] = {
        "key": "uuid",
        "facility_type": "school",
        "central_point": {
            "long": 77.67305,
            "lat": 28.5398
        }
    }

    happiness, avg_happiness, d = get_updated_happiness(d, happiness)

    print(happiness)
    print(avg_happiness)
