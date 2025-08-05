import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SceneConfig } from './types';

export function createScene(sceneColor: number): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneColor);
    return scene;
}

export function createRenderer(container?: HTMLElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (container) {
        container.appendChild(renderer.domElement);
    }
    return renderer;
}

export function createCamera(
    cameraPositionZ: number,
    cameraPositionY: number,
    cameraPositionX: number,
    cameraConfig: SceneConfig['camera']
): THREE.OrthographicCamera {
    const aspect = window.innerWidth / window.innerHeight;
    const { frustumSize, near, far } = cameraConfig;
    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2, // left
        frustumSize * aspect / 2,  // right
        frustumSize / 2,           // top
        -frustumSize / 2,          // bottom
        near,                      // near
        far                        // far
    );
    camera.position.z = cameraPositionZ;
    camera.position.y = cameraPositionY;
    camera.position.x = cameraPositionX;
    return camera;
}

export function createGrid(gridSize: number, gridStep: number): THREE.GridHelper {
    const grid = new THREE.GridHelper(gridSize, gridStep);
    // grid.rotation.x = Math.PI / 2;
    return grid;
}

export function createControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional
    controls.update();
    return controls;
}

export function createReferenceFrame(referenceFrameConfig: SceneConfig['referenceFrame']): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(referenceFrameConfig.size);

    return axesHelper;
}