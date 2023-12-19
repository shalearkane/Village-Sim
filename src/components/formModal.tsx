import { useContext, useRef, useState } from "react";
import { CostDataContext, initialCostData } from "../App";
import { GeoDataType } from "../interface/geo";
import { InitialCostData } from "../interface/form";

function FormModal() {
  // @ts-ignore
  const { costData, setCostData } = useContext(CostDataContext);

  const [input, setInput] = useState<InitialCostData>(initialCostData);
  const modalRef = useRef();
  const [error, setError] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<number>(0);

  const defaultValue = {
    [GeoDataType.ADMINISTRATION]: 500000,
    [GeoDataType.COMMERCIAL]: 500000,
    [GeoDataType.ELECTRICITY]: 500000,
    [GeoDataType.HOSPITAL]: 500000,
    [GeoDataType.INDUSTRIAL]: 500000,
    [GeoDataType.SCHOOL]: 500000,
    [GeoDataType.SEWAGE_TREATMENT]: 500000,
    budget: 5000000,
  };

  const validate = (): boolean => {
    let result = true;

    Object.keys(defaultValue).forEach((key: string) => {
      // @ts-ignore
      if (!input[key]) {
        result = false;
      }
    });

    setError(!result);

    return result;
  };

  const saveCostData = () => {
    if (!validate()) {
      return;
    }
    setCostData({ ...input, set: true });
    // @ts-ignore
    if (modalRef) modalRef.current?.click();
  };

  return (
    <div>
      <input
        // @ts-ignore
        ref={modalRef}
        type="checkbox"
        id="form_modal"
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          {nextPage == 0 ? (
            <div>
              <h3 className="font-bold text-lg">Important Instructions</h3>
              <p className="">
                Please read the following instructions carefully!
              </p>
              <ol>
                <li>
                  Select the cost of each building/facility and total budget for
                  development.
                </li>
                <li>
                  On starting game, you will see a simulation of the village.
                  You can freely traverse the map.
                </li>
                <li>
                  Mini Map is in the top-right corner. Click on any region in
                  the Mini Map to quickly go there. You can also spot your
                  position and location of facilities.
                </li>
                <li>
                  Toolbar is in the left side of the screen. Use it to add
                  facilities. A green block will appear where the facility can
                  be put. Double click to add facility.
                </li>
                <li>
                  To create a road, select road option. Single-click points on
                  the map along which road will be created. Double-click to
                  create road.
                </li>
                <li>
                  To delete any facility, select delete on the toolbar and
                  double-click on the facility.
                </li>
                <li>
                  Using selection cursor, click on any facility to know more
                  relevant information about it.
                </li>
                <li>
                  Goal of the simulation is to create the happiest village in
                  the given amount of budget and costs!!
                </li>
              </ol>
              <label
                onClick={() => {
                  setNextPage(1);
                }}
                htmlFor="my_modal_6"
                className="btn"
              >
                NEXT
              </label>
            </div>
          ) : null}
          {nextPage == 1 ? (
            <div>
              <h3 className="font-bold text-lg">Cost Analysis</h3>
              <p className="">
                Please provide the cost and budget of the development
              </p>

              <span
                className="label-text-alt cursor-pointer mt-2 mb-2"
                onClick={() => {
                  // @ts-ignore
                  setInput({ ...defaultValue, set: input.set });
                }}
              >
                Set all default values
              </span>

              <div className="form-control w-full max-h-[50vh] overflow-scroll no-scrollbar">
                {Object.entries(defaultValue).map(
                  //@ts-ignore
                  (entry: string, entryIndex) => {
                    return (
                      <div key={`CostData_${entryIndex}`} className="mb-2">
                        <div className="label">
                          <span className="label-text">{entry[0]}</span>
                          <span
                            className="label-text-alt cursor-pointer"
                            onClick={() => {
                              setInput({
                                ...input,
                                // @ts-ignore
                                [entry[0]]: defaultValue[entry[0]],
                              });
                            }}
                          >
                            Set Default Value
                          </span>
                        </div>
                        <input
                          // @ts-ignore
                          value={input[entry[0]]}
                          onChange={(e) => {
                            setInput({ ...input, [entry[0]]: e.target.value });
                          }}
                          type="number"
                          placeholder="Type here"
                          className="input input-bordered w-full"
                        />
                        {/* @ts-ignore */}
                        {!input[entry[0]] && (
                          <div className="label">
                            <span className="label-text-alt text-red-200">
                              This field is required
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-red-200">
                  {error && "Kindly fill all the fields properly"}
                </p>
                <label
                  onClick={saveCostData}
                  htmlFor="my_modal_6"
                  className="btn"
                >
                  SAVE
                </label>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FormModal;
