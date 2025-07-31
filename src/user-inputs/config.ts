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
    },
    lengths: {
        link_0_length: LENGTH_LIMITS,
        link_1_length: LENGTH_LIMITS,
        link_2_length: LENGTH_LIMITS,
        link_3_length: LENGTH_LIMITS,
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