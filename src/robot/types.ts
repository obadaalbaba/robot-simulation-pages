import * as THREE from 'three';
import { type UserInputs } from '../user-inputs';

export interface RobotComponents {
    // Link origins (coordinate frames at start of each link)
    link0origin: THREE.AxesHelper;
    link1origin: THREE.AxesHelper;
    link2origin: THREE.AxesHelper;
    link3origin: THREE.AxesHelper;
    
    // Link end frames (coordinate frames at end of each link)
    link0end: THREE.AxesHelper;
    link1end: THREE.AxesHelper;
    link2end: THREE.AxesHelper;
    link3end: THREE.AxesHelper;
    
    // Joint frames (coordinate frames that rotate with joints)
    joint1frame: THREE.AxesHelper;
    joint2frame: THREE.AxesHelper;
    joint3frame: THREE.AxesHelper;
    joint4frame: THREE.AxesHelper;
    joint5frame: THREE.AxesHelper;
    joint6frame: THREE.AxesHelper;
    
    // Tool Center Point
    tcp: THREE.AxesHelper;
}

export interface RobotConfig {
    userInputs: UserInputs;
    baseFrame: THREE.Object3D;
}