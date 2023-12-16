import { useContext } from "react";
import { GeoStoreContext } from "../App";
import { GeoDataPoint, GeoDataType } from "../interface/geo";
import { Vector3, Shape, ShapeGeometry, TextureLoader, Euler } from "three";
import { CatmullRomLine, Center } from "@react-three/drei";
import { getRoadBoundaries, getRoadCoordinates } from "../utils/terrain";
import { setUV } from "./renderer";
import { useLoader } from "@react-three/fiber";

function Roads() {
  // @ts-ignore
  const { geoStore, setGeoStore } = useContext(GeoStoreContext);

  return geoStore.data.map((GeoDataPoint: GeoDataPoint) => {
    switch (GeoDataPoint.type) {
      case GeoDataType.ROAD: {
        const polugonBoundaries = getRoadBoundaries(GeoDataPoint.steps, 2);
        // const roadCoordinates: Vector3[][] = getRoadCoordinates(
        //   GeoDataPoint.steps,
        //   2
        // );

        const shape = new Shape();
        polugonBoundaries.forEach((coordinate: THREE.Vector3) => {
          shape.lineTo(coordinate.x, coordinate.z);
        });
        const geometry = new ShapeGeometry(shape);
        setUV(geometry);

        const texture = useLoader(
          TextureLoader,
          "/agriculture/pexels-pok-rie-4861069.jpg"
        );

        return (
          <Center
            key={GeoDataPoint.key}
            top
            position={[0, 2, 0]}
            rotation={new Euler(-1.57, 0, 0)}
          >
            <mesh geometry={geometry}>
              <meshStandardMaterial map={texture} />
            </mesh>
          </Center>
        );
      }
    }
  });
}

export default Roads;
