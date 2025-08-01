declare module '@cognitive3d/analytics' {
  interface C3DConfig {
    APIKey: string;
    allSceneData: Array<{
      sceneName: string;
      sceneId: string;
      versionNumber: string;
    }>;
  }

  interface C3DGaze {
    recordGaze(position: number[], rotation: number[], gaze: number[]): void;
  }

  interface FPSMetrics {
    avg: number;
    '1pl': number;
  }

  interface C3DFPSTracker {
    start(callback: (metrics: FPSMetrics) => void): void;
    stop(): void;
    lastDeltaTime: number;
  }

  interface C3DSensor {
    recordSensor(sensorName: string, value: any): void;
  }

  class C3DAnalytics {
    constructor(options: { config: C3DConfig });
    gaze: C3DGaze;
    sensor: C3DSensor;
    fpsTracker: C3DFPSTracker;
    setDeviceProperty(key: string, value: string): void;
    setScene(sceneName: string): void;
    startSession(xrSession?: any): Promise<boolean>;
    endSession(): Promise<any>;
    isSessionActive(): boolean;
    getApiKey(): string;
    getSceneId(): string;
  }

  export default C3DAnalytics;
}

declare module '@cognitive3d/analytics/adapters/threejs' {
  import C3DAnalytics from '@cognitive3d/analytics';
  import { Vector3, Quaternion, Camera } from 'three';

  class C3DThreeAdapter {
    constructor(c3dInstance: C3DAnalytics);
    c3d: C3DAnalytics;
    
    /**
     * Converts a THREE.Vector3 to a simple array [x, y, z]
     */
    fromVector3(vec3: Vector3): [number, number, number];
    
    /**
     * Converts a THREE.Quaternion to a simple array [x, y, z, w]
     */
    fromQuaternion(quat: Quaternion): [number, number, number, number];
    
    /**
     * Records gaze data from a THREE.js camera
     */
    recordGazeFromCamera(camera: Camera): void;
  }

  export default C3DThreeAdapter;
} 