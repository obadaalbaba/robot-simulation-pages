import { UserInputManager } from './user-inputs';
import { SceneManager } from './scene';
import { RobotBuilder } from './robot';
import { MONITOR_INTERVAL_SECONDS } from './constants';

// Initialize managers
const sceneManager = new SceneManager();
const inputManager = new UserInputManager();
const robotBuilder = new RobotBuilder(sceneManager.getWorldReferenceFrame());

// Build initial robot
const userInputs = inputManager.getUserInputs();
robotBuilder.buildRobot(userInputs);

// Set up input monitoring callbacks
inputManager.onStructuralChange((params) => {
    robotBuilder.rebuildRobot(params);
});

inputManager.onJointUpdate((params) => {
    robotBuilder.updateJointAngles(params);
});

// Start monitoring user inputs
inputManager.startMonitoring(MONITOR_INTERVAL_SECONDS);

// Start animation loop
sceneManager.startAnimation();

// All robot construction and update logic is now handled by RobotBuilder
