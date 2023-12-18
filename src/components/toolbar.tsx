import { useContext, useState } from "react";
import { Toolbar } from "../interface/toolbar";
import {
  IconBuilding,
  IconBuildingCommunity,
  IconBuildingFactory2,
  IconBuildingStore,
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
import { MouseControlContext, ToolbarContext, CostDataContext } from "../App";

function ToolbarComponent() {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);
  // @ts-ignore
  const { costData } = useContext(CostDataContext);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div>
      <div className="absolute opacity-70 z-10 top-[10px] right-[70px] bg-black rounded-lg p-3">
        {showInfo ? (
          <>
            <div className="flex flex-end m-2">
              <div>
                <div>
                  <p>Budget Remaining: {costData.budget}</p>
                </div>
                <div>
                  <p>Budget Used: {}</p>
                </div>
                <div>
                  <p>
                    Current Facility Cost:{" "}
                    {costData[selectedTool] ? costData[selectedTool] : "0"}
                  </p>
                </div>
                <div>
                  <p>Happiness Index: {}</p>
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
