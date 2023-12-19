import { Boundaries, GeoData, GeoDataType } from "./geo";

export interface GeoResponse {
  old: OldGeoSchema;
  new: NewGeoSchema;
}

export interface Happiness {
  [Facility.administrative]: number;
  [Facility.electric_facility]: number;
  [Facility.healthcare]: number;
  [Facility.sanitation]: number;
  [Facility.school]: number;
  [Facility.water_facility]: number;
}

export interface OldGeoSchema {
  houses: HouseMap;
  facilities: FacilityMap;
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
  nearest_dist?: {
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
  [Facility.house]?: FacilityMapData;
  [Facility.road]?: FacilityMapData;
}

export enum Facility {
  "administrative" = "administrative",
  "water_facility" = "water_facility",
  "electric_facility" = "electric_facility",
  "healthcare" = "healthcare",
  "sanitation" = "sanitation",
  "school" = "school",
  "house" = "house",
  "road" = "road",
}

export interface NewGeoSchema {
  key: string;
  facility_type: Facility;
  central_point: CentralPoint;
}

export const FacilityToGeoDataTypeMap = {
  administrative: GeoDataType.ADMINISTRATION,
  water_facility: GeoDataType.WATER_SUPPLY,
  electric_facility: GeoDataType.ELECTRICITY,
  healthcare: GeoDataType.HOSPITAL,
  sanitation: GeoDataType.SEWAGE_TREATMENT,
  school: GeoDataType.SCHOOL,
};

export const GeoDataTypeToFacility = {
  [GeoDataType.ADMINISTRATION]: "administrative",
  [GeoDataType.WATER_SUPPLY]: "water_facility",
  [GeoDataType.ELECTRICITY]: "electric_facility",
  [GeoDataType.HOSPITAL]: "healthcare",
  [GeoDataType.SEWAGE_TREATMENT]: "sanitation",
  [GeoDataType.SCHOOL]: "school",
};

export interface NormalizedGeoStore {
  data: GeoData;
  buffer: {
    x: number;
    y: number;
  };
  bounds: Boundaries;
}

export interface OptimalSolution {
  administrative: {
    x: number;
    y: number;
  };
  electric_facility: {
    x: number;
    y: number;
  };
  healthcare: {
    x: number;
    y: number;
  };
  sanitation: {
    x: number;
    y: number;
  };
  school: {
    x: number;
    y: number;
  };
  water_facility: {
    x: number;
    y: number;
  };
  happiness: number;
}