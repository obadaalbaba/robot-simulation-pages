import * as THREE from 'three';
import { type UserInputs } from '../user-inputs';

// Type aliases for better type safety with indices
export type LinkIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type JointNumber = 1 | 2 | 3 | 4 | 5 | 6;  // Joints are numbered 1-6, not 0-5

export interface RobotComponents {
    // Link origins (coordinate frames at start of each link) - indexed from 0-6
    linkOrigins: THREE.AxesHelper[];
    
    // Link end frames (coordinate frames at end of each link) - indexed from 0-6
    linkEnds: THREE.AxesHelper[];
    
    // Joint frames (coordinate frames that rotate with joints) - joint1 at index 0, joint6 at index 5
    jointFrames: THREE.AxesHelper[];  // Array length 6: [joint1, joint2, joint3, joint4, joint5, joint6]
    
    // Tool Center Point
    tcp: THREE.AxesHelper;
}

export interface RobotConfig {
    userInputs: UserInputs;
    baseFrame: THREE.Object3D;
}