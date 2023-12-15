import { Euler, Vector3 } from "three";

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

  // Just for internal use
  "TERRAIN_VIEWPOINT" = "TERRAIN_VIEWPOINT",
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

export interface Road {
  key: string;
  type: GeoDataType.ROAD;
  steps: Vector3[];
  metadata: Metadata;
}

export interface Residential {
  key: string;
  type: GeoDataType.RESIDENTIAL;
  floors: number;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Hospital {
  key: string;
  type: GeoDataType.HOSPITAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Agricultural {
  key: string;
  type: GeoDataType.AGRICULTURAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface WaterBody {
  key: string;
  type: GeoDataType.WATER_BODY;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Commercial {
  key: string;
  type: GeoDataType.COMMERCIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Industrial {
  key: string;
  type: GeoDataType.INDUSTRIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface School {
  key: string;
  type: GeoDataType.SCHOOL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Health {
  key: string;
  type: GeoDataType.HEALTH;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface SewageTreatment {
  key: string;
  type: GeoDataType.SEWAGE_TREATMENT;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
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

// Gives me the key of the block in a coordinate x,y
export interface TerrainMap {
  [key: string]: string[];
}

export interface GeoStore {
  terrainMap: TerrainMap;
  data: GeoData;
}

export interface RoadTerrain {
  distance: number;
  startCoordinate: Vector3;
  endCoordinate: Vector3;
  centralCoordinate: Vector3;
  width: number;
  rotation: Euler;
}
