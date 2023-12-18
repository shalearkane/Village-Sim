import { Vector3 } from "three";
import { GeoData, GeoDataType } from "../interface/geo";
import {
  Facility,
  FacilityToGeoDataTypeMap,
  GeoResponse,
} from "../interface/geoResponse";

export function geoResposeToGeoData(geoResponse: GeoResponse): GeoData {
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
      metadata: {
        roadDistance: 0,
        residentialDistance: 0,
        hospitalDistance: house.nearest_dist[Facility.healthcare]?.dist,
        agriculturalDistance: 0,
        commercialDistance: 0,
        industrialDistance: 0,
        schoolDistance: house.nearest_dist[Facility.school]?.dist,
        sewageTreatmentDistance: house.nearest_dist[Facility.water_facility]?.dist,
        waterBodyDistance: 0,
      },
    });
  });

  Object.keys(geoResponse.old.facilities).forEach((facilityType: string) => {
    // @ts-ignore
    Object.keys(geoResponse.old.facilities[facilityType]).forEach(
      (facilityUUID) => {
        const { central_point } =
          // @ts-ignore
          geoResponse.old.facilities[facilityType][facilityUUID];
        geoData.push({
          // @ts-ignore
          type: FacilityToGeoDataTypeMap[facilityType],
          key: facilityUUID,
          centralPoint: new Vector3(central_point.lat, 0, central_point.long),
        });
      }
    );
  });

  return geoData;
}
