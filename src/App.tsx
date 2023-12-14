import { memo, useEffect } from "react";
import { Canvas, ThreeEvent, useLoader, useThree } from "@react-three/fiber";
import {
  Grid,
  GizmoHelper,
  GizmoViewport,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  Plane,
  PerformanceMonitor,
  Sky,
  Stars,
} from "@react-three/drei";
import { useControls } from "leva";
import GenerateObjects, { Model } from "./components/renderer";
import { dummyData } from "./dummy";
import { GeoStore } from "./interface/geo";
import { useState } from "react";

import { Toolbar as ToolbarInterface } from "./interface/toolbar";
import Toolbar from "./components/toolbar";

import { createContext } from "react";
import { MouseControl } from "./interface/mouse";
import VisualBlock from "./components/visualBlock";
import { TextureLoader } from 'three'
import { getTerrainMap } from "./utils/terrain";


function Earth() {
  const { gl } = useThree()
  const texture = useLoader(
    TextureLoader,
    'assets/aerial_rocks_04_diff_4k.jpg'
  )
  const displacementMap = useLoader(
    TextureLoader,
    'assets/aerial_rocks_04_rough_4k.png'
  )

  const material = useControls({
    wireframe: false,
    displacementScale: { value: 0.5, min: 0, max: 1.0, step: 0.01 }
  })

  useEffect(() => {
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  }, [texture, gl])

  return (
    <mesh receiveShadow={true} position={[0,0,0]} rotation={[-1.57, 0, 0]}>
      <planeGeometry args={[50, 50, 100, 100]} />
      <meshStandardMaterial
        wireframe={material.wireframe}
        map={texture}
        displacementMap={displacementMap}
        displacementScale={0.1}
      />
    </mesh>
  )
}

export const ToolbarContext = createContext<ToolbarInterface>(
  ToolbarInterface.CURSOR
);
export const MouseControlContext = createContext<MouseControl>({
  x: 0,
  y: 0,
  z: 0,
});
export const GeoStoreContext = createContext<GeoStore>({
  data: dummyData,
  terrainMap: {},
});

export default function App() {
  const [geoStore, setGeoStore] = useState<GeoStore>({
    data: dummyData,
    terrainMap: getTerrainMap(dummyData),
  });
  const [selectedTool, setSelectedTool] = useState<ToolbarInterface>(
    ToolbarInterface.CURSOR
  );
  const [mouseControl, setMouseControl] = useState<MouseControl>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [dpr, setDpr] = useState(1.5);
  const [lightMode, setLightMode] = useState<boolean>(true);

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
    infiniteGrid: false,
  });

  return (
    // @ts-ignore
    <ToolbarContext.Provider value={{ selectedTool, setSelectedTool }}>
      {/* @ts-ignore */}
      <GeoStoreContext.Provider value={{ geoStore, setGeoStore }}>
        {/* @ts-ignore */}
        <MouseControlContext.Provider value={{ mouseControl, setMouseControl }}>
          <div className="relative">
            <Toolbar />
            <Canvas
              dpr={dpr}
              shadows
              style={{ height: "100vh", width: "100vw" }}
            >
              {lightMode ? (
                <Sky sunPosition={[100, 20, 100]} />
              ) : (
                <Stars
                  radius={100}
                  depth={50}
                  count={5000}
                  factor={4}
                  saturation={0}
                  fade
                  speed={1}
                />
              )}

              <ambientLight intensity={0.3} />
              <pointLight
                castShadow
                intensity={0.8}
                position={[100, 100, 100]}
              />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <PerformanceMonitor
                onIncline={() => setDpr(2)}
                onDecline={() => setDpr(1)}
              />
              <Plane
                onClick={(e) => {
                  console.log(e);
                }}
                onPointerMove={(event: ThreeEvent<PointerEvent>) => {
                  setMouseControl({
                    ...mouseControl,
                    x: event.point.x,
                    y: event.point.y,
                    z: event.point.z,
                  });
                }}
                position={[0, -0.55, 0]}
                rotation={[-1.57, 0, 0]}
                args={[100, 100]}
              />
              <VisualBlock />
              <group position={[0, -0.5, 0]}>
                <GenerateObjects GeoData={geoStore.data} />
                {/* <Shadows /> */}
                <Grid
                  position={[0, -0.01, 0]}
                  args={gridSize}
                  {...gridConfig}
                />
              </group>
              <OrbitControls makeDefault />
              <Environment files="assets/potsdamer_platz_1k.hdr" />
              <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport
                  axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
                  labelColor="white"
                />
              </GizmoHelper>
              <Earth/>
            </Canvas>
          </div>
        </MouseControlContext.Provider>
      </GeoStoreContext.Provider>
    </ToolbarContext.Provider>
  );
}

export const Shadows = memo(({ position }: { position: number[] }) => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="#9d4b4b"
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight
      amount={8}
      radius={1}
      position={[position[0], position[1], position[2]]}
    />
  </AccumulativeShadows>
));
