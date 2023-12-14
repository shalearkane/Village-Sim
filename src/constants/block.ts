import { GeoDataType } from "../interface/geo";

export const BLOCK = {
  ROAD: 0,
  BUILDING: 1,
  HOSPITAL: 2,
  SCHOOL: 3,
};

export const BLOCK_TERRAIN_RAIUS = {
  [GeoDataType.HOSPITAL]: 10,
  [GeoDataType.SCHOOL]: 5,
  [GeoDataType.RESIDENTIAL]: 2,
  [GeoDataType.COMMERCIAL]: 2,
  [GeoDataType.INDUSTRIAL]: 5,
  [GeoDataType.HEALTH]: 2,
  [GeoDataType.SEWAGE_TREATMENT]: 5,
  [GeoDataType.AGRICULTURAL]: 10,
  [GeoDataType.ROAD]: 1,
  [GeoDataType.WATER_BODY]: 5,
};

export const BLOCK_THRESHOLD = {
  HOSPITAL: 150,
  SCHOOL: 100,
};
