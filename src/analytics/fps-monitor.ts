import C3DAnalytics from '@cognitive3d/analytics';
import C3DThreeAdapter from '@cognitive3d/analytics/adapters/threejs';

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

    public async start(): Promise<void> {
        if (this.isMonitoring) return;

        // Start FPS monitoring
        if (this.c3d.fpsTracker) {
            this.c3d.fpsTracker.start((metrics) => {
                this.updateFPSDisplay(metrics);
            });
            console.log('✅ FPS monitoring started');
        } else {
            console.error('❌ FPS tracker not available');
        }

        // Start C3D session
        try {
            await this.c3d.startSession();
            console.log('✅ C3D Analytics session started');
        } catch (error) {
            console.warn('⚠️ C3D session start failed (expected for non-XR):', error);
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
}