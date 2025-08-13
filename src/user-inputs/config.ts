import { UserInputs, UserInputKeys } from './types';
import { RobotDefinition } from '../robot/robot-definition';

/**
 * Configuration generated from the unified robot definition
 * This ensures all default values and limits come from a single source
 */

// Generate default user inputs from robot definition
export const defaultUserInputs: UserInputs = (() => {
    const robotConfig = RobotDefinition.config;
    
    return {
        // Link 0
        link_0_direction: robotConfig.links[0].direction,
        link_0_length: robotConfig.links[0].defaultLength,
        
        // Joint 1 + Link 1  
        joint1_direction: robotConfig.joints[0].direction,
        theta1: robotConfig.joints[0].defaultAngle,
        link_1_direction: robotConfig.links[1].direction,
        link_1_length: robotConfig.links[1].defaultLength,
        
        // Joint 2 + Link 2
        joint2_direction: robotConfig.joints[1].direction,
        theta2: robotConfig.joints[1].defaultAngle,
        link_2_direction: robotConfig.links[2].direction,
        link_2_length: robotConfig.links[2].defaultLength,
        
        // Joint 3 + Link 3
        joint3_direction: robotConfig.joints[2].direction,
        theta3: robotConfig.joints[2].defaultAngle,
        link_3_direction: robotConfig.links[3].direction,
        link_3_length: robotConfig.links[3].defaultLength,
        
        // Joint 4 + Link 4
        joint4_direction: robotConfig.joints[3].direction,
        theta4: robotConfig.joints[3].defaultAngle,
        link_4_direction: robotConfig.links[4].direction,
        link_4_length: robotConfig.links[4].defaultLength,
        
        // Joint 5 + Link 5
        joint5_direction: robotConfig.joints[4].direction,
        theta5: robotConfig.joints[4].defaultAngle,
        link_5_direction: robotConfig.links[5].direction,
        link_5_length: robotConfig.links[5].defaultLength,
        
        // Joint 6 + Link 6
        joint6_direction: robotConfig.joints[5].direction,
        theta6: robotConfig.joints[5].defaultAngle,
        link_6_direction: robotConfig.links[6].direction,
        link_6_length: robotConfig.links[6].defaultLength,
    };
})();

// Generate GUI configuration from robot definition
export const guiConfig = (() => {
    const robotConfig = RobotDefinition.config;
    
    // Generate angle limits for all joints
    const angles = Object.fromEntries(
        UserInputKeys.JOINT_ANGLES.map((angleKey, index) => [
            angleKey, 
            robotConfig.joints[index].angleRange
        ])
    );
    
    // Generate length limits for all links  
    const lengths = Object.fromEntries(
        UserInputKeys.LINK_LENGTHS.map((lengthKey, index) => [
            lengthKey,
            robotConfig.links[index].lengthRange
        ])
    );
    
    return {
        angles,
        lengths,
        orientations: {
            axisOptions: ['x', 'y', 'z'] as const,
        },
        
        // Configuration constants for easy maintenance
        limits: {
            angle: { min: -180, max: 180 },
            length: { min: 0, max: 20 },
        },
    };
})();