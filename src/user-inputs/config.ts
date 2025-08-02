import { UserInputs } from './types';
import { RobotDefinitionUtils } from '../robot/robot-definition';

/**
 * Configuration generated from the unified robot definition
 * This ensures all default values and limits come from a single source
 */

// Generate default user inputs from robot definition
export const defaultUserInputs: UserInputs = (() => {
    const inputs: any = {};
    
    // Add all link parameters
    for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
        const link = RobotDefinitionUtils.getLinkDefinition(i);
        inputs[RobotDefinitionUtils.getLinkDirectionKey(i)] = link.direction;
        inputs[RobotDefinitionUtils.getLinkLengthKey(i)] = link.defaultLength;
    }
    
    // Add all joint parameters
    for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
        const joint = RobotDefinitionUtils.getJointDefinition(i);
        inputs[RobotDefinitionUtils.getJointDirectionKey(i)] = joint.direction;
        inputs[RobotDefinitionUtils.getJointAngleKey(i)] = joint.defaultAngle;
    }
    
    return inputs as UserInputs;
})();

// Generate GUI configuration from robot definition
export const guiConfig = (() => {
    const angles: any = {};
    const lengths: any = {};
    
    // Generate angle limits for all joints
    for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
        const joint = RobotDefinitionUtils.getJointDefinition(i);
        const angleKey = RobotDefinitionUtils.getJointAngleKey(i);
        angles[angleKey] = joint.angleRange;
    }
    
    // Generate length limits for all links
    for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
        const link = RobotDefinitionUtils.getLinkDefinition(i);
        const lengthKey = RobotDefinitionUtils.getLinkLengthKey(i);
        lengths[lengthKey] = link.lengthRange;
    }
    
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