/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 assets/school/scene.glb -o src/components/models/school.jsx 
Author: rikki23 (https://sketchfab.com/rikki23)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/low-poly-school-building-c78ace4136f341e883ba8cdd48375068
Title: Low Poly  School Building
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/school/scene.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.phong1SG} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.phong1SG} />
      </group>
    </group>
  )
}

useGLTF.preload('/school/scene.glb')
