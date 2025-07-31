import * as dat from 'dat.gui';
import * as THREE from 'three';
import {
    createScene,
    createRenderer,
    createCamera,
    createGrid,
    createControls,
    createBaseFrame,
    createLinkOrigin,
    createLink,
    createLinkEndFrame,
    createJoint,
    createJointFrame,
    createTCPframe,
    type Axis
} from './functions';

type UserInputs = {
    link_0_direction: Axis;
    link_0_length: number;
    joint1_direction: Axis;
    theta1: number;
    link_1_length: number;
    joint2_direction: Axis;
    theta2: number;
    link_2_length: number;
    joint3_direction: Axis;
    theta3: number;
    link_3_length: number;
};

const userInputs: UserInputs = {
    link_0_direction: 'z',
    link_0_length: 10,
    joint1_direction: 'z',
    theta1: 120,
    link_1_length: 10,
    joint2_direction: 'z',
    theta2: 120,
    link_2_length: 10,
    joint3_direction: 'z',
    theta3: 45,
    link_3_length: 10,
};

const gui = new dat.GUI();
const anglesFolder = gui.addFolder('Angles');
anglesFolder.add(userInputs, 'theta1', 0, 360);
anglesFolder.add(userInputs, 'theta2', -180, 180);
anglesFolder.add(userInputs, 'theta3', -180, 180);
anglesFolder.open();
const lengthFolder = gui.addFolder('Lengths');
lengthFolder.add(userInputs, 'link_0_length', 0, 20);
lengthFolder.add(userInputs, 'link_1_length', 0, 20);
lengthFolder.add(userInputs, 'link_2_length', 0, 20);
lengthFolder.add(userInputs, 'link_3_length', 0, 20);
lengthFolder.open();
const orientationsFolder = gui.addFolder('Orientations');
orientationsFolder.add(userInputs, 'link_0_direction', ['x', 'y', 'z']);
orientationsFolder.add(userInputs, 'joint1_direction', ['x', 'y', 'z']);
orientationsFolder.add(userInputs, 'joint2_direction', ['x', 'y', 'z']);
orientationsFolder.add(userInputs, 'joint3_direction', ['x', 'y', 'z']);
orientationsFolder.open();

//this file depends on constants and functions defined in the other files: constants.js & functions.js
const scene = createScene(0x808080);
const renderer = createRenderer();
const camera = createCamera(100, -100);
const grid = createGrid(100, 20);
scene.add(grid);
const controls = createControls(camera, renderer);
const baseFrame = createBaseFrame(4);
scene.add(baseFrame);

// Build hierarchical robot structure following the new approach:
// baseFrame -> link0origin -> link0 -> link0end -> joint1 -> joint1frame -> link1origin -> link1 -> ...

let link0origin = createLinkOrigin(userInputs.link_0_direction, baseFrame);
let link0 = createLink(userInputs.link_0_length, link0origin);
let link0end = createLinkEndFrame(userInputs.link_0_length, link0origin);
let joint1 = createJoint(link0end);
let joint1frame = createJointFrame(userInputs.theta1, userInputs.joint1_direction, joint1);

let link1origin = createLinkOrigin(userInputs.joint1_direction, joint1frame);
let link1 = createLink(userInputs.link_1_length, link1origin);
let link1end = createLinkEndFrame(userInputs.link_1_length, link1origin);
let joint2 = createJoint(link1end);
let joint2frame = createJointFrame(userInputs.theta2, userInputs.joint2_direction, joint2);

let link2origin = createLinkOrigin(userInputs.joint2_direction, joint2frame);
let link2 = createLink(userInputs.link_2_length, link2origin);
let link2end = createLinkEndFrame(userInputs.link_2_length, link2origin);
let joint3 = createJoint(link2end);
let joint3frame = createJointFrame(userInputs.theta3, userInputs.joint3_direction, joint3);

let link3origin = createLinkOrigin(userInputs.joint3_direction, joint3frame);
let link3 = createLink(userInputs.link_3_length, link3origin);
let link3end = createLinkEndFrame(userInputs.link_3_length, link3origin);
let TCP4 = createTCPframe(0, link3end); // TCP at the end of link3

console.log('TCP Matrix', TCP4.matrix);

