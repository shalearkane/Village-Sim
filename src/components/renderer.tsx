import { GeoStoreContext, Shadows, ToolbarContext } from "../App";
import { GeoData, GeoDataPoint, GeoDataType } from "../interface/geo";
import { Center } from "@react-three/drei";
import { Toolbar } from "../interface/toolbar";
import { useContext } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene.clone(true)} />;
}

export default function GenerateObjects({ GeoData }: { GeoData: GeoData }) {
  // @ts-ignore
  const { selectedTool, setSelectedTool } = useContext(ToolbarContext);
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);

  const deleteBlock = (key: string) => {
    const newGeoData: GeoData = [];
    console.log(key);
    geoStore.data.forEach((point: GeoDataPoint) => {
      if (point.key != key) {
        newGeoData.push(point);
      }
    });

    setGeoStore({ ...geoStore, data: newGeoData });
  };

  const handleClick = (key: string) => {
    switch (selectedTool) {
      case Toolbar.DELETE: {
        deleteBlock(key);
      }
    }
  };

  return GeoData.map((GeoDataPoint: GeoDataPoint) => {
    switch (GeoDataPoint.type) {
      case GeoDataType.ROAD: {
        // renderedElements.push(<Center top position={[, 0, 2]}>
        //     <mesh castShadow>
        //       <sphereGeometry args={[0.5, 64, 64]} />
        //       <meshStandardMaterial color="#9d4b4b" />
        //     </mesh>
        //   </Center>)
        break;
      }
      case GeoDataType.RESIDENTIAL: {
        return (
          <Center
            castShadow={true}
            onClick={(event) => {
              event.stopPropagation();
              handleClick(GeoDataPoint.key);
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            {/* <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh> */}
            <Model url={"assets/residential/Houses.glb"} />
            {/* <Shadows /> */}
          </Center>
        );
      }
      case GeoDataType.HOSPITAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.AGRICULTURAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.COMMERCIAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.INDUSTRIAL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.SCHOOL: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.HEALTH: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.SEWAGE_TREATMENT: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
      case GeoDataType.WATER_BODY: {
        return (
          <Center
            onClick={() => {
              handleClick(GeoDataPoint.key);
            }}
            key={GeoDataPoint.key}
            top
            position={GeoDataPoint.centralPoint}
          >
            <mesh castShadow>
              <sphereGeometry args={[0.5, 64, 64]} />
              <meshStandardMaterial color="#9d4b4b" />
            </mesh>
          </Center>
        );
      }
    }
  });
}
