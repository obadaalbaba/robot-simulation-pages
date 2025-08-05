import { SceneConfig } from './types';

export const defaultSceneConfig: SceneConfig = {
    backgroundColor: 0x000000, // Black
    camera: {
        positionZ: 100,
        positionY: 100,
        positionX: 50,
    },
    grid: {
        size: 100,
        divisions: 20,
    }
};