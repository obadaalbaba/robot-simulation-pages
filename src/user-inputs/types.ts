import { type Axis } from '../shared/types';

/**
 * User input types for robot simulation
 * 
 * To modify the robot structure, update ROBOT_CONFIG in robot-definition.ts
 * and then update these types accordingly. In the future, these could be
 * code-generated from the robot definition.
 */

export interface UserInputs {
    // Link 0
    link_0_direction: Axis;
    link_0_length: number;
    
    // Joint 1 + Link 1
    joint1_direction: Axis;
    theta1: number;
    link_1_direction: Axis;
    link_1_length: number;
    
    // Joint 2 + Link 2
    joint2_direction: Axis;
    theta2: number;
    link_2_direction: Axis;
    link_2_length: number;
    
    // Joint 3 + Link 3
    joint3_direction: Axis;
    theta3: number;
    link_3_direction: Axis;
    link_3_length: number;
    
    // Joint 4 + Link 4
    joint4_direction: Axis;
    theta4: number;
    link_4_direction: Axis;
    link_4_length: number;
    
    // Joint 5 + Link 5
    joint5_direction: Axis;
    theta5: number;
    link_5_direction: Axis;
    link_5_length: number;
    
    // Joint 6 + Link 6
    joint6_direction: Axis;
    theta6: number;
    link_6_direction: Axis;
    link_6_length: number;
}

// Structural parameters (everything except joint angles)
export interface StructuralParams {
    // Link parameters
    link_0_direction: Axis;
    link_0_length: number;
    link_1_direction: Axis;
    link_1_length: number;
    link_2_direction: Axis;
    link_2_length: number;
    link_3_direction: Axis;
    link_3_length: number;
    link_4_direction: Axis;
    link_4_length: number;
    link_5_direction: Axis;
    link_5_length: number;
    link_6_direction: Axis;
    link_6_length: number;
    
    // Joint directions (angles are not structural)
    joint1_direction: Axis;
    joint2_direction: Axis;
    joint3_direction: Axis;
    joint4_direction: Axis;
    joint5_direction: Axis;
    joint6_direction: Axis;
}

// Type-safe key definitions - no more string generation!
export const UserInputKeys = {
    // Link direction keys
    LINK_DIRECTIONS: [
        'link_0_direction',
        'link_1_direction', 
        'link_2_direction',
        'link_3_direction',
        'link_4_direction',
        'link_5_direction',
        'link_6_direction'
    ] as const satisfies readonly (keyof UserInputs)[],
    
    // Link length keys
    LINK_LENGTHS: [
        'link_0_length',
        'link_1_length',
        'link_2_length', 
        'link_3_length',
        'link_4_length',
        'link_5_length',
        'link_6_length'
    ] as const satisfies readonly (keyof UserInputs)[],
    
    // Joint direction keys
    JOINT_DIRECTIONS: [
        'joint1_direction',
        'joint2_direction',
        'joint3_direction',
        'joint4_direction', 
        'joint5_direction',
        'joint6_direction'
    ] as const satisfies readonly (keyof UserInputs)[],
    
    // Joint angle keys
    JOINT_ANGLES: [
        'theta1',
        'theta2',
        'theta3',
        'theta4',
        'theta5',
        'theta6'
    ] as const satisfies readonly (keyof UserInputs)[],
} as const;

// Type-safe accessors
export type LinkDirectionKey = typeof UserInputKeys.LINK_DIRECTIONS[number];
export type LinkLengthKey = typeof UserInputKeys.LINK_LENGTHS[number];
export type JointDirectionKey = typeof UserInputKeys.JOINT_DIRECTIONS[number];
export type JointAngleKey = typeof UserInputKeys.JOINT_ANGLES[number];