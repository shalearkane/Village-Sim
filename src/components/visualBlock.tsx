import { useContext, useEffect, useState } from "react";
import {
  CacheKeyContext,
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
import { Facility, GeoResponse, Happiness } from "../interface/geoResponse";
import { geoDataToGeoResponse, geoResposeToGeoData } from "../utils/geo";
import axios from "axios";

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
  const cacheKey = useContext(CacheKeyContext);

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
    if (!safe) {
      document?.getElementById("no_safe_area")?.click();
      return;
    }
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

  const addObject = async (point: THREE.Vector3) => {
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
    setCostData({
      ...costData,
      budget: newBudget,
      moneyUsed: (costData.moneyUsed || 0) + (costData[selectedTool] || 0),
    });
    let data = [...geoStore.data, newPoint];
    const terrainMap = getTerrainMap(data);

    const addNewObjectRequest: GeoResponse = geoDataToGeoResponse(
      data,
      {
        key: "",
        facility_type: selectedTool,
        central_point: {
          lat: point.x,
          long: point.z,
        },
      },
      {
        x: geoStore.buffer.x,
        y: geoStore.buffer.y,
      }
    );

    setGeoStore({ ...geoStore, data, terrainMap });

    const response: {
      data: { data: GeoResponse; avg_happiness: number; happiness: Happiness };
    } = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/happiness?cache=${cacheKey}`,
      addNewObjectRequest
    );

    if (response.data) {
      const normalizedNewData = geoResposeToGeoData(response.data.data);

      geoStore.data.forEach((point: GeoDataPoint) => {
        if (point.type == GeoDataType.ROAD) normalizedNewData.data.push(point);
      });

      const newTerrainMap = getTerrainMap(normalizedNewData.data);

      setGeoStore({
        ...geoStore,
        data: normalizedNewData.data,
        terrainMap: newTerrainMap,
        happiness: response.data.happiness,
        avg_happiness: response.data.avg_happiness * 100000,
      });
    }
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
          position={[mouseControl.x, -0.3, mouseControl.z]}
          rotation={[-1.57, 0, 0]}
          onClick={(event) => {
            event.stopPropagation();
            const d = new Date();
            if (d.getTime() - mouseControl.camPos.time >= 200) {
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
              if (!safe) {
                document?.getElementById("no_safe_area")?.click();
                return;
              }
              event.stopPropagation();
              const d = new Date();
              if (d.getTime() - mouseControl.camPos.time >= 200)
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
                position={[roadPoint.x, -0.4, roadPoint.z]}
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
