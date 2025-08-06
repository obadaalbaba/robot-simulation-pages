/// <reference types="webxr" />

import C3DAnalytics from '@cognitive3d/analytics';
// import C3DThreeAdapter from '@cognitive3d/analytics/adapters/threejs';
import * as THREE from 'three';
// @ts-ignore
import mySettings from './settings';

export interface AnalyticsMonitorConfig {
    apiKey?: string;
    sceneName?: string;
    sceneId?: string;
    versionNumber?: string;
}

export interface FPSMetrics {
    avg: number;
    '1pl': number;
}

export class AnalyticsMonitor {
    private c3d: C3DAnalytics;
    private isMonitoring: boolean = false;
    private fpsDisplay: HTMLElement = document.createElement('div');
    private onFPSUpdate?: (metrics: FPSMetrics) => void;
    private camera?: THREE.OrthographicCamera;
    private gazeTrackingEnabled: boolean = false;
    private lastGazeTime: number = 0;
    private gazeRecordingInterval: number = 100; // Record gaze every 100ms (10Hz as per Step 7 documentation)
    private sceneName?: string;
    private sessionTimeout?: number;
    private sessionDurationMs: number = 2 * 60 * 1000; // 2 minutes in milliseconds

    constructor() {
        this.c3d = new C3DAnalytics(mySettings);
        this.setupBasicUserMetadata();
        this.sceneName = mySettings.config.allSceneData[0].sceneName;
        this.createFPSDisplay();
    }

    // =============================================================================
    // PUBLIC METHODS
    // =============================================================================

    public hasValidCredentials(): boolean {
        const settingsConfig = mySettings.config;
        const sceneData = settingsConfig.allSceneData[0];
        
        return !!(settingsConfig.APIKey && 
                 settingsConfig.APIKey !== 'your_api_key_here' && 
                 settingsConfig.APIKey !== 'ASDF1234ASDF' &&
                 sceneData && 
                 sceneData.sceneName && 
                 sceneData.sceneId && 
                 sceneData.versionNumber);
    }

    public async start(camera?: THREE.OrthographicCamera): Promise<void> {
        if (this.isMonitoring) return;

        // Store camera reference for gaze tracking
        this.camera = camera;

        // Start FPS monitoring
        if (this.c3d.fpsTracker) {
            this.c3d.fpsTracker.start((metrics) => {
                this.updateFPSDisplay(metrics);
            });
            console.log('✅ FPS monitoring started');
        } else {
            console.error('❌ FPS tracker not available');
        }

        // Step 6: Start a Session (following documentation exactly)
        try {
            if (this.hasValidCredentials() && this.sceneName) {
                // Step 6.1: Choose which scene is currently active
                this.c3d.setScene(this.sceneName);
                
                // Step 6.2: Add these 4 required property names to the session
                this.setupRequiredSessionProperties();
                
                // Step 6.3: Start the session
                const mockXRSession = this.createMockXRSession();
                await this.c3d.startSession(mockXRSession);
                
                if (camera) {
                    this.gazeTrackingEnabled = true;
                    console.log('✅ C3D Analytics session started following Step 6 (gaze tracking enabled)');
                } else {
                    console.log('✅ C3D Analytics session started following Step 6 (no gaze tracking)');
                }
                
                // Schedule automatic session end after 2 minutes
                this.scheduleSessionEnd();
            } else {
                console.warn('⚠️ Starting FPS monitor without C3D Analytics (missing/invalid credentials or scene)');
                console.warn('⚠️ Please check your settings.js file for valid API key and scene data');
            }
        } catch (error) {
            console.warn('⚠️ C3D session start failed:', error);
        }

        this.isMonitoring = true;
    }

    public recordGaze(): void {
        // Throttle gaze recording to avoid API spam (10Hz as per documentation)
        const now = Date.now();
        if (now - this.lastGazeTime < this.gazeRecordingInterval) {
            return; // Skip this frame
        }
        
        // Step 7: Record User Gaze using direct C3D API
        if (this.gazeTrackingEnabled && this.camera) {
            try {
                // Extract camera position and rotation for gaze recording
                const pos = this.camera.position.toArray() as [number, number, number];
                const rot = this.camera.quaternion.toArray() as [number, number, number, number];
                
                // Calculate gaze direction (camera forward direction)
                const gazeDirection = new THREE.Vector3(0, 0, -1); // Forward in camera space
                gazeDirection.applyQuaternion(this.camera.quaternion);
                const gaze = gazeDirection.toArray() as [number, number, number];
                
                // Record gaze following Step 7 documentation
                this.c3d.gaze.recordGaze(pos, rot, gaze);
                
                this.lastGazeTime = now;
            } catch (error) {
                // Handle authentication or network errors gracefully
                if (error instanceof Error && error.message.includes('401')) {
                    console.warn('⚠️ Gaze tracking authentication failed - check your Cognitive3D API credentials');
                    this.gazeTrackingEnabled = false; // Disable to prevent spam
                } else {
                    console.warn('⚠️ Gaze tracking error:', error);
                }
            }
        }
    }

    public isGazeTrackingEnabled(): boolean {
        return this.gazeTrackingEnabled;
    }

    // =============================================================================
    // PRIVATE METHODS - Initialization & Setup
    // =============================================================================

