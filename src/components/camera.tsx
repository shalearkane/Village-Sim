import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { Vector3 } from "three";
import { MouseControlContext } from "../App";

function Camera(props: any) {
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);
  const camera = useThree((state) => state.camera);

  const changeCameraPos = ({ x, z }: { x: number; z: number }) => {
    camera.lookAt(new Vector3(x, 0, z));
    camera.position.lerp(new Vector3(x, 10, z), 1);
    camera.updateProjectionMatrix();
    camera.updateWorldMatrix(true, true);
    camera.updateMatrix();
  };

  const changeCameraPosition = () => {
    if (
      mouseControl.camPos.x != camera.position.x ||
      mouseControl.camPos.y != camera.position.y
    )
      setMouseControl({
        ...mouseControl,
        camPos: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
      });
  };

  useEffect(() => {
    if (mouseControl.newCameraPos) changeCameraPos(mouseControl.newCameraPos);
  }, [mouseControl.newCameraPos]);

  return (
    <PerspectiveCamera onPointerMove={changeCameraPosition}>
      {props.children}
    </PerspectiveCamera>
  );
}

export default Camera;
