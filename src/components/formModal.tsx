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

  const defaultValue = {
    [GeoDataType.ADMINISTRATION]: 500000,
    [GeoDataType.COMMERCIAL]: 500000,
    [GeoDataType.ELECTRICITY]: 500000,
    [GeoDataType.HOSPITAL]: 500000,
    [GeoDataType.INDUSTRIAL]: 500000,
    [GeoDataType.SCHOOL]: 500000,
    [GeoDataType.WATER_SUPPLY]: 500000,
    budget: 5000000,
  };

  const validate = (): boolean => {
    let result = true;

    Object.keys(defaultValue).forEach((key: string) => {
      // @ts-ignore
      if (!input[key]) {
        console.log(key);
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
          <h3 className="font-bold text-lg">Cost Analysis</h3>
          <p className="">
            Please provide the cost and budget of the development
          </p>

          <div className="form-control w-full max-h-[50vh] overflow-scroll no-scrollbar">
            {/* @ts-ignore */}
            {Object.entries(defaultValue).map((entry: string, entryIndex) => {
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
            })}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-red-200">
              {error && "Kindly fill all the fields properly"}
            </p>
            <label onClick={saveCostData} htmlFor="my_modal_6" className="btn">
              SAVE
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormModal;
