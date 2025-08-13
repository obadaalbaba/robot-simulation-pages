import { UserInputManager } from './user-inputs';
import { SceneManager, SceneExporter } from './scene';
import { RobotBuilder } from './robot';
import { AnalyticsMonitor } from './analytics';
import { MONITOR_INTERVAL_SECONDS } from './constants';

// Initialize analytics monitor with settings from analytics-monitor.ts
const analyticsMonitor = new AnalyticsMonitor();
const sceneManager = new SceneManager();
const camera = sceneManager.getCamera();

// Analytics will be controlled manually via GUI buttons

const sceneExporter = new SceneExporter();
const robotBuilder = new RobotBuilder(sceneManager.getWorldReferenceFrame());

// Create analytics control functions
const startAnalytics = async () => {
    if (analyticsMonitor.hasValidCredentials()) {
        await analyticsMonitor.start(camera);
    } else {
        await analyticsMonitor.start();
    }
};

const stopAnalytics = async () => {
    await analyticsMonitor.stop();
};

const inputManager = new UserInputManager(
    undefined, 
    () => sceneExporter.exportForCognitive3D(sceneManager.getScene()), 
    () => robotBuilder.calculateAndLogTransformations(),
    startAnalytics,
    stopAnalytics
);
const userInputs = inputManager.getUserInputs();
robotBuilder.buildRobot(userInputs);

inputManager.onStructuralChange((params) => {
    robotBuilder.rebuildRobot(params);
});

inputManager.onJointUpdate((params) => {
    robotBuilder.updateJointAngles(params);
});

inputManager.startMonitoring(MONITOR_INTERVAL_SECONDS);

sceneManager.startAnimation(() => {
    if (analyticsMonitor.isSessionActive() && analyticsMonitor.isGazeTrackingEnabled()) {
        analyticsMonitor.recordGaze();
    }
});

// Make analytics monitor available globally for debugging
// Session is now controlled manually via GUI buttons
(globalThis as any).analyticsMonitor = analyticsMonitor;
