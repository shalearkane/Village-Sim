import { useContext } from "react";
import { ToolbarContext, CostDataContext } from "../App";

function ConfirmModal() {
  // @ts-ignore
  const { selectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { costData } = useContext(CostDataContext);

  return (
    <div>
      <input type="checkbox" id="confirm_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="text-center mt-3">
            <p className="mb-3">
              <b>Confirm action! </b>
            </p>
            <p>
              Are you sure to add {selectedTool} costing{" "}
              {costData[selectedTool] ? costData[selectedTool] : "0"}?
            </p>
            <p>Your remaining budget is {costData.budget}</p>
            <div className="flex justify-around mt-3">
            <label className="btn m-3" htmlFor="confirm_modal" id="confirm_button">
              Confirm
            </label>
            <label className="btn m-3" htmlFor="confirm_modal">
              Cancel
            </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
