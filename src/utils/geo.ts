import { Vector3 } from "three";
import {
  Boundaries,
  GeoData,
  GeoDataPoint,
  GeoDataType,
} from "../interface/geo";
import {
  Facility,
  FacilityToGeoDataTypeMap,
  GeoDataTypeToFacility,
  GeoResponse,
  NewGeoSchema,
  NormalizedGeoStore,
} from "../interface/geoResponse";
import { getBounds, getUpsampledCoordinateArray } from "./math";
import { RoadResponse } from "../interface/roads";

const normalizationFactor = 40000;

export function geoResposeToGeoData(
  geoResponse: GeoResponse,
  buffer?: { x: number; y: number }
): NormalizedGeoStore {
  const geoData: GeoData = [];
  Object.keys(geoResponse.old.houses).forEach((houseUUID: string) => {
    const house = geoResponse.old.houses[houseUUID];
    geoData.push({
      type: GeoDataType.RESIDENTIAL,
      key: houseUUID,
      floors: house.floors,
      centralPoint: new Vector3(
        house.central_point.lat,
        0,
        house.central_point.long
      ),
      metadata: house.nearest_dist,
    });
  });

  Object.keys(geoResponse.old.facilities).forEach((facilityType: string) => {
    // @ts-ignore
    Object.keys(geoResponse.old.facilities[facilityType]).forEach(
      (facilityUUID) => {
        const { central_point } =
          // @ts-ignore
          geoResponse.old.facilities[facilityType][facilityUUID];
        // @ts-ignore
        geoData.push({
          // @ts-ignore
          type: FacilityToGeoDataTypeMap[facilityType],
          key: facilityUUID,
          centralPoint: new Vector3(central_point.lat, 0, central_point.long),
        });
      }
    );
  });

  return getNormalizedGeoData(geoData, buffer);
}

export function geoDataToGeoResponse(
  geoData: GeoData,
  newSchema: NewGeoSchema,
  buffer: { x: number; y: number }
): GeoResponse {
  let geoResponse: GeoResponse = {
    new: newSchema,
    old: {
      houses: {},
      facilities: {
        [Facility.administrative]: {},
        [Facility.electric_facility]: {},
        [Facility.healthcare]: {},
        [Facility.sanitation]: {},
        [Facility.school]: {},
        [Facility.water_facility]: {},
        [Facility.house]: {},
        [Facility.road]: {},
      },
    },
  };

  geoData.forEach((point: GeoDataPoint) => {
    if (point.type === GeoDataType.RESIDENTIAL) {
      if (!point.key) return;
      geoResponse.old.houses[point.key] = {
        floors: point.floors || 0,
        central_point: {
          lat: (point.centralPoint.x + buffer.x) / normalizationFactor,
          long: (point.centralPoint.z + buffer.y) / normalizationFactor,
        },
        nearest_dist: point.metadata,
      };
    } else if (point.type != GeoDataType.ROAD) {
      // @ts-ignore
      const key = GeoDataTypeToFacility[point.type];
      if (!key || key == "house" || key == "road") return;
      // @ts-ignore
      if (!geoResponse.old.facilities[key])
        // @ts-ignore
        geoResponse.old.facilities[key] = {};
      // @ts-ignore
      geoResponse.old.facilities[key][point.key] = {
        central_point: {
          lat: (point.centralPoint.x + buffer.x) / normalizationFactor,
          long: (point.centralPoint.z + buffer.y) / normalizationFactor,
        },
        nearest_dist: point.metadata,
      };
    }
  });

  delete geoResponse.old.facilities[Facility.house];
  delete geoResponse.old.facilities[Facility.road];

  return geoResponse;
}

export const getNormalizedGeoData = (
  geoData: GeoData,
  buffer?: { x: number; y: number },
  bounds?: Boundaries
): NormalizedGeoStore => {
  let mormalizationBufferX = buffer?.x || 0;
  let mormalizationBufferY = buffer?.y || 0;

  if (!buffer) {
    let { minX, minY, maxX, maxY } = getBounds(geoData);
    mormalizationBufferX = ((minX + maxX) / 2) * normalizationFactor;
    mormalizationBufferY = ((minY + maxY) / 2) * normalizationFactor;
  }

  const normalizedGeoData: GeoData = [];

  geoData.forEach((point: GeoDataPoint) => {
    if (point.type != GeoDataType.ROAD) {
      const normalizedX =
        point.centralPoint.x * normalizationFactor - mormalizationBufferX;
      const normalizedZ =
        point.centralPoint.z * normalizationFactor - mormalizationBufferY;

      if (
        !bounds ||
        (bounds.minX <= normalizedX &&
          bounds.maxX >= normalizedX &&
          bounds.minY <= normalizedZ &&
          bounds.maxY >= normalizedZ)
      ) {
        normalizedGeoData.push({
          ...point,
          centralPoint: new Vector3(
            normalizedX,
            point.centralPoint.y,
            normalizedZ
          ),
        });
      }
    } else {
      const normalizedSteps: Vector3[] = [];
      const upSampledSteps: Vector3[] = getUpsampledCoordinateArray(
        point.steps,
        20
      );
      upSampledSteps.forEach((step: Vector3) => {
        const normalizedX = step.x * normalizationFactor - mormalizationBufferX;
        const normalizedZ = step.z * normalizationFactor - mormalizationBufferY;
        if (
          !bounds ||
          (bounds.minX <= normalizedX &&
            bounds.maxX >= normalizedX &&
            bounds.minY <= normalizedZ &&
            bounds.maxY >= normalizedZ)
        ) {
          normalizedSteps.push(new Vector3(normalizedX, step.y, normalizedZ));
        }
      });
      if (normalizedSteps.length)
        normalizedGeoData.push({
          ...point,
          steps: normalizedSteps,
        });
    }
  });

  const newBounds = getBounds(normalizedGeoData);

  return {
    data: normalizedGeoData,
    buffer: { x: mormalizationBufferX, y: mormalizationBufferY },
    bounds: newBounds,
  };
};

export function coordinateArrayToSteps(coordianteArray: number[][]): Vector3[] {
  const steps: Vector3[] = [];

  coordianteArray.forEach((coordiante: number[]) => {
    steps.push(new Vector3(coordiante[1], 0, coordiante[0]));
  });

  return steps;
}

export function roadsToGeoData(
  roads: RoadResponse,
  buffer?: { x: number; y: number },
  bounds?: Boundaries
): NormalizedGeoStore {
  const geoData: GeoData = [];

  Object.keys(roads).map((roadUUID: string) => {
    geoData.push({
      type: GeoDataType.ROAD,
      key: roadUUID,
      steps: coordinateArrayToSteps(roads[roadUUID]),
    });
  });

  return getNormalizedGeoData(geoData, buffer, bounds);
}
