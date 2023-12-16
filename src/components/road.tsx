import { useContext } from "react";
import { GeoStoreContext } from "../App";
import { GeoDataPoint, GeoDataType } from "../interface/geo";
import { Vector3 } from "three";
import { Line } from "@react-three/drei";
import { getRoadCoordinates } from "../utils/terrain";

function Roads() {
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);

  return geoStore.data.map((GeoDataPoint: GeoDataPoint) => {
    switch (GeoDataPoint.type) {
      case GeoDataType.ROAD: {
        const roadCoordinates: Vector3[][] = getRoadCoordinates(
          GeoDataPoint.steps,
          2
        );
        return roadCoordinates.map((point: Array<Vector3>) => {
          return (
            <Line
              // @ts-ignore
              points={point}
              lineWidth={3}
              color={"grey"}
            />
          );
        });
      }
    }
  });
}

export default Roads;
