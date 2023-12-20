import Camera from "./components/camera";
import {
  Environment,
  OrbitControls,
  Sky,
  Stats,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import VisualBlock from "./components/visualBlock";
import GenerateObjects from "./components/renderer";
import Earth from "./components/earth";
import { Boundaries } from "./interface/geo";
import { Vector3 } from "three";
import { useContext, useEffect, useState } from "react";
import { MouseControlContext } from "./App";

function Scene(bounds: Boundaries) {
  // @ts-ignore
  const { mouseControl } = useContext(MouseControlContext);
  const [target, setTarget] = useState<Vector3>(new Vector3(0, 0, 0));

  useEffect(() => {
    if (mouseControl.newCameraPos) {
      setTarget(
        new Vector3(
          mouseControl.newCameraPos.x + 10,
          0,
          mouseControl.newCameraPos.z + 10
        )
      );
    }
  }, [mouseControl.newCameraPos]);

  return (
    <Camera>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.8} position={[100, 100, 100]} />
      <VisualBlock />
      <group position={[0, -0.5, 0]}>
        <GenerateObjects />
      </group>
      <OrbitControls
        target={target}
        makeDefault
        dampingFactor={0.9}
        rotateSpeed={0.3}
        enableDamping={false}
        maxPolarAngle={Math.PI / 2}
      />
      <Stats />
      <Environment files="/potsdamer_platz_1k.hdr" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
      <Earth {...bounds} />
    </Camera>
  );
}

export default Scene;
