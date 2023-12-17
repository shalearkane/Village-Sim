import { useContext, useEffect, useRef, useState } from "react";
import { GeoStoreContext, MouseControlContext } from "../App";
import { getBounds } from "../utils/math";
import { Boundaries, GeoDataPoint, GeoDataType } from "../interface/geo";
import { IconMap, IconX } from "@tabler/icons-react";
import { FilterOptions } from "../interface/filter";
import { Vector3 } from "three";

function Minimap() {
  // @ts-ignore
  const { geoStore } = useContext(GeoStoreContext);
  // @ts-ignore
  const { setMouseControl } = useContext(MouseControlContext);

  const [bounds, setBounds] = useState<Boundaries>({
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  });
  const [showMap, setShowMap] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    [GeoDataType.HOSPITAL]: false,
    [GeoDataType.INDUSTRIAL]: false,
    [GeoDataType.SCHOOL]: false,
    [GeoDataType.SEWAGE_TREATMENT]: false,
    [GeoDataType.COMMERCIAL]: false,
    [GeoDataType.ROAD]: false,
  });
  const [scale] = useState<number>(1.5);
  const canvasRef = useRef();

  const padding = 5;
  const pointWidth = 2;

  const resizeCanvas = () => {
    const { minX, maxX, minY, maxY } = getBounds(geoStore.data);
    setBounds({ minX, minY, maxX, maxY });
  };

  // const scaleUp = () => {
  //   // @ts-ignore
  //   const ctx = canvasRef.current?.getContext("2d");
  //   ctx.scale(scale + 0.5, scale + 0.5);
  //   setScale(scale + 0.5);
  // };

  // const scaleDown = () => {
  //   if (scale > 1) {
  //     // @ts-ignore
  //     const ctx = canvasRef.current?.getContext("2d");
  //     ctx.scale(scale - 0.5, scale - 0.5);
  //     setScale(scale - 0.5);
  //   }
  // };

  const plot = () => {
    // @ts-ignore
    const ctx = canvasRef.current?.getContext("2d");

    geoStore.data.forEach((point: GeoDataPoint) => {
      switch (point.type) {
        case GeoDataType.RESIDENTIAL: {
          ctx.fillStyle = "#22c55e";
          ctx.fillRect(
            scale * (point.centralPoint.x - bounds.minX),
            scale * (point.centralPoint.z - bounds.minY),
            pointWidth,
            pointWidth
          );
          break;
        }
        case GeoDataType.HOSPITAL: {
          if (filters.HOSPITAL) {
            ctx.fillStyle = "#06b6d4";
            ctx.fillRect(
              scale * (point.centralPoint.x - bounds.minX),
              scale * (point.centralPoint.z - bounds.minY),
              pointWidth,
              pointWidth
            );
          } else {
            ctx.clearRect(
              scale * (point.centralPoint.x - bounds.minX),
              scale * (point.centralPoint.z - bounds.minY),
              pointWidth,
              pointWidth
            );
          }
          break;
        }
        case GeoDataType.SCHOOL: {
          if (filters.SCHOOL) {
            ctx.fillStyle = "#f97316";
            ctx.fillRect(
              scale * (point.centralPoint.x - bounds.minX),
              scale * (point.centralPoint.z - bounds.minY),
              pointWidth,
              pointWidth
            );
          } else {
            ctx.clearRect(
              scale * (point.centralPoint.x - bounds.minX),
              scale * (point.centralPoint.z - bounds.minY),
              pointWidth,
              pointWidth
            );
          }
          break;
        }
        case GeoDataType.SEWAGE_TREATMENT: {
          if (filters.SEWAGE_TREATMENT) {
            ctx.fillStyle = "#8b5cf6";
            ctx.fillRect(
              scale * (point.centralPoint.x - bounds.minX),
              scale * (point.centralPoint.z - bounds.minY),
              pointWidth,
              pointWidth
            );
          } else {
            ctx.clearRect(
              scale * (point.centralPoint.x - bounds.minX),
              scale * (point.centralPoint.z - bounds.minY),
              pointWidth,
              pointWidth
            );
          }
          break;
        }
        case GeoDataType.ROAD: {
          if (filters.ROAD) {
            ctx.fillStyle = "white";
            point.steps.forEach((stepPoint: Vector3) => {
              ctx.fillRect(
                scale * (stepPoint.x - bounds.minX),
                scale * (stepPoint.z - bounds.minY),
                pointWidth,
                pointWidth
              );
            });
          } else {
            point.steps.forEach((stepPoint: Vector3) => {
              ctx.clearRect(
                scale * (stepPoint.x - bounds.minX),
                scale * (stepPoint.z - bounds.minY),
                pointWidth,
                pointWidth
              );
            });
          }
          break;
        }
      }
    });
  };

  useEffect(() => {
    if (canvasRef.current) plot();
  });

  useEffect(() => {
    resizeCanvas();
  }, [geoStore, filters]);

  const handleClick = (event: MouseEvent) => {
    // @ts-ignore
    const rect = canvasRef.current?.getBoundingClientRect();
    // console.log(
    //   rect.left / scale + bounds.minX,
    //   rect.right / scale + bounds.minX,
    //   rect.top / scale + bounds.minY,
    //   rect.bottom / scale + bounds.minY
    // );
    // console.log(bounds);
    const x = (event.clientX - rect.left) / scale + bounds.minX;
    const y = (event.clientY - rect.top) / scale + bounds.minY;
    console.log({ x, y });

    setMouseControl({
      ...MouseControlContext,
      newCameraPos: {
        x,
        z: y,
      },
    });
  };

  const toggleFilter = (filter: GeoDataType) => {
    // @ts-ignore
    setFilters({ ...filters, [filter]: !filters[filter] });
  };

  return (
    <div className="absolute opacity-80 z-20 top-[10px] right-[10px] bg-black rounded-lg cursor-pointer">
      {showMap ? (
        <div>
          <div className="flex justify-between cursor-pointer items-center w-full">
            <div className="flex m-3 gap-4">
              {/* <IconZoomIn onClick={scaleUp} />
              <IconZoomOut onClick={scaleDown} /> */}
            </div>
            <IconX
              onClick={() => {
                setShowMap(false);
              }}
              className="m-3"
            />
          </div>
          <div className="h-[92vh] w-[40vw] flex flex-col justify-between">
            <div className="flex flex-wrap ml-2 mr-2 h-1 z-10">
              <div
                className={`border border-sky-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.HOSPITAL && "bg-sky-500"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.HOSPITAL);
                }}
              >
                Hospitals
              </div>
              <div
                className={`border border-orange-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.SCHOOL && "bg-orange-500"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.SCHOOL);
                }}
              >
                School
              </div>
              <div
                className={`border border-violet-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.SEWAGE_TREATMENT && "bg-violet-500"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.SEWAGE_TREATMENT);
                }}
              >
                Sewage Treatment
              </div>
              <div
                className={`border border-white m-2 pl-1 pr-1 rounded-md ${
                  filters.ROAD && "bg-white text-black"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.ROAD);
                }}
              >
                Road
              </div>
            </div>
            <div className="flex h-[80vh] overflow-scroll">
              <canvas
                //@ts-ignore
                onClick={handleClick}
                height={(bounds.maxY - bounds.minY + padding) * scale}
                width={(bounds.maxX - bounds.minX + padding) * scale}
                //@ts-ignore
                ref={canvasRef}
              ></canvas>
            </div>
            {/* <div className="h-10"></div> */}
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
