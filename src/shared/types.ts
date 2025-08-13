import * as THREE from 'three';

export type Axis = 'x' | 'y' | 'z';

export type CylinderMesh = THREE.Mesh<
  THREE.CylinderGeometry,
  THREE.Material | THREE.Material[],
  THREE.Object3DEventMap
>;