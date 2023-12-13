import { Vector3 } from "three";
import { GeoData, GeoDataType } from "./interface/geo";
import { generateUUID } from "three/src/math/MathUtils.js";

export let dummyData: GeoData = [
  {
    key: generateUUID(),
    type: GeoDataType.RESIDENTIAL,
    boundaryPoints: [new Vector3(0, 0, 0)],
    centralPoint: new Vector3(0, 0, 0),
    metadata: {
      roadDistance: 0,
      residentialDistance: 0,
      hospitalDistance: 0,
      agriculturalDistance: 0,
      commercialDistance: 0,
      industrialDistance: 0,
      schoolDistance: 0,
      healthDistance: 0,
      sewageTreatmentDistance: 0,
      waterBodyDistance: 0,
    },
  },
  {
    key: generateUUID(),
    type: GeoDataType.RESIDENTIAL,
    boundaryPoints: [new Vector3(1, 1, 0)],
    centralPoint: new Vector3(1, 1, 0),
    metadata: {
      roadDistance: 0,
      residentialDistance: 0,
      hospitalDistance: 0,
      agriculturalDistance: 0,
      commercialDistance: 0,
      industrialDistance: 0,
      schoolDistance: 0,
      healthDistance: 0,
      sewageTreatmentDistance: 0,
      waterBodyDistance: 0,
    },
  },
  {
    key: generateUUID(),
    type: GeoDataType.RESIDENTIAL,
    boundaryPoints: [new Vector3(2, 2, 0)],
    centralPoint: new Vector3(2, 2, 0),
    metadata: {
      roadDistance: 0,
      residentialDistance: 0,
      hospitalDistance: 0,
      agriculturalDistance: 0,
      commercialDistance: 0,
      industrialDistance: 0,
      schoolDistance: 0,
      healthDistance: 0,
      sewageTreatmentDistance: 0,
      waterBodyDistance: 0,
    },
  },
];
