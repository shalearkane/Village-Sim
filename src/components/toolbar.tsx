import { useContext } from "react";
import { Toolbar } from "../interface/toolbar";
import {
  IconBuilding,
  IconHandMove,
  IconHospital,
  IconSchool,
  IconTrash,
} from "@tabler/icons-react";
import { ToolbarContext } from "../App";

function ToolbarComponent() {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);

  return (
    <div className="absolute opacity-70 z-10 top-[100px] left-[20px] bg-black rounded-lg">
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
    </div>
  );
}

export default ToolbarComponent;