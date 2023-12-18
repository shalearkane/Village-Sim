export interface DataPoint {
  code: number;
  count: number;
  gpCount: number;
  level: string;
  name: string;
  updatedGpCount: number;
}

export interface DataPointResponse {
  data: DataPoint[];
}

export interface StateMap {
  [key: number]: string;
}

export interface ReverseStateMap {
  [key: string]: number;
}

export interface StoreFormat {
  map: StateMap;
  reverseMap: ReverseStateMap;
}

export interface StateStore {
  blocks: StoreFormat;
  districts: StoreFormat;
  gramPanchayat: StoreFormat;
  shpFile: File | null;
  prjFile: File | null;
  dbfFile: File | null;
}

export interface LoadingState {
  districts: boolean;
  blocks: boolean;
  gramPanchayat: boolean;
}
