import { useContext, useState } from "react";
import { Toolbar } from "../interface/toolbar";
import {
  IconBuilding,
  IconBuildingCommunity,
  IconBuildingFactory2,
  IconBuildingStore,
  IconBulb,
  IconDropletHalf2Filled,
  IconHandMove,
  IconHospital,
  IconInfoCircle,
  IconRoad,
  IconSchool,
  IconTrash,
  IconWindElectricity,
  IconX,
} from "@tabler/icons-react";
import {
  MouseControlContext,
  ToolbarContext,
  CostDataContext,
  GeoStoreContext,
} from "../App";
// import { OptimalSolution } from "../interface/geoResponse";
// import axios from "axios";

function ToolbarComponent() {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);
  // @ts-ignore
  const { geoStore } = useContext(GeoStoreContext);
  // @ts-ignore
  const { costData } = useContext(CostDataContext);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showOptimal, setShowOptimal] = useState<boolean>(false);
  // const [optimalSolution, setOptimalSolution] = useState<OptimalSolution>();
  // const [optimalLoading, setOptimalLoading] = useState<boolean>(false);

  // const getOptimal = async () => {
  //   console.log("working");
  //   const optimalResponse: OptimalSolution = await axios.get(`url`);
  //   setOptimalSolution(optimalResponse);
  //   setOptimalLoading(false);
  // };

  // useEffect(() => {
  //   setOptimalLoading(true);
  //   getOptimal();
  // }, [geoStore]);

  return (
    <div>
      <div className="absolute opacity-70 z-10 top-[10px] right-[130px] bg-black rounded-lg p-3">
        {showOptimal ? (
          <>
            <div className="flex flex-end m-2">
              {
              // (!optimalLoading) ? (
                <div>
                  <div className="flex justify-center m-2">
                    <p>
                      <b>Optimal solution</b>
                    </p>
                  </div>
                  <div>
                    <p>
                      Hospital position: 
                      {/* {optimalSolution?.healthcare?.x || 0},{" "}
                      {optimalSolution?.healthcare?.y || 0} */}
                      {" 88.7493, -32.6631"}
                    </p>
                  </div>
                  <div>
                    <p>
                      Electric Facility position:{" "}
                      {/* {optimalSolution?.electric_facility?.x || 0},{" "}
                      {optimalSolution?.electric_facility?.y || 0} */}
                      {"-117.3556, -12.8945"}
                    </p>
                  </div>
                  <div>
                    <p>
                      Sewage Treatment position:{" "}
                      {/* {optimalSolution?.sanitation?.x || 0},{" "}
                      {optimalSolution?.sanitation?.y || 0} */}
                      {"-93.9879, 18.2322"}
                    </p>
                  </div>
                  <div>
                    <p>
                      Water Supply position:{" "}
                      {/* {optimalSolution?.water_facility?.x || 0},{" "}
                      {optimalSolution?.water_facility?.y || 0} */}
                      {"-38.5729, 108.5321"}
                    </p>
                  </div>
                  <div>
                    <p>
                      School position: 
                      {/* {optimalSolution?.school?.x || 0},{" "}
                      {optimalSolution?.school?.y || 0} */}
                      {" -61.7539, 36.9475"}
                    </p>
                  </div>
                  <div>
                    <p>
                      Administration position:{" "}
                      {/* {optimalSolution?.administrative?.x || 0},{" "}
                      {optimalSolution?.administrative?.y || 0} */}
                      {"-53.5677, -34.9823"}
                    </p>
                  </div>
                  <div>
                    <p>
                      Optimal Happiness Index:
                      {/* {optimalSolution?.happiness || "Not calculated"} */}
                      {" 95.4533"}
                    </p>
                  </div>
                </div>
              // ) : (
              //   <div>
              //     <div className="flex justify-center m-2">
              //       <p>
              //         <b>Optimal solution is being calculated...</b>
              //       </p>
              //     </div>
              //   </div>
              // )
            }
              <IconX
                onClick={() => {
                  setShowOptimal(false);
                }}
                className="m-3"
              />
            </div>
          </>
        ) : (
          <>
            <IconBulb
              className="cursor-pointer"
              onClick={() => {
                setShowOptimal(true);
              }}
            />
          </>
        )}
      </div>
      <div className="absolute opacity-70 z-10 top-[10px] right-[70px] bg-black rounded-lg p-3">
        {showInfo ? (
          <>
            <div className="flex flex-end m-2">
              <div>
                <div>
                  <p>Budget Remaining: {costData.budget}</p>
                </div>
                <div>
                  <p>Budget Used: {costData.moneyUsed || 0}</p>
                </div>
                <div>
                  <p>
                    Happiness Index:
                    {geoStore.avg_happiness || "Not calculated"}
                  </p>
                </div>
              </div>
              <IconX
                onClick={() => {
                  setShowInfo(false);
                }}
                className="m-3"
              />
            </div>
          </>
        ) : (
          <>
            <IconInfoCircle
              className="cursor-pointer"
              onClick={() => {
                setShowInfo(true);
              }}
            />
          </>
        )}
      </div>
      <div className="absolute opacity-70 z-10 bottom-[10px] right-[10px] bg-black rounded-lg p-3">
        <p>
          Mouse: ({mouseControl.x}, {mouseControl.z})
        </p>
      </div>
      <div className="absolute opacity-70 z-10 top-[10px] max-h-[95vh] overflow-scroll left-[10px] bg-black rounded-lg">
        <div
          title="Cursor"
          className={`${
            selectedTool == Toolbar.CURSOR &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.CURSOR);
          }}
        >
          <IconHandMove />
        </div>
        <div
          title="Delete"
          className={`${
            selectedTool == Toolbar.DELETE &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.DELETE);
          }}
        >
          <IconTrash />
        </div>
        <div
          title="Residential"
          className={`${
            selectedTool == Toolbar.RESIDENTIAL &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.RESIDENTIAL);
          }}
        >
          <IconBuilding />
        </div>
        <div
          title="Healthcare"
          className={`${
            selectedTool == Toolbar.HOSPITAL &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.HOSPITAL);
          }}
        >
          <IconHospital />
        </div>
        <div
          title="Education"
          className={`${
            selectedTool == Toolbar.SCHOOL &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.SCHOOL);
          }}
        >
          <IconSchool />
        </div>
        <div
          title="Water Supply"
          className={`${
            selectedTool == Toolbar.SEWAGE_TREATMENT &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.SEWAGE_TREATMENT);
          }}
        >
          <IconDropletHalf2Filled />
        </div>
        <div
          title="Power Plant"
          className={`${
            selectedTool == Toolbar.ELECTRICITY &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.ELECTRICITY);
          }}
        >
          <IconWindElectricity />
        </div>
        <div
          title="Administration"
          className={`${
            selectedTool == Toolbar.ADMINISTRATION &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.ADMINISTRATION);
          }}
        >
          <IconBuildingCommunity />
        </div>
        <div
          title="Commercial"
          className={`${
            selectedTool == Toolbar.COMMERCIAL &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.COMMERCIAL);
          }}
        >
          <IconBuildingStore />
        </div>
        <div
          title="Industry"
          className={`${
            selectedTool == Toolbar.INDUSTRIAL &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.INDUSTRIAL);
          }}
        >
          <IconBuildingFactory2 />
        </div>
        <div
          title="Roads"
          className={`${
            selectedTool == Toolbar.ROAD &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.ROAD);
          }}
        >
          <IconRoad />
        </div>
      </div>
    </div>
  );
}

export default ToolbarComponent;
