import { UserInputManager } from './user-inputs';
import { SceneManager } from './scene';
import { RobotBuilder } from './robot';

// Initialize scene manager
const sceneManager = new SceneManager();
const baseFrame = sceneManager.getBaseFrame();

// Initialize user input manager
const inputManager = new UserInputManager();
const userInputs = inputManager.getUserInputs();

// Initialize robot builder and build initial robot
const robotBuilder = new RobotBuilder(baseFrame);
robotBuilder.buildRobot(userInputs);

// Set up input monitoring callbacks
inputManager.onStructuralChange((params) => {
    robotBuilder.rebuildRobot(params);
});

inputManager.onJointUpdate((params) => {
    robotBuilder.updateJointAngles(params);
});

// Start monitoring user inputs
inputManager.startMonitoring(120);

// Start animation loop
sceneManager.startAnimation();

// All robot construction and update logic is now handled by RobotBuilder
