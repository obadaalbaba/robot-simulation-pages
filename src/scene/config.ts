import { SceneConfig } from './types';

export const defaultSceneConfig: SceneConfig = {
    backgroundColor: 0x000000, // Black
    camera: {
        positionZ: 90,
        positionY: 30,
        positionX: 40,
        frustumSize: 100,
        near: 1,
        far: 1000,
    },
    grid: {
        size: 100,
        divisions: 20,
    },
    referenceFrame: {
        size: 20,
    }
};