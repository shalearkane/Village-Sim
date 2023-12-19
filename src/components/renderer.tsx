import {
  CostDataContext,
  GeoStoreContext,
  MouseControlContext,
  ToolbarContext,
} from "../App";
import { GeoData, GeoDataPoint, GeoDataType } from "../interface/geo";
import { CatmullRomLine, Center } from "@react-three/drei";
import { Toolbar } from "../interface/toolbar";
import { useContext, useEffect, useState } from "react";
import { Vector3, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  getRoadCoordinates,
  getTerrainCoordinateArray,
  getTerrainMap,
} from "../utils/terrain";
// @ts-ignore
import { House1Model } from "./models/house1";
// @ts-ignore
import { House2Model } from "./models/house2";
// @ts-ignore
import { Hospital1Model } from "./models/hospital1.jsx";
// @ts-ignore
import { SchoolModel } from "./models/school.jsx";
// @ts-ignore
import { SewageModel } from "./models/sewage.jsx";
// @ts-ignore
import { ElectricityModel } from "./models/electric_facility.jsx";
// @ts-ignore
import { AdministrativeModel } from "./models/administrative.jsx";
// @ts-ignore
import { IndustrialModel } from "./models/industrial.jsx";
// @ts-ignore
import { CommercialModel } from "./models/commercial.jsx";
import * as THREE from "three";
import { MouseControl } from "../interface/mouse";

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

