import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { Vector3 } from "three";
import { MouseControlContext } from "../App";
import { getCoordinateAtDistance } from "../utils/math";

function Camera(props: any) {
  // @ts-ignore
  const { mouseControl, setMouseControl } = useContext(MouseControlContext);
  const camera = useThree((state) => state.camera);

  const changeCameraPos = ({ x, z }: { x: number; z: number }) => {
    camera.lookAt(new Vector3(x, 0, z));
    camera.position.lerp(new Vector3(x, 1, z), 1);
    camera.updateProjectionMatrix();
    camera.updateWorldMatrix(true, true);
    camera.updateMatrix();
    const d = new Date();

    setMouseControl({
      ...mouseControl,
      camPos: {
        x: x,
        y: 1,
        z: z,
        time: d.getTime(),
      },
    });
  };

  useEffect(() => {
    camera.position.x = 5;
    camera.position.y = 2;
    camera.position.z = 5;
  }, []);

  useFrame((state) => {
    // Bound camera
    if (state.camera.position.y > 4) state.camera.position.y = 4;
    if (state.camera.position.y < 0) state.camera.position.y = 0;

    const distantCoordinate = getCoordinateAtDistance(
      new Vector3(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z
      ),
      // @ts-ignore
      state.controls.target,
      10
    );

    // @ts-ignore
    state.controls.target = distantCoordinate;
  });

  const changeCameraPosition = () => {
    if (
      mouseControl.camPos.x != camera.position.x ||
      mouseControl.camPos.y != camera.position.y
    ) {
      const d = new Date();
      setMouseControl({
        ...mouseControl,
        camPos: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
          time: d.getTime(),
        },
      });
    }
  };

  useEffect(() => {
    if (mouseControl.newCameraPos) changeCameraPos(mouseControl.newCameraPos);
  }, [mouseControl.newCameraPos]);

  return (
    <PerspectiveCamera onPointerMove={changeCameraPosition}>
      <OrbitControls
        makeDefault
        dampingFactor={0.9}
        rotateSpeed={0.3}
        enableDamping={false}
        maxPolarAngle={Math.PI / 2}
      />
      {props.children}
    </PerspectiveCamera>
  );
}

export default Camera;
