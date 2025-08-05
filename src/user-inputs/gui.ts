import * as dat from 'dat.gui';
import { UserInputs, UserInputKeys } from './types';
import { guiConfig } from './config';

export class UserInputsGUI {
    private gui: dat.GUI;
    private anglesFolder: dat.GUI;
    private lengthFolder: dat.GUI;
    private orientationsFolder: dat.GUI;
    private exportFolder: dat.GUI;

    constructor(private userInputs: UserInputs, private exportFunction?: () => void) {
        this.gui = new dat.GUI();
        
        // Initialize folders directly in constructor
        this.anglesFolder = this.gui.addFolder('Angles');
        this.lengthFolder = this.gui.addFolder('Lengths');
        this.orientationsFolder = this.gui.addFolder('Orientations');
        this.exportFolder = this.gui.addFolder('Export');
        
        this.setupGUI();
    }

    private setupGUI(): void {
        this.setupAnglesFolder();
        this.setupLengthsFolder();
        this.setupOrientationsFolder();
        this.setupExportFolder();
    }

    private setupAnglesFolder(): void {
        const { angles } = guiConfig;
        if (!angles) {
            console.warn('Angles configuration missing');
            return;
        }
        
        // Type-safe joint angle controls - no more string generation!
        UserInputKeys.JOINT_ANGLES.forEach(angleKey => {
            const limits = angles[angleKey];
            if (limits) {
                this.anglesFolder.add(this.userInputs, angleKey, limits.min, limits.max);
            }
        });
        
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
        
        // Validate all required length properties exist
        for (const property of UserInputKeys.LINK_LENGTHS) {
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
            // Type-safe link length controls - no more string generation!
            UserInputKeys.LINK_LENGTHS.forEach(lengthKey => {
                const limits = lengths[lengthKey];
                if (limits) {
                    this.lengthFolder.add(this.userInputs, lengthKey, limits.min, limits.max);
                }
            });
            
        } catch (error) {
            console.error('GUI Critical Error: Failed to set up lengths folder with valid config:', error);
            this.setupLengthsFallback();
        }
    }

    private setupLengthsFallback(): void {
        // Fallback length limits if config is invalid
        const fallbackLengthLimits = { min: 0, max: 20 };
        
        try {
            // Type-safe link length controls with fallback limits
            UserInputKeys.LINK_LENGTHS.forEach(lengthKey => {
                this.lengthFolder.add(this.userInputs, lengthKey, fallbackLengthLimits.min, fallbackLengthLimits.max);
            });
            
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
            // Type-safe link direction controls
            UserInputKeys.LINK_DIRECTIONS.forEach(linkDirectionKey => {
                this.orientationsFolder.add(this.userInputs, linkDirectionKey, orientations.axisOptions);
            });
            
            // Type-safe joint direction controls
            UserInputKeys.JOINT_DIRECTIONS.forEach(jointDirectionKey => {
                this.orientationsFolder.add(this.userInputs, jointDirectionKey, orientations.axisOptions);
            });
            
        } catch (error) {
            console.error('GUI Setup Error: Failed to add orientation controls:', error);
            this.setupOrientationsFallback();
        }
    }

    private setupOrientationsFallback(): void {
        // Fallback axis options if config is invalid
        const fallbackAxisOptions = ['x', 'y', 'z'] as const;
        
        try {
            // Type-safe link direction controls with fallback
            UserInputKeys.LINK_DIRECTIONS.forEach(linkDirectionKey => {
                this.orientationsFolder.add(this.userInputs, linkDirectionKey, fallbackAxisOptions);
            });
            
            // Type-safe joint direction controls with fallback
            UserInputKeys.JOINT_DIRECTIONS.forEach(jointDirectionKey => {
                this.orientationsFolder.add(this.userInputs, jointDirectionKey, fallbackAxisOptions);
            });
            
            console.log('GUI: Successfully set up orientations folder with fallback defaults.');
        } catch (error) {
            console.error('GUI Critical Error: Failed to set up orientations folder even with fallbacks:', error);
        }
    }

    private setupExportFolder(): void {
        if (this.exportFunction) {
            // Create an object for the button action
            const exportActions = {
                exportScene: () => {
                    console.log('🎬 Exporting scene for Cognitive3D...');
                    this.exportFunction!();
                }
            };

            // Add the export button
            this.exportFolder.add(exportActions, 'exportScene').name('Export Scene (.gltf + .bin)');            
            this.exportFolder.open();
        } else {
            // If no export function provided, show a disabled state
            const noExportActions = {
                disabled: () => {
                    console.warn('Export function not available');
                }
            };
            this.exportFolder.add(noExportActions, 'disabled').name('Export Disabled');
        }
    }

    public destroy(): void {
        this.gui.destroy();
    }
}