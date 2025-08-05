import { UserInputs, StructuralParams, UserInputKeys } from './types';
import { defaultUserInputs } from './config';
import { UserInputsGUI } from './gui';

export type StructuralChangeCallback = (params: UserInputs) => void;
export type JointUpdateCallback = (params: UserInputs) => void;

export class UserInputManager {
    private userInputs: UserInputs;
    private previousStructuralParams: StructuralParams;
    private previousJointAngles: Record<string, number>;
    private gui: UserInputsGUI;
    private updateInterval: number | null = null;

    private structuralChangeCallbacks: StructuralChangeCallback[] = [];
    private jointUpdateCallbacks: JointUpdateCallback[] = [];

    constructor(initialInputs?: Partial<UserInputs>, exportFunction?: () => void, transformationFunction?: () => void) {
        this.userInputs = { ...defaultUserInputs, ...initialInputs };
        this.previousStructuralParams = this.extractStructuralParams(this.userInputs);
        this.previousJointAngles = this.extractJointAngles(this.userInputs);
        this.gui = new UserInputsGUI(this.userInputs, exportFunction, transformationFunction);
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

    public startMonitoring(intervalMs: number): void {
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
        if (this.hasJointUpdates()) {
            this.previousJointAngles = this.extractJointAngles(this.userInputs);
            this.jointUpdateCallbacks.forEach(callback => callback(this.userInputs));
        }

        if (this.hasStructuralChanges()) {
            this.previousStructuralParams = this.extractStructuralParams(this.userInputs);
            this.structuralChangeCallbacks.forEach(callback => callback(this.userInputs));
        }
    }

    private hasJointUpdates(): boolean {
        const current = this.extractJointAngles(this.userInputs);
        const previous = this.previousJointAngles;

        // Type-safe check of all joint angle parameters  
        for (const jointAngleKey of UserInputKeys.JOINT_ANGLES) {
            if (previous[jointAngleKey] !== current[jointAngleKey]) {
                return true;
            }
        }

        return false;
    }

    private hasStructuralChanges(): boolean {
        const current = this.extractStructuralParams(this.userInputs);
        const previous = this.previousStructuralParams;

        // Type-safe check of all link parameters
        for (const linkDirectionKey of UserInputKeys.LINK_DIRECTIONS) {
            if (previous[linkDirectionKey] !== current[linkDirectionKey]) {
                return true;
            }
        }
        
        for (const linkLengthKey of UserInputKeys.LINK_LENGTHS) {
            if (previous[linkLengthKey] !== current[linkLengthKey]) {
                return true;
            }
        }
        
        // Type-safe check of all joint direction parameters  
        for (const jointDirectionKey of UserInputKeys.JOINT_DIRECTIONS) {
            if (previous[jointDirectionKey] !== current[jointDirectionKey]) {
                return true;
            }
        }
        
        return false;
    }

    private extractStructuralParams(inputs: UserInputs): StructuralParams {
        // Type-safe extraction of structural parameters - no casting needed!
        return {
            // Link directions
            link_0_direction: inputs.link_0_direction,
            link_1_direction: inputs.link_1_direction,
            link_2_direction: inputs.link_2_direction,
            link_3_direction: inputs.link_3_direction,
            link_4_direction: inputs.link_4_direction,
            link_5_direction: inputs.link_5_direction,
            link_6_direction: inputs.link_6_direction,
            
            // Link lengths
            link_0_length: inputs.link_0_length,
            link_1_length: inputs.link_1_length,
            link_2_length: inputs.link_2_length,
            link_3_length: inputs.link_3_length,
            link_4_length: inputs.link_4_length,
            link_5_length: inputs.link_5_length,
            link_6_length: inputs.link_6_length,
            
            // Joint directions (angles are not structural)
            joint1_direction: inputs.joint1_direction,
            joint2_direction: inputs.joint2_direction,
            joint3_direction: inputs.joint3_direction,
            joint4_direction: inputs.joint4_direction,
            joint5_direction: inputs.joint5_direction,
            joint6_direction: inputs.joint6_direction,
        };
    }

    private extractJointAngles(inputs: UserInputs): Record<string, number> {
        // Type-safe extraction of joint angle parameters
        const angles: Record<string, number> = {};
        for (const jointAngleKey of UserInputKeys.JOINT_ANGLES) {
            angles[jointAngleKey] = inputs[jointAngleKey];
        }
        return angles;
    }

    public destroy(): void {
        this.stopMonitoring();
        this.gui.destroy();
    }
}