import numpy as np
import osmnx as ox
import json
import subprocess

np.random.seed(0)
ox.__version__
ox.settings.use_cache = True
ox.settings.log_console = True
utn = ox.settings.useful_tags_node
oxna = ox.settings.osm_xml_node_attrs
oxnt = ox.settings.osm_xml_node_tags
utw = ox.settings.useful_tags_way
oxwa = ox.settings.osm_xml_way_attrs
oxwt = ox.settings.osm_xml_way_tags
utn = list(set(utn + oxna + oxnt))
utw = list(set(utw + oxwa + oxwt))
ox.settings.all_oneway = True
ox.settings.useful_tags_node = utn
ox.settings.useful_tags_way = utw


def get_geojson(north: float, south: float, east: float, west: float):
    G = ox.graph_from_bbox(
        north=north, south=south, east=east, west=west, network_type="all"
    )
    Gp = ox.project_graph(G)
    Gc = ox.consolidate_intersections(
        Gp, rebuild_graph=True, tolerance=20, dead_ends=False
    )
    file_name = f"{north}-{south}-{east}-{west}.osm"
    ox.io.save_graph_xml(G, filepath=file_name)
    output = subprocess.check_output(
        [
            f'OSM_USE_CUSTOM_INDEXING=NO ogr2ogr -f "GeoJSON" /vsistdout/ {file_name} lines'
        ],
        shell=True,
    )
    d: dict = json.loads(output)
    print(d)


def get_distance(lat: float, long: float):
    pass


if __name__ == "__main__":
    get_geojson(28.5576, 28.5264, 77.7078, 77.6472)
