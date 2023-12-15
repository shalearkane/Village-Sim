import { Vector3 } from "three";
import { BLOCK_TERRAIN_RADIUS } from "../constants/block";
import { GeoData, GeoDataType, TerrainMap } from "../interface/geo";
import { MouseControl } from "../interface/mouse";

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
        const y = geoDataPoint.centralPoint.z;
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

export const getRoadCoordinates = (
  steps: Vector3[],
  width: number
): Vector3[][] => {
  const road: Vector3[][] = [];
  for (let i = 0; i < 100; i++) {
    const temp: Vector3[] = [];
    steps.forEach((step: Vector3) => {
      const x = step.x - width / 2 + i / 100;
      temp.push(new Vector3(x, 0, step.z));
    });

    road.push(temp);
  }

  return road;
};
