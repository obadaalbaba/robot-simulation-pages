import { UserInputManager } from './user-inputs';
import { SceneManager } from './scene';
import { RobotBuilder } from './robot';
import { FPSMonitor } from './analytics';
import { MONITOR_INTERVAL_SECONDS } from './constants';

// Validate environment variables
const requiredEnvVars = [
    'VITE_C3D_API_KEY',
    'VITE_C3D_SCENE_NAME',
    'VITE_C3D_SCENE_ID',
    'VITE_C3D_VERSION'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    console.error('Please check your .env file and ensure all Cognitive3D credentials are set.');
}
// Initialize FPS monitoring
const fpsMonitor = new FPSMonitor({
    apiKey: import.meta.env.VITE_C3D_API_KEY,
    sceneName: import.meta.env.VITE_C3D_SCENE_NAME,
    sceneId: import.meta.env.VITE_C3D_SCENE_ID,
    versionNumber: import.meta.env.VITE_C3D_VERSION
});

// Start FPS monitoring with visual display
fpsMonitor.start();

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
sceneManager.startAnimation(() => {
    // Gaze tracking available via: fpsMonitor.getAdapter().recordGazeFromCamera(camera)
    // Currently disabled due to authentication requirements
});

// Cleanup on window unload
window.addEventListener('beforeunload', () => {
    fpsMonitor.stop();
    sceneManager.dispose();
});

// All robot construction and update logic is now handled by RobotBuilder