export default function GenerateObjects() {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);
  // @ts-ignore
  const { costData, setCostData } = useContext(CostDataContext);
  // @ts-ignore
  const { mouseControl, setMouseControl } =
    useContext<MouseControl>(MouseControlContext);

  const [visibleGeoData, setVisibleGeoData] = useState<GeoData>([]);

  const deleteBlock = (key: string) => {
    const newGeoData: GeoData = [];
    geoStore.data.forEach((point: GeoDataPoint) => {
      if (point.key != key) {
        newGeoData.push(point);
      } else {
        const newBudget =
          costData.budget + (costData[point.type] ? costData[point.type] : 0);
        setCostData({ ...costData, budget: newBudget, moneyUsed: (costData.moneyUsed || 0) - (costData[[point.type]] || 0) });
      }
    });
    const terrainMap = getTerrainMap(newGeoData);
    setGeoStore({ ...geoStore, data: newGeoData, terrainMap });
  };

  const handleClick = (geoDataPoint: GeoDataPoint) => {
    setMouseControl({
      ...mouseControl,
      clickInfo: {
        ...mouseControl.clickInfo,
        geoDataPoint,
      },
    });
    switch (selectedTool) {
      case Toolbar.DELETE: {
        deleteBlock(geoDataPoint.key);
        break;
      }
      case Toolbar.CURSOR: {
        const modal = document?.getElementById("info_modal");
        modal?.click();
        break;
      }
    }
  };

  const checkAcceptedArea = () => {
    const coordinateArray = getTerrainCoordinateArray(
      mouseControl.camPos.x,
      mouseControl.camPos.z,
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
        if (terrainMap[coordinate]) {
          visibleGeoData.push(point);
        }
      } else {
        const steps: THREE.Vector3[] = [];
        point.steps.forEach((step: THREE.Vector3) => {
          const coordinate = `${Math.floor(step.x)},${Math.floor(step.z)}`;
          if (terrainMap[coordinate]) {
            steps.push(step);
          }
        });

        visibleGeoData.push({ ...point, steps });
      }
    });
    setVisibleGeoData(visibleGeoData);
  };

  useEffect(() => {
    checkAcceptedArea();
  }, [mouseControl.camPos, mouseControl.newCameraPos, geoStore]);

  return (
    <>
      {visibleGeoData.map((GeoDataPoint: GeoDataPoint) => {
        switch (GeoDataPoint.type) {
          case GeoDataType.ROAD: {
            const roadCoordinates: Vector3[][] = getRoadCoordinates(
              GeoDataPoint.steps,
              2
            );
            return roadCoordinates.map((point: Array<Vector3>) => {
              if (point.length > 1)
                return (
                  <CatmullRomLine
                    // @ts-ignore
                    points={point}
                    lineWidth={3}
                    color={"grey"}
                  />
                );
            });
          }
          case GeoDataType.RESIDENTIAL: {
            if (GeoDataPoint.floors == 1) {
              return (
                <Center
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClick(GeoDataPoint);
                  }}
                  key={GeoDataPoint.key}
                  top
                  onBeforeRender={() => {
                    "Hello";
                  }}
                  position={GeoDataPoint.centralPoint}
                >
                  <House1Model />
                </Center>
              );
            } else {
              return (
                <Center
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClick(GeoDataPoint);
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                  }}
                  key={GeoDataPoint.key}
                  top
                  position={GeoDataPoint.centralPoint}
                >
                  <House2Model />
                </Center>
              );
            }
          }
          case GeoDataType.HOSPITAL: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <Hospital1Model scale={new THREE.Vector3(0.5, 0.5, 0.5)} />
              </Center>
            );
          }
          case GeoDataType.AGRICULTURAL: {
            const shape = new THREE.Shape();
            GeoDataPoint.boundaryPoints.forEach((coordinate: THREE.Vector3) => {
              shape.lineTo(coordinate.x, coordinate.z);
            });
            const geometry = new THREE.ShapeGeometry(shape);
            setUV(geometry);

            const texture = useLoader(
              THREE.TextureLoader,
              "/agriculture/pexels-pok-rie-4861069.jpg"
            );

            GeoDataPoint.centralPoint.y = 0.05;

            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
                rotation={new THREE.Euler(-1.57, 0, 0)}
              >
                <mesh geometry={geometry}>
                  <meshStandardMaterial map={texture} />
                </mesh>
              </Center>
            );
          }
          case GeoDataType.COMMERCIAL: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <CommercialModel
                  scale={new THREE.Vector3(0.125, 0.125, 0.125)}
                />
              </Center>
            );
          }
          case GeoDataType.INDUSTRIAL: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <IndustrialModel scale={new THREE.Vector3(0.04, 0.04, 0.04)} />
              </Center>
            );
          }
          case GeoDataType.SCHOOL: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <SchoolModel
                  scale={new THREE.Vector3(0.0015, 0.0015, 0.0015)}
                />
              </Center>
            );
          }
          case GeoDataType.SEWAGE_TREATMENT: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <mesh>
                  <SewageModel scale={new THREE.Vector3(1, 1, 1)} />
                </mesh>
              </Center>
            );
          }
          case GeoDataType.ELECTRICITY: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <mesh>
                  <ElectricityModel scale={new THREE.Vector3(0.2, 0.2, 0.2)} />
                </mesh>
              </Center>
            );
          }
          case GeoDataType.ADMINISTRATION: {
            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
              >
                <mesh>
                  <AdministrativeModel scale={new THREE.Vector3(6, 6, 6)} />
                </mesh>
              </Center>
            );
          }
          case GeoDataType.WATER_BODY: {
            const shape = new THREE.Shape();
            GeoDataPoint.boundaryPoints.forEach((coordinate: THREE.Vector3) => {
              shape.lineTo(coordinate.x, coordinate.z);
            });
            const geometry = new THREE.ShapeGeometry(shape);
            setUV(geometry);

            const texture = useLoader(
              THREE.TextureLoader,
              "/water/Vol_36_5_Base_Color.png"
            );

            GeoDataPoint.centralPoint.y = 0.05;

            return (
              <Center
                onClick={() => {
                  handleClick(GeoDataPoint);
                }}
                key={GeoDataPoint.key}
                top
                position={GeoDataPoint.centralPoint}
                rotation={new THREE.Euler(-1.57, 0, 0)}
              >
                <mesh geometry={geometry}>
                  <meshStandardMaterial map={texture} />
                </mesh>
              </Center>
            );
          }
        }
      })}
    </>
  );
}

export function setUV(geometry: THREE.ShapeGeometry) {
  // @ts-ignore
  const pos: THREE.BufferAttribute = geometry.attributes.position;
  const b3 = new THREE.Box3().setFromBufferAttribute(pos);
  const size = new THREE.Vector3();
  b3.getSize(size);
  const uv = [];
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    v3.sub(b3.min).divide(size);
    uv.push(v3.x, v3.y);
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
}
