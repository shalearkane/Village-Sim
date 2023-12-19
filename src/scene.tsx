import Camera from "./components/camera";
import {
  Environment,
  OrbitControls,
  Sky,
  Stats,
  GizmoHelper,
  GizmoViewport,
  useProgress,
} from "@react-three/drei";
import VisualBlock from "./components/visualBlock";
import GenerateObjects from "./components/renderer";
import Earth from "./components/earth";
import { Boundaries } from "./interface/geo";

function Scene(bounds: Boundaries) {
  const progress = useProgress();
  console.log(progress);
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
