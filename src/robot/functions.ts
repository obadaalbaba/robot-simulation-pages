import * as THREE from 'three';
import { type Axis, type CylinderMesh } from '../shared/types';

export function createLinkOrigin(direction: Axis, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(3);
    axesHelper.material.linewidth = 1;
    
    // Orient the origin frame based on the specified direction
    if (direction === 'x') {
        axesHelper.rotateY(Math.PI / 2); // Rotate so z-axis points along x
    } else if (direction === 'y') {
        axesHelper.rotateX(-Math.PI / 2);
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

export function createJoint(parent: THREE.Object3D, direction: Axis): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xb30086 });
    const cylinder = new THREE.Mesh(geometry, material);
    
    // Joint is positioned at the origin of its parent frame
    // Orient along z-axis (same as links)
    if (direction === 'x') {
        cylinder.rotation.z= Math.PI / 2;
    } else if (direction === 'y') {
        // no rotation needed
    } else {
        cylinder.rotation.x = Math.PI / 2;
    }

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

export function createTCPframe(parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(5);    
    parent.add(axesHelper);

    return axesHelper;
}