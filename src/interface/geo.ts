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
  "WATER_BODY" = "WATER_BODY",
}

export interface Metadata {
  roadDistance: number;
  residentialDistance: number;
  hospitalDistance: number;
  agriculturalDistance: number;
  commercialDistance: number;
  industrialDistance: number;
  schoolDistance: number;
  healthDistance: number;
  sewageTreatmentDistance: number;
  waterBodyDistance: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Road {
  type: GeoDataType.ROAD;
  steps: Coordinate[];
  metadata: Metadata;
}

export interface Residential {
  types: GeoDataType.RESIDENTIAL;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export interface Hospital {
  types: GeoDataType.HOSPITAL;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export interface Agricultural {
  types: GeoDataType.AGRICULTURAL;
  boundaryPoints: Coordinate[];
  metadata: Metadata;
}

export interface WaterBody {
  types: GeoDataType.WATER_BODY;
  boundaryPoints: Coordinate[];
  metadata: Metadata;
}

export interface Commercial {
  types: GeoDataType.COMMERCIAL;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export interface Industrial {
  types: GeoDataType.INDUSTRIAL;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export interface School {
  types: GeoDataType.SCHOOL;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export interface Health {
  types: GeoDataType.HEALTH;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export interface SewageTreatment {
  types: GeoDataType.SEWAGE_TREATMENT;
  centerPoint: Coordinate;
  metadata: Metadata;
}

export type GeoDataPoint =
  | Road
  | Residential
  | Hospital
  | Agricultural
  | Commercial
  | Industrial
  | School
  | Health
  | SewageTreatment
  | WaterBody;

export type GeoData = GeoDataPoint[];
