import { UserInputManager } from './user-inputs';
import { SceneManager } from './scene';
import { RobotBuilder } from './robot';
import { FPSMonitor } from './analytics';
import { MONITOR_INTERVAL_SECONDS } from './constants';

// Validate environment variables
if (!import.meta.env.VITE_C3D_API_KEY) {
    console.error('❌ VITE_C3D_API_KEY not found in environment variables');
}

// Initialize FPS monitoring
const fpsMonitor = new FPSMonitor({
    apiKey: import.meta.env.VITE_C3D_API_KEY || '',
    sceneName: import.meta.env.VITE_C3D_SCENE_NAME || 'BasicScene',
    sceneId: import.meta.env.VITE_C3D_SCENE_ID || '',
    versionNumber: import.meta.env.VITE_C3D_VERSION || '1'
});

// Start FPS monitoring
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
