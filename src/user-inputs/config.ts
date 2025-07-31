import { UserInputs } from './types';

// Default robot parameters
export const defaultUserInputs: UserInputs = {
    link_0_direction: 'z',
    link_0_length: 10,
    joint1_direction: 'y',
    theta1: 290,
    link_1_direction: 'x',
    link_1_length: 10,
    joint2_direction: 'z',
    theta2: 80,
    link_2_direction: 'y',
    link_2_length: 10,
    joint3_direction: 'x',
    theta3: 45,
    link_3_direction: 'y',
    link_3_length: 10,
};

// GUI configuration
export const guiConfig = {
    angles: {
        theta1: { min: 0, max: 360 },
        theta2: { min: -180, max: 180 },
        theta3: { min: -180, max: 180 },
    },
    lengths: {
        link_0_length: { min: 0, max: 20 },
        link_1_length: { min: 0, max: 20 },
        link_2_length: { min: 0, max: 20 },
        link_3_length: { min: 0, max: 20 },
    },
    orientations: {
        axisOptions: ['x', 'y', 'z'] as const,
    },
};