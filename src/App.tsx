import { memo, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Grid,
  GizmoHelper,
  GizmoViewport,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  Plane,
} from "@react-three/drei";
import { useControls } from "leva";
import GenerateObjects from "./components/renderer";
import { dummyData } from "./dummy";
import { GeoData, GeoDataPoint, GeoDataType } from "./interface/geo";
import { useState } from "react";
import { Vector3 } from "three";
import { generateUUID } from "three/src/math/MathUtils.js";
import { GLTFLoader } from "three-stdlib";

function Model({ url } : { url:string}) {
  const gltf = useLoader(GLTFLoader, url);
  return (<primitive object={gltf.scene}/>)
}

import { Toolbar as ToolbarInterface } from "./interface/toolbar";
import Toolbar from "./components/toolbar";

import { createContext } from "react";

export const ToolbarContext = createContext<ToolbarInterface>(
  ToolbarInterface.CURSOR
);

export default function App() {
  const [geoData, setGeoData] = useState<GeoData>(dummyData);
  const [selectedTool, setSelectedTool] = useState<ToolbarInterface>(
    ToolbarInterface.CURSOR
  );

  const addObject = (point: Vector3) => {
    point.y = 0;
    const newPoint: GeoDataPoint = {
      key: generateUUID(),
      type: GeoDataType.HOSPITAL,
      boundaryPoints: [new Vector3(0.5, 0.5, 0)],
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

    let data = geoData.concat(newPoint);
    setGeoData(data);
  };

  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });

  console.log(selectedTool);

  return (
    // @ts-ignore
    <ToolbarContext.Provider value={{ selectedTool, setSelectedTool }}>
      <div className="relative">
        <Toolbar />
        <Canvas shadows style={{ height: "100vh", width: "100vw" }}>
          <Plane
            position={[0, -0.55, 0]}
            rotation={[-1.57, 0, 0]}
            args={[100, 100]}
            onDoubleClick={(event) => {
              addObject(event.point);
            }}
          />
          <group position={[0, -0.5, 0]}>
            <GenerateObjects GeoData={geoData} />
            <Shadows />
            <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
          </group>
          <OrbitControls makeDefault />
          <Environment files="assets/potsdamer_platz_1k.hdr" />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport
              axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
              labelColor="white"
            />
          </GizmoHelper>
        </Canvas>
      </div>
    </ToolbarContext.Provider>
  );
}

const Shadows = memo(() => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="#9d4b4b"
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
));
