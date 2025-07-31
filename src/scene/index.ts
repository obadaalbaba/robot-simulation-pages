// Main exports from the scene module
export { SceneManager } from './scene-manager';
export { defaultSceneConfig } from './config';
export type { SceneConfig, SceneComponents } from './types';
export {
    createScene,
    createRenderer,
    createCamera,
    createGrid,
    createControls,
    createReferenceFrame,
} from './functions';