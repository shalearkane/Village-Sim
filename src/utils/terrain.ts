import { Euler, Line, Vector2, Vector3 } from "three";
import { BLOCK_TERRAIN_RADIUS } from "../constants/block";
import {
  GeoData,
  GeoDataType,
  RoadTerrain,
  TerrainMap,
} from "../interface/geo";
import { MouseControl } from "../interface/mouse";
import { getAbsoluteDistance } from "./distance";

export function getTerrainCoordinateArray(
  x: number,
  y: number,
  type: GeoDataType
): string[] {
  const coordinates: string[] = [];
  if (!BLOCK_TERRAIN_RADIUS[type]) console.log(type);
  for (
    let i = Math.floor(x - BLOCK_TERRAIN_RADIUS[type]);
    i <= Math.ceil(x + BLOCK_TERRAIN_RADIUS[type]);
    i++
  ) {
    for (
      let j = Math.floor(y - BLOCK_TERRAIN_RADIUS[type]);
      j <= Math.ceil(y + BLOCK_TERRAIN_RADIUS[type]);
      j++
    ) {
      coordinates.push(`${i},${j}`);
    }
  }

  return coordinates;
}

export function getTerrainMap(geoData: GeoData): TerrainMap {
  let terrainMap: TerrainMap = {};

  geoData.forEach((geoDataPoint) => {
    switch (geoDataPoint.type) {
      case GeoDataType.ROAD: {
        break;
      }

      default: {
        const x = geoDataPoint.centralPoint.x;
        const y = geoDataPoint.centralPoint.y;
        const coordiantesArray = getTerrainCoordinateArray(
          x,
          y,
          geoDataPoint.type
        );

        coordiantesArray.forEach((coordinate: string) => {
          if (terrainMap[coordinate]) {
            terrainMap[coordinate].push(geoDataPoint.key);
          } else {
            terrainMap[coordinate] = [geoDataPoint.key];
          }
        });
      }
    }
  });

  return terrainMap;
}

export function checkSafe(
  terrainMap: TerrainMap,
  mouse: MouseControl,
  type: GeoDataType
): Boolean {
  const coordinateArray = getTerrainCoordinateArray(mouse.x, mouse.z, type);

  let safe = true;

  coordinateArray.forEach((coordinate: string) => {
    if (terrainMap[coordinate] && terrainMap[coordinate].length) {
      safe = false;
      return;
    }
  });

  return safe;
}

export function getRoadTerrainFromGeoData(
  steps: Vector3[],
  width: number
): RoadTerrain[] {
  const roadTerrainArray: RoadTerrain[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const v1 = new Vector3(steps[i].x, steps[i].y, steps[i].z);
    const v2 = new Vector3(steps[i + 1].x, steps[i + 1].y, steps[i + 1].z);
    const angleX = new Vector3(1, 0, 0);
    const angleY = new Vector3(0, 1, 0);
    const angleZ = new Vector3(0, 0, 1);
    const xy1 = new Vector2(steps[i].x, steps[i].y);
    const xy2 = new Vector2(steps[i + 1].x, steps[i + 1].y);
    xy1.add(xy2);
    console.log(xy1.angle());

    console.log(angleZ.angleTo(v1.add(v2)));
    roadTerrainArray.push({
      distance: getAbsoluteDistance(steps[i], steps[i + 1]),
      startCoordinate: steps[i],
      endCoordinate: steps[i + 1],
      width: width,
      rotation: new Euler(-1.57, 0, xy1.angle()),
      centralCoordinate: new Vector3(
        (steps[i].x + steps[i + 1].x) / 2,
        (steps[i].y + steps[i + 1].y) / 2,
        (steps[i].z + steps[i + 1].z) / 2
      ),
    });
  }

  return roadTerrainArray;
}
