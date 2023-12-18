import { GeoDataType } from "./geo";

export interface RootResponse {
  old: OldGeoSchema;
  new: NewGeoSchema;
}

export interface OldGeoSchema {
  houses: HouseMap;
  facilites: FacilityMap;
}

export interface HouseMap {
  [key: string]: House;
}

export interface NearestDistMetaData {
  id: string;
  dist: number;
}

export interface House {
  floors: number;
  central_point: CentralPoint;
  nearest_dist: {
    [Facility.administrative]: NearestDistMetaData;
    [Facility.electric_facility]: NearestDistMetaData;
    [Facility.healthcare]: NearestDistMetaData;
    [Facility.sanitation]: NearestDistMetaData;
    [Facility.school]: NearestDistMetaData;
    [Facility.water_facility]: NearestDistMetaData;
  };
}

export interface CentralPoint {
  long: number;
  lat: number;
}

export interface FacilityMapData {
  [key: string]: { central_point: CentralPoint };
}

export interface FacilityMap {
  [Facility.administrative]: FacilityMapData;
  [Facility.electric_facility]: FacilityMapData;
  [Facility.healthcare]: FacilityMapData;
  [Facility.sanitation]: FacilityMapData;
  [Facility.school]: FacilityMapData;
  [Facility.water_facility]: FacilityMapData;
}

export enum Facility {
  "administrative" = "administrative",
  "water_facility" = "water_facility",
  "electric_facility" = "electric_facility",
  "healthcare" = "healthcare",
  "sanitation" = "sanitation",
  "school" = "school",
}

export interface NewGeoSchema {
  key: string;
  facility_type: Facility;
  central_point: CentralPoint;
}

export interface FacilityToGeoDataTypeMap {
  administrative: GeoDataType.ADMINISTRATION;
  water_facility: GeoDataType.WATER_SUPPLY;
  electric_facility: GeoDataType.ELECTRICITY;
  healthcare: GeoDataType.HOSPITAL;
  sanitation: GeoDataType.SEWAGE_TREATMENT;
  school: GeoDataType.SCHOOL;
}

export interface GeoDataTypeToFacility {
  [GeoDataType.ADMINISTRATION]: "administrative";
  [GeoDataType.WATER_SUPPLY]: "water_facility";
  [GeoDataType.ELECTRICITY]: "electric_facility";
  [GeoDataType.HOSPITAL]: "healthcare";
  [GeoDataType.SEWAGE_TREATMENT]: "sanitation";
  [GeoDataType.SCHOOL]: "school";
}
