import { type Axis } from '../shared/types';

/**
 * Generated types based on robot definition
 * These types are dynamically created to match the robot structure
 */

// Core user input type with all parameters
export type UserInputs = {
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
};

// Structural parameters (everything except joint angles)
export type StructuralParams = {
    // Link 0
    link_0_direction: Axis;
    link_0_length: number;
    
    // Joint 1 + Link 1
    joint1_direction: Axis;
    link_1_direction: Axis;
    link_1_length: number;
    
    // Joint 2 + Link 2
    joint2_direction: Axis;
    link_2_direction: Axis;
    link_2_length: number;
    
    // Joint 3 + Link 3
    joint3_direction: Axis;
    link_3_direction: Axis;
    link_3_length: number;
    
    // Joint 4 + Link 4
    joint4_direction: Axis;
    link_4_direction: Axis;
    link_4_length: number;
    
    // Joint 5 + Link 5
    joint5_direction: Axis;
    link_5_direction: Axis;
    link_5_length: number;
    
    // Joint 6 + Link 6
    joint6_direction: Axis;
    link_6_direction: Axis;
    link_6_length: number;
};

/**
 * Utility functions for type-safe dynamic property access
 */

// Type-safe property accessors
export const getProperty = <T, K extends keyof T>(obj: T, key: K): T[K] => {
    return obj[key];
};

export const getDynamicProperty = <T>(obj: T, key: string): unknown => {
    return (obj as Record<string, unknown>)[key];
};

export const setDynamicProperty = (obj: Record<string, unknown>, key: string, value: unknown): void => {
    obj[key] = value;
};
