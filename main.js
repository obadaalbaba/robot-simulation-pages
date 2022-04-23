//****** USER INPUTS *//
const userInputs = {
	link_0_direction : 'z',
	link_0_length : 10,
	joint1_direction : 'z',
	theta1 :  120,
	link_1_length : 13,
	joint2_parallel_to_joint1 : true,
	theta2 :  120,
	link_2_length : 13,
}
const gui = new dat.gui.GUI();
const anglesFolder = gui.addFolder('Angles');
anglesFolder.add(userInputs, 'theta1', 1, 360)
anglesFolder.add(userInputs, 'theta2', -160, 160)
anglesFolder.open();
const lengthFolder = gui.addFolder('Lengths');
lengthFolder.add(userInputs, 'link_0_length', 0, 12)
lengthFolder.add(userInputs, 'link_1_length', 0, 12)
lengthFolder.add(userInputs, 'link_2_length', 0, 12)
lengthFolder.open();
const orientationsFolder = gui.addFolder('Orientations')
orientationsFolder.add(userInputs, 'link_0_direction');
orientationsFolder.add(userInputs, 'joint1_direction');
orientationsFolder.add(userInputs, 'joint2_parallel_to_joint1');
lengthFolder.open();


//this file depends on constants and functions defined in the other files: constants.js & functions.js
//adding scene and camera as per three.js documentaion. Played around with camera positionconst scene = createScene(sceneColor = 0x808080);
const scene = createScene(0x808080);
const renderer = createRenderer();
const camera = createCamera(cameraPositionZ = 100, cameraPositionY = -100);
const grid = createGrid(gridSize = 100, gridStep = 20);
scene.add( grid );
let controls = createControls();
const baseFrame = createBaseFrame(arrowThickness = 4);
scene.add( baseFrame );

let link0 = createLink0(direction = userInputs.link_0_direction, length = userInputs.link_0_length);
let joint1 = createJoint1(direction = userInputs.joint1_direction, link0);
let frame1 = createFrame1(direction = joint1.direction, link0, userInputs.theta1);
let link1 = createLink1(frame1, length = userInputs.link_1_length);
let joint2 = createJoint2(link1, userInputs.joint2_parallel_to_joint1, joint1);
let frame2 = createFrame2(joint2, frame1, userInputs.theta2 );
let link2 = createLink2(frame2, length = userInputs.link_2_length);
let TCP = createTCPframe(link2);

function addObjects(){
	scene.add(link0, joint1, frame1, link1, joint2, frame2, link2, TCP);
}
function removeObjects(){
	scene.remove(link0, joint1, frame1, link1, joint2, frame2, link2, TCP);
}

addObjects();

setInterval(function(){
	removeObjects();
	link0 = createLink0(direction = userInputs.link_0_direction,  userInputs.link_0_length);
	joint1 = createJoint1(direction = userInputs.joint1_direction, link0);
	frame1 = createFrame1(direction = joint1.direction, link0, userInputs.theta1);
	link1 = createLink1(frame1, length = userInputs.link_1_length);
	joint2 = createJoint2(link1, userInputs.joint2_parallel_to_joint1, joint1);
	frame2 = createFrame2(joint2, frame1, userInputs.theta2 );
	link2 = createLink2(frame2, length = userInputs.link_2_length);
	TCP = createTCPframe(link2);
	addObjects();
}, 200);




function animate() {
	requestAnimationFrame( animate );
	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	renderer.render( scene, camera );
}

//Animate
animate();

