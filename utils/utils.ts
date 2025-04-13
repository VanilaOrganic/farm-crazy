import * as THREE from 'three'
import { Vector3 } from 'three'
import { PlaneAttributes } from '../constants/plane'

export function getRandomPositionWithinPlane(
  lowerBoundHeight: number
): Vector3 {
  return new THREE.Vector3(
    Math.random() * PlaneAttributes.width - PlaneAttributes.width / 2,
    calculateAboveGroundPadding(lowerBoundHeight),
    Math.random() * PlaneAttributes.height - PlaneAttributes.height / 2
  )
}

export function calculateAboveGroundPadding(lowerBoundHeight: number): number {
  return lowerBoundHeight + PlaneAttributes.depth / 2
}
