import { GeoDataType } from "./geo";

export interface InitialCostData {
  set: boolean;
  budget: number;
  [GeoDataType.ADMINISTRATION]: number;
  [GeoDataType.COMMERCIAL]: number;
  [GeoDataType.ELECTRICITY]: number;
  [GeoDataType.HOSPITAL]: number;
  [GeoDataType.INDUSTRIAL]: number;
  [GeoDataType.SCHOOL]: number;
  [GeoDataType.WATER_SUPPLY]: number;
}

export interface InitialStateForm {
  stateId: number;
  districtId: number;
  blockId: number;
  gramId: number;
  shpFile: File | null;
  prjFile: File | null;
}
