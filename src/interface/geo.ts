import { Euler, Vector3 } from "three";
import { Facility, Happiness, NearestDistMetaData } from "./geoResponse";

export enum GeoDataType {
  "ROAD" = "ROAD",
  "RESIDENTIAL" = "RESIDENTIAL",
  "HOSPITAL" = "HOSPITAL",
  "AGRICULTURAL" = "AGRICULTURAL",
  "COMMERCIAL" = "COMMERCIAL",
  "INDUSTRIAL" = "INDUSTRIAL",
  "SCHOOL" = "SCHOOL",
  "SEWAGE_TREATMENT" = "SEWAGE_TREATMENT",
  "WATER_SUPPLY" = "WATER_SUPPLY",
  "ADMINISTRATION" = "ADMINISTRATION",
  "ELECTRICITY" = "ELECTRICITY",
  "WATER_BODY" = "WATER_BODY",

  // Just for internal use
  "TERRAIN_VIEWPOINT" = "TERRAIN_VIEWPOINT",
}

export interface Metadata {
  [Facility.administrative]: NearestDistMetaData;
  [Facility.electric_facility]: NearestDistMetaData;
  [Facility.healthcare]: NearestDistMetaData;
  [Facility.sanitation]: NearestDistMetaData;
  [Facility.school]: NearestDistMetaData;
  [Facility.water_facility]: NearestDistMetaData;
}

export interface Road {
  key: string;
  type: GeoDataType.ROAD;
  steps: Vector3[];
  metadata?: Metadata;
}

export interface Residential {
  key: string;
  type: GeoDataType.RESIDENTIAL;
  centralPoint: Vector3;
  metadata?: Metadata;
  boundaryPoints?: Vector3[];
  floors?: number;
}

export interface Hospital {
  key: string;
  type: GeoDataType.HOSPITAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface Agricultural {
  key: string;
  type: GeoDataType.AGRICULTURAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface WaterBody {
  key: string;
  type: GeoDataType.WATER_BODY;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface Commercial {
  key: string;
  type: GeoDataType.COMMERCIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface Industrial {
  key: string;
  type: GeoDataType.INDUSTRIAL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface School {
  key: string;
  type: GeoDataType.SCHOOL;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface SewageTreatment {
  key: string;
  type: GeoDataType.SEWAGE_TREATMENT;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface WaterSupply {
  key: string;
  type: GeoDataType.WATER_SUPPLY;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface Administrative {
  key: string;
  type: GeoDataType.ADMINISTRATION;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export interface Electricity {
  key: string;
  type: GeoDataType.ELECTRICITY;
  boundaryPoints: Vector3[];
  centralPoint: Vector3;
  metadata?: Metadata;
}

export type GeoDataPoint =
  | Road
  | Residential
  | Hospital
  | Agricultural
  | Commercial
  | Industrial
  | School
  | SewageTreatment
  | WaterBody
  | WaterSupply
  | Electricity
  | Administrative;

export type GeoData = GeoDataPoint[];

// Gives me the key of the block in a coordinate x,y
export interface TerrainMap {
  [key: string]: string[];
}

export interface GeoStore {
  terrainMap: TerrainMap;
  data: GeoData;
  buffer: {
    x: number;
    y: number;
  };
  avg_happiness?: number;
  happiness?: Happiness;
}

export interface RoadTerrain {
  distance: number;
  startCoordinate: Vector3;
  endCoordinate: Vector3;
  centralCoordinate: Vector3;
  width: number;
  rotation: Euler;
}

export interface Boundaries {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
