import { UserInputManager } from './user-inputs';
import { SceneManager, SceneExporter } from './scene';
import { RobotBuilder } from './robot';
import { AnalyticsMonitor } from './analytics';
import { MONITOR_INTERVAL_SECONDS } from './constants';

const requiredEnvVars = [
    'VITE_C3D_API_KEY',
    'VITE_C3D_SCENE_NAME',
    'VITE_C3D_SCENE_ID',
    'VITE_C3D_VERSION'
];
const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
}

const hasValidCredentials = missingVars.length === 0 && 
    import.meta.env.VITE_C3D_API_KEY !== 'your_api_key_here';
const analyticsMonitor = new AnalyticsMonitor({
    apiKey: import.meta.env.VITE_C3D_API_KEY,
    sceneName: import.meta.env.VITE_C3D_SCENE_NAME,
    sceneId: import.meta.env.VITE_C3D_SCENE_ID,
    versionNumber: import.meta.env.VITE_C3D_VERSION
}); 
const sceneManager = new SceneManager();
const camera = sceneManager.getCamera();

if (hasValidCredentials) {
    analyticsMonitor.start(camera);
} else {
    console.warn('Starting FPS monitor without gaze tracking (missing/invalid credentials)');
    analyticsMonitor.start();
}

const sceneExporter = new SceneExporter();
const inputManager = new UserInputManager(undefined, ()=>sceneExporter.exportForCognitive3D(sceneManager.getScene()));
const robotBuilder = new RobotBuilder(sceneManager.getWorldReferenceFrame());
const userInputs = inputManager.getUserInputs();
robotBuilder.buildRobot(userInputs);

console.log('robot', robotBuilder);

inputManager.onStructuralChange((params) => {
    robotBuilder.rebuildRobot(params);
    console.log('robot', robotBuilder);
});

inputManager.onJointUpdate((params) => {
    robotBuilder.updateJointAngles(params);
    console.log('robot', robotBuilder);
});

inputManager.startMonitoring(MONITOR_INTERVAL_SECONDS);

sceneManager.startAnimation(() => {
    if (hasValidCredentials && analyticsMonitor.isGazeTrackingEnabled()) {
        analyticsMonitor.recordGaze();
    }
});
