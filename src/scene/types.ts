import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneConfig {
    backgroundColor: number;
    camera: {
        positionZ: number;
        positionY: number;
        positionX?: number;
    };
    grid: {
        size: number;
        divisions: number;
    };
    baseFrame: {
        size: number;
    };
}

export interface SceneComponents {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    grid: THREE.GridHelper;
    baseFrame: THREE.AxesHelper;
}