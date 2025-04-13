import * as THREE from 'three'
import { ThreeElements, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

export function UIIA(props: ThreeElements['mesh']) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const gltf = useLoader(GLTFLoader, 'uiia/scene.gltf')
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene])

  const mixer = useMemo(
    () => new THREE.AnimationMixer(clonedScene),
    [clonedScene]
  )
  useEffect(() => {
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play()
    })
  }, [gltf.animations, mixer])

  useFrame((_, delta) => {
    mixer.update(delta)
  })

  return (
    <primitive
      onClick={() => {
        meshRef.current.rotation.y += Math.PI * 0.5
      }}
      object={clonedScene}
      ref={meshRef}
      {...props}
    />
  )
}
