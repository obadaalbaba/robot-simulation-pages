import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createScene(sceneColor: number): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneColor);
    return scene;
}

export function createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export function createCamera(
    cameraPositionZ: number,
    cameraPositionY: number,
    cameraPositionX: number
): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
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

export function createReferenceFrame(arrowThickness: number = 4): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.material.linewidth = arrowThickness;
    return axesHelper;
}