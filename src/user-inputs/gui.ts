import * as dat from 'dat.gui';
import { UserInputs } from './types';
import { guiConfig } from './config';

export class UserInputsGUI {
    private gui: dat.GUI;
    private anglesFolder!: dat.GUI;
    private lengthFolder!: dat.GUI;
    private orientationsFolder!: dat.GUI;

    constructor(private userInputs: UserInputs) {
        this.gui = new dat.GUI();
        this.setupGUI();
    }

    private setupGUI(): void {
        this.setupAnglesFolder();
        this.setupLengthsFolder();
        this.setupOrientationsFolder();
    }

    private setupAnglesFolder(): void {
        this.anglesFolder = this.gui.addFolder('Angles');
        
        const { angles } = guiConfig;
        this.anglesFolder.add(this.userInputs, 'theta1', angles.theta1.min, angles.theta1.max);
        this.anglesFolder.add(this.userInputs, 'theta2', angles.theta2.min, angles.theta2.max);
        this.anglesFolder.add(this.userInputs, 'theta3', angles.theta3.min, angles.theta3.max);
        
        this.anglesFolder.open();
    }

    private setupLengthsFolder(): void {
        this.lengthFolder = this.gui.addFolder('Lengths');
        
        const { lengths } = guiConfig;
        this.lengthFolder.add(this.userInputs, 'link_0_length', lengths.link_0_length.min, lengths.link_0_length.max);
        this.lengthFolder.add(this.userInputs, 'link_1_length', lengths.link_1_length.min, lengths.link_1_length.max);
        this.lengthFolder.add(this.userInputs, 'link_2_length', lengths.link_2_length.min, lengths.link_2_length.max);
        this.lengthFolder.add(this.userInputs, 'link_3_length', lengths.link_3_length.min, lengths.link_3_length.max);
        
        this.lengthFolder.open();
    }

    private setupOrientationsFolder(): void {
        this.orientationsFolder = this.gui.addFolder('Orientations');
        
        const { orientations } = guiConfig;
        this.orientationsFolder.add(this.userInputs, 'link_0_direction', orientations.axisOptions);
        this.orientationsFolder.add(this.userInputs, 'joint1_direction', orientations.axisOptions);
        this.orientationsFolder.add(this.userInputs, 'link_1_direction', orientations.axisOptions);
        this.orientationsFolder.add(this.userInputs, 'joint2_direction', orientations.axisOptions);
        this.orientationsFolder.add(this.userInputs, 'link_2_direction', orientations.axisOptions);
        this.orientationsFolder.add(this.userInputs, 'joint3_direction', orientations.axisOptions);
        this.orientationsFolder.add(this.userInputs, 'link_3_direction', orientations.axisOptions);
        
        this.orientationsFolder.open();
    }

    public destroy(): void {
        this.gui.destroy();
    }
}