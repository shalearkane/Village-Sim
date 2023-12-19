import { Vector3 } from "three";
import {
  Boundaries,
  GeoData,
  GeoDataPoint,
  GeoDataType,
} from "../interface/geo";

export function getBounds(geoData: GeoData): Boundaries {
  let boundaries: Boundaries = {
    minX: 1e10,
    minY: 1e10,
    maxX: 0,
    maxY: 0,
  };

  geoData.forEach((point: GeoDataPoint) => {
    if (point.type != GeoDataType.ROAD) {
      boundaries.maxX = Math.max(boundaries.maxX, point.centralPoint.x);
      boundaries.minX = Math.min(boundaries.minX, point.centralPoint.x);
      boundaries.minY = Math.min(boundaries.minY, point.centralPoint.z);
      boundaries.maxY = Math.max(boundaries.maxY, point.centralPoint.z);
    } else {
      point.steps.forEach((step: Vector3) => {
        boundaries.maxX = Math.max(boundaries.maxX, step.x);
        boundaries.minX = Math.min(boundaries.minX, step.x);
        boundaries.minY = Math.min(boundaries.minY, step.z);
        boundaries.maxY = Math.max(boundaries.maxY, step.z);
      });
    }
  });

  return boundaries;
}

export function getMinCoordinates(geoData: GeoData): { x: number; y: number } {
  let minC = {
    x: 0,
    y: 0,
  };

  geoData.forEach((point: GeoDataPoint) => {
    if (point.type != GeoDataType.ROAD) {
      minC.x = Math.min(minC.x, point.centralPoint.x);
      minC.y = Math.min(minC.y, point.centralPoint.z);
    } else {
      point.steps.forEach((step: Vector3) => {
        minC.x = Math.min(minC.x, step.x);
        minC.y = Math.min(minC.y, step.z);
      });
    }
  });

  return minC;
}
export const upsampledCoordinate = (
  start: Vector3,
  end: Vector3,
  n: number
): Vector3[] => {
  const result: Vector3[] = [];
  const dx = (end.x - start.x) / n;
  const dz = (end.z - start.z) / n;

  for (let i = 0; i <= n; i++) {
    result.push(new Vector3(start.x + i * dx, 0, start.z + i * dz));
  }

  return result;
};

export const getUpsampledCoordinateArray = (
  coordinateArray: Vector3[],
  factor: number
): Vector3[] => {
  const upsampledData: Vector3[] = [];

  for (let i = 0; i < coordinateArray.length - 1; i++) {
    const upsampledCoordinateArray: Vector3[] = upsampledCoordinate(
      coordinateArray[i],
      coordinateArray[i + 1],
      factor
    );
    upsampledData.push(...upsampledCoordinateArray);
  }

  return upsampledData;
};
