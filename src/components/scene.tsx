import Camera from "./camera";
import {
  Environment,
  OrbitControls,
  Sky,
  Stats,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import VisualBlock from "./visualBlock";
import GenerateObjects from "./renderer";
import Roads from "./road";
import Earth from "./earth";

function Scene() {
  return (
    <Camera>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.8} position={[100, 100, 100]} />
      <VisualBlock />
      <group position={[0, -0.5, 0]}>
        <GenerateObjects />
        <Roads />
      </group>
      <OrbitControls
        makeDefault
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
      <Earth />
    </Camera>
  );
}

export default Scene;