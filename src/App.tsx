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
import { GeoDataType, GeoStore } from "./interface/geo";
import { Suspense, useCallback, useState } from "react";

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
import Loading from "./components/loading";
import FormModal from "./components/formModal";
import { InitialCostData } from "./interface/form";

export const initialCostData = {
  set: false,
  budget: 0,
  [GeoDataType.HOSPITAL]: 0,
  [GeoDataType.ADMINISTRATION]: 0,
  [GeoDataType.COMMERCIAL]: 0,
  [GeoDataType.ELECTRICITY]: 0,
  [GeoDataType.INDUSTRIAL]: 0,
  [GeoDataType.SCHOOL]: 0,
  [GeoDataType.WATER_SUPPLY]: 0,
};

const initialMouseControl = {
  x: 0,
  y: 0,
  z: 0,
  camPos: {
    x: 0,
    y: 0,
    z: 0,
  },
};

export const ToolbarContext = createContext<ToolbarInterface>(
  ToolbarInterface.CURSOR
);
export const MouseControlContext =
  createContext<MouseControl>(initialMouseControl);
export const GeoStoreContext = createContext<GeoStore>({
  data: dummyData,
  terrainMap: {},
});
export const CostDataContext = createContext<InitialCostData>(initialCostData);

export default function App() {
  const [geoStore, setGeoStore] = useState<GeoStore>({
    data: dummyData,
    terrainMap: getTerrainMap(dummyData),
  });
  const [selectedTool, setSelectedTool] = useState<ToolbarInterface>(
    ToolbarInterface.CURSOR
  );
  const [costData, setCostData] = useState<InitialCostData>(initialCostData);
  const [mouseControl, setMouseControl] =
    useState<MouseControl>(initialMouseControl);
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

      if (!costData.set) {
        const modal = document?.getElementById("form_modal");
        modal?.click();
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
          {/* @ts-ignore */}
          <CostDataContext.Provider value={{ costData, setCostData }}>
            <FullScreen handle={fullScreenHanler} onChange={reportChange}>
              <FormModal />
              {!beginGame ? (
                <div className="flex justify-center items-center flex-col w-[100vw]">
                  <h1>Panchayat Sim</h1>
                  <p>A simulator to visualize the possibilities of growth</p>
                  <button className="mt-5" onClick={toggleFullScreen}>
                    {costData.set ? "RESUME GAME !" : "START GAME !"}
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
                      <Suspense fallback={<Loading />}>
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
                            </group>
                            <OrbitControls
                              makeDefault
                              enableDamping={false}
                              maxPolarAngle={Math.PI / 2}
                            />
                            <Stats />
                            <Environment files="/potsdamer_platz_1k.hdr" />
                            <GizmoHelper
                              alignment="bottom-right"
                              margin={[80, 80]}
                            >
                              <GizmoViewport
                                axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
                                labelColor="white"
                              />
                            </GizmoHelper>
                            <Earth />
                          </Camera>
                        </Canvas>
                      </Suspense>
                    </div>
                  </Orientation>
                </DeviceOrientation>
              )}
            </FullScreen>
          </CostDataContext.Provider>
        </MouseControlContext.Provider>
      </GeoStoreContext.Provider>
    </ToolbarContext.Provider>
  );
}
