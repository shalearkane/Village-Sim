// import { Canvas } from "@react-three/offscreen";

import { dummyData } from "./dummy";
import { GeoData, GeoDataType, GeoStore } from "./interface/geo";
import { Suspense, lazy, useCallback, useState } from "react";

// This is the fallback component that will be rendered on the main thread
// This will happen on systems where OffscreenCanvas is not supported
const Scene = lazy(() => import("./components/scene"));

// This is the worker thread that will render the scene
// const worker = new Worker(new URL("./components/worker", import.meta.url), {
//   type: "module",
// });

// @ts-ignore
import DeviceOrientation, { Orientation } from "react-screen-orientation";

import { Toolbar as ToolbarInterface } from "./interface/toolbar";
import Toolbar from "./components/toolbar";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import { createContext } from "react";
import { MouseControl } from "./interface/mouse";
import { getTerrainMap } from "./utils/terrain";
import InfoModal from "./components/modal";
import Minimap from "./components/minimap";
import { IconRotate } from "@tabler/icons-react";
import Loading from "./components/loading";
import FormModal from "./components/formModal";
import { InitialCostData, InitialStateForm } from "./interface/form";
import StateForm from "./components/stateForm";
import { Canvas } from "@react-three/fiber";
import ConfirmModal from "./components/confirmModal";

export const initialCostData = {
  set: false,
  budget: 0,
  [GeoDataType.HOSPITAL]: 0,
  [GeoDataType.ADMINISTRATION]: 0,
  [GeoDataType.COMMERCIAL]: 0,
  [GeoDataType.ELECTRICITY]: 0,
  [GeoDataType.INDUSTRIAL]: 0,
  [GeoDataType.SCHOOL]: 0,
  [GeoDataType.SEWAGE_TREATMENT]: 0,
};

const date = new Date();

const initialMouseControl = {
  x: 0,
  y: 0,
  z: 0,
  camPos: {
    x: 0,
    y: 0,
    z: 0,
    time: date.getTime()
  },
};

export const initialStateFormData: InitialStateForm = {
  stateId: 0,
  blockId: 0,
  gramId: 0,
  districtId: 0,
  shpFile: null,
  prjFile: null,
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
export const StateDataContext =
  createContext<InitialStateForm>(initialStateFormData);

export default function App() {
  const [geoStore, setGeoStore] = useState<GeoStore>({
    data: dummyData,
    terrainMap: getTerrainMap(dummyData),
  });
  const [selectedTool, setSelectedTool] = useState<ToolbarInterface>(
    ToolbarInterface.CURSOR
  );
  const [costData, setCostData] = useState<InitialCostData>(initialCostData);
  const [stateData, setStateData] =
    useState<InitialStateForm>(initialStateFormData);
  const [mouseControl, setMouseControl] =
    useState<MouseControl>(initialMouseControl);
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
            {/* @ts-ignore */}
            <StateDataContext.Provider value={{ stateData, setStateData }}>
              <FullScreen handle={fullScreenHanler} onChange={reportChange}>
                <FormModal />
                {!beginGame ? (
                  <div className="flex justify-center items-center flex-col w-[100vw]">
                    <h1>Panchayat Sim</h1>
                    <p>A simulator to visualize the possibilities of growth</p>
                    <StateForm />
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
                          <ConfirmModal />
                          <Toolbar />
                          <Minimap />
                          <Canvas
                            style={{ width: "100vw", height: "100vh" }}
                            // worker={worker}
                            // fallback={<Scene />}
                          >
                            <Scene />
                          </Canvas>
                        </Suspense>
                      </div>
                    </Orientation>
                  </DeviceOrientation>
                )}
              </FullScreen>
            </StateDataContext.Provider>
          </CostDataContext.Provider>
        </MouseControlContext.Provider>
      </GeoStoreContext.Provider>
    </ToolbarContext.Provider>
  );
}
