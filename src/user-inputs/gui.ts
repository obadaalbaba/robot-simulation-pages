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