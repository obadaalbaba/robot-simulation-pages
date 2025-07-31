import * as THREE from 'three';
import {
    createLinkOrigin,
    createLink,
    createLinkEndFrame,
    createJoint,
    createJointFrame,
    createTCPframe,
    type Axis
} from './functions';
import { UserInputManager } from './user-inputs';
import { SceneManager } from './scene';

// Initialize scene manager
const sceneManager = new SceneManager();
const worldReferenceFrame = sceneManager.getWorldReferenceFrame();

// Initialize user input manager
const inputManager = new UserInputManager();
const userInputs = inputManager.getUserInputs();

// Build robot structure
let link0origin = createLinkOrigin(userInputs.link_0_direction, worldReferenceFrame);
createLink(userInputs.link_0_length, link0origin);
let link0end = createLinkEndFrame(userInputs.link_0_length, link0origin);
let joint1frame = createJointFrame(userInputs.theta1, userInputs.joint1_direction, link0end);
createJoint(link0end, userInputs.joint1_direction);

let link1origin = createLinkOrigin(userInputs.link_1_direction, joint1frame);
createLink(userInputs.link_1_length, link1origin);
let link1end = createLinkEndFrame(userInputs.link_1_length, link1origin);
let joint2frame = createJointFrame(userInputs.theta2, userInputs.joint2_direction, link1end);
createJoint(link1end, userInputs.joint2_direction);

let link2origin = createLinkOrigin(userInputs.link_2_direction, joint2frame);
createLink(userInputs.link_2_length, link2origin);
let link2end = createLinkEndFrame(userInputs.link_2_length, link2origin);
let joint3frame = createJointFrame(userInputs.theta3, userInputs.joint3_direction, link2end);
createJoint(link2end, userInputs.joint3_direction);

let link3origin = createLinkOrigin(userInputs.link_3_direction, joint3frame);
createLink(userInputs.link_3_length, link3origin);
let link3end = createLinkEndFrame(userInputs.link_3_length, link3origin);
let TCP4 = createTCPframe(0, link3end); // TCP at the end of link3

console.log('TCP Matrix', TCP4.matrix);

// Set up input monitoring callbacks
inputManager.onStructuralChange((params) => {
    rebuildRobot(params);
});

inputManager.onJointUpdate((params) => {
    updateJointAngles(params);
});

// Start monitoring user inputs
inputManager.startMonitoring(120);

// Start animation loop
sceneManager.startAnimation();

// Update joint angles only
function updateJointAngles(params: typeof userInputs) {
    updateJointRotation(joint1frame, params.theta1, params.joint1_direction);
    updateJointRotation(joint2frame, params.theta2, params.joint2_direction);
    updateJointRotation(joint3frame, params.theta3, params.joint3_direction);
}

// Rebuild robot structure when structural parameters change
function rebuildRobot(params: typeof userInputs) {
    // Remove current hierarchy
    worldReferenceFrame.remove(link0origin);
    
    // Rebuild hierarchy with new parameters
    link0origin = createLinkOrigin(params.link_0_direction, worldReferenceFrame);
    createLink(params.link_0_length, link0origin);
    link0end = createLinkEndFrame(params.link_0_length, link0origin);
    joint1frame = createJointFrame(params.theta1, params.joint1_direction, link0end);
    createJoint(link0end, params.joint1_direction);

    link1origin = createLinkOrigin(params.link_1_direction, joint1frame);
    createLink(params.link_1_length, link1origin);
    link1end = createLinkEndFrame(params.link_1_length, link1origin);
    joint2frame = createJointFrame(params.theta2, params.joint2_direction, link1end);
    createJoint(link1end, params.joint2_direction);

    link2origin = createLinkOrigin(params.link_2_direction, joint2frame);
    createLink(params.link_2_length, link2origin);
    link2end = createLinkEndFrame(params.link_2_length, link2origin);
    joint3frame = createJointFrame(params.theta3, params.joint3_direction, link2end);
    createJoint(link2end, params.joint3_direction);

    link3origin = createLinkOrigin(params.link_3_direction, joint3frame);
    createLink(params.link_3_length, link3origin);
    link3end = createLinkEndFrame(params.link_3_length, link3origin);
    TCP4 = createTCPframe(0, link3end);

    console.log('TCP Matrix', TCP4.matrix);
}

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
