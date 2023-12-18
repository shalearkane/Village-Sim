import { GeoDataPoint } from "./geo";

export interface MouseControl {
  x: number;
  y: number;
  z: number;
  clickInfo?: {
    geoDataPoint: GeoDataPoint;
  };
  camPos: {
    x: number;
    y: number;
    z: number;
    time: number;
  };
  newCameraPos?: {
    x: number;
    z: number;
  };
}
