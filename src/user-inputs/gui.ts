import * as dat from 'dat.gui';
import { UserInputs } from './types';
import { guiConfig } from './config';

export class UserInputsGUI {
    private gui: dat.GUI;
    private anglesFolder: dat.GUI;
    private lengthFolder: dat.GUI;
    private orientationsFolder: dat.GUI;

    constructor(private userInputs: UserInputs) {
        this.gui = new dat.GUI();
        
        // Initialize folders directly in constructor
        this.anglesFolder = this.gui.addFolder('Angles');
        this.lengthFolder = this.gui.addFolder('Lengths');
        this.orientationsFolder = this.gui.addFolder('Orientations');
        
        this.setupGUI();
    }

    private setupGUI(): void {
        this.setupAnglesFolder();
        this.setupLengthsFolder();
        this.setupOrientationsFolder();
    }

    private setupAnglesFolder(): void {
        const { angles } = guiConfig;
        if (!angles) {
            console.warn('Angles configuration missing');
            return;
        }
        this.anglesFolder.add(this.userInputs, 'theta1', angles.theta1.min, angles.theta1.max);
        this.anglesFolder.add(this.userInputs, 'theta2', angles.theta2.min, angles.theta2.max);
        this.anglesFolder.add(this.userInputs, 'theta3', angles.theta3.min, angles.theta3.max);
        
        this.anglesFolder.open();
    }
    private setupLengthsFolder(): void {
        // Validate guiConfig.lengths exists
        if (!guiConfig.lengths) {
            console.error('GUI Config Error: guiConfig.lengths is missing. Using fallback defaults.');
            this.setupLengthsFallback();
            return;
        }

        const { lengths } = guiConfig;
        
        // Validate each required length property exists and has min/max values
        const requiredLengthProperties = ['link_0_length', 'link_1_length', 'link_2_length', 'link_3_length'] as const;
        
        for (const property of requiredLengthProperties) {
            if (!lengths[property]) {
                console.error(`GUI Config Error: guiConfig.lengths.${property} is missing. Using fallback defaults.`);
                this.setupLengthsFallback();
                return;
            }
            
            const lengthConfig = lengths[property];
            if (typeof lengthConfig.min !== 'number' || typeof lengthConfig.max !== 'number') {
                console.error(`GUI Config Error: guiConfig.lengths.${property} min/max values are invalid. Using fallback defaults.`);
                this.setupLengthsFallback();
                return;
            }
            
            if (lengthConfig.min > lengthConfig.max) {
                console.error(`GUI Config Error: guiConfig.lengths.${property} min value (${lengthConfig.min}) is greater than max value (${lengthConfig.max}). Using fallback defaults.`);
                this.setupLengthsFallback();
                return;
            }
        }

        try {
            this.lengthFolder.add(this.userInputs, 'link_0_length', lengths.link_0_length.min, lengths.link_0_length.max);
            this.lengthFolder.add(this.userInputs, 'link_1_length', lengths.link_1_length.min, lengths.link_1_length.max);
            this.lengthFolder.add(this.userInputs, 'link_2_length', lengths.link_2_length.min, lengths.link_2_length.max);
            this.lengthFolder.add(this.userInputs, 'link_3_length', lengths.link_3_length.min, lengths.link_3_length.max);
            
            this.lengthFolder.open();
        } catch (error) {
            console.error('GUI Critical Error: Failed to set up lengths folder with valid config:', error);
            this.setupLengthsFallback();
        }
    }

    private setupLengthsFallback(): void {
        // Fallback length limits if config is invalid
        const fallbackLengthLimits = { min: 0, max: 20 };
        
        try {
            this.lengthFolder.add(this.userInputs, 'link_0_length', fallbackLengthLimits.min, fallbackLengthLimits.max);
            this.lengthFolder.add(this.userInputs, 'link_1_length', fallbackLengthLimits.min, fallbackLengthLimits.max);
            this.lengthFolder.add(this.userInputs, 'link_2_length', fallbackLengthLimits.min, fallbackLengthLimits.max);
            this.lengthFolder.add(this.userInputs, 'link_3_length', fallbackLengthLimits.min, fallbackLengthLimits.max);
            
            this.lengthFolder.open();
            console.log('GUI: Successfully set up lengths folder with fallback defaults.');
        } catch (error) {
            console.error('GUI Critical Error: Failed to set up lengths folder even with fallbacks:', error);
        }
    }

    private setupOrientationsFolder(): void {
        // Validate guiConfig.orientations exists
        if (!guiConfig.orientations) {
            console.error('GUI Config Error: guiConfig.orientations is missing. Using fallback defaults.');
            this.setupOrientationsFallback();
            return;
        }

        const { orientations } = guiConfig;
        
        // Validate orientations.axisOptions exists and is a valid array
        if (!orientations.axisOptions || !Array.isArray(orientations.axisOptions) || orientations.axisOptions.length < 1) {
            console.error('GUI Config Error: orientations.axisOptions is missing, not an array, or empty. Using fallback defaults.');
            this.setupOrientationsFallback();
            return;
        }

        try {
            this.orientationsFolder.add(this.userInputs, 'link_0_direction', orientations.axisOptions);
            this.orientationsFolder.add(this.userInputs, 'joint1_direction', orientations.axisOptions);
            this.orientationsFolder.add(this.userInputs, 'link_1_direction', orientations.axisOptions);
            this.orientationsFolder.add(this.userInputs, 'joint2_direction', orientations.axisOptions);
            this.orientationsFolder.add(this.userInputs, 'link_2_direction', orientations.axisOptions);
            this.orientationsFolder.add(this.userInputs, 'joint3_direction', orientations.axisOptions);
            this.orientationsFolder.add(this.userInputs, 'link_3_direction', orientations.axisOptions);
            
            this.orientationsFolder.open();
        } catch (error) {
            console.error('GUI Setup Error: Failed to add orientation controls:', error);
            this.setupOrientationsFallback();
        }
    }

    private setupOrientationsFallback(): void {
        // Fallback axis options if config is invalid
        const fallbackAxisOptions = ['x', 'y', 'z'] as const;
        
        try {
            this.orientationsFolder.add(this.userInputs, 'link_0_direction', fallbackAxisOptions);
            this.orientationsFolder.add(this.userInputs, 'joint1_direction', fallbackAxisOptions);
            this.orientationsFolder.add(this.userInputs, 'link_1_direction', fallbackAxisOptions);
            this.orientationsFolder.add(this.userInputs, 'joint2_direction', fallbackAxisOptions);
            this.orientationsFolder.add(this.userInputs, 'link_2_direction', fallbackAxisOptions);
            this.orientationsFolder.add(this.userInputs, 'joint3_direction', fallbackAxisOptions);
            this.orientationsFolder.add(this.userInputs, 'link_3_direction', fallbackAxisOptions);
            
            this.orientationsFolder.open();
            console.log('GUI: Successfully set up orientations folder with fallback defaults.');
        } catch (error) {
            console.error('GUI Critical Error: Failed to set up orientations folder even with fallbacks:', error);
        }
    }

    public destroy(): void {
        this.gui.destroy();
    }
}