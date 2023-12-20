import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { GeoStoreContext, MouseControlContext } from "../App";
import { getBounds } from "../utils/math";
import { Boundaries, GeoDataPoint, GeoDataType } from "../interface/geo";
import { IconMap, IconX } from "@tabler/icons-react";
import { FilterOptions } from "../interface/filter";
import { Vector3 } from "three";
import { Stage, Circle, Layer } from "react-konva";

function Minimap() {
  // @ts-ignore
  const { geoStore } = useContext(GeoStoreContext);
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);

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
    [GeoDataType.ELECTRICITY]: false,
    [GeoDataType.ADMINISTRATION]: false,
    [GeoDataType.WATER_SUPPLY]: false,
    YOUR_POSITION: true,
  });
  const [scale] = useState<number>(1.5);
  const canvasRef = useRef();

  const padding = 5;
  const pointWidth = 1;

  const resizeCanvas = () => {
    const { minX, maxX, minY, maxY } = getBounds(geoStore.data);
    setBounds({ minX, minY, maxX, maxY });
  };

  const colorCoding = {
    [GeoDataType.ROAD]: "white",
    [GeoDataType.SCHOOL]: "#f97316",
    [GeoDataType.RESIDENTIAL]: "#22c55e",
    [GeoDataType.HOSPITAL]: "#ef4444",
    [GeoDataType.WATER_SUPPLY]: "#0ea5e9",
    [GeoDataType.SEWAGE_TREATMENT]: "#8b5cf6",
    [GeoDataType.ELECTRICITY]: "#14b8a6",
    [GeoDataType.ADMINISTRATION]: "#84cc16",
  };

  useEffect(() => {
    resizeCanvas();
  }, [geoStore, filters]);

  const handleClick = (event: any) => {
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    let offset = { x: event.target.attrs.x, y: event.target.attrs.y };
    if (!offset.x) offset.x = 0;
    if (!offset.y) offset.y = 0;
    const x = (pointerPosition.x - offset.x) / scale + bounds.minX;
    const y = (pointerPosition.y - offset.y) / scale + bounds.minY;

    setMouseControl({
      ...mouseControl,
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

              <p>Click on the map to teleport</p>
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
                className={`border border-red-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.HOSPITAL && "bg-red-500  text-black"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.HOSPITAL);
                }}
              >
                Hospitals
              </div>
              <div
                className={`border border-orange-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.SCHOOL && "bg-orange-500  text-black"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.SCHOOL);
                }}
              >
                School
              </div>
              <div
                className={`border border-violet-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.SEWAGE_TREATMENT && "bg-violet-500  text-black"
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
              <div
                className={`border border-teal-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.ELECTRICITY && "bg-teal-500 text-black"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.ELECTRICITY);
                }}
              >
                Electricity
              </div>
              <div
                className={`border border-sky-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.WATER_SUPPLY && "bg-sky-500 text-black"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.WATER_SUPPLY);
                }}
              >
                Water Supply
              </div>
              <div
                className={`border border-lime-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.ADMINISTRATION && "bg-lime-500 text-black"
                }`}
                onClick={() => {
                  toggleFilter(GeoDataType.ADMINISTRATION);
                }}
              >
                Administration
              </div>
              <div
                className={`border border-cyan-500 m-2 pl-1 pr-1 rounded-md ${
                  filters.YOUR_POSITION && "bg-cyan-500 text-black"
                }`}
                onClick={() => {
                  // @ts-ignore
                  toggleFilter("YOUR_POSITION");
                }}
              >
                Your Position
              </div>
            </div>
            <div className="flex h-[80vh] overflow-scroll">
              <Stage
                height={(bounds.maxY - bounds.minY + padding) * scale}
                width={(bounds.maxX - bounds.minX + padding) * scale}
                // @ts-ignore
                onClick={handleClick}
              >
                {/* @ts-ignore */}
                <Layer ref={canvasRef}>
                  {geoStore.data.map((point: GeoDataPoint) => {
                    switch (point.type) {
                      case GeoDataType.ROAD: {
                        const road: ReactNode[] = [];
                        if (filters.ROAD)
                          point.steps.forEach(
                            (step: Vector3, stepIndex: number) => {
                              road.push(
                                <Circle
                                  key={`GeoDataPoint_Minimap_${point.key}_${stepIndex}`}
                                  radius={pointWidth}
                                  fill={colorCoding[point.type]}
                                  x={scale * (step.x - bounds.minX)}
                                  y={scale * (step.z - bounds.minY)}
                                />
                              );
                            }
                          );
                        return road;
                      }
                      case GeoDataType.RESIDENTIAL: {
                        return (
                          <Circle
                            key={`GeoDataPoint_Minimap_${point.key}`}
                            radius={pointWidth}
                            fill={colorCoding[point.type]}
                            x={scale * (point.centralPoint.x - bounds.minX)}
                            y={scale * (point.centralPoint.z - bounds.minY)}
                          />
                        );
                      }
                      case GeoDataType.HOSPITAL: {
                        return (
                          filters.HOSPITAL && (
                            <Circle
                              key={`GeoDataPoint_Minimap_${point.key}`}
                              radius={pointWidth * 5}
                              fill={colorCoding[point.type]}
                              x={scale * (point.centralPoint.x - bounds.minX)}
                              y={scale * (point.centralPoint.z - bounds.minY)}
                            />
                          )
                        );
                      }
                      case GeoDataType.SEWAGE_TREATMENT: {
                        return (
                          filters.SEWAGE_TREATMENT && (
                            <Circle
                              key={`GeoDataPoint_Minimap_${point.key}`}
                              radius={pointWidth * 5}
                              fill={colorCoding[point.type]}
                              x={scale * (point.centralPoint.x - bounds.minX)}
                              y={scale * (point.centralPoint.z - bounds.minY)}
                            />
                          )
                        );
                      }
                      case GeoDataType.WATER_SUPPLY: {
                        return (
                          filters.WATER_SUPPLY && (
                            <Circle
                              key={`GeoDataPoint_Minimap_${point.key}`}
                              radius={pointWidth * 5}
                              fill={colorCoding[point.type]}
                              x={scale * (point.centralPoint.x - bounds.minX)}
                              y={scale * (point.centralPoint.z - bounds.minY)}
                            />
                          )
                        );
                      }
                      case GeoDataType.ADMINISTRATION: {
                        return (
                          filters.ADMINISTRATION && (
                            <Circle
                              key={`GeoDataPoint_Minimap_${point.key}`}
                              radius={pointWidth * 5}
                              fill={colorCoding[point.type]}
                              x={scale * (point.centralPoint.x - bounds.minX)}
                              y={scale * (point.centralPoint.z - bounds.minY)}
                            />
                          )
                        );
                      }
                      case GeoDataType.ELECTRICITY: {
                        return (
                          filters.ELECTRICITY && (
                            <Circle
                              key={`GeoDataPoint_Minimap_${point.key}`}
                              radius={pointWidth * 5}
                              fill={colorCoding[point.type]}
                              x={scale * (point.centralPoint.x - bounds.minX)}
                              y={scale * (point.centralPoint.z - bounds.minY)}
                            />
                          )
                        );
                      }
                      case GeoDataType.SCHOOL: {
                        return (
                          filters.SCHOOL && (
                            <Circle
                              key={`GeoDataPoint_Minimap_${point.key}`}
                              radius={pointWidth * 5}
                              fill={colorCoding[point.type]}
                              x={scale * (point.centralPoint.x - bounds.minX)}
                              y={scale * (point.centralPoint.z - bounds.minY)}
                            />
                          )
                        );
                      }
                    }
                  })}
                </Layer>
                <Layer>
                  {filters.YOUR_POSITION && (
                    <Circle
                      radius={10}
                      fill={"#67e8f9"}
                      x={scale * (mouseControl.camPos.x - bounds.minX)}
                      y={scale * (mouseControl.camPos.z - bounds.minY)}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
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
