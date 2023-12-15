import { GeoDataType } from "../interface/geo";

export const BLOCK = {
  ROAD: 0,
  BUILDING: 1,
  HOSPITAL: 2,
  SCHOOL: 3,
};

export const BLOCK_TERRAIN_RADIUS = {
  [GeoDataType.HOSPITAL]: 2,
  [GeoDataType.SCHOOL]: 1,
  [GeoDataType.RESIDENTIAL]: 0.5,
  [GeoDataType.COMMERCIAL]: 0.5,
  [GeoDataType.INDUSTRIAL]: 2,
  [GeoDataType.HEALTH]: 0.5,
  [GeoDataType.SEWAGE_TREATMENT]: 3,
  [GeoDataType.AGRICULTURAL]: 5,
  [GeoDataType.ROAD]: 0.1,
  [GeoDataType.WATER_BODY]: 1,
  [GeoDataType.TERRAIN_VIEWPOINT]: 20,
};

export const BLOCK_THRESHOLD = {
  HOSPITAL: 150,
  SCHOOL: 100,
};
