import * as THREE from 'three';
import { type Axis, type CylinderMesh } from '../shared/types';
import { VISUAL_CONSTANTS } from './robot-definition';

/**
 * COORDINATE SYSTEM ASSUMPTION:
 * This module assumes Y-AXIS DOMINANCE for all robot components:
 * - Link origins align their Y-axis with the specified direction
 * - Links extend along the Y-axis of their parent frame
 * - Link end frames are positioned along the Y-axis
 * 
 * POTENTIAL FLAW: This assumption may not be consistent throughout the entire
 * codebase. Other modules (joints, scene, etc.) might still assume Z-axis
 * dominance, creating coordinate system inconsistencies.
 */

export function createLinkOrigin(direction: Axis, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(VISUAL_CONSTANTS.LINK_ORIGIN_AXES_SIZE);
    axesHelper.material.linewidth = VISUAL_CONSTANTS.STANDARD_LINE_WIDTH;
    
    // Orient the origin frame based on the specified direction
    if (direction === 'x') {
        axesHelper.rotateZ(-Math.PI / 2); // Rotate so y-axis points along x
    } else if (direction === 'y') {
        // No rotation needed - y-axis already points along y
    } else if (direction === 'z') {
        axesHelper.rotateX(Math.PI / 2); // Rotate so y-axis points along z
    }
    
    parent.add(axesHelper);
    return axesHelper;
}

export function createLink(length: number = 0, parent: THREE.Object3D): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(VISUAL_CONSTANTS.LINK_RADIUS, VISUAL_CONSTANTS.LINK_RADIUS, length, VISUAL_CONSTANTS.CYLINDER_RADIAL_SEGMENTS);
    const material = new THREE.MeshBasicMaterial({ color: VISUAL_CONSTANTS.LINK_COLOR });
    const cylinder = new THREE.Mesh(geometry, material);
    
    // Always align with y-axis of parent origin (cylinder's default is already along y-axis)
    // No rotation needed - cylinder default orientation is along y-axis
    cylinder.position.y = length / 2; // Position so link starts at origin
    
    parent.add(cylinder);
    return cylinder;
}

export function createLinkEndFrame(length: number, parent: THREE.Object3D): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(VISUAL_CONSTANTS.LINK_END_AXES_SIZE);
    axesHelper.material.linewidth = VISUAL_CONSTANTS.STANDARD_LINE_WIDTH;
    
    // Position at the end of the link (along y-axis)
    axesHelper.position.y = length;
    
    parent.add(axesHelper);
    return axesHelper;
}

export function createJoint(parent: THREE.Object3D, direction: Axis): CylinderMesh {
    const geometry = new THREE.CylinderGeometry(VISUAL_CONSTANTS.JOINT_RADIUS, VISUAL_CONSTANTS.JOINT_RADIUS, VISUAL_CONSTANTS.JOINT_HEIGHT, VISUAL_CONSTANTS.CYLINDER_RADIAL_SEGMENTS);
    const material = new THREE.MeshBasicMaterial({ color: VISUAL_CONSTANTS.JOINT_COLOR });
    const cylinder = new THREE.Mesh(geometry, material);
    
    // Joint is positioned at the origin of its parent frame
    // Aligns the y-axis of the joint with the direction of the joint
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
    const axesHelper = new THREE.AxesHelper(VISUAL_CONSTANTS.JOINT_FRAME_AXES_SIZE);
    axesHelper.material.linewidth = VISUAL_CONSTANTS.THICK_LINE_WIDTH;
    
    // Apply joint rotation around the specified axis
    const rotationAngle = (theta * Math.PI) / VISUAL_CONSTANTS.DEGREES_TO_RADIANS;
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
    const axesHelper = new THREE.AxesHelper(VISUAL_CONSTANTS.TCP_FRAME_AXES_SIZE);    
    parent.add(axesHelper);

    return axesHelper;
}