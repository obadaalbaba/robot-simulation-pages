import { type Axis } from '../shared/types';

/**
 * Type-safe robot definition that serves as the single source of truth
 * for robot structure, defaults, and validation limits.
 */

// Visual constants for robot rendering
export const VISUAL_CONSTANTS = {
  // Axes sizes
  LINK_ORIGIN_AXES_SIZE: 3,
  LINK_END_AXES_SIZE: 3,
  JOINT_FRAME_AXES_SIZE: 5,
  TCP_FRAME_AXES_SIZE: 5,
  
  // Line widths
  STANDARD_LINE_WIDTH: 1,
  THICK_LINE_WIDTH: 2,
  
  // Geometry
  LINK_RADIUS: 1,
  JOINT_RADIUS: 1.5,
  JOINT_HEIGHT: 2,
  CYLINDER_RADIAL_SEGMENTS: 32,
  
  // Colors
  LINK_COLOR: 0xc0c0c0, // Light Grey
  JOINT_COLOR: 0x4682b4, // Steel Blue
  
  // Mathematical constants
  DEGREES_TO_RADIANS: 180,
} as const;

export interface JointDefinition {
    direction: Axis;
    defaultAngle: number;
    angleRange: { min: number; max: number };
}

export interface LinkDefinition {
    direction: Axis;
    defaultLength: number;
    lengthRange: { min: number; max: number };
}

// Define the robot structure as a const assertion for better type inference
export const ROBOT_CONFIG = {
    links: [
        // Link 0 (base)
        { direction: 'y', defaultLength: 5, lengthRange: { min: 0, max: 20 } },
        // Link 1
        { direction: 'z', defaultLength: 5, lengthRange: { min: 0, max: 20 } },
        // Link 2
        { direction: 'x', defaultLength: 15, lengthRange: { min: 0, max: 20 } },
        // Link 3
        { direction: 'y', defaultLength: 15, lengthRange: { min: 0, max: 20 } },
        // Link 4
        { direction: 'x', defaultLength: 5, lengthRange: { min: 0, max: 20 } },
        // Link 5
        { direction: 'z', defaultLength: 4, lengthRange: { min: 0, max: 20 } },
        // Link 6
        { direction: 'y', defaultLength: 2, lengthRange: { min: 0, max: 20 } },
    ],
    joints: [
        // Joint 1
        { direction: 'y', defaultAngle: 150, angleRange: { min: -180, max: 180 } },
        // Joint 2
        { direction: 'y', defaultAngle: 45, angleRange: { min: -180, max: 180 } },
        // Joint 3
        { direction: 'x', defaultAngle: 45, angleRange: { min: -180, max: 180 } },
        // Joint 4
        { direction: 'y', defaultAngle: 0, angleRange: { min: -180, max: 180 } },
        // Joint 5
        { direction: 'y', defaultAngle: 0, angleRange: { min: -180, max: 180 } },
        // Joint 6
        { direction: 'y', defaultAngle: 0, angleRange: { min: -180, max: 180 } },
    ],
} as const;

// Infer types from the configuration
export type RobotConfig = typeof ROBOT_CONFIG;
export type LinkConfig = RobotConfig['links'][number];
export type JointConfig = RobotConfig['joints'][number];

// Type-safe utilities that work with the config directly
export const RobotDefinition = {
    config: ROBOT_CONFIG,
    getNumLinks: () => ROBOT_CONFIG.links.length,
    getNumJoints: () => ROBOT_CONFIG.joints.length,
    getLinkConfig: (index: number): LinkConfig => {
        if (index < 0 || index >= ROBOT_CONFIG.links.length) {
            throw new Error(`Link index ${index} out of range`);
        }
        return ROBOT_CONFIG.links[index];
    },
    getJointConfig: (index: number): JointConfig => {
        if (index < 0 || index >= ROBOT_CONFIG.joints.length) {
            throw new Error(`Joint index ${index} out of range`);
        }
        return ROBOT_CONFIG.joints[index];
    },
} as const;