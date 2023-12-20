import { Vector3 } from "three";
import {
  Boundaries,
  GeoData,
  GeoDataPoint,
  GeoDataType,
} from "../interface/geo";
import { GeoResponse } from "../interface/geoResponse";

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

export const getBoundsFromGeoResponse = (
  geoResponse: GeoResponse
): Boundaries => {
  let boundaries: Boundaries = {
    minX: 1e10,
    minY: 1e10,
    maxX: 0,
    maxY: 0,
  };

  Object.keys(geoResponse.old.houses).forEach((houseUUID) => {
    const centralPoint = geoResponse.old.houses[houseUUID].central_point;
    boundaries.maxX = Math.max(boundaries.maxX, centralPoint.lat);
    boundaries.minX = Math.min(boundaries.minX, centralPoint.lat);
    boundaries.minY = Math.min(boundaries.minY, centralPoint.long);
    boundaries.maxY = Math.max(boundaries.maxY, centralPoint.long);
  });

  Object.keys(geoResponse.old.facilities).forEach((facilityType) => {
    // @ts-ignore
    Object.keys(geoResponse.old.facilities[facilityType]).forEach(
      (facilityUUID) => {
        const { centralPoint } =
          // @ts-ignore
          geoResponse.old.facilities[facilityType][facilityUUID];
        // @ts-ignore
        boundaries.maxX = Math.max(boundaries.maxX, centralPoint.lat);
        boundaries.minX = Math.min(boundaries.minX, centralPoint.lat);
        boundaries.minY = Math.min(boundaries.minY, centralPoint.long);
        boundaries.maxY = Math.max(boundaries.maxY, centralPoint.long);
      }
    );
  });

  return boundaries;
};

export const getCoordinateAtDistance = (
  start: Vector3,
  end: Vector3,
  d: number
): Vector3 => {
  if (end.x == start.x) {
    return new Vector3(start.x, 0, start.z + d * Math.sign(end.z - start.z));
  }
  const m = (end.z - start.z) / (end.x - start.x);
  const factor = 1 / Math.sqrt(1 + m * m);

  const dx = d * factor;
  const dz = d * m * factor;

  if (dx == 0) {
    return new Vector3(start.x, 0, start.z);
  }

  let result = new Vector3(0, 0, 0);

  if (
    Math.sign(dx) == Math.sign(end.x - start.x) &&
    Math.sign(dz) == Math.sign(end.z - start.z)
  ) {
    result = new Vector3(start.x + dx, 0, start.z + dz);
  } else {
    result = new Vector3(start.x - dx, 0, start.z - dz);
  }

  return result;
};
