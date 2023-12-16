# TODO:
# happiness_factor -> Dynamic
# Max_dis
# Call Magic Soumik code for min_dist
import numpy as np
import osmnx as ox
import networkx as nx
from geopandas import GeoSeries
from shapely.geometry import Point

np.random.seed(0)
ox.__version__
ox.settings.use_cache= True
ox.settings.log_console = True

G = ox.graph_from_bbox(north=28.5576, south=28.5264, east=77.7078, west=77.6472, network_type="drive")
Gp = ox.project_graph(G)
Gc = ox.consolidate_intersections(Gp, rebuild_graph=True, tolerance=20, dead_ends=False)

Gc.graph["crs"]

facilities = {
    "road" : [10, 1],
    "school" : [15, 1],
    "healthcare" : [12, 1],
    "haat_shop_csc" : [13, 1],
    "water_facility" : [13, 1],
    "electric_facilty" : [15, 1],
    "solar_plant" : [13, -1],
    "biogas" : [12, -1],
    "windmill" : [13, -1],
    "sanitation" : [10, -1],
}

def dist_road(point1 : Point, point2 : Point) -> float :
  lat_longs = [point1, point2]
  points = GeoSeries(lat_longs, crs="wgs84")
  points_proj = points.to_crs(epsg="32643")
  nodes = []
  for pt in points_proj:
    nodes.append(ox.nearest_nodes(Gc, pt.x, pt.y))
  # route = ox.shortest_path(Gc, nodes[0], nodes[1], weight="length")
  route_length = nx.shortest_path_length(G=Gc, source=nodes[0], target=nodes[1], weight='length')
  return route_length

def dist_cityblock(point1, point2):
  lat_longs = [point1, point2]
  points = GeoSeries(lat_longs, crs="wgs84")
  points_proj = points.to_crs(epsg="32643")
  distance = abs(points_proj[0].x - points_proj[1].x) + abs(points_proj[0].y - points_proj[1].y)
  return distance


def get_initial_happiness(initial_data):
  houses_coord = initial_data["old"]["houses"]
  facilities_coord = initial_data["old"]["facilities"]

  happiness = {}
  for facility in facilities.keys():
    happiness[facility] = 0
  avg_happiness = 0

  max_dist = 65 # ye dekhna h kese nikaalna h

  for house_uuid in houses_coord.keys():
    nearest_dist = []
    for facility in facilities_coord.keys():
      distance = float("inf")
      uuid = ""

      for facility_uuid in facilities_coord[facility].keys():
        if(facilities[facility][1]):
          point1 = Point(
            houses_coord[house_uuid]["central_point"]["lat"],
            houses_coord[house_uuid]["central_point"]["long"]
          )
          point2 = Point(
            facilities_coord[facility][facility_uuid]["central_point"]["lat"],
            facilities_coord[facility][facility_uuid]["central_point"]["long"]  
          )
          new_distance = dist_road(point1, point2)

          if(new_distance < distance):
            distance = new_distance
            uuid = facility_uuid

        else:
          point1 = Point(
            houses_coord[house_uuid]["central_point"]["lat"],
            houses_coord[house_uuid]["central_point"]["long"]
          )
          point2 = Point(
            facilities_coord[facility][facility_uuid]["central_point"]["lat"],
            facilities_coord[facility][facility_uuid]["central_point"]["long"]
          )
          new_distance = dist_cityblock(point1, point2) 

          if(new_distance < distance):
            distance = new_distance
            uuid = facility_uuid

      nearest_dist.append(
        {
          "facility_type": facility,
          "id": uuid,
          "dist": distance
        }
      )

      if(distance != float("inf")):
        if(facilities[facility][1]):
          happiness[facility] += facilities[facility][0] / distance
        else:
          happiness[facility] += facilities[facility][0] * distance / max_dist

    initial_data["old"]["houses"][house_uuid]["nearest_dist"] = nearest_dist

  for facility in happiness.keys():
      avg_happiness += happiness[facility]
      
  avg_happiness = avg_happiness / (len(happiness) * len(houses_coord))

  return happiness, avg_happiness, initial_data

def get_updated_happiness(data, happiness):
  houses_coord = data["old"]["houses"]
  facilities_coord = data["old"]["facilities"]

  new_building = data["new"]["facility_type"]
  new_building_coord = Point(
    data["new"]["central_point"]["lat"],
    data["new"]["central_point"]["long"]   
  )
  
  if (new_building != "house"):
    for house_uuid in houses_coord.keys():
      curr_house_coordinates = Point(
          houses_coord[house_uuid]["central_point"]["lat"],
          houses_coord[house_uuid]["central_point"]["long"]
        )
      
      if(facilities[new_building][1]):
        new_distance = dist_road(new_building_coord, curr_house_coordinates)
        old_distance = 0

        for i in range(len(houses_coord[house_uuid]["nearest_dist"])):
          if(houses_coord[house_uuid]["nearest_dist"][i]["facility_type"] == new_building):
            old_distance = houses_coord[house_uuid]["nearest_dist"][i]["dist"]
            data["old"]["houses"][house_uuid]["nearest_dist"][i]["dist"] = new_distance
            break

        if(new_distance < old_distance):
          if(old_distance != float("inf")):
            happiness[new_building] -= facilities[new_building][0] / old_distance
          happiness[new_building] += facilities[new_building][0] / new_distance

      else:
        new_distance = dist_cityblock(new_building_coord, curr_house_coordinates)
        old_distance = 0

        for i in range(len(houses_coord[house_uuid]["nearest_dist"])):
          if(houses_coord[house_uuid]["nearest_dist"][i]["facility_type"] == new_building):
            old_distance = houses_coord[house_uuid]["nearest_dist"][i]["dist"]
            data["old"]["houses"][house_uuid]["nearest_dist"][i]["dist"] = new_distance
            break

        if(new_distance < old_distance):
          if(old_distance != float("inf")):
            happiness[new_building] -= facilities[new_building][0] * old_distance / max_dist
          happiness[new_building] += facilities[new_building][0] * new_distance / max_dist

    avg_happiness = 0
    for facility in happiness.keys():
      avg_happiness += happiness[facility]
      
    avg_happiness = avg_happiness / (len(happiness) * len(houses_coord))

    return happiness, avg_happiness, data
        
  elif (new_building == "house"):
    nearest_distances = []
    for facility in facilities_coord.keys():
      if(facilities[facility][1]):
        distance = float("inf")
        for facility_uuid in facilities_coord[facility].keys():
          curr_facility_coordinates = Point(
            facilities_coord[facility][facility_uuid]["central_point"]["lat"],
            facilities_coord[facility][facility_uuid]["central_point"]["long"]
          )
          distance = min(dist_road(new_building_coord, curr_facility_coordinates), distance)
        happiness[facility] += facilities[facility][0] / distance

      else:
        distance = float("inf")
        for facility_uuid in facilities_coord[facility].keys():
          curr_facility_coordinates = Point(
            facilities_coord[facility][facility_uuid]["central_point"]["lat"],
            facilities_coord[facility][facility_uuid]["central_point"]["long"]
          )
          distance = min(dist_cityblock(new_building_coord, curr_facility_coordinates), distance)
        happiness[facility] += facilities[facility][0] * distance / max_dist

      nearest_distances.append(
        {
          "facility_type" : facility,
          "dist" : distance
        }
      )
    
    avg_happiness = 0
    for facility in happiness.keys():
      avg_happiness += happiness[facility]
      
    avg_happiness = avg_happiness / (len(happiness) * len(houses_coord))

    return happiness, avg_happiness, nearest_distances