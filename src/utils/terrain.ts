import { Euler, Vector3 } from "three";
import { BLOCK_TERRAIN_RAIUS } from "../constants/block";
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
  for (
    let i = Math.floor(x - BLOCK_TERRAIN_RAIUS[type]);
    i <= Math.ceil(x + BLOCK_TERRAIN_RAIUS[type]);
    i++
  ) {
    for (
      let j = Math.floor(y - BLOCK_TERRAIN_RAIUS[type]);
      j <= Math.ceil(y + BLOCK_TERRAIN_RAIUS[type]);
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
        const coordiantesArray = getTerrainCoordinateArray(
          geoDataPoint.centralPoint.x,
          geoDataPoint.centralPoint.y,
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
    roadTerrainArray.push({
      distance: getAbsoluteDistance(steps[i], steps[i + 1]),
      startCoordinate: steps[i],
      endCoordinate: steps[i + 1],
      width: width,
      rotation: new Euler(-1.57, 0, 0),
    });
  }

  return roadTerrainArray;
}
