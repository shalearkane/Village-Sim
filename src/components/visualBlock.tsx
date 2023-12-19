import { useContext, useEffect, useState } from "react";
import {
  CostDataContext,
  GeoStoreContext,
  MouseControlContext,
  ToolbarContext,
} from "../App";
import * as THREE from "three";
import { checkSafe, getTerrainMap } from "../utils/terrain";
import { Toolbar } from "../interface/toolbar";
import { generateUUID } from "three/src/math/MathUtils.js";
import { GeoDataPoint, GeoDataType } from "../interface/geo";
import { Circle } from "@react-three/drei";
import { Facility } from "../interface/geoResponse";

function VisualBlock() {
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);
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

  const handleClick = (point: THREE.Vector3) => {
    const modal = document?.getElementById("confirm_modal");
    modal?.click();
    const modalButton = document?.getElementById("confirm_button");
    modalButton?.addEventListener("click", () => {
      addObject(point);
    });
  };

  const dummyMetadata = {
    id: "",
    dist: 0,
  };

  const addObject = (point: THREE.Vector3) => {
    point.y = 0;
    const newPoint: GeoDataPoint = {
      key: generateUUID(),
      type: selectedTool,
      boundaryPoints: [new THREE.Vector3(0.5, 0.5, 0)],
      centralPoint: point,
      metadata: {
        [Facility.administrative]: dummyMetadata,
        [Facility.electric_facility]: dummyMetadata,
        [Facility.healthcare]: dummyMetadata,
        [Facility.sanitation]: dummyMetadata,
        [Facility.school]: dummyMetadata,
        [Facility.water_facility]: dummyMetadata,
      },
    };

    const newBudget =
      costData.budget - (costData[selectedTool] ? costData[selectedTool] : 0);
    setCostData({ ...costData, budget: newBudget });
    let data = [...geoStore.data, newPoint];
    const terrainMap = getTerrainMap(data);
    setGeoStore({ ...geoStore, data, terrainMap });
  };

  const addRoad = (points: THREE.Vector3[]) => {
    const newRoad: GeoDataPoint = {
      key: generateUUID(),
      type: GeoDataType.ROAD,
      steps: points,
      metadata: {
        [Facility.administrative]: dummyMetadata,
        [Facility.electric_facility]: dummyMetadata,
        [Facility.healthcare]: dummyMetadata,
        [Facility.sanitation]: dummyMetadata,
        [Facility.school]: dummyMetadata,
        [Facility.water_facility]: dummyMetadata,
      },
    };

    let data = [...geoStore.data, newRoad];
    const terrainMap = getTerrainMap(data);
    setGeoStore({ ...geoStore, data, terrainMap });

    setRoadPoints([]);
  };

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
          onClick={(event) => {
            event.stopPropagation();
            const d = new Date();
            if (safe && d.getTime() - mouseControl.camPos.time >= 200) {
              handleClick(event.point);
            }
          }}
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            transparent
            opacity={0.5}
            color={safe ? "green" : "red"}
          />
        </mesh>
      )}
      {selectedTool == Toolbar.ROAD && (
        <>
          <mesh
            position={[mouseControl.x, -0.5, mouseControl.z]}
            rotation={[-1.57, 0, 0]}
            onClick={(event) => {
              event.stopPropagation();
              const d = new Date();
              if (safe && d.getTime() - mouseControl.camPos.time >= 200)
                setRoadPoints([...roadPoints, event.point]);
            }}
            onDoubleClick={() => {
              addRoad(roadPoints);
            }}
          >
            <planeGeometry args={[3, 3]} />
            <meshStandardMaterial
              transparent
              opacity={0.5}
              color={safe ? "green" : "red"}
            />
          </mesh>
          {roadPoints.map((roadPoint: THREE.Vector3) => {
            return (
              <mesh
                position={[roadPoint.x, -0.5, roadPoint.z]}
                rotation={[-1.57, 0, 0]}
              >
                <Circle args={[0.1, 32, 0, Math.PI * 2]} />
                <meshStandardMaterial transparent opacity={0.9} color="red" />
              </mesh>
            );
          })}
        </>
      )}
    </>
  );
}

export default VisualBlock;
