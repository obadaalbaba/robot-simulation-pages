function createScene(sceneColor) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneColor);
    return scene;
}

function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

function createCamera(cameraPositionZ = 5, cameraPositionY = -5, cameraPositionX = 0) {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = cameraPositionZ;
    camera.position.y = cameraPositionY;
    camera.position.x = cameraPositionX;
    return camera;
}

function createGrid(gridSize, gridStep){
    const grid = new THREE.GridHelper(gridSize, gridStep);
    grid.rotation.x = Math.PI / 2;
    return grid;
}

function createControls(){
    let controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional
    controls.update();
    return controls;
}

function createBaseFrame(arrowThickness = 4){
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.material.linewidth = arrowThickness;
    return axesHelper;
}

function createLink0(direction = 'z', length = 0){
    const geometry = new THREE.CylinderGeometry( 1, 1, length, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position[direction] = length/2;
    cylinder.rotation[linkOrientation[direction]['axis']] = linkOrientation[direction]['rotation'];
    cylinder.length = length;
    cylinder.direction = direction;
    return cylinder;
}

function createJoint1(direction = 'y', link1){
    const geometry = new THREE.CylinderGeometry( 1.5, 1.5, 3, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xb30086} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position[link1.direction] = link1.length;
    cylinder.rotation[linkOrientation[direction]['axis']] = -linkOrientation[direction]['rotation'];
    cylinder.direction = direction;
    return cylinder;
}

function createFrame1(direction, link1, theta1){
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.material.linewidth = 2;
    axesHelper.position[link1.direction] = link1.length;
    axesHelper.rotation[frameOrientation[direction]['axis']] = -frameOrientation[direction]['rotation'];
    axesHelper.rotation.z = (theta1*Math.PI/180);
    return axesHelper;
}

function createLink(frame1, length = 0){
    const geometry = new THREE.CylinderGeometry( 1, 1, length, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.x = frame1.position.x;
    cylinder.position.y = frame1.position.y;
    cylinder.position.z = frame1.position.z;
    cylinder.rotation.x = frame1.rotation.x;
    cylinder.rotation.y = frame1.rotation.y;
    cylinder.rotation.z = frame1.rotation.z+Math.PI/2;
    cylinder.translateY(-length/2);
    cylinder.length = length;
    return cylinder;
}

function createJoint2(link1 , align, joint1){
    const geometry = new THREE.CylinderGeometry( 1.5, 1.5, 3, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xb30086} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.x = link1.position.x;
    cylinder.position.y = link1.position.y;
    cylinder.position.z = link1.position.z;
    cylinder.rotation.x = link1.rotation.x;
    cylinder.rotation.y = link1.rotation.y;
    cylinder.rotation.z = link1.rotation.z;
    cylinder.translateY(-link1.length/2);
    if (joint1.direction === 'y'){
        cylinder.rotateZ(Math.PI/2);
    } else if (joint1.direction === 'x'){
        cylinder.rotateZ(Math.PI/2);
    } else {
        cylinder.rotateZ(Math.PI/2);
    }
    const rotation = align ? Math.PI/2 : 0;
    cylinder.rotateX(rotation);
    cylinder.align = align;
    return cylinder;
}

function createFrame2(joint2, frame1, theta2){
    const axesHelper = new THREE.AxesHelper( 5 );
    const rotation = joint2.align ? 0 : Math.PI/2;
    axesHelper.material.linewidth = 2;
    axesHelper.position.x = joint2.position.x;
    axesHelper.position.y = joint2.position.y;
    axesHelper.position.z = joint2.position.z;
    axesHelper.rotation.x = frame1.rotation.x;
    axesHelper.rotation.y = frame1.rotation.y;
    axesHelper.rotation.z = frame1.rotation.z;
    axesHelper.rotateX(rotation);
    axesHelper.rotateZ(theta2*Math.PI/180);
    return axesHelper;
}

function createTCPframe(link2){
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.position.x = link2.position.x;
    axesHelper.position.y = link2.position.y;
    axesHelper.position.z = link2.position.z;
    axesHelper.rotation.x = link2.rotation.x;
    axesHelper.rotation.y = link2.rotation.y;
    axesHelper.rotation.z = link2.rotation.z;
    axesHelper.translateY(-link2.length/2);
    axesHelper.rotateZ(Math.PI);
    return axesHelper;
}

function randomNumber(upperLimmit, lowerLimit) {
    return Math.random() * (upperLimmit - lowerLimit) + lowerLimit;
}
