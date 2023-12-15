import { useContext } from "react";
import { MouseControlContext } from "../App";

function InfoModal() {
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);

  return (
    <div>
      <input type="checkbox" id="info_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="modal-action">
            <label
              htmlFor="info_modal"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </label>
          </div>
          <p className="">
            <b>Type: </b>
            {mouseControl.clickInfo?.geoDataPoint?.type}
          </p>
          <p className="">
            <b>Nearest Hospital: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.hospitalDistance}
          </p>
          <p className="">
            <b>Nearest road: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.roadDistance}
          </p>
          <p className="">
            <b>Nearest Residential: </b>
            {
              mouseControl.clickInfo?.geoDataPoint?.metadata
                ?.residentialDistance
            }
          </p>
          <p className="">
            <b>Nearest Hospital: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.hospitalDistance}
          </p>
          <p className="">
            <b>Nearest Agriculture field: </b>
            {
              mouseControl.clickInfo?.geoDataPoint?.metadata
                ?.agriculturalDistance
            }
          </p>
          <p className="">
            <b>Nearest Shop: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.commercialDistance}
          </p>
          <p className="">
            <b>Nearest Factory: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.industrialDistance}
          </p>
          <p className="">
            <b>Nearest School: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.schoolDistance}
          </p>
          <p className="">
            <b>Nearest Clinic/Dispenseries: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.healthDistance}
          </p>
          <p className="">
            <b>Nearest Sewage Treatment Plant: </b>
            {
              mouseControl.clickInfo?.geoDataPoint?.metadata
                ?.sewageTreatmentDistance
            }
          </p>
          <p className="">
            <b>Nearest Water Body: </b>
            {mouseControl.clickInfo?.geoDataPoint?.metadata?.waterBodyDistance}
          </p>

          <div className="text-center mt-5">
            <p>
              <b>HAPPINESS FACTOR</b>
            </p>
            <p>200</p>
          </div>
        </div>

        <label className="modal-backdrop" htmlFor="info_modal">
          Close
        </label>
      </div>
    </div>
  );
}

export default InfoModal;
