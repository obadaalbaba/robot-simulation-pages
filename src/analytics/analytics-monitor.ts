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

interface GazeData {
    position: [number, number, number];
    rotation: [number, number, number, number];
    direction: [number, number, number];
}

export class AnalyticsMonitor {
    // Constants
    private static readonly GAZE_RECORDING_INTERVAL_MS = 100; // 10Hz as per Step 7 documentation
    private static readonly FPS_DISPLAY_TOP_OFFSET = 10;
    private static readonly FPS_DISPLAY_LEFT_OFFSET = 10;
    private static readonly FPS_DISPLAY_PADDING = 8;
    private static readonly FPS_DISPLAY_BORDER_RADIUS = 4;
    private static readonly FPS_DISPLAY_FONT_SIZE = 12;
    private static readonly FPS_DISPLAY_Z_INDEX = 10000;
    private static readonly APP_VERSION = "1.0.0";
    private static readonly C3D_VERSION = "0.1";
    private static readonly ENGINE_NAME = "threejs";
    
    // Default values for invalid credentials
    private static readonly DEFAULT_API_KEY_PLACEHOLDER = 'your_api_key_here';
    private static readonly TEST_API_KEY_PLACEHOLDER = 'ASDF1234ASDF';

    // Instance properties
    private c3d: C3DAnalytics;
    private isMonitoring: boolean = false;
    private fpsDisplay: HTMLElement = document.createElement('div');
    private onFPSUpdate?: (metrics: FPSMetrics) => void;
    private camera?: THREE.OrthographicCamera;
    private gazeTrackingEnabled: boolean = false;
    private lastGazeTime: number = 0;
    private sceneName?: string;

    constructor() {
        this.c3d = new C3DAnalytics(mySettings);
        this.sceneName = mySettings.config.allSceneData[0].sceneName;
        this.setupBasicUserMetadata();
        this.createFPSDisplay();
    }

    // =============================================================================
    // PUBLIC API
    // =============================================================================

    public hasValidCredentials(): boolean {
        const settingsConfig = mySettings.config;
        const sceneData = settingsConfig.allSceneData[0];
        
        return !!(settingsConfig.APIKey && 
                 settingsConfig.APIKey !== AnalyticsMonitor.DEFAULT_API_KEY_PLACEHOLDER && 
                 settingsConfig.APIKey !== AnalyticsMonitor.TEST_API_KEY_PLACEHOLDER &&
                 sceneData && 
                 sceneData.sceneName && 
                 sceneData.sceneId && 
                 sceneData.versionNumber);
    }

    public async start(camera?: THREE.OrthographicCamera): Promise<void> {
        if (this.isMonitoring) return;

        this.camera = camera;
        this.startFPSMonitoring();
        await this.startAnalyticsSession();
        this.isMonitoring = true;
    }

    public async stop(): Promise<void> {
        if (!this.isMonitoring) return;

        await this.endSession();
        this.stopFPSMonitoring();
        this.isMonitoring = false;
    }

    public isSessionActive(): boolean {
        return this.isMonitoring && this.c3d.isSessionActive();
    }

    public recordGaze(): void {
        if (!this.shouldRecordGaze()) {
            return;
        }
        
        try {
            const gazeData = this.calculateGazeData();
            this.c3d.gaze.recordGaze(gazeData.position, gazeData.rotation, gazeData.direction);
            this.lastGazeTime = Date.now();
        } catch (error) {
            this.handleGazeTrackingError(error);
        }
    }

    public isGazeTrackingEnabled(): boolean {
        return this.gazeTrackingEnabled;
    }

    // =============================================================================
    // PRIVATE METHODS - Analytics Session Management
    // =============================================================================

    private startFPSMonitoring(): void {
        if (this.c3d.fpsTracker) {
            this.c3d.fpsTracker.start((metrics) => {
                this.updateFPSDisplay(metrics);
            });
            console.log('✅ FPS monitoring started');
        } else {
            console.error('❌ FPS tracker not available');
        }
    }

    private stopFPSMonitoring(): void {
        if (this.c3d.fpsTracker) {
            this.c3d.fpsTracker.stop();
            console.log('✅ FPS monitoring stopped');
        }
        
        // Hide FPS display
        if (this.fpsDisplay && this.fpsDisplay.parentNode) {
            this.fpsDisplay.style.display = 'none';
        }
    }

    private async startAnalyticsSession(): Promise<void> {
        // Step 6: Start a Session (following documentation exactly)
        try {
            if (this.hasValidCredentials() && this.sceneName) {
                await this.initializeC3DSession();
                this.enableGazeTrackingIfCameraAvailable();
                // Note: No automatic session scheduling - user controls via GUI
            } else {
                this.logInvalidCredentialsWarning();
            }
        } catch (error) {
            console.warn('⚠️ C3D session start failed:', error);
        }
        
        // Show FPS display when starting
        if (this.fpsDisplay) {
            this.fpsDisplay.style.display = 'block';
        }
    }

