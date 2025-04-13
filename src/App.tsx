import { Canvas } from '@react-three/fiber'
import { Chicken } from './Chicken'
import { OrbitControls, useTexture } from '@react-three/drei'
import { PlaneAttributes } from '../constants/plane'
import { Cow } from './Cow'
import { Sheep } from './Sheep'

function App() {
  const chickenSize = 10

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
        <Chicken key={'chicken ' + i} scale={0.1} />
      ))}
      {Array.from({ length: chickenSize }, (_, i) => (
        <Cow key={'cow ' + i} scale={0.1} />
      ))}
      {Array.from({ length: chickenSize }, (_, i) => (
        <Sheep key={'sheep ' + i} scale={0.1} />
      ))}
    </Canvas>
  )
}

export default App
