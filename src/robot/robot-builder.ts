import * as THREE from 'three';
import {
    createLinkOrigin,
    createLink,
    createLinkEndFrame,
    createJoint,
    createJointFrame,
    createTCPframe,
} from './functions';
import { type Axis } from '../shared/types';
import { type UserInputs } from '../user-inputs';
import { RobotComponents } from './types';

export class RobotBuilder {
    private components: RobotComponents | null = null;
    private worldReferenceFrame: THREE.Object3D;

    constructor(worldReferenceFrame: THREE.Object3D) {
        this.worldReferenceFrame = worldReferenceFrame;
    }

    public buildRobot(userInputs: UserInputs): RobotComponents {
        // Remove existing robot if any
        if (this.components) {
            this.destroyRobot();
        }

        // Build the robot structure
        const components = this.constructRobotStructure(userInputs);
        this.components = components;

        console.log('Robot built - TCP Matrix:', components.tcp.matrix);
        return components;
    }

    public rebuildRobot(userInputs: UserInputs): RobotComponents {
        return this.buildRobot(userInputs);
    }

    public updateJointAngles(userInputs: UserInputs): void {
        if (!this.components) {
            throw new Error('Robot must be built before updating joint angles');
        }

        this.updateJointRotation(this.components.joint1frame, userInputs.theta1, userInputs.joint1_direction);
        this.updateJointRotation(this.components.joint2frame, userInputs.theta2, userInputs.joint2_direction);
        this.updateJointRotation(this.components.joint3frame, userInputs.theta3, userInputs.joint3_direction);
    }

    public getComponents(): RobotComponents | null {
        return this.components;
    }

    public getTCP(): THREE.AxesHelper | null {
        return this.components?.tcp || null;
    }

    public destroyRobot(): void {
        if (this.components) {
            // Remove the robot hierarchy from the world reference frame
            this.worldReferenceFrame.remove(this.components.link0origin);
            this.components = null;
        }
    }

    private constructRobotStructure(userInputs: UserInputs): RobotComponents {
        // Link 0 (base link) - attached to world reference frame
        const link0origin = createLinkOrigin(userInputs.link_0_direction, this.worldReferenceFrame);
        createLink(userInputs.link_0_length, link0origin);
        const link0end = createLinkEndFrame(userInputs.link_0_length, link0origin);
        
        // Joint 1
        const joint1frame = createJointFrame(userInputs.theta1, userInputs.joint1_direction, link0end);
        createJoint(link0end, userInputs.joint1_direction);

        // Link 1
        const link1origin = createLinkOrigin(userInputs.link_1_direction, joint1frame);
        createLink(userInputs.link_1_length, link1origin);
        const link1end = createLinkEndFrame(userInputs.link_1_length, link1origin);
        
        // Joint 2
        const joint2frame = createJointFrame(userInputs.theta2, userInputs.joint2_direction, link1end);
        createJoint(link1end, userInputs.joint2_direction);

        // Link 2
        const link2origin = createLinkOrigin(userInputs.link_2_direction, joint2frame);
        createLink(userInputs.link_2_length, link2origin);
        const link2end = createLinkEndFrame(userInputs.link_2_length, link2origin);
        
        // Joint 3
        const joint3frame = createJointFrame(userInputs.theta3, userInputs.joint3_direction, link2end);
        createJoint(link2end, userInputs.joint3_direction);

        // Link 3 (end effector link)
        const link3origin = createLinkOrigin(userInputs.link_3_direction, joint3frame);
        createLink(userInputs.link_3_length, link3origin);
        const link3end = createLinkEndFrame(userInputs.link_3_length, link3origin);
        
        // TCP (Tool Center Point)
        const tcp = createTCPframe(link3end);

        return {
            link0origin,
            link1origin,
            link2origin,
            link3origin,
            link0end,
            link1end,
            link2end,
            link3end,
            joint1frame,
            joint2frame,
            joint3frame,
            tcp,
        };
    }

    private updateJointRotation(jointFrame: THREE.AxesHelper, angle: number, direction: Axis): void {
        // Reset rotation
        jointFrame.rotation.set(0, 0, 0);
        
        // Apply rotation around the specified axis
        const rotationAngle = (angle * Math.PI) / 180;
        if (direction === 'x') {
            jointFrame.rotateX(rotationAngle);
        } else if (direction === 'y') {
            jointFrame.rotateY(rotationAngle);
        } else { // direction === 'z'
            jointFrame.rotateZ(rotationAngle);
        }
    }
}