import { useContext, useEffect, useRef, useState } from "react";
import { GeoStoreContext } from "../App";
import { getBounds } from "../utils/math";
import { Boundaries, GeoDataPoint, GeoDataType } from "../interface/geo";
import { IconMap, IconX } from "@tabler/icons-react";

function Minimap() {
  // @ts-ignore
  const { geoStore } = useContext(GeoStoreContext);

  const [bounds, setBounds] = useState<Boundaries>({
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  });
  const [showMap, setShowMap] = useState<boolean>(false);
  const canvasRef = useRef();

  const padding = 5;

  const resizeCanvas = () => {
    const { minX, maxX, minY, maxY } = getBounds(geoStore.data);
    setBounds({ minX, minY, maxX, maxY });
  };

  const plot = () => {
    // @ts-ignore
    const ctx = canvasRef.current?.getContext("2d");
    ctx.fillStyle = "green";

    geoStore.data.forEach((point: GeoDataPoint) => {
      if (
        point.type == GeoDataType.SCHOOL ||
        point.type == GeoDataType.COMMERCIAL ||
        point.type == GeoDataType.RESIDENTIAL ||
        point.type == GeoDataType.HEALTH ||
        point.type == GeoDataType.HOSPITAL ||
        point.type == GeoDataType.INDUSTRIAL
      ) {
        ctx.fillRect(
          point.centralPoint.x - bounds.minX,
          point.centralPoint.z - bounds.minY,
          2,
          1
        );
      }
    });
  };

  useEffect(() => {
    if (canvasRef.current) plot();
  });

  useEffect(() => {
    resizeCanvas();
  }, [geoStore]);

  const handleClick = (event: MouseEvent) => {
    // @ts-ignore
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log({ x, y });
  };

  return (
    <div className="absolute opacity-80 z-20 top-[10px] right-[10px] bg-black rounded-lg cursor-pointer">
      {showMap ? (
        <div>
          <div
            className="flex justify-end cursor-pointer"
            onClick={() => {
              setShowMap(false);
            }}
          >
            <IconX className="m-3" />
          </div>
          <div className="max-h-[300px] overflow-scroll">
            <canvas
              //@ts-ignore
              onClick={handleClick}
              height={bounds.maxY - bounds.minY + padding}
              //@ts-ignore
              ref={canvasRef}
            ></canvas>
          </div>
        </div>
      ) : (
        <IconMap
          className="cursor-pointer m-3"
          onClick={() => {
            setShowMap(true);
          }}
        />
      )}
    </div>
  );
}

export default Minimap;
