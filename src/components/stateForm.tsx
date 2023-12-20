import { useContext, useEffect, useState } from "react";
import { InitialStateForm } from "../interface/form";
import { GeoStoreContext, StateDataContext } from "../App";
import { STATE_CODES } from "../constants/state";
import axios from "axios";
import {
  DataPointResponse,
  LoadingState,
  StateStore,
} from "../interface/state";
import { convertDataPointToStoreFormat } from "../utils/state";
import { Oval } from "react-loader-spinner";
import { GeoResponse, NormalizedGeoStore } from "../interface/geoResponse";
import { geoResposeToGeoData, roadsToGeoData } from "../utils/geo";
import { getTerrainMap } from "../utils/terrain";
import { GeoData } from "../interface/geo";
import { RoadResponse } from "../interface/roads";
import { getBoundsFromGeoResponse } from "../utils/math";

const defaultStore = {
  map: {},
  reverseMap: {},
};

function StateForm() {
  // @ts-ignore
  const { stateData, setStateData } = useContext(StateDataContext);
  // @ts-ignore
  const { setGeoStore } = useContext(GeoStoreContext);
  const [input, setInput] = useState<InitialStateForm>(stateData);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [store, setStore] = useState<StateStore>({
    districts: defaultStore,
    blocks: defaultStore,
    gramPanchayat: defaultStore,
    shpFile: null,
    prjFile: null,
    dbfFile: null,
  });
  const [loading, setLoading] = useState<LoadingState>({
    districts: true,
    blocks: true,
    gramPanchayat: true,
  });
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);

  const fetchDistricts = async () => {
    setShowSpinner(true);
    setLoading({
      ...loading,
      blocks: true,
      districts: true,
      gramPanchayat: true,
    });

    const response: DataPointResponse = await axios.get(
      `${import.meta.env.VITE_APP_DISTRICT_URL}?stateId=${
        input.stateId
      }&year=2023-2024`
    );

    if (response.data && response.data.length) {
      const { map, reverseMap } = convertDataPointToStoreFormat(response.data);
      setStore({ ...store, districts: { map, reverseMap } });
    }

    setStateData(input);
    setLoading({ ...loading, districts: false });
    setShowSpinner(false);
  };

  const fetchBlocks = async () => {
    setShowSpinner(true);
    setLoading({ ...loading, blocks: true, gramPanchayat: true });

    const response: DataPointResponse = await axios.get(
      `${import.meta.env.VITE_APP_BLOCK_URL}?stateId=${input.stateId}&code=${
        input.districtId
      }&year=2023-2024`
    );

    if (response.data && response.data.length) {
      const { map, reverseMap } = convertDataPointToStoreFormat(response.data);
      setStore({ ...store, blocks: { map, reverseMap } });
    }

    setStateData(input);
    setLoading({ ...loading, blocks: false });
    setShowSpinner(false);
  };

  const fetchGramPanchayat = async () => {
    setShowSpinner(true);
    setLoading({ ...loading, gramPanchayat: true });

    const response: DataPointResponse = await axios.get(
      `${import.meta.env.VITE_APP_BLOCK_URL}?stateId=${input.stateId}&code=${
        input.blockId
      }&year=2023-2024`
    );

    if (response.data && response.data.length) {
      const { map, reverseMap } = convertDataPointToStoreFormat(response.data);
      setStore({ ...store, gramPanchayat: { map, reverseMap } });
    }

    setStateData(input);
    setLoading({ ...loading, gramPanchayat: false });
    setShowSpinner(false);
  };

  const handleSubmit = async () => {
    setShowSpinner(true);
    const formData = new FormData();
    //@ts-ignore
    formData.append("shp", input.shpFile);
    //@ts-ignore
    formData.append("prj", input.prjFile);
    //@ts-ignore
    formData.append("dbf", input.dbfFile);
    const geoResponse: { data: GeoResponse } = await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_BACKEND}/interchange?gpcode=${
        input.gramId
      }`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (geoResponse.data) {
      const { data, buffer, bounds }: NormalizedGeoStore = geoResposeToGeoData(
        geoResponse.data
      );

      const { minX, minY, maxX, maxY } = getBoundsFromGeoResponse(
        geoResponse.data
      );

      console.log(data);
      const roadsResponse: { data: RoadResponse } = await axios.get(
        `${
          import.meta.env.VITE_APP_BACKEND
        }/roads?north=${maxX}south=${minX}&east=${minY}&west=${maxY}`
      );
      if (roadsResponse.data) {
        console.log("HELo");
        const { data: roadsData }: NormalizedGeoStore = roadsToGeoData(
          roadsResponse.data,
          buffer,
          bounds
        );

        const geoData: GeoData = [...data, ...roadsData];

        setGeoStore({
          data: geoData,
          terrainMap: getTerrainMap(geoData),
          buffer,
        });

        setStateData({ ...stateData, set: true });
      }
    }
    setShowSpinner(false);
  };

  useEffect(() => {
    if (
      input.prjFile &&
      input.shpFile &&
      input.dbfFile &&
      input.blockId &&
      input.districtId &&
      input.gramId &&
      input.stateId
    ) {
      setBtnDisabled(false);
    }
  }, [input]);

  useEffect(() => {
    if (input.stateId) fetchDistricts();
  }, [input.stateId]);

  useEffect(() => {
    if (input.districtId) fetchBlocks();
  }, [input.districtId]);

  useEffect(() => {
    if (input.blockId) fetchGramPanchayat();
  }, [input.blockId]);

  return (
    <>
      {showSpinner ? (
        <div className="m-5">
          <Oval
            height={80}
            width={80}
            color="#0ea5e9"
            visible={showSpinner}
            ariaLabel="oval-loading"
            secondaryColor="#7dd3fc"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <p className="m-2">Processing ...</p>
        </div>
      ) : (
        <div className="w-[350px] text-center">
          {!input.set && (
            <div>
              {/* State */}
              <div className="label">
                <span className="label-text">State</span>
              </div>
              <select
                onChange={(e) =>
                  // @ts-ignore
                  setInput({ ...input, stateId: STATE_CODES[e.target.value] })
                }
                className="select select-bordered w-full max-w-xs"
              >
                {Object.keys(STATE_CODES).map(
                  (key: string, keyIndex: number) => {
                    return (
                      <option
                        key={`State_Option_${keyIndex}`}
                        // @ts-ignore
                        selected={input.stateId == STATE_CODES[key]}
                      >
                        {key}
                      </option>
                    );
                  }
                )}
              </select>
              {/* @ts-ignore */}
              {!input.stateId && (
                <div className="label">
                  <span className="label-text-alt text-red-200">
                    This field is required
                  </span>
                </div>
              )}

              {/* Districts */}
              {!loading.districts && (
                <div>
                  <div className="label">
                    <span className="label-text">Districts</span>
                  </div>
                  <select
                    value={store.districts.map[input.districtId]}
                    onChange={(e) =>
                      // @ts-ignore
                      setInput({
                        ...input,
                        districtId: store.districts.reverseMap[e.target.value],
                      })
                    }
                    className="select select-bordered w-full max-w-xs"
                  >
                    {Object.keys(store.districts.reverseMap).map(
                      (key: string, keyIndex: number) => {
                        return (
                          <option
                            key={`Districts_Option_${keyIndex}`}
                            selected={
                              // @ts-ignore
                              input.districtId == store.districts.map[key]
                            }
                          >
                            {key}
                          </option>
                        );
                      }
                    )}
                  </select>
                  {/* @ts-ignore */}
                  {!input.districtId && (
                    <div className="label">
                      <span className="label-text-alt text-red-200">
                        This field is required
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Blocks */}
              {!loading.districts && !loading.blocks && (
                <div>
                  <div className="label">
                    <span className="label-text">Blocks</span>
                  </div>
                  <select
                    value={store.blocks.map[input.blockId]}
                    onChange={(e) =>
                      // @ts-ignore
                      setInput({
                        ...input,
                        blockId: store.blocks.reverseMap[e.target.value],
                      })
                    }
                    className="select select-bordered w-full max-w-xs"
                  >
                    {Object.keys(store.blocks.reverseMap).map(
                      (key: string, keyIndex: number) => {
                        return (
                          <option
                            key={`Districts_Option_${keyIndex}`}
                            // @ts-ignore
                            selected={input.blockId == store.blocks.map[key]}
                          >
                            {key}
                          </option>
                        );
                      }
                    )}
                  </select>
                  {/* @ts-ignore */}
                  {!input.blockId && (
                    <div className="label">
                      <span className="label-text-alt text-red-200">
                        This field is required
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* GramPanchayat */}
              {!loading.districts &&
                !loading.blocks &&
                !loading.gramPanchayat && (
                  <div>
                    <div className="label">
                      <span className="label-text">Gram Panchayat</span>
                    </div>
                    <select
                      value={store.gramPanchayat.map[input.gramId]}
                      onChange={(e) =>
                        // @ts-ignore
                        setInput({
                          ...input,
                          gramId:
                            store.gramPanchayat.reverseMap[e.target.value],
                        })
                      }
                      className="select select-bordered w-full max-w-xs"
                    >
                      {Object.keys(store.gramPanchayat.reverseMap).map(
                        (key: string, keyIndex: number) => {
                          return (
                            <option
                              key={`Districts_Option_${keyIndex}`}
                              selected={
                                // @ts-ignore
                                input.gramId == store.gramPanchayat.map[key]
                              }
                            >
                              {key}
                            </option>
                          );
                        }
                      )}
                    </select>
                    {!input.gramId && (
                      <div className="label">
                        <span className="label-text-alt text-red-200">
                          This field is required
                        </span>
                      </div>
                    )}
                  </div>
                )}

              {input.gramId && !loading.gramPanchayat ? (
                <div>
                  <p className="mt-4 text-left w-full">
                    Upload the drone data here
                  </p>

                  {/* SHP File Upload */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Upload .SHP file</span>
                    </div>
                    <input
                      type="file"
                      accept=".shp"
                      onChange={(e) =>
                        // @ts-ignore
                        setInput({ ...input, shpFile: e.target.files[0] })
                      }
                      className="file-input file-input-bordered w-full max-w-xs"
                    />
                    {!input.shpFile && (
                      <div className="label">
                        <span className="label-text-alt text-red-200">
                          This field is required
                        </span>
                      </div>
                    )}
                  </label>

                  {/* SHP File Upload */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Upload .PRJ file</span>
                    </div>
                    <input
                      type="file"
                      accept=".prj"
                      onChange={(e) =>
                        // @ts-ignore
                        setInput({ ...input, prjFile: e.target.files[0] })
                      }
                      className="file-input file-input-bordered w-full max-w-xs"
                    />
                    {!input.prjFile && (
                      <div className="label">
                        <span className="label-text-alt text-red-200">
                          This field is required
                        </span>
                      </div>
                    )}
                  </label>

                  {/* SHP File Upload */}
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text">Upload .DBF file</span>
                    </div>
                    <input
                      type="file"
                      accept=".dbf"
                      onChange={(e) =>
                        // @ts-ignore
                        setInput({ ...input, dbfFile: e.target.files[0] })
                      }
                      className="file-input file-input-bordered w-full max-w-xs"
                    />
                    {!input.dbfFile && (
                      <div className="label">
                        <span className="label-text-alt text-red-200">
                          This field is required
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              ) : (
                <></>
              )}

              <button
                disabled={btnDisabled}
                className="m-2"
                onClick={() => {
                  handleSubmit();
                }}
              >
                SUBMIT
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default StateForm;
