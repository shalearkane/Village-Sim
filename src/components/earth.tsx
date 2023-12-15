import { ThreeEvent, useLoader } from "@react-three/fiber";
import { useContext } from "react";
import * as THREE from "three";
import { MouseControlContext } from "../App";

export default function Earth() {
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);
  const texture = useLoader(
    THREE.TextureLoader,
    "assets/aerial_rocks_04_diff_4k.jpg"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);

  const roughnessMap = useLoader(
    THREE.TextureLoader,
    "assets/aerial_rocks_04_rough_4k.png"
  );

  const displacementMap = useLoader(
    THREE.TextureLoader,
    "assets/aerial_rocks_04_nor_4k.png"
  );

  return (
    <mesh
      position={[0, -0.55, 0]}
      rotation={[-1.57, 0, 0]}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        setMouseControl({
          ...mouseControl,
          x: event.point.x,
          y: event.point.y,
          z: event.point.z,
        });
      }}
    >
      <planeGeometry args={[50, 50, 100, 100]} />
      <meshStandardMaterial
        map={texture}
        roughnessMap={roughnessMap}
        displacementMap={displacementMap}
        roughness={10}
        displacementScale={0.2}
      />
    </mesh>
  );
}
