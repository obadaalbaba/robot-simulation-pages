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

console.log(c3d)
console.log(c3dAdapter)

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
