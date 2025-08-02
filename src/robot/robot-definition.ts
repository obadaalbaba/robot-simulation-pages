import { type Axis } from '../shared/types';

/**
 * Unified robot definition that serves as the single source of truth
 * for robot structure, defaults, and validation limits.
 */

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

export interface RobotDefinition {
    links: LinkDefinition[];
    joints: JointDefinition[];
}

// Shared limits
const ANGLE_LIMITS = { min: -180, max: 180 };
const LENGTH_LIMITS = { min: 0, max: 20 };

/**
 * The canonical robot definition - modify this to change the entire robot
 */
export const ROBOT_DEFINITION: RobotDefinition = {
    links: [
        // Link 0 (base)
        { direction: 'y', defaultLength: 5, lengthRange: LENGTH_LIMITS },
        // Link 1
        { direction: 'z', defaultLength: 5, lengthRange: LENGTH_LIMITS },
        // Link 2
        { direction: 'x', defaultLength: 15, lengthRange: LENGTH_LIMITS },
        // Link 3
        { direction: 'y', defaultLength: 15, lengthRange: LENGTH_LIMITS },
        // Link 4
        { direction: 'x', defaultLength: 8, lengthRange: LENGTH_LIMITS },
        // Link 5
        { direction: 'z', defaultLength: 8, lengthRange: LENGTH_LIMITS },
        // Link 6
        { direction: 'y', defaultLength: 5, lengthRange: LENGTH_LIMITS },
    ],
    joints: [
        // Joint 1
        { direction: 'y', defaultAngle: 150, angleRange: ANGLE_LIMITS },
        // Joint 2
        { direction: 'y', defaultAngle: 45, angleRange: ANGLE_LIMITS },
        // Joint 3
        { direction: 'x', defaultAngle: 45, angleRange: ANGLE_LIMITS },
        // Joint 4
        { direction: 'y', defaultAngle: 0, angleRange: ANGLE_LIMITS },
        // Joint 5
        { direction: 'y', defaultAngle: 0, angleRange: ANGLE_LIMITS },
        // Joint 6
        { direction: 'y', defaultAngle: 0, angleRange: ANGLE_LIMITS },
    ],
};

/**
 * Utility functions to work with the robot definition
 */
export const RobotDefinitionUtils = {
    getNumLinks: (): number => ROBOT_DEFINITION.links.length,
    getNumJoints: (): number => ROBOT_DEFINITION.joints.length,
    
    getLinkDefinition: (index: number): LinkDefinition => {
        if (index < 0 || index >= ROBOT_DEFINITION.links.length) {
            throw new Error(`Link index ${index} out of range`);
        }
        return ROBOT_DEFINITION.links[index];
    },
    
    getJointDefinition: (index: number): JointDefinition => {
        if (index < 0 || index >= ROBOT_DEFINITION.joints.length) {
            throw new Error(`Joint index ${index} out of range`);
        }
        return ROBOT_DEFINITION.joints[index];
    },
    
    // Generate property names dynamically
    getLinkDirectionKey: (index: number): string => `link_${index}_direction`,
    getLinkLengthKey: (index: number): string => `link_${index}_length`,
    getJointDirectionKey: (index: number): string => `joint${index + 1}_direction`,
    getJointAngleKey: (index: number): string => `theta${index + 1}`,
};