import { useContext, useEffect, useState } from "react";
import { GeoStoreContext, MouseControlContext, ToolbarContext } from "../App";
import * as THREE from "three";
import { checkSafe, getTerrainMap } from "../utils/terrain";
import { Toolbar } from "../interface/toolbar";
import { generateUUID } from "three/src/math/MathUtils.js";
import { GeoDataPoint, GeoDataType } from "../interface/geo";

function VisualBlock() {
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);

  const [safe, setSafe] = useState<Boolean>(false);

  // const checkIfSafe = () => {};

  useEffect(() => {
    if (
      selectedTool == Toolbar.HOSPITAL ||
      selectedTool == Toolbar.RESIDENTIAL
    ) {
      setSafe(checkSafe(geoStore.terrainMap, mouseControl, selectedTool));
    }
  }, [mouseControl]);

  const addObject = (point: THREE.Vector3) => {
    point.y = 0;
    const newPoint: GeoDataPoint = {
      key: generateUUID(),
      type: GeoDataType.HOSPITAL,
      boundaryPoints: [new THREE.Vector3(0.5, 0.5, 0)],
      centralPoint: point,
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
    };

    let data = geoStore.data.concat(newPoint);
    setGeoStore({ ...geoStore, data, terrainMap: getTerrainMap(data) });
  };

  return (
    <>
      {(selectedTool == Toolbar.HOSPITAL ||
        selectedTool == Toolbar.RESIDENTIAL) && (
        <mesh
          position={[mouseControl.x, -0.5, mouseControl.z]}
          rotation={[-1.57, 0, 0]}
          onDoubleClick={(event) => {
            event.stopPropagation();
            if (safe) addObject(event.point);
          }}
        >
          <planeGeometry args={[4, 4]} />
          <meshStandardMaterial
            transparent
            opacity={0.5}
            color={safe ? "green" : "red"}
          />
        </mesh>
      )}
    </>
  );
}

export default VisualBlock;