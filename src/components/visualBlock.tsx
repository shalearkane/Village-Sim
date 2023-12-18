import { useContext, useEffect, useState } from "react";
import { CostDataContext, GeoStoreContext, MouseControlContext, ToolbarContext } from "../App";
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
  // @ts-ignore
  const { costData, setCostData } = useContext(CostDataContext);

  const [safe, setSafe] = useState<Boolean>(false);
  const [roadPoints, setRoadPoints] = useState<THREE.Vector3[]>([]);

  // const checkIfSafe = () => {};

  useEffect(() => {
    if (
      selectedTool == Toolbar.HOSPITAL ||
      selectedTool == Toolbar.RESIDENTIAL ||
      selectedTool == Toolbar.SCHOOL ||
      selectedTool == Toolbar.SEWAGE_TREATMENT ||
      selectedTool == Toolbar.ELECTRICITY ||
      selectedTool == Toolbar.ADMINISTRATION ||
      selectedTool == Toolbar.COMMERCIAL ||
      selectedTool == Toolbar.INDUSTRIAL ||
      selectedTool == Toolbar.ROAD
    ) {
      setSafe(checkSafe(geoStore.terrainMap, mouseControl, selectedTool));
    }
  }, [mouseControl]);

  const addObject = (point: THREE.Vector3) => {
    point.y = 0;
    const newPoint: GeoDataPoint = {
      key: generateUUID(),
      type: selectedTool,
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
        sewageTreatmentDistance: 0,
        waterBodyDistance: 0,
      },
    };

    const newBudget = costData.budget - costData[selectedTool];
    setCostData({...costData, budget: newBudget});
    let data = [...geoStore.data, newPoint];
    const terrainMap = getTerrainMap(data);
    setGeoStore({ ...geoStore, data, terrainMap });
  };

  const addRoad = (points: THREE.Vector3[]) => {
    const newRoad : GeoDataPoint = {
      key: generateUUID(),
      type: GeoDataType.ROAD,
      steps: points,
      metadata: {
        roadDistance: 0,
        residentialDistance: 0,
        hospitalDistance: 0,
        agriculturalDistance: 0,
        commercialDistance: 0,
        industrialDistance: 0,
        schoolDistance: 0,
        sewageTreatmentDistance: 0,
        waterBodyDistance: 0,
      },
    }

    console.log(newRoad);
  
    let data = [...geoStore.data, newRoad];
    const terrainMap = getTerrainMap(data);
    setGeoStore({ ...geoStore, data, terrainMap });

    setRoadPoints([]);
  }

  return (
    <>
      {(selectedTool == Toolbar.HOSPITAL ||
        selectedTool == Toolbar.RESIDENTIAL ||
        selectedTool == Toolbar.SCHOOL ||
        selectedTool == Toolbar.SEWAGE_TREATMENT ||
        selectedTool == Toolbar.ELECTRICITY ||
        selectedTool == Toolbar.ADMINISTRATION ||
        selectedTool == Toolbar.COMMERCIAL ||
        selectedTool == Toolbar.INDUSTRIAL) && (
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
      {(selectedTool == Toolbar.ROAD) && (
        <>
          <mesh
            position={[mouseControl.x, -0.5, mouseControl.z]}
            rotation={[-1.57, 0, 0]}
            onClick={(event) => {
              event.stopPropagation();
              if (safe) setRoadPoints([...roadPoints, event.point]);
            }}
            onDoubleClick={() => {
              addRoad(roadPoints);
            }}
          >
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial
              transparent
              opacity={0.5}
              color={safe ? "green" : "red"}
            />
          </mesh>
        </>
      )}
    </>
  );
}

export default VisualBlock;
