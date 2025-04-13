import { ThreeElements, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { getRandomPositionWithinPlane } from '../utils/utils'

export function Sheep(props: ThreeElements['mesh']) {
  const sheepRef = useRef<THREE.Mesh>(null!)
  const boxHelperRef = useRef<THREE.BoxHelper>(null!)
  const [position, setPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  )

  // load model
  const gltf = useLoader(GLTFLoader, 'sheep/scene.gltf')

  // clone gltf object because useLoader cached model.
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene])

  // set model height on load.
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(sheepRef.current)
    setPosition(getRandomPositionWithinPlane(Math.abs(box.min.y) + 0.1))
  }, [])

  // execute this code every frame
  useFrame(() => {
    if (boxHelperRef.current !== null) {
      // update boxHelper object to match with chicken object (position, rotation, etc)
      boxHelperRef.current.update()
    }
  })

  return (
    <group>
      <primitive
        object={clonedScene}
        ref={sheepRef}
        position={position}
        onClick={() => {
          sheepRef.current.position.y += 1
          sheepRef.current.rotation.y += Math.PI * 0.5
        }}
        {...props}
      />
      {sheepRef.current ? (
        <primitive
          object={new THREE.BoxHelper(sheepRef.current, 0xffff00)}
          ref={boxHelperRef}
        />
      ) : (
        <></>
      )}
    </group>
  )
}
