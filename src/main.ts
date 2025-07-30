import * as dat from 'dat.gui';
import {
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
    createJoint,
    createFrame2,
    createTCPframe,
    type Axis
} from './functions';
import C3DAnalytics from '@cognitive3d/analytics';
import C3DThreeAdapter from '@cognitive3d/analytics/adapters/threejs';


const c3d = new C3DAnalytics({
    config: {
        APIKey: "SHTC90DAUQCGVNVL6JXHTLEWLYX2I0MR",
        allSceneData: [{
            sceneName: "BasicScene", 
            sceneId: "93f486e4-0e22-4650-946a-e64ce527f915",
            versionNumber: "1"
        }]
    }
});
const c3dAdapter = new C3DThreeAdapter(c3d);

console.log(c3d)
console.log(c3dAdapter)


type UserInputs = {
    link_0_direction: Axis;
    link_0_length: number;
    joint1_direction: Axis;
    theta1: number;
    link_1_length: number;
    joint2_parallel_to_joint1: boolean;
    theta2: number;
    link_2_length: number;
    joint3_parallel_to_joint2: boolean;
    theta3: number;
    link_3_length: number;
};

const userInputs: UserInputs = {
    link_0_direction: 'z',
    link_0_length: 10,
    joint1_direction: 'z',
    theta1: 120,
    link_1_length: 10,
    joint2_parallel_to_joint1: true,
    theta2: 120,
    link_2_length: 10,
    joint3_parallel_to_joint2: true,
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
orientationsFolder.add(userInputs, 'joint2_parallel_to_joint1');
orientationsFolder.add(userInputs, 'joint3_parallel_to_joint2');
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

let link0 = createLink0(userInputs.link_0_direction, userInputs.link_0_length);
let joint1 = createJoint1(userInputs.joint1_direction, userInputs.link_0_direction, userInputs.link_0_length);
let frame1 = createFrame1(userInputs.joint1_direction, userInputs.link_0_direction, userInputs.link_0_length, userInputs.theta1);
let link1 = createLink(frame1, userInputs.link_1_length);
let joint2 = createJoint(link1, userInputs.link_1_length, userInputs.joint2_parallel_to_joint1, userInputs.joint1_direction);
let frame2 = createFrame2(joint2, userInputs.joint2_parallel_to_joint1, frame1, userInputs.theta2);
let link2 = createLink(frame2, userInputs.link_2_length);
let joint3 = createJoint(link2, userInputs.link_2_length, userInputs.joint3_parallel_to_joint2, userInputs.joint1_direction);
let frame3 = createFrame2(joint3, userInputs.joint3_parallel_to_joint2, frame2, userInputs.theta3);
let link3 = createLink(frame3, userInputs.link_3_length);
let TCP4 = createTCPframe(link3, userInputs.link_3_length);

// function divide(matrix1: THREE.Matrix4, matrix2: THREE.Matrix4): THREE.Matrix4 {
//     const inverse = new THREE.Matrix4();
//     let result = new THREE.Matrix4();
//     inverse.copy(matrix2);
//     inverse.invert();
//     let _matrix1 = new THREE.Matrix4();
//     _matrix1 = _matrix1.copy(matrix1);
//     result = matrix1.multiply(inverse);
//     return result;
// }
// let T_0_1 = divide(frame1.matrix, baseFrame.matrix);
// let T_1_2 = divide(frame2.matrix, frame1.matrix);
// let T_2_3 = divide(frame3.matrix, frame2.matrix);
// let T_3_4 = divide(TCP4.matrix, frame3.matrix);
// let T_0_4 = T_0_1.multiply(T_1_2).multiply(T_2_3).multiply(T_3_4);
// let T_0_2 = T_0_1.premultiply(T_1_2);
console.log('TCP Matrix', TCP4.matrix);

function addObjects() {
    scene.add(link0, joint1, frame1, link1, joint2, frame2, link2, joint3, frame3, link3, TCP4);
}
function removeObjects() {
    scene.remove(link0, joint1, frame1, link1, joint2, frame2, link2, joint3, frame3, link3, TCP4);
}

addObjects();

setInterval(function () {
    removeObjects();
    link0 = createLink0(userInputs.link_0_direction, userInputs.link_0_length);
    joint1 = createJoint1(userInputs.joint1_direction, userInputs.link_0_direction, userInputs.link_0_length);
    frame1 = createFrame1(userInputs.joint1_direction, userInputs.link_0_direction, userInputs.link_0_length, userInputs.theta1);
    link1 = createLink(frame1, userInputs.link_1_length);
    joint2 = createJoint(link1, userInputs.link_1_length, userInputs.joint2_parallel_to_joint1, userInputs.joint1_direction);
    frame2 = createFrame2(joint2, userInputs.joint2_parallel_to_joint1, frame1, userInputs.theta2);
    link2 = createLink(frame2, userInputs.link_2_length);
    joint3 = createJoint(link2, userInputs.link_2_length, userInputs.joint3_parallel_to_joint2, userInputs.joint1_direction);
    frame3 = createFrame2(joint3, userInputs.joint3_parallel_to_joint2, frame2, userInputs.theta3);
    link3 = createLink(frame3, userInputs.link_3_length);
    TCP4 = createTCPframe(link3, userInputs.link_3_length);
    addObjects();
}, 120);

function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
}

//Animate
animate();