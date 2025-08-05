import * as THREE from 'three';
import {
    createScene,
    createRenderer,
    createCamera,
    createGrid,
    createControls,
    createReferenceFrame,
} from './functions';
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
        const renderer = createRenderer(document.body);
        const camera = createCamera(
            this.config.camera.positionZ,
            this.config.camera.positionY,
            this.config.camera.positionX,
            this.config.camera
        );
        
        // Create interactive components
        const controls = createControls(camera, renderer);
        
        // Create scene objects
        const grid = createGrid(this.config.grid.size, this.config.grid.divisions);
        const worldReferenceFrame = createReferenceFrame(this.config.referenceFrame);
        
        // Add objects to scene
        scene.add(grid);
        scene.add(worldReferenceFrame);

        return {
            scene,
            renderer,
            camera,
            controls,
            grid,
            worldReferenceFrame,
        };
    }

    public getScene(): THREE.Scene {
        return this.components.scene;
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.components.renderer;
    }

    public getCamera(): THREE.OrthographicCamera {
        return this.components.camera;
    }

    public getControls() {
        return this.components.controls;
    }

    public getWorldReferenceFrame(): THREE.Group {
        return this.components.worldReferenceFrame;
    }

    public getAllComponents(): SceneComponents {
        return this.components;
    }

    public startAnimation(animationCallback?: () => void): void {
        const animate = () => {
            try {
                requestAnimationFrame(animate);
                
                // Update controls if they have damping or auto-rotate enabled
                this.components.controls.update();
                
                // Custom animation callback
                if (animationCallback) {
                    animationCallback();
                }
                
                // Render the scene
                this.components.renderer.render(this.components.scene, this.components.camera);
            } catch (error) {
                console.error('Animation loop error:', error);
                // Continue animation loop even if one frame fails
                requestAnimationFrame(animate);
            }
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