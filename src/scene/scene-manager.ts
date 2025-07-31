import * as THREE from 'three';
import {
    createScene,
    createRenderer,
    createCamera,
    createGrid,
    createControls,
    createBaseFrame,
} from '../functions';
import { SceneConfig, SceneComponents } from './types';
import { defaultSceneConfig } from './config';

export class SceneManager {
    private components: SceneComponents;
    private config: SceneConfig;

    constructor(config?: Partial<SceneConfig>) {
        this.config = { ...defaultSceneConfig, ...config };
        this.components = this.initializeScene();
    }

    private initializeScene(): SceneComponents {
        // Create core components
        const scene = createScene(this.config.backgroundColor);
        const renderer = createRenderer();
        const camera = createCamera(
            this.config.camera.positionZ,
            this.config.camera.positionY,
            this.config.camera.positionX
        );
        
        // Create interactive components
        const controls = createControls(camera, renderer);
        
        // Create scene objects
        const grid = createGrid(this.config.grid.size, this.config.grid.divisions);
        const baseFrame = createBaseFrame(this.config.baseFrame.size);
        
        // Add objects to scene
        scene.add(grid);
        scene.add(baseFrame);

        return {
            scene,
            renderer,
            camera,
            controls,
            grid,
            baseFrame,
        };
    }

    public getScene(): THREE.Scene {
        return this.components.scene;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.components.renderer;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.components.camera;
    }

    public getControls() {
        return this.components.controls;
    }

    public getBaseFrame(): THREE.AxesHelper {
        return this.components.baseFrame;
    }

    public getAllComponents(): SceneComponents {
        return this.components;
    }

    public startAnimation(animationCallback?: () => void): void {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update controls if they have damping or auto-rotate enabled
            this.components.controls.update();
            
            // Custom animation callback
            if (animationCallback) {
                animationCallback();
            }
            
            // Render the scene
            this.components.renderer.render(this.components.scene, this.components.camera);
        };
        
        animate();
    }

    public dispose(): void {
        // Clean up renderer
        this.components.renderer.dispose();
        
        // Clean up geometries and materials
        this.components.grid.geometry.dispose();
        if (Array.isArray(this.components.grid.material)) {
            this.components.grid.material.forEach(material => material.dispose());
        } else {
            this.components.grid.material.dispose();
        }
        
        // Remove controls event listeners
        this.components.controls.dispose();
    }
}