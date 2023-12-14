import { ThreeEvent, useLoader, useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { TextureLoader } from "three";
import { MouseControlContext } from "../App";

export default function Earth() {
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);
  const { gl } = useThree();
  const texture = useLoader(
    TextureLoader,
    "assets/aerial_rocks_04_diff_4k.jpg"
  );
  const displacementMap = useLoader(
    TextureLoader,
    "assets/aerial_rocks_04_rough_4k.png"
  );

  useEffect(() => {
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
  }, [texture, gl]);

  return (
    <mesh
      receiveShadow={true}
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
        displacementMap={displacementMap}
        displacementScale={0.05}
      />
    </mesh>
  );
}
