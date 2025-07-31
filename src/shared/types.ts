import * as THREE from 'three';

export type Axis = 'x' | 'y' | 'z';

export type CylinderMesh = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;