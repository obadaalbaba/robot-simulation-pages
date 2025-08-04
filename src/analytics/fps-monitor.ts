import C3DAnalytics from '@cognitive3d/analytics';
import C3DThreeAdapter from '@cognitive3d/analytics/adapters/threejs';
import * as THREE from 'three';

export interface FPSMonitorConfig {
    apiKey: string;
    sceneName: string;
    sceneId: string;
    versionNumber: string;
}

export interface FPSMetrics {
    avg: number;
    '1pl': number;
}

export class FPSMonitor {
    private c3d: C3DAnalytics;
    private adapter: C3DThreeAdapter;
    private isMonitoring: boolean = false;
    private fpsDisplay: HTMLElement | null = null;
    private onFPSUpdate?: (metrics: FPSMetrics) => void;
    private camera?: THREE.PerspectiveCamera;
    private gazeTrackingEnabled: boolean = false;
    private lastGazeTime: number = 0;
    private gazeRecordingInterval: number = 100; // Record gaze every 100ms (10 times per second)

    constructor(config: FPSMonitorConfig) {
        // Initialize C3D Analytics
        this.c3d = new C3DAnalytics({
            config: {
                APIKey: config.apiKey,
                allSceneData: [{
                    sceneName: config.sceneName,
                    sceneId: config.sceneId,
                    versionNumber: config.versionNumber
                }]
            }
        });

        // Create adapter
        this.adapter = new C3DThreeAdapter(this.c3d);

        // Set the current scene
        this.c3d.setScene(config.sceneName);
        
        // Create FPS display element
        this.createFPSDisplay();
    }

    private createFPSDisplay(): void {
        this.fpsDisplay = document.createElement('div');
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

    private updateFPSDisplay(metrics: FPSMetrics): void {
        if (this.fpsDisplay) {
            this.fpsDisplay.innerHTML = `
                FPS: ${metrics.avg.toFixed(1)}<br>
                1%L: ${metrics['1pl'].toFixed(1)}
            `;
        }
        
        // Call external callback if provided
        if (this.onFPSUpdate) {
            this.onFPSUpdate(metrics);
        }
    }

    public async start(camera?: THREE.PerspectiveCamera): Promise<void> {
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

        // Start C3D session with simulated XR support
        try {
            // Create a mock XR session object for better analytics quality
            const mockXRSession = this.createMockXRSession();
            await this.c3d.startSession(mockXRSession);
            
            if (camera) {
                this.gazeTrackingEnabled = true;
                console.log('✅ C3D Analytics session started with simulated XR (gaze tracking enabled)');
            } else {
                console.log('✅ C3D Analytics session started with simulated XR (no gaze tracking)');
            }
        } catch (error) {
            console.warn('⚠️ C3D session start failed:', error);
        }

        this.isMonitoring = true;
    }

    public stop(): void {
        if (!this.isMonitoring) return;

        if (this.c3d.isSessionActive()) {
            this.c3d.endSession().catch(console.error);
        }

        // Remove FPS display
        if (this.fpsDisplay && this.fpsDisplay.parentNode) {
            this.fpsDisplay.parentNode.removeChild(this.fpsDisplay);
            this.fpsDisplay = null;
        }

        this.isMonitoring = false;
    }

    public setFPSCallback(callback: (metrics: FPSMetrics) => void): void {
        this.onFPSUpdate = callback;
    }

    public showFPSDisplay(show: boolean = true): void {
        if (this.fpsDisplay) {
            this.fpsDisplay.style.display = show ? 'block' : 'none';
        }
    }

    public hideFPSDisplay(): void {
        this.showFPSDisplay(false);
    }

    public getAdapter(): C3DThreeAdapter {
        return this.adapter;
    }

    public isActive(): boolean {
        return this.isMonitoring;
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

    private createMockXRSession(): any {
        // Minimal mock XR session - only implement methods that are actually used
        const mockSession = {
            // Core properties that may be checked
            inputSources: [],
            environmentBlendMode: 'opaque',
            visibilityState: 'visible',
            enabledFeatures: [], // SDK expects array for .includes() calls
            
            // Event handling - SDK tries to add listeners
            addEventListener: (_type: string, _listener: any) => {
                // No-op but SDK expects this method to exist
            },
            
            // Animation frame handling - REQUIRED by C3D SDK
            requestAnimationFrame: (callback: (time: number, frame?: any) => void) => {
                return requestAnimationFrame((time) => {
                    const mockFrame = {
                        session: mockSession,
                        getViewerPose: () => null, // Minimal frame interface
                    };
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
                    getOffsetReferenceSpace: (_transform: any) => ({}),
                });
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