// Store previous structural parameters to detect changes
let previousParams = {
    link_0_direction: userInputs.link_0_direction,
    link_0_length: userInputs.link_0_length,
    joint1_direction: userInputs.joint1_direction,
    link_1_length: userInputs.link_1_length,
    joint2_direction: userInputs.joint2_direction,
    link_2_length: userInputs.link_2_length,
    joint3_direction: userInputs.joint3_direction,
    link_3_length: userInputs.link_3_length,
};

// Efficient update function - only update what changed
function updateRobot() {
    // Always update joint angles (these are fast operations)
    // Update joint rotations based on their direction
    updateJointRotation(joint1frame, userInputs.theta1, userInputs.joint1_direction);
    updateJointRotation(joint2frame, userInputs.theta2, userInputs.joint2_direction);
    updateJointRotation(joint3frame, userInputs.theta3, userInputs.joint3_direction);
    
    // Check if any structural parameters changed
    const structuralChanged = 
        previousParams.link_0_direction !== userInputs.link_0_direction ||
        previousParams.link_0_length !== userInputs.link_0_length ||
        previousParams.joint1_direction !== userInputs.joint1_direction ||
        previousParams.link_1_length !== userInputs.link_1_length ||
        previousParams.joint2_direction !== userInputs.joint2_direction ||
        previousParams.link_2_length !== userInputs.link_2_length ||
        previousParams.joint3_direction !== userInputs.joint3_direction ||
        previousParams.link_3_length !== userInputs.link_3_length;

    if (structuralChanged) {
        // Remove current hierarchy
        baseFrame.remove(link0origin);
        
        // Rebuild hierarchy with new parameters
        link0origin = createLinkOrigin(userInputs.link_0_direction, baseFrame);
        link0 = createLink(userInputs.link_0_length, link0origin);
        link0end = createLinkEndFrame(userInputs.link_0_length, link0origin);
        joint1 = createJoint(link0end);
        joint1frame = createJointFrame(userInputs.theta1, userInputs.joint1_direction, joint1);

        link1origin = createLinkOrigin(userInputs.joint1_direction, joint1frame);
        link1 = createLink(userInputs.link_1_length, link1origin);
        link1end = createLinkEndFrame(userInputs.link_1_length, link1origin);
        joint2 = createJoint(link1end);
        joint2frame = createJointFrame(userInputs.theta2, userInputs.joint2_direction, joint2);

        link2origin = createLinkOrigin(userInputs.joint2_direction, joint2frame);
        link2 = createLink(userInputs.link_2_length, link2origin);
        link2end = createLinkEndFrame(userInputs.link_2_length, link2origin);
        joint3 = createJoint(link2end);
        joint3frame = createJointFrame(userInputs.theta3, userInputs.joint3_direction, joint3);

        link3origin = createLinkOrigin(userInputs.joint3_direction, joint3frame);
        link3 = createLink(userInputs.link_3_length, link3origin);
        link3end = createLinkEndFrame(userInputs.link_3_length, link3origin);
        TCP4 = createTCPframe(0, link3end);

        // Update stored parameters
        previousParams = {
            link_0_direction: userInputs.link_0_direction,
            link_0_length: userInputs.link_0_length,
            joint1_direction: userInputs.joint1_direction,
            link_1_length: userInputs.link_1_length,
            joint2_direction: userInputs.joint2_direction,
            link_2_length: userInputs.link_2_length,
            joint3_direction: userInputs.joint3_direction,
            link_3_length: userInputs.link_3_length,
        };
    }
}

// Helper function to update joint rotation based on direction
function updateJointRotation(jointFrame: THREE.AxesHelper, angle: number, direction: Axis) {
    // Reset rotation
    jointFrame.rotation.set(0, 0, 0);
    
    // Apply rotation around the specified axis
    const rotationAngle = (angle * Math.PI) / 180;
    if (direction === 'x') {
        jointFrame.rotateX(rotationAngle);
    } else if (direction === 'y') {
        jointFrame.rotateY(rotationAngle);
    } else { // direction === 'z'
        jointFrame.rotateZ(rotationAngle);
    }
}

// Update robot parameters periodically
setInterval(updateRobot, 120);

function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}

//Animate
animate();