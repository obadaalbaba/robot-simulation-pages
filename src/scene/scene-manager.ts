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
    private resizeHandler: () => void;

    constructor(config?: Partial<SceneConfig>) {
        this.config = { ...defaultSceneConfig, ...config };
        this.components = this.initializeScene();
        this.resizeHandler = this.handleResize.bind(this);
        this.setupResizeListener();
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

    private setupResizeListener(): void {
        window.addEventListener('resize', this.resizeHandler);
    }

    private handleResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;

        // Update renderer size
        this.components.renderer.setSize(width, height);

        // Update camera for orthographic projection
        const camera = this.components.camera;
        const frustumSize = this.config.camera.frustumSize;
        
        camera.left = -frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        
        camera.updateProjectionMatrix();
    }

    public dispose(): void {
        // Remove resize event listener
        window.removeEventListener('resize', this.resizeHandler);
        
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