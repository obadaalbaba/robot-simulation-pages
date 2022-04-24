# Robot Visualization
## Summary
This code renders a customaizable robotic arm. The goal of this project is to create a tool that allows the user to visualize different robot configurations and to be able to perform forward kinematics.
## How to Run the Code
1. git clone https://github.com/obadaalbaba/RobotVisualization.git or Download and extract the repository
2. Add the directory to an environment such as VSCode.
3. Right click on the .html file within VSCode and select "Run with Live Server" (you may need to install the "live server" extension).
4. Refresh the webpage as needed.
5. You can run the application on heroku as well: stay tuned
## The Code
The code is seperated into multiple files:
1. index.html depends on six javascript (.js) files.
2. three.js is a library downloaded from the web. It does all the heavy lifting.
3. constants.js contains all the unchanging variables.
4. functions.js contains all the functions.
5. OrbitControls.js allows for rotation and navigation using the mouse.
6. dat.gui.min.js adds a box that allows the user to modify the robot's dimentions, angles and joint orientations.
7. main.js contains the code that executes all the actions. It depens on the three other javascript files.
## Initial Problem
1. Set up a 3D environment where the user can visualize a customizable robot. 
2. Link 0 can be either parallel to the x, y, or z axis. The robot contains two rotary joints that can be oriented in multiple ways
3. The user should be able to modify the joint angles and the link lengthes.
## Libraries and Concepts Used
The code uses the three.js library. This library is widely used for 3D animations and games.
Some basic 3D geometry consepts were used as well. For example, a list of basic orientations was used to orient link 0:

const linkOrientation = {x: {axis: 'z', rotation: Math.PI/2}, y: {axis: 'y', rotation: 0}, z: {axis: 'x', rotation: Math.PI/2}};

## Solution Formulation
1. Created a navigable 3D environment using three.js and OrbitControls.js.
2. Created links and joints using three js cylinders. Created fucntions that take in a string as a parameter. For example, `function createLink0(direction = 'z', length = 0){`
3. Gave the user the option to customize the robot using dat.gui.min.js.
4. Used `setInterval` to refresh the robot periodically.
## Limitations and Future Work
1. Add more degrees of freedom.
2. Add the ability to add prismatic joints.
3. Give more flexibility for link and joint orientations.
