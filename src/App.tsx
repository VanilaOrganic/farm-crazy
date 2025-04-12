import { Canvas } from '@react-three/fiber'
import { Chicken } from './chicken'
import { UIIA } from './cat';

function App() {
  return (
    <Canvas style={{
      width: '100vw',
      height: '100vh',
    }} camera={{ position: [10, 10, 0], fov: 75, }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {/* <Plane /> */}
      <Chicken position={[0, 0, 0]} />
      <UIIA position={[0, 0, 10]} />
      <UIIA position={[0, 0, -10]} />
    </Canvas>
  )
}

export default App
