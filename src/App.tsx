import { memo, useEffect } from 'react'
import { Canvas, events } from '@react-three/fiber'
import { Grid, Center, GizmoHelper, GizmoViewport, AccumulativeShadows, RandomizedLight, OrbitControls, Environment } from '@react-three/drei'
import { useControls } from 'leva'
import GenerateObjects from './components/renderer'
import { dummyData } from './dummy'
import { GeoData } from './interface/geo'
import React from 'react'

export default function App() {
  const [geoData, setGeoData] = React.useState<GeoData>(dummyData)
  const [objects, setObjects] = React.useState<any>(null);

  useEffect(() => {
    setObjects(GenerateObjects(geoData))
  }, [geoData])

  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: '#6f6f6f',
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: '#9d4b4b',
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true
  })

  return (
    <Canvas shadows style={{ height: "100vh", width: "100vw" }}>
      <group position={[0, -0.5, 0]}>
        {
          objects
        }
        <Shadows />
        <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
      </group>
      <OrbitControls makeDefault />
      <Environment files="assets/potsdamer_platz_1k.hdr" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
      </GizmoHelper>
    </Canvas>
  )
}

const Shadows = memo(() => (
  <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
))
