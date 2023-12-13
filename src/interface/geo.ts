import { Vector3 } from "three";

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

export interface Road {
  id: string;
  type: GeoDataType.ROAD;
  steps: Vector3[];
  metadata: Metadata;
}

export interface Residential {
  id: string;
  type: GeoDataType.RESIDENTIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Hospital {
  id: string;
  type: GeoDataType.HOSPITAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Agricultural {
  id: string;
  type: GeoDataType.AGRICULTURAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface WaterBody {
  id: string;
  type: GeoDataType.WATER_BODY;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Commercial {
  id: string;
  type: GeoDataType.COMMERCIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Industrial {
  id: string;
  type: GeoDataType.INDUSTRIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface School {
  id: string;
  type: GeoDataType.SCHOOL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface Health {
  id: string;
  type: GeoDataType.HEALTH;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata: Metadata;
}

export interface SewageTreatment {
  id: string;
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
