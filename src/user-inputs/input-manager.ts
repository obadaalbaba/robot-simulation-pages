import { UserInputs, StructuralParams } from './types';
import { defaultUserInputs } from './config';
import { UserInputsGUI } from './gui';

export type StructuralChangeCallback = (params: UserInputs) => void;
export type JointUpdateCallback = (params: UserInputs) => void;

export class UserInputManager {
    private userInputs: UserInputs;
    private previousStructuralParams: StructuralParams;
    private gui: UserInputsGUI;
    private updateInterval: number | null = null;

    private structuralChangeCallbacks: StructuralChangeCallback[] = [];
    private jointUpdateCallbacks: JointUpdateCallback[] = [];

    constructor(initialInputs?: Partial<UserInputs>) {
        this.userInputs = { ...defaultUserInputs, ...initialInputs };
        this.previousStructuralParams = this.extractStructuralParams(this.userInputs);
        this.gui = new UserInputsGUI(this.userInputs);
    }

    public getUserInputs(): UserInputs {
        return this.userInputs;
    }

    public onStructuralChange(callback: StructuralChangeCallback): void {
        this.structuralChangeCallbacks.push(callback);
    }

    public onJointUpdate(callback: JointUpdateCallback): void {
        this.jointUpdateCallbacks.push(callback);
    }

    public startMonitoring(intervalMs: number = 120): void {
        if (this.updateInterval !== null) {
            this.stopMonitoring();
        }

        this.updateInterval = window.setInterval(() => {
            this.checkForUpdates();
        }, intervalMs);
    }

    public stopMonitoring(): void {
        if (this.updateInterval !== null) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    private checkForUpdates(): void {
        // Always notify joint update callbacks
        this.jointUpdateCallbacks.forEach(callback => callback(this.userInputs));

        // Check for structural changes
        if (this.hasStructuralChanges()) {
            this.previousStructuralParams = this.extractStructuralParams(this.userInputs);
            this.structuralChangeCallbacks.forEach(callback => callback(this.userInputs));
        }
    }

    private hasStructuralChanges(): boolean {
        const current = this.extractStructuralParams(this.userInputs);
        const previous = this.previousStructuralParams;

        return (
            previous.link_0_direction !== current.link_0_direction ||
            previous.link_0_length !== current.link_0_length ||
            previous.joint1_direction !== current.joint1_direction ||
            previous.link_1_direction !== current.link_1_direction ||
            previous.link_1_length !== current.link_1_length ||
            previous.joint2_direction !== current.joint2_direction ||
            previous.link_2_direction !== current.link_2_direction ||
            previous.link_2_length !== current.link_2_length ||
            previous.joint3_direction !== current.joint3_direction ||
            previous.link_3_direction !== current.link_3_direction ||
            previous.link_3_length !== current.link_3_length ||
            previous.joint4_direction !== current.joint4_direction ||
            previous.link_4_direction !== current.link_4_direction ||
            previous.link_4_length !== current.link_4_length ||
            previous.joint5_direction !== current.joint5_direction ||
            previous.link_5_direction !== current.link_5_direction ||
            previous.link_5_length !== current.link_5_length ||
            previous.joint6_direction !== current.joint6_direction ||
            previous.link_6_direction !== current.link_6_direction ||
            previous.link_6_length !== current.link_6_length
        );
    }

    private extractStructuralParams(inputs: UserInputs): StructuralParams {
        return {
            link_0_direction: inputs.link_0_direction,
            link_0_length: inputs.link_0_length,
            joint1_direction: inputs.joint1_direction,
            link_1_direction: inputs.link_1_direction,
            link_1_length: inputs.link_1_length,
            joint2_direction: inputs.joint2_direction,
            link_2_direction: inputs.link_2_direction,
            link_2_length: inputs.link_2_length,
            joint3_direction: inputs.joint3_direction,
            link_3_direction: inputs.link_3_direction,
            link_3_length: inputs.link_3_length,
            joint4_direction: inputs.joint4_direction,
            link_4_direction: inputs.link_4_direction,
            link_4_length: inputs.link_4_length,
            joint5_direction: inputs.joint5_direction,
            link_5_direction: inputs.link_5_direction,
            link_5_length: inputs.link_5_length,
            joint6_direction: inputs.joint6_direction,
            link_6_direction: inputs.link_6_direction,
            link_6_length: inputs.link_6_length,
        };
    }

    public destroy(): void {
        this.stopMonitoring();
        this.gui.destroy();
    }
}