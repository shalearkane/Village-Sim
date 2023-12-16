import { GeoDataType } from "./geo";

export interface FilterOptions {
  [GeoDataType.HOSPITAL]: boolean;
  [GeoDataType.INDUSTRIAL]: boolean;
  [GeoDataType.SCHOOL]: boolean;
  [GeoDataType.SEWAGE_TREATMENT]: boolean;
  [GeoDataType.COMMERCIAL]: boolean;
  [GeoDataType.ROAD]: boolean;
}
