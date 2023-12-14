import { BLOCK_TERRAIN_RAIUS } from "../constants/block";
import { GeoData, GeoDataType, TerrainMap } from "../interface/geo";
import { MouseControl } from "../interface/mouse";

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
