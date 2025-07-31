import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type CylinderMesh = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;

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
    cameraPositionZ: number = 5,
    cameraPositionY: number = -5,
    cameraPositionX: number = 0
): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = cameraPositionZ;
    camera.position.y = cameraPositionY;
    camera.position.x = cameraPositionX;
    return camera;
}

export function createGrid(gridSize: number, gridStep: number): THREE.GridHelper {
    const grid = new THREE.GridHelper(gridSize, gridStep);
    grid.rotation.x = Math.PI / 2;
    return grid;
}

export function createControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional
    controls.update();
    return controls;
}

export function createBaseFrame(arrowThickness: number = 4): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.material.linewidth = arrowThickness;
    return axesHelper;
}

export type Axis = 'x' | 'y' | 'z';

export function createLinkOrigin(direction: Axis, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(3);
    axesHelper.material.linewidth = 1;
    
    // Orient the origin frame based on the specified direction
    if (direction === 'x') {
        axesHelper.rotateZ(-Math.PI / 2); // Rotate so z-axis points along x
    } else if (direction === 'y') {
        // Default orientation has z-axis pointing along y, so no rotation needed
    } else { // direction === 'z'
        axesHelper.rotateX(Math.PI / 2); // Rotate so z-axis points along z
    }
    
    parent.add(axesHelper);
    return axesHelper;
}

export function createLink(length: number = 0, parent: THREE.Object3D): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(1, 1, length, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cylinder = new THREE.Mesh(geometry, material);
    
    // Always align with z-axis of parent origin (cylinder's default is along y-axis)
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.z = length / 2; // Position so link starts at origin
    
    parent.add(cylinder);
    return cylinder;
}

export function createLinkEndFrame(length: number, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(3);
    axesHelper.material.linewidth = 1;
    
    // Position at the end of the link (along z-axis)
    axesHelper.position.z = length;
    
    parent.add(axesHelper);
    return axesHelper;
}

export function createJoint(parent: THREE.Object3D): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xb30086 });
    const cylinder = new THREE.Mesh(geometry, material);
    
    // Joint is positioned at the origin of its parent frame
    // Orient along z-axis (same as links)
    cylinder.rotation.x = Math.PI / 2;
    
    parent.add(cylinder);
    return cylinder;
}

export function createJointFrame(theta: number, jointDirection: Axis, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.material.linewidth = 2;
    
    // Apply joint rotation around the specified axis
    const rotationAngle = (theta * Math.PI) / 180;
    if (jointDirection === 'x') {
        axesHelper.rotateX(rotationAngle);
    } else if (jointDirection === 'y') {
        axesHelper.rotateY(rotationAngle);
    } else { // jointDirection === 'z'
        axesHelper.rotateZ(rotationAngle);
    }
    
    parent.add(axesHelper);
    return axesHelper;
}





export function createTCPframe(link2length: number, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    
    // Position relative to parent link
    axesHelper.translateY(-link2length / 2);
    axesHelper.rotateZ(Math.PI);
    
    parent.add(axesHelper);
    return axesHelper;
}
