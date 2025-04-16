import { Canvas } from '@react-three/fiber'
import { Animal, AnimalRef } from './Animal'
import { OrbitControls, useTexture } from '@react-three/drei'
import { PlaneAttributes } from '../constants/plane'
import React, { useRef } from 'react'
import * as THREE from 'three'

function App() {
  const chickenSize = 10
  const chickenRefs = useRef<React.RefObject<AnimalRef | null>[]>([])
  if (chickenRefs.current.length === 0) {
    chickenRefs.current = Array.from({ length: chickenSize }, () =>
      React.createRef<AnimalRef>()
    )
  }

  const Plane = () => {
    const [colorMap, normalMap, roughnessMap] = useTexture([
      'texture/rocky_terrain_diff_1k.jpg',
      'texture/rocky_terrain_nor_dx_1k.jpg',
      'texture/rocky_terrain_rough_1k.jpg',
    ])

    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry
          args={[
            PlaneAttributes.width,
            PlaneAttributes.height,
            PlaneAttributes.depth,
          ]}
        />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          roughness={1} // adjust roughness value if needed
        />
      </mesh>
    )
  }

  return (
    <>
      <button
        onClick={() =>
          chickenRefs.current.forEach((ref) => {
            ref.current?.walkToDirection(new THREE.Vector3(1, 0, 0))
          })
        }
      >
        Make chicken 0 walk east
      </button>
      <Canvas
        style={{
          width: '100vw',
          height: '100vh',
        }}
        camera={{ position: [10, 10, 0], fov: 75 }}
      >
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {/* Adding the OrbitControls */}
        <OrbitControls />
        {/* Plane at the base */}
        <Plane />
        {/* Chicken always on top of the plane */}
        {Array.from({ length: chickenSize }, (_, i) => (
          <Animal
            key={'chicken ' + i}
            ref={chickenRefs.current[i]}
            scale={0.1}
            gltfPath="chicken/scene.gltf"
          />
        ))}
        {Array.from({ length: chickenSize }, (_, i) => (
          <Animal key={'cow ' + i} scale={0.1} gltfPath="cow/scene.gltf" />
        ))}
        {Array.from({ length: chickenSize }, (_, i) => (
          <Animal key={'sheep ' + i} scale={0.1} gltfPath="sheep/scene.gltf" />
        ))}
      </Canvas>
    </>
  )
}

export default App
