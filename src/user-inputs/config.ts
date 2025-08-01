import { UserInputs } from './types';

// Default robot parameters
export const defaultUserInputs: UserInputs = {
    link_0_direction: 'y',
    link_0_length: 5,
    joint1_direction: 'y',
    theta1: 150,
    link_1_direction: 'z',
    link_1_length: 5,
    joint2_direction: 'y',
    theta2: 45,
    link_2_direction: 'x',
    link_2_length: 15,
    joint3_direction: 'x',
    theta3: -45,
    link_3_direction: 'z',
    link_3_length: 15,
    joint4_direction: 'y',
    theta4: 0,
    link_4_direction: 'x',
    link_4_length: 8,
    joint5_direction: 'y',
    theta5: 0,
    link_5_direction: 'z',
    link_5_length: 8,
    joint6_direction: 'y',
    theta6: 0,
    link_6_direction: 'y',
    link_6_length: 5,
};

// Shared configuration values
const ANGLE_LIMITS = { min: -180, max: 180 };
const LENGTH_LIMITS = { min: 0, max: 20 };

// GUI configuration
export const guiConfig = {
    angles: {
        theta1: ANGLE_LIMITS,
        theta2: ANGLE_LIMITS,
        theta3: ANGLE_LIMITS,
        theta4: ANGLE_LIMITS,
        theta5: ANGLE_LIMITS,
        theta6: ANGLE_LIMITS,
    },
    lengths: {
        link_0_length: LENGTH_LIMITS,
        link_1_length: LENGTH_LIMITS,
        link_2_length: LENGTH_LIMITS,
        link_3_length: LENGTH_LIMITS,
        link_4_length: LENGTH_LIMITS,
        link_5_length: LENGTH_LIMITS,
        link_6_length: LENGTH_LIMITS,
    },
    orientations: {
        axisOptions: ['x', 'y', 'z'] as const,
    },
    
    // Configuration constants for easy maintenance
    limits: {
        angle: ANGLE_LIMITS,
        length: LENGTH_LIMITS,
    },
};