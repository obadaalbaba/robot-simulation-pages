import { UserInputManager } from './user-inputs';
import { SceneManager, SceneExporter } from './scene';
import { RobotBuilder } from './robot';
import { AnalyticsMonitor } from './analytics';
import { MONITOR_INTERVAL_SECONDS } from './constants';

// Initialize analytics monitor with settings from analytics-monitor.ts
const analyticsMonitor = new AnalyticsMonitor(); 
const sceneManager = new SceneManager();
const camera = sceneManager.getCamera();

if (analyticsMonitor.hasValidCredentials()) {
    analyticsMonitor.start(camera);
} else {
    analyticsMonitor.start();
}

const sceneExporter = new SceneExporter();
const robotBuilder = new RobotBuilder(sceneManager.getWorldReferenceFrame());
const inputManager = new UserInputManager(undefined, ()=>sceneExporter.exportForCognitive3D(sceneManager.getScene()), () => robotBuilder.calculateAndLogTransformations());
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
    if (analyticsMonitor.hasValidCredentials() && analyticsMonitor.isGazeTrackingEnabled()) {
        analyticsMonitor.recordGaze();
    }
});
