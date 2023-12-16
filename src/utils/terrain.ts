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

export function getRoadBoundaries(points: Vector3[], width: number) {
  let result: Vector3[][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    let m1 = (points[i + 1].z - points[i].z) / (points[i + 1].x - points[i].x);
    let m2 = -1 / m1;

    let d = width / 2;

    let p1 = new Vector3(
      points[i].x + d / Math.sqrt(1 + m2 * m2),
      0,
      points[i].z + (d * m2) / Math.sqrt(1 + m2 * m2)
    );

    let p2 = new Vector3(
      points[i + 1].x + d / Math.sqrt(1 + m2 * m2),
      0,
      points[i + 1].z + (d * m2) / Math.sqrt(1 + m2 * m2)
    );

    let p3 = new Vector3(
      points[i].x - d / Math.sqrt(1 + m2 * m2),
      0,
      points[i].z - (d * m2) / Math.sqrt(1 + m2 * m2)
    );

    let p4 = new Vector3(
      points[i + 1].x - d / Math.sqrt(1 + m2 * m2),
      0,
      points[i + 1].z - (d * m2) / Math.sqrt(1 + m2 * m2)
    );

    let arr1 = [];
    let arr2 = [];

    arr1.push(new Vector3(p1.x, 0, p1.z));
    arr2.push(new Vector3(p2.x, 0, p2.z));
    arr1.push(new Vector3(p3.x, 0, p3.z));
    arr2.push(new Vector3(p4.x, 0, p4.z));

    result.push(arr1);
    result.push(arr2);
  }

  result = result[0].map((_, colIndex) => result.map((row) => row[colIndex]));
  const output: Vector3[] = [];
  for (let j = 0; j < result[0].length; j++) {
    output.push(result[0][j]);
  }
  for (let j = result[0].length - 1; j >= 0; j--) {
    output.push(result[1][j]);
  }
  return output;
}
