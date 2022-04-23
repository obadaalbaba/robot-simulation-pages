# Robot Visualization
## Summary
This code renders two cubes that interact with each other. The goal of this project is to practice using javascript for 3D animations.
## How to Run the Code
1. git clone https://github.com/obadaalbaba/colored_cubes_three_js.git or Download and extract the repository
2. Add the directory to an environment such as VSCode.
3. Right click on the .html file within VSCode and select "Run with Live Server".
4. Refresh the webpage as needed.
5. You can run the application on heroku as well: https://cube-animation-three-js.herokuapp.com/
## The Code
The code is seperated into multiple files:
1. index.html depends on four javascript (.js) files.
2. three.js is a library downloaded from the web. It does all the heavy lifting.
3. constants.js contains all the unchanging variables
4. functions.js contains all the functions
5. main.js contains the code that executes all the actions. It depens on the three other javascript files.
## Initial Problem
1. Set up a 3D environment where two cubes travel toward each other. 
2. Cube A and cube B are colored similarly. Each cube has a red, green, blue, yellow, purple and a black face.
3. The starting orientation of each cube is randomized independently.
The outcomes of the collisions are shown in the image titled "outcomesSummary" in the repository.
![image](https://user-images.githubusercontent.com/64380720/151727537-40f09313-623f-421c-a621-6afebec44f95.png)
## Assumptions
Cube A's starting position is on the left side of the screen and cube B's starting position is on the right side of the screen. Using this assumption, we can detect a collision when cube B's x position is less than half its size.
Not all 24 orientations of the cubes are needed for this excersise. We only use six orientations per cube so that we have all 36 outcomes.
The outcomes for cube B are not specified in most of the outcomes in the initial problem. We simply stop its motion to focus on cube A's outcome.
## Libraries and Concepts Used
The code uses the three.js library. This library is widely used for 3D animations and games.
Some basic 3D geometry consepts were used as well. For example, a list of basic orientations was used to randomize the initial postion:

const orientationsList = [ [0,0] , [0,Math.PI/2] , [0,Math.PI*3/2] , [Math.PI/2,0], [Math.PI,0] , [Math.PI*3/2,0] ];

Using the [0,0] transformation leaves the cube in it's default position where its red side faces the other cube. Using the [0,Math.PI/2] transformation causes the cube to rotate by 90 degrees along the z-axis causing its yellow side to face the other cube.
## Solution Formulation
1. Discovered three.js
2. Used code from the "documentaion" section in the "threejs.org" website to create the scene, camera, rendered and the two cubes.
3. Applied colors to the cube faces.
4. Understood the "cube.rotation.y" and the "cube.rotation.z" methods to generate six random initial orientations per cube so that all 36 color combinations are generated randomly.
5. Understood the "cube.position.x" method to move the cubes toward eachother.
## How the Colors Were Applied
In order to label the cubes uniquely, I applied the colors as textures. Each texture is loaded from a .png file.
## Limitations and Future Work
This was my first javascript project. In the future I will be able to improve the animate() function to make it faster.
