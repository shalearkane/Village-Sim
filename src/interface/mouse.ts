import { GeoDataPoint } from "./geo";

export interface MouseControl {
  x: number;
  y: number;
  z: number;
  clickInfo?: {
    geoDataPoint: GeoDataPoint;
  };
}
