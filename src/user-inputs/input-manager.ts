import { UserInputs, StructuralParams, getDynamicProperty, setDynamicProperty } from './types';
import { defaultUserInputs } from './config';
import { UserInputsGUI } from './gui';
import { RobotDefinitionUtils } from '../robot/robot-definition';

export type StructuralChangeCallback = (params: UserInputs) => void;
export type JointUpdateCallback = (params: UserInputs) => void;

export class UserInputManager {
    private userInputs: UserInputs;
    private previousStructuralParams: StructuralParams;
    private gui: UserInputsGUI;
    private updateInterval: number | null = null;

    private structuralChangeCallbacks: StructuralChangeCallback[] = [];
    private jointUpdateCallbacks: JointUpdateCallback[] = [];

    constructor(initialInputs?: Partial<UserInputs>, exportFunction?: () => void) {
        this.userInputs = { ...defaultUserInputs, ...initialInputs };
        this.previousStructuralParams = this.extractStructuralParams(this.userInputs);
        this.gui = new UserInputsGUI(this.userInputs, exportFunction);
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

        // Dynamically check all link parameters
        for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
            const linkDirectionKey = `link_${i}_direction`;
            const linkLengthKey = `link_${i}_length`;
            
            if (getDynamicProperty(previous, linkDirectionKey) !== getDynamicProperty(current, linkDirectionKey) ||
                getDynamicProperty(previous, linkLengthKey) !== getDynamicProperty(current, linkLengthKey)) {
                return true;
            }
        }
        
        // Dynamically check all joint direction parameters
        for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
            const jointDirectionKey = `joint${i + 1}_direction`;
            
            if (getDynamicProperty(previous, jointDirectionKey) !== getDynamicProperty(current, jointDirectionKey)) {
                return true;
            }
        }
        
        return false;
    }

    private extractStructuralParams(inputs: UserInputs): StructuralParams {
        const params = {} as Record<string, unknown>;
        
        // Extract all link parameters
        for (let i = 0; i < RobotDefinitionUtils.getNumLinks(); i++) {
            const linkDirectionKey = `link_${i}_direction`;
            const linkLengthKey = `link_${i}_length`;
            
            setDynamicProperty(params, linkDirectionKey, getDynamicProperty(inputs, linkDirectionKey));
            setDynamicProperty(params, linkLengthKey, getDynamicProperty(inputs, linkLengthKey));
        }
        
        // Extract all joint direction parameters (angles are not structural)
        for (let i = 0; i < RobotDefinitionUtils.getNumJoints(); i++) {
            const jointDirectionKey = `joint${i + 1}_direction`;
            setDynamicProperty(params, jointDirectionKey, getDynamicProperty(inputs, jointDirectionKey));
        }
        
        return params as StructuralParams;
    }

    public destroy(): void {
        this.stopMonitoring();
        this.gui.destroy();
    }
}