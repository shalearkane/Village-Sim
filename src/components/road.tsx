import { useContext } from "react";
import { GeoStoreContext } from "../App";
import { GeoDataPoint, GeoDataType } from "../interface/geo";
import { Vector3 } from "three";
import { CatmullRomLine } from "@react-three/drei";
import { getRoadCoordinates } from "../utils/terrain";

function Roads() {
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);

  return (
    <>
      {geoStore.data.forEach((geoDataPoint: GeoDataPoint) => {
        if (geoDataPoint.type === GeoDataType.ROAD) {
          const roadCoordinates: Vector3[][] = getRoadCoordinates(
            geoDataPoint.steps,
            2
          );

          return (
            <>
              {roadCoordinates.map((line: Vector3[], lineIndex: number) => {
                console.log("Gello")
                return (
                  <CatmullRomLine
                  key={`Line_${lineIndex}_${geoDataPoint.key}`}
                   
                    points={line}
                    lineWidth={3}
                    color={"grey"}
                  />
                );
              })}
            </>
          );
        }
      })}
    </>
  );
}

export default Roads;