    private setupBasicUserMetadata(): void {
        this.c3d.userId = this.generateUserId();
        this.c3d.setUserName("Robot Simulation User");

        const settingsConfig = mySettings.config;

        if (settingsConfig.HMDType) {
            this.c3d.setDeviceName(settingsConfig.HMDType);
        }
        
        this.c3d.setDeviceProperty("AppName", "Robot_Simulation");
        this.c3d.setDeviceProperty("AppVersion", "1.0.0");
    }

    private setupRequiredSessionProperties(): void {
        this.c3d.setUserProperty("c3d.version", "0.1");
        this.c3d.setUserProperty("c3d.app.version", "0.1");
        this.c3d.setUserProperty("c3d.app.engine", "threejs");
        this.c3d.setUserProperty("c3d.deviceid", this.generateDeviceId());
    }

    private generateDeviceId(): string {
        return 'threejs_windows_device_' + Date.now();
    }

    private generateUserId(): string {
        return 'user_' + Date.now();
    }

    // =============================================================================
    // PRIVATE METHODS - FPS Display
    // =============================================================================

    private createFPSDisplay(): void {
        this.fpsDisplay.id = 'fps-monitor';
        this.fpsDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            user-select: none;
            pointer-events: none;
            border: 1px solid rgba(0, 255, 0, 0.3);
        `;
        this.fpsDisplay.textContent = 'FPS: Initializing...';
        document.body.appendChild(this.fpsDisplay);
    }

    private ensureFPSDisplay(): HTMLElement {
        if (!this.fpsDisplay) {
            this.createFPSDisplay();
        }
        return this.fpsDisplay!;
    }

    private updateFPSDisplay(metrics: FPSMetrics): void {
        this.ensureFPSDisplay().innerHTML = `
            FPS: ${metrics.avg.toFixed(1)}<br>
            1%L: ${metrics['1pl'].toFixed(1)}
        `;
        
        // Call external callback if provided
        this.onFPSUpdate?.(metrics);
    }

    // =============================================================================
    // PRIVATE METHODS - Session Management
    // =============================================================================

    private scheduleSessionEnd(): void {
        // Clear any existing timeout
        if (this.sessionTimeout) {
            clearTimeout(this.sessionTimeout);
        }
        
        // Schedule session end after configured duration
        this.sessionTimeout = setTimeout(() => {
            this.endSession();
        }, this.sessionDurationMs);
        
        console.log(`⏱️ C3D Analytics session will automatically end in ${this.sessionDurationMs / 1000} seconds`);
    }

    private async endSession(): Promise<void> {
        try {
            if (this.c3d.isSessionActive()) {
                await this.c3d.endSession();
                console.log('✅ C3D Analytics session ended successfully');
                
                // Disable gaze tracking
                this.gazeTrackingEnabled = false;
                
                // Clear the timeout
                if (this.sessionTimeout) {
                    clearTimeout(this.sessionTimeout);
                    this.sessionTimeout = undefined;
                }
            } else {
                console.log('ℹ️ C3D Analytics session was not active');
            }
        } catch (error) {
            console.warn('⚠️ Error ending C3D Analytics session:', error);
        }
    }

    // =============================================================================
    // PRIVATE METHODS - XR Session Mock
    // =============================================================================

    private createMockXRSession(): Partial<XRSession> {
        // Minimal mock XR session - only implement methods that are actually used
        const mockSession = {
            // Core properties that may be checked
            inputSources: [],
            environmentBlendMode: 'opaque' as XREnvironmentBlendMode,
            visibilityState: 'visible' as XRVisibilityState,
            enabledFeatures: [], // SDK expects array for .includes() calls
            
            // Event handling - SDK tries to add/remove listeners
            addEventListener: () => {
                // No-op but SDK expects this method to exist
            },
            
            removeEventListener: () => {
                // No-op but SDK expects this method to exist during cleanup
            },
            
            // Animation frame handling - REQUIRED by C3D SDK
            requestAnimationFrame: (callback: XRFrameRequestCallback) => {
                return requestAnimationFrame((time) => {
                    const mockFrame = {
                        session: mockSession,
                        getViewerPose: () => null, // Minimal frame interface
                    } as unknown as XRFrame;
                    callback(time, mockFrame);
                });
            },
            
            cancelAnimationFrame: (handle: number) => {
                cancelAnimationFrame(handle);
            },
            
            // Reference space handling - USED by C3D SDK  
            requestReferenceSpace: (type: string) => {
                console.log(`🔧 Mock XR: Using "${type}" reference space`);
                return Promise.resolve({
                    getOffsetReferenceSpace: () => ({}),
                } as unknown as XRReferenceSpace);
            },
            
            // Session cleanup - USED when ending session
            end: () => {
                console.log('🔧 Mock XR: Session ended');
                return Promise.resolve();
            }
        };
        
        // Add proxy to catch any unexpected method calls
        return new Proxy(mockSession, {
            get: (target, prop) => {
                if (prop in target) {
                    return target[prop as keyof typeof target];
                }
                console.warn(`🔧 Mock XR: Unexpected method/property access: ${String(prop)}`);
                return () => null; // Return a no-op function for any method calls
            }
        });
    }
}