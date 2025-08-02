import * as dat from 'dat.gui';
import { UserInputs } from './types';
import { guiConfig } from './config';
import { RobotDefinitionUtils } from '../robot/robot-definition';

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
        
        // Dynamically add all joint angle controls based on robot definition
        for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
            const angleKey = RobotDefinitionUtils.getJointAngleKey(i) as keyof UserInputs;
            const limits = angles[angleKey];
            if (limits) {
                this.anglesFolder.add(this.userInputs, angleKey, limits.min, limits.max);
            }
        }
        
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
        
        // Generate required length properties from robot definition
        const requiredLengthProperties = [];
        for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
            requiredLengthProperties.push(RobotDefinitionUtils.getLinkLengthKey(i));
        }
        
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
            // Dynamically add all link length controls based on robot definition
            for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
                const lengthKey = RobotDefinitionUtils.getLinkLengthKey(i) as keyof UserInputs;
                const limits = lengths[lengthKey];
                if (limits) {
                    this.lengthFolder.add(this.userInputs, lengthKey, limits.min, limits.max);
                }
            }
            
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
            // Dynamically add all link length controls with fallback limits
            for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
                const lengthKey = RobotDefinitionUtils.getLinkLengthKey(i) as keyof UserInputs;
                this.lengthFolder.add(this.userInputs, lengthKey, fallbackLengthLimits.min, fallbackLengthLimits.max);
            }
            
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
            // Dynamically add all link direction controls
            for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
                const linkDirectionKey = RobotDefinitionUtils.getLinkDirectionKey(i) as keyof UserInputs;
                this.orientationsFolder.add(this.userInputs, linkDirectionKey, orientations.axisOptions);
            }
            
            // Dynamically add all joint direction controls
            for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
                const jointDirectionKey = RobotDefinitionUtils.getJointDirectionKey(i) as keyof UserInputs;
                this.orientationsFolder.add(this.userInputs, jointDirectionKey, orientations.axisOptions);
            }
            
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
            // Dynamically add all link direction controls with fallback
            for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
                const linkDirectionKey = RobotDefinitionUtils.getLinkDirectionKey(i) as keyof UserInputs;
                this.orientationsFolder.add(this.userInputs, linkDirectionKey, fallbackAxisOptions);
            }
            
            // Dynamically add all joint direction controls with fallback
            for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
                const jointDirectionKey = RobotDefinitionUtils.getJointDirectionKey(i) as keyof UserInputs;
                this.orientationsFolder.add(this.userInputs, jointDirectionKey, fallbackAxisOptions);
            }
            
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