    private async initializeC3DSession(): Promise<void> {
        // Step 6.1: Choose which scene is currently active
        this.c3d.setScene(this.sceneName!);
        
        // Step 6.2: Add these 4 required property names to the session
        this.setupRequiredSessionProperties();
        
        // Step 6.3: Start the session
        const mockXRSession = this.createMockXRSession();
        await this.c3d.startSession(mockXRSession);
    }

    private enableGazeTrackingIfCameraAvailable(): void {
        if (this.camera) {
            this.gazeTrackingEnabled = true;
            console.log('✅ C3D Analytics session started following Step 6 (gaze tracking enabled)');
        } else {
            console.log('✅ C3D Analytics session started following Step 6 (no gaze tracking)');
        }
    }

    private logInvalidCredentialsWarning(): void {
        console.warn('⚠️ Starting FPS monitor without C3D Analytics (missing/invalid credentials or scene)');
        console.warn('⚠️ Please check your settings.js file for valid API key and scene data');
    }

    // =============================================================================
    // PRIVATE METHODS - Gaze Tracking
    // =============================================================================

    private shouldRecordGaze(): boolean {
        // Throttle gaze recording to avoid API spam (10Hz as per documentation)
        const now = Date.now();
        const timeSinceLastGaze = now - this.lastGazeTime;
        
        return this.gazeTrackingEnabled && 
               !!this.camera && 
               timeSinceLastGaze >= AnalyticsMonitor.GAZE_RECORDING_INTERVAL_MS;
    }

    private calculateGazeData(): GazeData {
        if (!this.camera) {
            throw new Error('Camera not available for gaze calculation');
        }

        // Extract camera position and rotation for gaze recording
        const position = this.camera.position.toArray() as [number, number, number];
        const rotation = this.camera.quaternion.toArray() as [number, number, number, number];
        
        // Calculate gaze direction (camera forward direction)
        const gazeDirection = new THREE.Vector3(0, 0, -1); // Forward in camera space
        gazeDirection.applyQuaternion(this.camera.quaternion);
        const direction = gazeDirection.toArray() as [number, number, number];
        
        return { position, rotation, direction };
    }

    private handleGazeTrackingError(error: unknown): void {
        // Handle authentication or network errors gracefully
        if (error instanceof Error && error.message.includes('401')) {
            console.warn('⚠️ Gaze tracking authentication failed - check your Cognitive3D API credentials');
            this.gazeTrackingEnabled = false; // Disable to prevent spam
        } else {
            console.warn('⚠️ Gaze tracking error:', error);
        }
    }

    // =============================================================================
    // PRIVATE METHODS - User & Device Setup
    // =============================================================================

    private setupBasicUserMetadata(): void {
        this.c3d.userId = this.generateUserId();
        this.c3d.setUserName("Robot Simulation User");

        const settingsConfig = mySettings.config;

        if (settingsConfig.HMDType) {
            this.c3d.setDeviceName(settingsConfig.HMDType);
        }
        
        this.c3d.setDeviceProperty("AppName", "Robot_Simulation");
        this.c3d.setDeviceProperty("AppVersion", AnalyticsMonitor.APP_VERSION);
    }

    private setupRequiredSessionProperties(): void {
        this.c3d.setUserProperty("c3d.version", AnalyticsMonitor.C3D_VERSION);
        this.c3d.setUserProperty("c3d.app.version", AnalyticsMonitor.C3D_VERSION);
        this.c3d.setUserProperty("c3d.app.engine", AnalyticsMonitor.ENGINE_NAME);
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
        this.fpsDisplay.style.cssText = this.getFPSDisplayStyles();
        this.fpsDisplay.textContent = 'Click on the "Start Analytics" button to start the analytics session';
        document.body.appendChild(this.fpsDisplay);
    }

    private getFPSDisplayStyles(): string {
        return `
            position: fixed;
            top: ${AnalyticsMonitor.FPS_DISPLAY_TOP_OFFSET}px;
            left: ${AnalyticsMonitor.FPS_DISPLAY_LEFT_OFFSET}px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: ${AnalyticsMonitor.FPS_DISPLAY_PADDING}px 12px;
            border-radius: ${AnalyticsMonitor.FPS_DISPLAY_BORDER_RADIUS}px;
            font-family: 'Courier New', monospace;
            font-size: ${AnalyticsMonitor.FPS_DISPLAY_FONT_SIZE}px;
            font-weight: bold;
            z-index: ${AnalyticsMonitor.FPS_DISPLAY_Z_INDEX};
            user-select: none;
            pointer-events: none;
            border: 1px solid rgba(0, 255, 0, 0.3);
        `;
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

    private async endSession(): Promise<void> {
        try {
            if (this.c3d.isSessionActive()) {
                await this.c3d.endSession();
                console.log('✅ C3D Analytics session ended successfully');
                
                // Disable gaze tracking
                this.gazeTrackingEnabled = false;
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