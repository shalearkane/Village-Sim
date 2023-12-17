import { Canvas } from "@react-three/fiber";
import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  Sky,
  Stars,
  Stats,
} from "@react-three/drei";
import GenerateObjects from "./components/renderer";
import { dummyData } from "./dummy";
import { GeoStore } from "./interface/geo";
import { useCallback, useState } from "react";

// @ts-ignore
import DeviceOrientation, { Orientation } from "react-screen-orientation";

import { Toolbar as ToolbarInterface } from "./interface/toolbar";
import Toolbar from "./components/toolbar";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { createContext } from "react";
import { MouseControl } from "./interface/mouse";
import VisualBlock from "./components/visualBlock";
import { getTerrainMap } from "./utils/terrain";
import Earth from "./components/earth";
import InfoModal from "./components/modal";
import Minimap from "./components/minimap";
import { IconRotate } from "@tabler/icons-react";
import Roads from "./components/road";
import Camera from "./components/camera";

export const ToolbarContext = createContext<ToolbarInterface>(
  ToolbarInterface.CURSOR
);
export const MouseControlContext = createContext<MouseControl>({
  x: 0,
  y: 0,
  z: 0,
  camPos: {
    x: 0,
    y: 0,
    z: 0,
  },
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
    camPos: {
      x: 0,
      y: 0,
      z: 0,
    },
  });
  const [lightMode] = useState<boolean>(true);
  const fullScreenHanler = useFullScreenHandle();
  const [beginGame, setBeginGame] = useState<boolean>(false);
  const [fullScreenError, setFullScreenError] = useState<boolean>(false);

  const toggleFullScreen = () => {
    if (beginGame) {
      if (!fullScreenError) {
        fullScreenHanler.exit();
        setBeginGame(!beginGame);
      }
    } else {
      try {
        fullScreenHanler.enter();
      } catch (error: any) {
        setFullScreenError(true);
      }
      setBeginGame(true);
    }
  };

  const reportChange = useCallback(
    (state: boolean) => {
      if (!fullScreenError) setBeginGame(state);
    },
    [fullScreenHanler]
  );

  return (
    // @ts-ignore
    <ToolbarContext.Provider value={{ selectedTool, setSelectedTool }}>
      {/* @ts-ignore */}
      <GeoStoreContext.Provider value={{ geoStore, setGeoStore }}>
        {/* @ts-ignore */}
        <MouseControlContext.Provider value={{ mouseControl, setMouseControl }}>
          <FullScreen handle={fullScreenHanler} onChange={reportChange}>
            {!beginGame ? (
              <div className="flex justify-center items-center flex-col w-[100vw]">
                <h1>Panchayat Sim</h1>
                <p>A simulator to visualize the possibilities of growth</p>
                <button className="mt-5" onClick={toggleFullScreen}>
                  START GAME !
                </button>
              </div>
            ) : (
              <DeviceOrientation lockOrientation={"landscape"}>
                <Orientation orientation="portrait" alwaysRender={false}>
                  <div className="flex flex-col justify-center items-center w-[100vw]">
                    <IconRotate />
                    <p>Please rotate your device</p>
                  </div>
                </Orientation>
                <Orientation orientation="landscape" alwaysRender={false}>
                  <div className={`relative w-[100vw]`}>
                    <InfoModal />
                    <Toolbar />
                    <Minimap />
                    <Canvas style={{ width: "100vw", height: "100vh" }}>
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
                      <Camera>
                        <ambientLight intensity={0.3} />
                        <pointLight
                          intensity={0.8}
                          position={[100, 100, 100]}
                        />
                        <VisualBlock />
                        <group position={[0, -0.5, 0]}>
                          <GenerateObjects />
                          <Roads />

                          {/* <Grid
                          position={[0, -0.01, 0]}
                          args={gridSize}
                          {...gridConfig}
                        /> */}
                        </group>
                        <OrbitControls
                          makeDefault
                          enableDamping={false}
                          maxPolarAngle={Math.PI / 2}
                        />
                        <Stats />
                        <Environment files="/potsdamer_platz_1k.hdr" />
                        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                          <GizmoViewport
                            axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
                            labelColor="white"
                          />
                        </GizmoHelper>
                        <Earth />
                      </Camera>
                    </Canvas>
                  </div>
                </Orientation>
              </DeviceOrientation>
            )}
          </FullScreen>
        </MouseControlContext.Provider>
      </GeoStoreContext.Provider>
    </ToolbarContext.Provider>
  );
}
