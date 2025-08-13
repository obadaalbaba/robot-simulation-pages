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

export function createReferenceFrame(referenceFrameConfig: SceneConfig['referenceFrame']): THREE.Group {
    const { size, thickness } = referenceFrameConfig;
    const axesGroup = new THREE.Group();
    
    // Create cylinder geometry for axes
    const cylinderGeometry = new THREE.CylinderGeometry(thickness, thickness, size, 8);
    
    // X-axis (Red)
    const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const xAxis = new THREE.Mesh(cylinderGeometry, xMaterial);
    xAxis.rotation.z = -Math.PI / 2; // Rotate to point along X-axis
    xAxis.position.x = size / 2; // Position at half the length to center
    axesGroup.add(xAxis);
    
    // Y-axis (Green) 
    const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const yAxis = new THREE.Mesh(cylinderGeometry, yMaterial);
    yAxis.position.y = size / 2; // No rotation needed, cylinder is already vertical
    axesGroup.add(yAxis);
    
    // Z-axis (Blue)
    const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const zAxis = new THREE.Mesh(cylinderGeometry, zMaterial);
    zAxis.rotation.x = Math.PI / 2; // Rotate to point along Z-axis
    zAxis.position.z = size / 2;
    axesGroup.add(zAxis);
    
    return axesGroup;
}