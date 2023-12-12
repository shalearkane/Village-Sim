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
  type: GeoDataType.RESIDENTIAL;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface Hospital {
  type: GeoDataType.HOSPITAL;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface Agricultural {
  type: GeoDataType.AGRICULTURAL;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface WaterBody {
  type: GeoDataType.WATER_BODY;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface Commercial {
  type: GeoDataType.COMMERCIAL;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface Industrial {
  type: GeoDataType.INDUSTRIAL;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface School {
  type: GeoDataType.SCHOOL;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface Health {
  type: GeoDataType.HEALTH;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
  metadata: Metadata;
}

export interface SewageTreatment {
  type: GeoDataType.SEWAGE_TREATMENT;
  boundaryPoints: Coordinate[];
  centralPoint: Coordinate;
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
