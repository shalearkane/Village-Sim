import { Canvas } from "@react-three/fiber";
import {
  Grid,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Environment,
  Sky,
  Stars,
} from "@react-three/drei";
import { useControls } from "leva";
import GenerateObjects from "./components/renderer";
import { dummyData } from "./dummy";
import { GeoStore } from "./interface/geo";
import { useState } from "react";

import { Toolbar as ToolbarInterface } from "./interface/toolbar";
import Toolbar from "./components/toolbar";

import { createContext } from "react";
import { MouseControl } from "./interface/mouse";
import VisualBlock from "./components/visualBlock";
import { getTerrainMap } from "./utils/terrain";
import Earth from "./components/earth";
import InfoModal from "./components/modal";

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
  const [lightMode] = useState<boolean>(true);

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
          <InfoModal />
          <div className="relative">
            <Toolbar />
            <Canvas style={{ height: "100vh", width: "100vw" }}>
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
              <pointLight intensity={0.8} position={[100, 100, 100]} />
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              {/* <mesh position={[0, -0.55, 0]} scale={30}>
                <Model url="assets/Terrain/ground.glb"></Model>
              </mesh> */}
              {/* <Plane
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
              /> */}
              <VisualBlock />
              <group position={[0, -0.5, 0]}>
                <GenerateObjects />
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
              <Earth />
            </Canvas>
          </div>
        </MouseControlContext.Provider>
      </GeoStoreContext.Provider>
    </ToolbarContext.Provider>
  );
}
