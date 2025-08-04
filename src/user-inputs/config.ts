import { UserInputs, setDynamicProperty } from './types';
import { RobotDefinitionUtils } from '../robot/robot-definition';

/**
 * Configuration generated from the unified robot definition
 * This ensures all default values and limits come from a single source
 */

// Generate default user inputs from robot definition
export const defaultUserInputs: UserInputs = (() => {
    const inputs = {} as Record<string, unknown>;
    
    // Add all link parameters
    for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
        const link = RobotDefinitionUtils.getLinkDefinition(i);
        setDynamicProperty(inputs, `link_${i}_direction`, link.direction);
        setDynamicProperty(inputs, `link_${i}_length`, link.defaultLength);
    }
    
    // Add all joint parameters
    for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
        const joint = RobotDefinitionUtils.getJointDefinition(i);
        setDynamicProperty(inputs, `joint${i + 1}_direction`, joint.direction);
        setDynamicProperty(inputs, `theta${i + 1}`, joint.defaultAngle);
    }
    
    return inputs as UserInputs;
})();

// Generate GUI configuration from robot definition
export const guiConfig = (() => {
    const angles: Record<string, { min: number; max: number }> = {};
    const lengths: Record<string, { min: number; max: number }> = {};
    
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