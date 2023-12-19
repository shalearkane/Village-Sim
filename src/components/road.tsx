import { useContext } from "react";
import { GeoStoreContext } from "../App";
import { GeoDataPoint, GeoDataType } from "../interface/geo";
import * as THREE from "three";
import { CatmullRomLine } from "@react-three/drei";
import { getRoadCoordinates } from "../utils/terrain";

function Roads() {
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);

  return geoStore.data.map((GeoDataPoint: GeoDataPoint) => {
    switch (GeoDataPoint.type) {
      case GeoDataType.ROAD: {
        const roadCoordinates: THREE.Vector3[][] = getRoadCoordinates(
          GeoDataPoint.steps,
          2
        );

        return roadCoordinates.map((point: Array<THREE.Vector3>) => {
          return (
            <CatmullRomLine
              // @ts-ignore
              points={point}
              color={0x6b6b74}
              lineWidth={3}
            />
          );
        });
      }
    }
  });
}

export default Roads;
