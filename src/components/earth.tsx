import { ThreeEvent, useLoader } from "@react-three/fiber";
import { useContext } from "react";
import * as THREE from "three";
import { MouseControlContext } from "../App";
import { isMobile, isDesktop } from "react-device-detect";
import { Boundaries } from "../interface/geo";

export default function Earth(bounds: Boundaries) {
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);
  const texture = useLoader(
    THREE.TextureLoader,
    "/earth/akshay-chauhan-qBUU6wsgK6A-unsplash_07.jpg"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(100, 100);

  const roughnessMap = useLoader(
    THREE.TextureLoader,
    "/aerial_rocks_04_rough_4k.png"
  );

  const displacementMap = useLoader(
    THREE.TextureLoader,
    "/aerial_rocks_04_nor_4k.png"
  );

  const changeMousePointer = (event: ThreeEvent<PointerEvent>) => {
    let target = new THREE.Vector3();
    let plane = new THREE.Plane();
    plane.setFromCoplanarPoints(
      new THREE.Vector3(0, -0.55, 0),
      new THREE.Vector3(1, -0.55, 0),
      new THREE.Vector3(0, -0.55, 1)
    );
    event.ray.intersectPlane(plane, target);
    setMouseControl({
      ...mouseControl,
      x: target.x,
      y: target.y,
      z: target.z,
    });
  };

  return (
    <mesh
      position={[0, -0.55, 0]}
      rotation={[-1.57, 0, 0]}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        if (isMobile) changeMousePointer(event);
      }}
      onPointerUp={(event: ThreeEvent<PointerEvent>) => {
        if (isMobile) changeMousePointer(event);
      }}
      onPointerMove={(event: ThreeEvent<PointerEvent>) => {
        if (isDesktop) changeMousePointer(event);
      }}
    >
      <planeGeometry
        args={[bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, 100, 100]}
      />
      <meshStandardMaterial
        map={texture}
        roughnessMap={roughnessMap}
        displacementMap={displacementMap}
        roughness={10}
        displacementScale={0.1}
      />
    </mesh>
  );
}
