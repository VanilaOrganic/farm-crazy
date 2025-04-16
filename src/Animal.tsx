import { ThreeElements, useFrame, useLoader } from '@react-three/fiber'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { getRandomPositionWithinPlane } from '../utils/utils'
import { MODEL_OFFSET, PlaneAttributes } from '../constants/plane'

interface AnimalProps {
  gltfPath: string
}

export interface AnimalRef {
  walkToDirection: (dir: THREE.Vector3) => void
}

export const Animal = forwardRef<
  AnimalRef,
  AnimalProps & ThreeElements['mesh']
>((props, ref) => {
  const animalRef = useRef<THREE.Mesh>(null!)
  const [position, setPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  )
  const [isMoving, setIsMoving] = useState(false)
  const [randomMovement, setRandomMovement] = useState({
    vector: new THREE.Vector3(0, 0, 0),
    angle: 0,
    speed: 0,
    distance: 0,
    moved: 0,
  })

  // ✅ Expose custom movement control
  useImperativeHandle(ref, () => ({
    walkToDirection(dir: THREE.Vector3) {
      const direction = dir.clone().normalize()
      const angleY = Math.atan2(direction.x, direction.z)
      const speed = Math.random() * 0.05 + 0.01
      const distance = Math.random() * 3 + 2

      setRandomMovement({
        vector: direction,
        angle: angleY,
        speed,
        distance,
        moved: 0,
      })
      setIsMoving(true)
    },
  }))

  // Random movement schedule
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const scheduleMovement = () => {
      const randomDelay = Math.random() * 2000 + 1000

      timeout = setTimeout(() => {
        if (!isMoving) {
          const randomX = Math.random() * 2 - 1
          const randomZ = Math.random() * 2 - 1
          const direction = new THREE.Vector3(randomX, 0, randomZ).normalize()
          const angleY = Math.atan2(direction.x, direction.z)
          const speed = Math.random() * 0.05 + 0.01
          const distance = Math.random() * 3 + 2

          setRandomMovement({
            vector: direction,
            angle: angleY,
            speed,
            distance,
            moved: 0,
          })
          setIsMoving(true)
        }

        scheduleMovement()
      }, randomDelay)
    }

    scheduleMovement()
    return () => clearTimeout(timeout)
  }, [isMoving])

  // Load model
  const gltf = useLoader(GLTFLoader, props.gltfPath)
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene])

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(animalRef.current)
    setPosition(
      getRandomPositionWithinPlane(Math.abs(box.min.y) + MODEL_OFFSET)
    )
  }, [])

  // Frame update
  useFrame(() => {
    if (isMoving) {
      const moveStep = randomMovement.vector
        .clone()
        .multiplyScalar(randomMovement.speed)
      animalRef.current.position.add(moveStep)

      const newMoved = randomMovement.moved + moveStep.length()
      animalRef.current.rotation.y = randomMovement.angle

      if (newMoved >= randomMovement.distance) {
        setIsMoving(false)
        setRandomMovement((prev) => ({ ...prev, moved: 0 }))
      } else {
        setRandomMovement((prev) => ({ ...prev, moved: newMoved }))
      }
    }

    const pos = animalRef.current.position
    const halfWidth = PlaneAttributes.width / 2
    const halfHeight = PlaneAttributes.height / 2
    if (pos.x > halfWidth) pos.x = halfWidth
    if (pos.x < -halfWidth) pos.x = -halfWidth
    if (pos.z > halfHeight) pos.z = halfHeight
    if (pos.z < -halfHeight) pos.z = -halfHeight
  })

  return (
    <group>
      <primitive
        object={clonedScene}
        ref={animalRef}
        position={position}
        onClick={() => {
          animalRef.current.position.y += 1
          animalRef.current.rotation.y += Math.PI * 0.5
        }}
        {...props}
      />
    </group>
  )
})
