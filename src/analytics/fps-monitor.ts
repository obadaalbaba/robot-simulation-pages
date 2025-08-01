import C3DAnalytics from '@cognitive3d/analytics';
import C3DThreeAdapter from '@cognitive3d/analytics/adapters/threejs';

export interface FPSMonitorConfig {
    apiKey: string;
    sceneName: string;
    sceneId: string;
    versionNumber: string;
}

export class FPSMonitor {
    private c3d: C3DAnalytics;
    private adapter: C3DThreeAdapter;
    private isMonitoring: boolean = false;

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
    }

    public async start(): Promise<void> {
        if (this.isMonitoring) return;

        // Start FPS monitoring
        if (this.c3d.fpsTracker) {
            this.c3d.fpsTracker.start((metrics) => {
                console.log(`📊 FPS: ${metrics.avg.toFixed(1)} avg, ${metrics['1pl'].toFixed(1)} 1%L`);
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

        this.isMonitoring = false;
    }

    public getAdapter(): C3DThreeAdapter {
        return this.adapter;
    }

    public isActive(): boolean {
        return this.isMonitoring;
    }
}