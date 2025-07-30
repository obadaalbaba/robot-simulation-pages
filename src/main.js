import * as THREE from 'three';
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
	createJoint2,
	createFrame2,
	createTCPframe
  } from './functions.js';


//****** USER INPUTS *//
const userInputs = {
	link_0_direction : 'z',
	link_0_length : 10,
	joint1_direction : 'z',
	theta1 :  120,
	link_1_length : 10,
	joint2_parallel_to_joint1 : true,
	theta2 :  120,
	link_2_length : 10,
	joint3_parallel_to_joint2 : true,
	theta3 :  45,
	link_3_length : 10,
}
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
orientationsFolder.add(userInputs, 'link_0_direction');
orientationsFolder.add(userInputs, 'joint1_direction');
orientationsFolder.add(userInputs, 'joint2_parallel_to_joint1');
orientationsFolder.add(userInputs, 'joint3_parallel_to_joint2');
orientationsFolder.open();

//this file depends on constants and functions defined in the other files: constants.js & functions.js
//adding scene and camera as per three.js documentaion. Played around with camera positionconst scene = createScene(sceneColor = 0x808080);
const scene = createScene(0x808080);
const renderer = createRenderer();
const camera = createCamera(100, -100);
const grid = createGrid(100, 20);
scene.add( grid );
let controls = createControls(camera, renderer);
const baseFrame = createBaseFrame(4);
scene.add( baseFrame );

let link0 = createLink0(userInputs.link_0_direction, userInputs.link_0_length);
let joint1 = createJoint1(userInputs.joint1_direction, link0);
let frame1 = createFrame1(joint1.direction, link0, userInputs.theta1);
let link1 = createLink(frame1, length = userInputs.link_1_length);
let joint2 = createJoint2(link1, userInputs.joint2_parallel_to_joint1, joint1);
let frame2 = createFrame2(joint2, frame1, userInputs.theta2 );
let link2 = createLink(frame2, length = userInputs.link_2_length);
let joint3 = createJoint2(link2, userInputs.joint3_parallel_to_joint2, joint1);
let frame3 = createFrame2(joint3, frame2, userInputs.theta3 );
let link3 = createLink(frame3, length = userInputs.link_3_length);
let TCP4 = createTCPframe(link3);
function divide(matrix1, matrix2) {
	const inverse = new THREE.Matrix4();
	let result = new THREE.Matrix4();
	inverse.copy(matrix2);
	inverse.invert();
	let _matrix1 = new THREE.Matrix4()
	_matrix1 = _matrix1.copy(matrix1);
	result = matrix1.multiply(inverse);
	return result;
}
let T_0_1 = divide(frame1.matrix, baseFrame.matrix);
let T_1_2 = divide(frame2.matrix, frame1.matrix);
let T_2_3 = divide(frame3.matrix, frame2.matrix);
let T_3_4 = divide(TCP4.matrix, frame3.matrix);
let T_0_4 = T_0_1.multiply(T_1_2).multiply(T_2_3).multiply(T_3_4);
let T_0_2 = T_0_1.premultiply(T_1_2);
console.log('TCP Matrix', TCP4.matrix);

function addObjects(){
	scene.add(link0, joint1, frame1, link1, joint2, frame2, link2, joint3, frame3, link3, TCP4);
}
function removeObjects(){
	scene.remove(link0, joint1, frame1, link1, joint2, frame2, link2, joint3, frame3, link3, TCP4);
}

addObjects();

setInterval(function(){
	removeObjects();
	link0 = createLink0(userInputs.link_0_direction,  userInputs.link_0_length);
	joint1 = createJoint1(userInputs.joint1_direction, link0);
	frame1 = createFrame1(joint1.direction, link0, userInputs.theta1);
	link1 = createLink(frame1, length = userInputs.link_1_length);
	joint2 = createJoint2(link1, userInputs.joint2_parallel_to_joint1, joint1);
	frame2 = createFrame2(joint2, frame1, userInputs.theta2 );
	link2 = createLink(frame2, length = userInputs.link_2_length);
	joint3 = createJoint2(link2, userInputs.joint3_parallel_to_joint2, joint1);
	frame3 = createFrame2(joint3, frame2, userInputs.theta3 );
	link3 = createLink(frame3, length = userInputs.link_3_length);
	TCP4 = createTCPframe(link3);
	addObjects();
}, 120);

function animate() {
	requestAnimationFrame( animate );
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

//Animate
animate();
