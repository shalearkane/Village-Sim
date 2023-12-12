export enum GeoDataType {
  "ROAD" = "ROAD",
  "RESIDENTIAL" = "RESIDENTIAL",
  "HOSPITAL" = "HOSPITAL",
  "AGRICULTURAL" = "AGRICULTURAL",
  "COMMERCIAL" = "COMMERCIAL",
  "INDUSTRIAL" = "INDUSTRIAL",
  "SCHOOL" = "SCHOOL",
  "HEALTH" = "HEALTH",
  "SEWAGE_TREATMENT" = "SEWAGE_TREATMENT",
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Road {
  type: GeoDataType.ROAD;
  steps: Coordinate[];
}

export interface Residential {
  types: GeoDataType.RESIDENTIAL;
  centerPoint: Coordinate;
}

export interface Hospital {
  types: GeoDataType.HOSPITAL;
  centerPoint: Coordinate;
}

export interface Agricultural {
  types: GeoDataType.AGRICULTURAL;
  centerPoint: Coordinate;
}

export interface Commercial {
  types: GeoDataType.COMMERCIAL;
  centerPoint: Coordinate;
}

export interface Industrial {
  types: GeoDataType.INDUSTRIAL;
  centerPoint: Coordinate;
}

export interface School {
  types: GeoDataType.SCHOOL;
  centerPoint: Coordinate;
}

export interface Health {
  types: GeoDataType.HEALTH;
  centerPoint: Coordinate;
}

export interface SewageTreatment {
  types: GeoDataType.SEWAGE_TREATMENT;
  centerPoint: Coordinate;
}

export type GeoData =
  | Road
  | Residential
  | Hospital
  | Agricultural
  | Commercial
  | Industrial
  | School
  | Health
  | SewageTreatment;
