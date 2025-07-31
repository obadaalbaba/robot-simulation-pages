import { SceneConfig } from './types';

export const defaultSceneConfig: SceneConfig = {
    backgroundColor: 0x808080,
    camera: {
        positionZ: 100,
        positionY: -100,
        positionX: 0,
    },
    grid: {
        size: 100,
        divisions: 20,
    },
    baseFrame: {
        size: 4,
    },
};