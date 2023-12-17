import { GeoDataType } from "./geo";

export interface FilterOptions {
  [GeoDataType.HOSPITAL]: boolean;
  [GeoDataType.INDUSTRIAL]: boolean;
  [GeoDataType.SCHOOL]: boolean;
  [GeoDataType.SEWAGE_TREATMENT]: boolean;
  [GeoDataType.COMMERCIAL]: boolean;
  [GeoDataType.ROAD]: boolean;
  [GeoDataType.ELECTRICITY]: boolean;
  [GeoDataType.ADMINISTRATION]: boolean;
  [GeoDataType.WATER_SUPPLY]: boolean;
  YOUR_POSITION: boolean;
}
