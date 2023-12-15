import { Vector3 } from "three";
import {
  Boundaries,
  GeoData,
  GeoDataPoint,
  GeoDataType,
} from "../interface/geo";

export function getBounds(geoData: GeoData): Boundaries {
  let boundaries: Boundaries = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };

  geoData.forEach((point: GeoDataPoint) => {
    if (
      point.type == GeoDataType.SCHOOL ||
      point.type == GeoDataType.COMMERCIAL ||
      point.type == GeoDataType.RESIDENTIAL ||
      point.type == GeoDataType.HEALTH ||
      point.type == GeoDataType.HOSPITAL ||
      point.type == GeoDataType.INDUSTRIAL
    ) {
      boundaries.maxX = Math.max(boundaries.maxX, point.centralPoint.x);
      boundaries.minX = Math.min(boundaries.minX, point.centralPoint.x);
      boundaries.minY = Math.min(boundaries.minY, point.centralPoint.z);
      boundaries.maxY = Math.max(boundaries.maxY, point.centralPoint.z);
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
    if (
      point.type == GeoDataType.SCHOOL ||
      point.type == GeoDataType.COMMERCIAL ||
      point.type == GeoDataType.RESIDENTIAL ||
      point.type == GeoDataType.HEALTH ||
      point.type == GeoDataType.HOSPITAL ||
      point.type == GeoDataType.INDUSTRIAL
    ) {
      minC.x = Math.min(minC.x, point.centralPoint.x);
      minC.y = Math.min(minC.y, point.centralPoint.z);
    }
  });

  return minC;
}
