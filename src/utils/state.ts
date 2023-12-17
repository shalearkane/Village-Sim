import {
  DataPoint,
  ReverseStateMap,
  StateMap,
  StoreFormat,
} from "../interface/state";

export function convertDataPointToStoreFormat(
  dataPoints: DataPoint[],
  gp?: boolean
): StoreFormat {
  let map: StateMap = {};
  let reverseMap: ReverseStateMap = {};

  dataPoints.forEach((point: DataPoint) => {
    map[gp ? point.gpCount : point.code] = point.name;
    reverseMap[point.name] = gp ? point.gpCount : point.code;
  });

  return { map, reverseMap };
}
