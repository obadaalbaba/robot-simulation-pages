import { UserInputManager } from './user-inputs';
import { SceneManager } from './scene';
import { RobotBuilder } from './robot';
import { MONITOR_INTERVAL_SECONDS } from './constants';
import C3DAnalytics from '@cognitive3d/analytics';
import C3DThreeAdapter from '@cognitive3d/analytics/adapters/threejs';


const c3d = new C3DAnalytics({
    config: {
        APIKey: "SHTC90DAUQCGVNVL6JXHTLEWLYX2I0MR",
        allSceneData: [{
            sceneName: "BasicScene", 
            sceneId: "93f486e4-0e22-4650-946a-e64ce527f915",
            versionNumber: "1"
        }]
    }
});
const c3dAdapter = new C3DThreeAdapter(c3d);
console.log(c3dAdapter)

// Set the current scene (required before recording any data)
c3d.setScene("BasicScene");

// Start FPS monitoring
if (c3d.fpsTracker) {
    c3d.fpsTracker.start((metrics) => {
        console.log(`📊 FPS: ${metrics.avg.toFixed(1)} avg, ${metrics['1pl'].toFixed(1)} 1%L`);
    });
    console.log('✅ FPS monitoring started');
} else {
    console.error('❌ FPS tracker not available');
}

// Start C3D session
c3d.startSession().then(() => {
    console.log('✅ C3D Analytics session started');
}).catch((error) => {
    console.warn('⚠️ C3D session start failed (expected for non-XR):', error);
});

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

// Start animation loop (gaze tracking disabled due to 401 errors)
sceneManager.startAnimation(() => {
    // Note: Gaze tracking disabled - causes 401 authentication errors
    // c3dAdapter.recordGazeFromCamera(sceneManager.getCamera());
});

// Cleanup on window unload
window.addEventListener('beforeunload', () => {
    if (c3d.isSessionActive()) {
        c3d.endSession().catch(console.error);
    }
    sceneManager.dispose();
});

// All robot construction and update logic is now handled by RobotBuilder
