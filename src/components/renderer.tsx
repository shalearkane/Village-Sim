import { GeoData, GeoDataPoint, GeoDataType } from "../interface/geo";
import { Grid, Center } from '@react-three/drei'

export default function Renderer(GeoData: GeoData) {
    console.log(GeoData);
    var renderedElements: any = [];
    GeoData.forEach((GeoDataPoint: GeoDataPoint) => {
        switch(GeoDataPoint.type) {
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
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                        <mesh castShadow>
                           <sphereGeometry args={[0.5, 64, 64]} />
                           <meshStandardMaterial color="#9d4b4b" />
                         </mesh>
                       </Center>)
                break;
            }
            case GeoDataType.HOSPITAL: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.AGRICULTURAL: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.COMMERCIAL: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.INDUSTRIAL: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.SCHOOL: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.HEALTH: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.SEWAGE_TREATMENT: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
            case GeoDataType.WATER_BODY: {
                renderedElements.push(<Center top position={[GeoDataPoint.centralPoint.x, 0, GeoDataPoint.centralPoint.y]}>
                    <mesh castShadow>
                       <sphereGeometry args={[0.5, 64, 64]} />
                       <meshStandardMaterial color="#9d4b4b" />
                     </mesh>
                   </Center>)
                break;
            }
        }
    })
    return renderedElements;
} 