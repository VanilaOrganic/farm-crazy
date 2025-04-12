import { Canvas } from '@react-three/fiber'
import { Chicken } from './chicken'
import { OrbitControls, useTexture } from '@react-three/drei'

function App() {
  const planeAtrributes = {
    width: 20,
    height: 20,
    depth: 0.5,
  }

  const chickenCount = 10

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
            planeAtrributes.width,
            planeAtrributes.height,
            planeAtrributes.depth,
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
      {Array.from({ length: chickenCount }, (_, i) => (
        <Chicken
          key={i}
          position={[
            Math.random() * planeAtrributes.width - planeAtrributes.width / 2,
            planeAtrributes.depth * 2,
            Math.random() * planeAtrributes.height - planeAtrributes.height / 2,
          ]}
        />
      ))}
      {/* Keep chicken slightly above the plane */}
    </Canvas>
  )
}

export default App
