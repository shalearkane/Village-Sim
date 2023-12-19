import { Vector3 } from "three";
import { GeoData, GeoDataPoint, GeoDataType } from "../interface/geo";
import {
  Facility,
  FacilityToGeoDataTypeMap,
  GeoDataTypeToFacility,
  GeoResponse,
  NewGeoSchema,
  NormalizedGeoStore,
} from "../interface/geoResponse";
import { getBounds } from "./math";

const normalizationFactor = 40000;

export function geoResposeToGeoData(
  geoResponse: GeoResponse
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

  return getNormalizedGeoData(geoData);
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
      geoResponse.old.facilities[GeoDataTypeToFacility[point.type]] = {
        central_point: {
          lat: (point.centralPoint.x + buffer.x) / normalizationFactor,
          long: (point.centralPoint.z + buffer.y) / normalizationFactor,
        },
        nearest_dist: point.metadata,
      };
    }
  });

  return geoResponse;
}

const getNormalizedGeoData = (geoData: GeoData): NormalizedGeoStore => {
  const { minX, minY, maxX, maxY } = getBounds(geoData);
  const mormalizationBufferX = ((minX + maxX) / 2) * normalizationFactor;
  const mormalizationBufferY = ((minY + maxY) / 2) * normalizationFactor;

  const getNormalizedGeoData: GeoData = [];

  geoData.forEach((point: GeoDataPoint) => {
    if (point.type != GeoDataType.ROAD) {
      const normalizedX =
        point.centralPoint.x * normalizationFactor - mormalizationBufferX;
      const normalizedZ =
        point.centralPoint.z * normalizationFactor - mormalizationBufferY;
      getNormalizedGeoData.push({
        ...point,
        centralPoint: new Vector3(
          normalizedX,
          point.centralPoint.y,
          normalizedZ
        ),
      });
    } else {
      const normalizedSteps: Vector3[] = [];
      point.steps.forEach((step: Vector3) => {
        const normalizedX = step.x * normalizationFactor - mormalizationBufferX;
        const normalizedZ = step.z * normalizationFactor - mormalizationBufferY;
        normalizedSteps.push(new Vector3(normalizedX, step.y, normalizedZ));
      });
      getNormalizedGeoData.push({
        ...point,
        steps: normalizedSteps,
      });
    }
  });

  return {
    data: getNormalizedGeoData,
    buffer: { x: mormalizationBufferX, y: mormalizationBufferY },
  };
};
