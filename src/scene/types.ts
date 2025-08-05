import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneConfig {
    backgroundColor: number;
    camera: {
        positionZ: number;
        positionY: number;
        positionX: number;
        frustumSize: number;
        near: number;
        far: number;
    };
    grid: {
        size: number;
        divisions: number;
    };
    referenceFrame: {
        size: number;
        thickness: number;
    };
}

export interface SceneComponents {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    controls: OrbitControls;
    grid: THREE.GridHelper;
    worldReferenceFrame: THREE.Group;
}