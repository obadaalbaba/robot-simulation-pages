/// <reference types="webxr" />

import C3DAnalytics from 'cognitive-3d-analytics/lib';
import C3DThreeAdapter from 'cognitive-3d-analytics/adapters/threejs';
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
    private adapter: C3DThreeAdapter;
    private isMonitoring: boolean = false;
    private fpsDisplay: HTMLElement = document.createElement('div');
    private onFPSUpdate?: (metrics: FPSMetrics) => void;
    private camera?: THREE.OrthographicCamera;
    private gazeTrackingEnabled: boolean = false;
    private lastGazeTime: number = 0;
    private gazeRecordingInterval: number = 100; // Record gaze every 100ms (10 times per second)

    constructor(config: AnalyticsMonitorConfig = {}) {
        // Get configuration from settings file, allow override from config parameter
        const settingsConfig = mySettings.config;
        const sceneData = settingsConfig.allSceneData[0];
        
        const finalConfig = {
            apiKey: config.apiKey || settingsConfig.APIKey,
            sceneName: config.sceneName || sceneData?.sceneName,
            sceneId: config.sceneId || sceneData?.sceneId,
            versionNumber: config.versionNumber || sceneData?.versionNumber
        };

        // Initialize C3D Analytics with full settings
        this.c3d = new C3DAnalytics(mySettings);

        // Create adapter
        this.adapter = new C3DThreeAdapter(this.c3d);

        // Set user metadata as recommended by C3D documentation
        this.setupUserMetadata();

        // Set the current scene
        if (finalConfig.sceneName) {
            this.c3d.setScene(finalConfig.sceneName);
        }
        
        // Create FPS display element
        this.createFPSDisplay();
    }

    private setupUserMetadata(): void {
        // Set required user properties as per C3D documentation
        // Using setDeviceProperty as it's the available method in the SDK
        this.c3d.setDeviceProperty("c3d.version", "0.1");
        this.c3d.setDeviceProperty("c3d.app.version", "0.1");
        this.c3d.setDeviceProperty("c3d.app.engine", "threejs");
        this.c3d.setDeviceProperty("c3d.deviceid", this.generateDeviceId());

        // Set device information from settings
        const settingsConfig = mySettings.config;
        if (settingsConfig.HMDType) {
            this.c3d.setDeviceProperty("HMDType", settingsConfig.HMDType);
        }
        
        // Set a default user ID using device property
        this.c3d.setDeviceProperty("userId", this.generateUserId());
    }

    private generateDeviceId(): string {
        // Generate a simple device ID based on browser fingerprint
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx?.fillText('device-id', 10, 10);
        const fingerprint = canvas.toDataURL();
        return btoa(fingerprint).substring(0, 16);
    }

    private generateUserId(): string {
        // Generate a simple user ID for analytics
        return 'user_' + Math.random().toString(36).substring(2, 15);
    }

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

        // Start C3D session following documentation guidelines
        try {
            if (this.hasValidCredentials()) {
                // Create a mock XR session object for better analytics quality
                const mockXRSession = this.createMockXRSession();
                await this.c3d.startSession(mockXRSession);
                
                if (camera) {
                    this.gazeTrackingEnabled = true;
                    console.log('✅ C3D Analytics session started with valid credentials (gaze tracking enabled)');
                } else {
                    console.log('✅ C3D Analytics session started with valid credentials (no gaze tracking)');
                }
            } else {
                console.warn('⚠️ Starting FPS monitor without C3D Analytics (missing/invalid credentials)');
                console.warn('⚠️ Please check your settings.js file for valid API key and scene data');
            }
        } catch (error) {
            console.warn('⚠️ C3D session start failed:', error);
        }

        this.isMonitoring = true;
    }

    public recordGaze(): void {
        // Throttle gaze recording to avoid API spam
        const now = Date.now();
        if (now - this.lastGazeTime < this.gazeRecordingInterval) {
            return; // Skip this frame
        }
        
        // Record gaze data from Three.js camera if available
        if (this.gazeTrackingEnabled && this.camera && this.adapter) {
            try {
                this.adapter.recordGazeFromCamera(this.camera);
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

    public setGazeRecordingFrequency(intervalMs: number): void {
        this.gazeRecordingInterval = Math.max(50, intervalMs); // Minimum 50ms (20fps max)
        console.log(`🎯 Gaze recording frequency set to ${1000/this.gazeRecordingInterval}fps`);
    }

    private createMockXRSession(): Partial<XRSession> {
        // Minimal mock XR session - only implement methods that are actually used
        const mockSession = {
            // Core properties that may be checked
            inputSources: [],
            environmentBlendMode: 'opaque' as XREnvironmentBlendMode,
            visibilityState: 'visible' as XRVisibilityState,
            enabledFeatures: [], // SDK expects array for .includes() calls
            
            // Event handling - SDK tries to add listeners
            addEventListener: () => {
                // No-op but SDK expects this method to exist
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