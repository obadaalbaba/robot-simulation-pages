import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { linkOrientation, frameOrientation } from './constants';

type CylinderMesh = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;

function createScene(sceneColor: number): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneColor);
    return scene;
}

function createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

function createCamera(
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

function createGrid(gridSize: number, gridStep: number): THREE.GridHelper {
    const grid = new THREE.GridHelper(gridSize, gridStep);
    grid.rotation.x = Math.PI / 2;
    return grid;
}

function createControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional
    controls.update();
    return controls;
}

function createBaseFrame(arrowThickness: number = 4): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.material.linewidth = arrowThickness;
    return axesHelper;
}

function createLink0(direction: string = 'z', length: number = 0): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(1, 1, length, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cylinder = new THREE.Mesh(geometry, material);
    (cylinder.position as any)[direction] = length / 2;
    (cylinder.rotation as any)[linkOrientation[direction]['axis']] = linkOrientation[direction]['rotation'];

    return cylinder;
}

interface CustomJointMesh extends THREE.Mesh { // todo: fix this
    direction?: string; // this should be an enum. preferrably from three.js
    align?: boolean;
}

function createJoint1(direction: string = 'y', link0direction: string, link0length: number): CustomJointMesh {
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xb30086 });
    const cylinder = new THREE.Mesh(geometry, material) as CustomJointMesh;
    (cylinder.position as any)[link0direction!] = link0length!;
    (cylinder.rotation as any)[linkOrientation[direction]['axis']] = -linkOrientation[direction]['rotation'];
    cylinder.direction = direction;
    return cylinder;
}

function createFrame1(direction: string, link0direction: string, link0length: number, theta1: number): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    (axesHelper.material as THREE.LineBasicMaterial).linewidth = 2;
    (axesHelper.position as any)[link0direction!] = link0length!;
    (axesHelper.rotation as any)[frameOrientation[direction]['axis']] = -frameOrientation[direction]['rotation'];
    axesHelper.rotation.z = (theta1 * Math.PI) / 180;
    return axesHelper;
}

function createLink(frame1: THREE.AxesHelper, length: number = 0): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(1, 1, length, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = frame1.position.x;
    cylinder.position.y = frame1.position.y;
    cylinder.position.z = frame1.position.z;
    cylinder.rotation.x = frame1.rotation.x;
    cylinder.rotation.y = frame1.rotation.y;
    cylinder.rotation.z = frame1.rotation.z + Math.PI / 2;
    cylinder.translateY(-length / 2);

    return cylinder;
}

function createJoint2(link1: CylinderMesh, link1length: number, align: boolean, joint1: CustomJointMesh): CustomJointMesh {
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xb30086 });
    const cylinder = new THREE.Mesh(geometry, material) as CustomJointMesh;
    cylinder.position.x = link1.position.x;
    cylinder.position.y = link1.position.y;
    cylinder.position.z = link1.position.z;
    cylinder.rotation.x = link1.rotation.x;
    cylinder.rotation.y = link1.rotation.y;
    cylinder.rotation.z = link1.rotation.z;
    cylinder.translateY(-link1length / 2);
    if (joint1.direction === 'y') {
        cylinder.rotateZ(Math.PI / 2);
    } else if (joint1.direction === 'x') {
        cylinder.rotateZ(Math.PI / 2);
    } else {
        cylinder.rotateZ(Math.PI / 2);
    }
    const rotation = align ? Math.PI / 2 : 0;
    cylinder.rotateX(rotation);
    cylinder.align = align;
    return cylinder;
}

function createFrame2(joint2: CustomJointMesh, frame1: THREE.AxesHelper, theta2: number): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    const rotation = joint2.align ? 0 : Math.PI / 2;
    (axesHelper.material as THREE.LineBasicMaterial).linewidth = 2;
    axesHelper.position.x = joint2.position.x;
    axesHelper.position.y = joint2.position.y;
    axesHelper.position.z = joint2.position.z;
    axesHelper.rotation.x = frame1.rotation.x;
    axesHelper.rotation.y = frame1.rotation.y;
    axesHelper.rotation.z = frame1.rotation.z;
    axesHelper.rotateX(rotation);
    axesHelper.rotateZ(theta2 * Math.PI / 180);
    return axesHelper;
}

function createTCPframe(link3: CylinderMesh, link2length: number): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);
    axesHelper.position.x = link3.position.x;
    axesHelper.position.y = link3.position.y;
    axesHelper.position.z = link3.position.z;
    axesHelper.rotation.x = link3.rotation.x;
    axesHelper.rotation.y = link3.rotation.y;
    axesHelper.rotation.z = link3.rotation.z;
    axesHelper.translateY(-link2length / 2);
    axesHelper.rotateZ(Math.PI);
    return axesHelper;
}

export {
    createScene,
    createRenderer,
    createCamera,
    createGrid,
    createControls,
    createBaseFrame,
    createLink0,
    createJoint1,
    createFrame1,
    createLink,
    createJoint2,
    createFrame2,
    createTCPframe
};