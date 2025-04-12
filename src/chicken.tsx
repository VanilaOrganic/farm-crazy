import { useLoader, Vector3 } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export function Chicken({ position }: { position: Vector3 }) {
  const chickenRef = useRef<THREE.Mesh>(null!);
  // const boxRef = useRef<THREE.Mesh>(null!);

  const gltf = useLoader(GLTFLoader, "chicken/scene.gltf");
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  useFrame(() => {
    // Optional rotation update
    // groupRef.current.rotation.y += 0.01
  });

  return (
    <group position={position}>
      <primitive
        object={clonedScene}
        ref={chickenRef}
        scale={0.1}
        onClick={() => {
          chickenRef.current.rotation.y += Math.PI * 0.5;
          chickenRef.current.position.y += Math.PI * 0.5;
        }}
      />
      {/* <mesh
        position={[0, 0, 0]}
        ref={boxRef}
        onClick={() => {
          boxRef.current.rotation.y += Math.PI * 0.5;
          boxRef.current.position.y += Math.PI * 0.5;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"orange"} />
      </mesh> */}
    </group>
  );
}
