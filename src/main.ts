import { UserInputManager } from './user-inputs';
import { SceneManager, SceneExporter } from './scene';
import { RobotBuilder } from './robot';
import { AnalyticsMonitor } from './analytics';
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
    console.warn('🔧 Running in development mode - some analytics features may be limited');
}
// Initialize managers first
const sceneManager = new SceneManager();

// Initialize FPS monitoring
const analyticsMonitor = new AnalyticsMonitor({
    apiKey: import.meta.env.VITE_C3D_API_KEY,
    sceneName: import.meta.env.VITE_C3D_SCENE_NAME,
    sceneId: import.meta.env.VITE_C3D_SCENE_ID,
    versionNumber: import.meta.env.VITE_C3D_VERSION
});

// Get camera for gaze tracking and start FPS monitoring
const camera = sceneManager.getCamera();

// Only enable gaze tracking if we have valid credentials
const hasValidCredentials = missingVars.length === 0 && 
    import.meta.env.VITE_C3D_API_KEY !== 'your_api_key_here';

if (hasValidCredentials) {
            analyticsMonitor.start(camera);
} else {
    console.warn('🔧 Starting FPS monitor without gaze tracking (missing/invalid credentials)');
            analyticsMonitor.start(); // Start without camera to avoid auth errors
}
const sceneExporter = new SceneExporter();
const inputManager = new UserInputManager(undefined, ()=>sceneExporter.exportForCognitive3D(sceneManager.getScene()));
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

// Start animation loop with conditional gaze tracking
sceneManager.startAnimation(() => {
    // Record gaze data if enabled and authenticated
    if (hasValidCredentials && analyticsMonitor.isGazeTrackingEnabled()) {
        analyticsMonitor.recordGaze();
    }
});

// Cleanup on window unload
window.addEventListener('beforeunload', () => {
    analyticsMonitor.stop();
    sceneManager.dispose();
});

// All robot construction and update logic is now handled by RobotBuilder
