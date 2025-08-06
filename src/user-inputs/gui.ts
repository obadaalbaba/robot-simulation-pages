import * as dat from 'dat.gui';
import { UserInputs, UserInputKeys } from './types';
import { guiConfig } from './config';

export class UserInputsGUI {
    private gui: dat.GUI;
    private anglesFolder: dat.GUI;
    private lengthFolder: dat.GUI;
    private orientationsFolder: dat.GUI;
    private exportFolder: dat.GUI;
    private analyticsFolder: dat.GUI;

    constructor(
        private userInputs: UserInputs, 
        private exportFunction?: () => void, 
        private transformationFunction?: () => void,
        private startAnalyticsFunction?: () => Promise<void>,
        private stopAnalyticsFunction?: () => Promise<void>
    ) {
        this.gui = new dat.GUI();
        
        this.anglesFolder = this.gui.addFolder('Angles');
        this.lengthFolder = this.gui.addFolder('Lengths');
        this.orientationsFolder = this.gui.addFolder('Orientations');
        this.exportFolder = this.gui.addFolder('Export');
        this.analyticsFolder = this.gui.addFolder('Analytics');
        
        this.setupGUI();
    }

    private setupGUI(): void {
        this.setupAnglesFolder();
        this.setupLengthsFolder();
        this.setupOrientationsFolder();
        this.setupExportFolder();
        this.setupAnalyticsFolder();
    }

    private setupAnglesFolder(): void {
        const { angles } = guiConfig;
        if (!angles) {
            console.warn('Angles configuration missing');
            return;
        }
        
        UserInputKeys.JOINT_ANGLES.forEach(angleKey => {
            const limits = angles[angleKey];
            if (limits) {
                this.anglesFolder.add(this.userInputs, angleKey, limits.min, limits.max);
            }
        });
        
        this.anglesFolder.open();
    }

    private setupLengthsFolder(): void {
        const { lengths } = guiConfig;

        UserInputKeys.LINK_LENGTHS.forEach(lengthKey => {
            const limits = lengths[lengthKey];
            if (limits) {
                this.lengthFolder.add(this.userInputs, lengthKey, limits.min, limits.max);
            }
        });
    }

    private setupOrientationsFolder(): void {
        const { orientations } = guiConfig;

        UserInputKeys.LINK_DIRECTIONS.forEach(linkDirectionKey => {
            this.orientationsFolder.add(this.userInputs, linkDirectionKey, orientations.axisOptions);
        });
         
        UserInputKeys.JOINT_DIRECTIONS.forEach(jointDirectionKey => {
            this.orientationsFolder.add(this.userInputs, jointDirectionKey, orientations.axisOptions);
        });
    }

    private setupExportFolder(): void {
        // Create an object for the button actions
        const actions = {
            exportScene: () => {
                if (this.exportFunction) {
                    this.exportFunction();
                } else {
                    console.warn('Export function not available');
                }
            },
            calculateTransformations: () => {
                if (this.transformationFunction) {
                    this.transformationFunction();
                } else {
                    console.warn('Transformation function not available');
                }
            }
        };

        // Add the export button
        if (this.exportFunction) {
            this.exportFolder.add(actions, 'exportScene').name('Export Scene (.gltf + .bin)');
        } else {
            this.exportFolder.add(actions, 'exportScene').name('Export Disabled');
        }

        // Add the transformation calculation button
        if (this.transformationFunction) {
            this.exportFolder.add(actions, 'calculateTransformations').name('Calculate Transformations');
        }
        
        this.exportFolder.open();
    }

    private setupAnalyticsFolder(): void {
        // Create an object for analytics actions
        const analyticsActions = {
            startAnalytics: async () => {
                if (this.startAnalyticsFunction) {
                    try {
                        await this.startAnalyticsFunction();
                        console.log('✅ Analytics started from GUI');
                    } catch (error) {
                        console.error('❌ Failed to start analytics:', error);
                    }
                } else {
                    console.warn('Start analytics function not available');
                }
            },
            stopAnalytics: async () => {
                if (this.stopAnalyticsFunction) {
                    try {
                        await this.stopAnalyticsFunction();
                        console.log('✅ Analytics stopped from GUI');
                    } catch (error) {
                        console.error('❌ Failed to stop analytics:', error);
                    }
                } else {
                    console.warn('Stop analytics function not available');
                }
            }
        };

        // Add analytics control buttons
        if (this.startAnalyticsFunction) {
            this.analyticsFolder.add(analyticsActions, 'startAnalytics').name('Start C3D Analytics');
        }
        
        if (this.stopAnalyticsFunction) {
            this.analyticsFolder.add(analyticsActions, 'stopAnalytics').name('Stop C3D Analytics');
        }
        
        this.analyticsFolder.open();
    }

    public destroy(): void {
        this.gui.destroy();
    }
}