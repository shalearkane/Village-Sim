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
import { CatmullRomLine, Center } from "@react-three/drei";
import { Toolbar } from "../interface/toolbar";
import { useContext, useEffect, useMemo, useState } from "react";
import { Vector3, useLoader } from "@react-three/fiber";
import { GLTFLoader, LineGeometry } from "three/examples/jsm/Addons.js";
import {
  getRoadCoordinates,
  getTerrainCoordinateArray,
} from "../utils/terrain";
import * as THREE from "three";

export function Model({ url, scale }: { url: string; scale?: THREE.Vector3 }) {
  const gltf = useLoader(GLTFLoader, url);
  const scaleX = scale ? scale.x : 1;
  const scaleY = scale ? scale.y : 1;
  const scaleZ = scale ? scale.z : 1;

  const clonedScene = gltf.scene.clone(true);
  clonedScene.scale.set(
    scaleX * gltf.scene.scale.x,
    scaleY * gltf.scene.scale.y,
    scaleZ * gltf.scene.scale.z
  );
  return <primitive object={clonedScene} />;
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
          point.centralPoint.z
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
        const roadCoordinates: Vector3[][] = getRoadCoordinates(
          GeoDataPoint.steps,
          2
        );
        roadCoordinates.map((point: Array<Vector3>) => {
          return (
            <CatmullRomLine
              // @ts-ignore
              points={point}
              lineWidth={3}
              color={"grey"}
            />
          );
        });
        break;
      }
      case GeoDataType.RESIDENTIAL: {
        if (GeoDataPoint.floors == 1) {
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
              <Model url={"assets/residential/house-1.glb"} />
            </Center>
          );
        } else if (GeoDataPoint.floors == 2) {
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
              <Model url={"assets/residential/house-2.glb"} />
            </Center>
          );
        }
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
            {/* <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh> */}
            <Model
              scale={new THREE.Vector3(0.5, 0.5, 0.5)}
              url={"assets/hospital_health/1.glb"}
            />
          </Center>
        );
      }
      case GeoDataType.AGRICULTURAL: {
        const shape = new THREE.Shape();
        GeoDataPoint.boundaryPoints.forEach((coordinate: THREE.Vector3) => {
          shape.lineTo(coordinate.x, coordinate.z);
        })
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
            rotation={new THREE.Euler(-1.57, 0, 0)}
          >
            <mesh castShadow>
              <shapeGeometry args={[shape]}/>
              <meshBasicMaterial color="yellow"/> 
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
        const shape = new THREE.Shape();
        GeoDataPoint.boundaryPoints.forEach((coordinate: THREE.Vector3) => {
          shape.lineTo(coordinate.x, coordinate.z);
        })
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
            rotation={new THREE.Euler(-1.57, 0, 0)}
          >
            <mesh castShadow>
              <shapeGeometry args={[shape]}/>
              <meshBasicMaterial color="blue"/> 
            </mesh>
          </Center>
        );
      }
    }
  })
}
