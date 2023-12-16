import { useContext } from "react";
import { Toolbar } from "../interface/toolbar";
import {
  IconBuilding,
  IconBuildingCommunity,
  IconDropletHalf2Filled,
  IconFountain,
  IconHandMove,
  IconHospital,
  IconSchool,
  IconTrash,
  IconWindElectricity,
} from "@tabler/icons-react";
import { MouseControlContext, ToolbarContext } from "../App";

function ToolbarComponent() {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);

  return (
    <div>
      <div className="absolute opacity-70 z-10 bottom-[10px] right-[10px] bg-black rounded-lg p-3">
        <p>
          Mouse: ({mouseControl.x}, {mouseControl.y})
        </p>
      </div>
      <div className="absolute opacity-70 z-10 top-[10px] max-h-[95vh] overflow-scroll left-[10px] bg-black rounded-lg">
        <div
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
          className={`${
            selectedTool == Toolbar.WATER_SUPPLY &&
            "border-solid border-2 border-sky-500"
          } cursor-pointer m-2 p-2 rounded-lg`}
          onClick={() => {
            setSelectedTool(Toolbar.WATER_SUPPLY);
          }}
        >
          <IconFountain />
        </div>
      </div>
    </div>
  );
}

export default ToolbarComponent;
