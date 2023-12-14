import { GeoData, GeoDataPoint, GeoDataType } from "../interface/geo";
import { Grid, Center } from "@react-three/drei";

export default function GenerateObjects({ GeoData }: { GeoData: GeoData }) {
  console.log(GeoData);
  // var renderedElements: any = [];
  // GeoData.forEach((GeoDataPoint: GeoDataPoint) => {});
  return GeoData.map((GeoDataPoint: GeoDataPoint, geoDataIndex: number) => {
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
            onClick={() => {
              console.log(GeoDataPoint.key);
            }}
            key={`GeoDataIndex_${geoDataIndex}`}
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
      case GeoDataType.HOSPITAL: {
        return (
          <Center
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
            key={`GeoDataIndex_${geoDataIndex}`}
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
