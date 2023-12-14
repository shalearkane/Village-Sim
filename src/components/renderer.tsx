import {
  GeoStoreContext,
  MouseControlContext,
  Shadows,
  ToolbarContext,
} from "../App";
import {
  GeoData,
  GeoDataPoint,
  GeoDataType,
  RoadTerrain,
} from "../interface/geo";
import { Center } from "@react-three/drei";
import { Toolbar } from "../interface/toolbar";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader, LineGeometry } from "three/examples/jsm/Addons.js";
import {
  getRoadTerrainFromGeoData,
  getTerrainCoordinateArray,
} from "../utils/terrain";
import * as THREE from "three";

export function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene.clone(true)} />;
}

export default function GenerateObjects({ GeoData }: { GeoData: GeoData }) {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);

  const [visibleGeoData, setVisibleGeoData] = useState<GeoData>([]);

  const deleteBlock = (key: string) => {
    const newGeoData: GeoData = [];
    geoStore.data.forEach((point: GeoDataPoint) => {
      if (point.key != key) {
        newGeoData.push(point);
      }
    });

    setGeoStore({ ...geoStore, data: newGeoData });
  };

  const handleClick = (key: string) => {
    switch (selectedTool) {
      case Toolbar.DELETE: {
        deleteBlock(key);
      }
    }
  };

  const checkAcceptedArea = () => {
    const coordinateArray = getTerrainCoordinateArray(
      mouseControl.x,
      mouseControl.y,
      GeoDataType.TERRAIN_VIEWPOINT
    );
    let terrainMap: { [key: string]: boolean } = {};
    coordinateArray.forEach((point: string) => {
      terrainMap[point] = true;
    });
    const visibleGeoData: GeoData = [];

    geoStore.data.forEach((point: GeoDataPoint) => {
      if (point.type !== GeoDataType.ROAD) {
        const coordinate = `${Math.floor(point.centralPoint.x)},${Math.floor(
          point.centralPoint.y
        )}`;
        if (terrainMap[coordinate] && terrainMap[coordinate]) {
          visibleGeoData.push(point);
        }
      }
    });

    setVisibleGeoData(visibleGeoData);
  };

  useEffect(() => {
    checkAcceptedArea();
  }, [mouseControl]);

  return visibleGeoData.map((GeoDataPoint: GeoDataPoint) => {
    switch (GeoDataPoint.type) {
      case GeoDataType.ROAD: {
        const roadSteps = getRoadTerrainFromGeoData(GeoDataPoint.steps, 4);
        return (
          <>
            {roadSteps.map((step: RoadTerrain, stepIndex: number) => {
              return (
                <mesh
                  key={`RoadStep_${stepIndex}_${GeoDataPoint.key}`}
                  position={[
                    step.centralCoordinate.x,
                    step.centralCoordinate.y,
                    step.centralCoordinate.z,
                  ]}
                  rotation={step.rotation}
                >
                  <planeGeometry args={[step.distance, 2]} />
                  <meshStandardMaterial
                    // transparent
                    // opacity={0.5}
                    color={"grey"}
                  />
                </mesh>
              );
            })}
            ;
          </>
        );
        // renderedElements.push(<Center top position={[, 0, 2]}>
        //     <mesh castShadow>
        //       <sphereGeometry args={[0.5, 64, 64]} />
        //       <meshStandardMaterial color="#9d4b4b" />
        //     </mesh>
        //   </Center>)
        // break;
      }
      case GeoDataType.RESIDENTIAL: {
        return (
          <Center
            castShadow={true}
            onClick={(event) => {
              event.stopPropagation();
              handleClick(GeoDataPoint.key);
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            {/* <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh> */}
            <Model url={"assets/residential/Houses.glb"} />
            {/* <Shadows /> */}
          </Center>
        );
      }
      case GeoDataType.HOSPITAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.AGRICULTURAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.COMMERCIAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.INDUSTRIAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.SCHOOL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.HEALTH: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.SEWAGE_TREATMENT: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.WATER_BODY: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
    }
  });
}
