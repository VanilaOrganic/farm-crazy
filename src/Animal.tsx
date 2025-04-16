import { ThreeElements, useFrame, useLoader } from '@react-three/fiber'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { getRandomPositionWithinPlane } from '../utils/utils'
import { MODEL_OFFSET, PlaneAttributes } from '../constants/plane'

interface AnimalProps {
  gltfPath: string
  scale?: number
}

export interface AnimalRef {
  walkToDirection: (dir: THREE.Vector3) => void
}

export const Animal = forwardRef<
  AnimalRef,
  AnimalProps & ThreeElements['mesh']
>((props, ref) => {
  const animalRef = useRef<THREE.Mesh>(null!)
  const movementRef = useRef({
    nvector: new THREE.Vector3(0, 0, 0),
    angle: 0,
    speed: 0,
    distance: 0,
    moved: 0,
  })

  // ✅ Expose custom movement control (override movement)
  useImperativeHandle(ref, () => ({
    walkToDirection(dir: THREE.Vector3) {
      const direction = dir.clone().normalize()
      movementRef.current = {
        nvector: direction,
        angle: Math.atan2(direction.x, direction.z),
        speed: Math.random() * 0.05 + 0.01,
        distance: Math.random() * 3 + 2,
        moved: 0,
      }
    },
  }))

  // Random movement schedule
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const scheduleMovement = () => {
      const randomDelay = Math.random() * 2000 + 1000
      timeout = setTimeout(() => {
        // If not moving, then generate random movement
        if (movementRef.current.moved >= movementRef.current.distance) {
          const direction = new THREE.Vector3(
            Math.random() * 2 - 1,
            0,
            Math.random() * 2 - 1
          ).normalize()

          movementRef.current = {
            nvector: direction,
            angle: Math.atan2(direction.x, direction.z),
            speed: Math.random() * 0.05 + 0.01,
            distance: Math.random() * 3 + 2,
            moved: 0,
          }
        }

        scheduleMovement()
      }, randomDelay)
    }

    scheduleMovement()
    return () => clearTimeout(timeout)
  }, [])

  // Load model
  const gltf = useLoader(GLTFLoader, props.gltfPath)
  const clonedScene = clone(gltf.scene)

  // Init pos
  const box = new THREE.Box3().setFromObject(clonedScene)
  const initialPos = getRandomPositionWithinPlane(
    Math.abs(box.min.y) * (props.scale ?? 1) + MODEL_OFFSET
  )
  clonedScene.position.copy(initialPos)

  // Frame update
  useFrame(() => {
    const shouldMove = movementRef.current.moved < movementRef.current.distance

    if (shouldMove) {
      const moveStep = movementRef.current.nvector
        .clone()
        .multiplyScalar(movementRef.current.speed)
      animalRef.current.position.add(moveStep)
      animalRef.current.rotation.y = movementRef.current.angle
      movementRef.current.moved += moveStep.length()

      // Stay within plane
      const pos = animalRef.current.position
      const halfWidth = PlaneAttributes.width / 2
      const halfHeight = PlaneAttributes.height / 2
      pos.x = THREE.MathUtils.clamp(pos.x, -halfWidth, halfWidth)
      pos.z = THREE.MathUtils.clamp(pos.z, -halfHeight, halfHeight)
    }
  })

  return (
    <group>
      <primitive
        object={clonedScene}
        ref={animalRef}
        onClick={() => {
          animalRef.current.position.y += 1
          animalRef.current.rotation.y += Math.PI * 0.5
        }}
        {...props}
      />
    </group>
  )
})
