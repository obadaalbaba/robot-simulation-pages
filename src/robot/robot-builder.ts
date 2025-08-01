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
        this.updateJointRotation(this.components.joint4frame, userInputs.theta4, userInputs.joint4_direction);
        this.updateJointRotation(this.components.joint5frame, userInputs.theta5, userInputs.joint5_direction);
        this.updateJointRotation(this.components.joint6frame, userInputs.theta6, userInputs.joint6_direction);
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

        // Link 3
        const link3origin = createLinkOrigin(userInputs.link_3_direction, joint3frame);
        createLink(userInputs.link_3_length, link3origin);
        const link3end = createLinkEndFrame(userInputs.link_3_length, link3origin);

        // Joint 4
        const joint4frame = createJointFrame(userInputs.theta4, userInputs.joint4_direction, link3end);
        createJoint(link3end, userInputs.joint4_direction);

        // Link 4
        const link4origin = createLinkOrigin(userInputs.link_4_direction, joint4frame);
        createLink(userInputs.link_4_length, link4origin);
        const link4end = createLinkEndFrame(userInputs.link_4_length, link4origin);

        // Joint 5
        const joint5frame = createJointFrame(userInputs.theta5, userInputs.joint5_direction, link4end);
        createJoint(link4end, userInputs.joint5_direction);

        // Link 5
        const link5origin = createLinkOrigin(userInputs.link_5_direction, joint5frame);
        createLink(userInputs.link_5_length, link5origin);
        const link5end = createLinkEndFrame(userInputs.link_5_length, link5origin);
        
        // Joint 6
        const joint6frame = createJointFrame(userInputs.theta6, userInputs.joint6_direction, link5end);
        createJoint(link5end, userInputs.joint6_direction);

        // Link 6
        const link6origin = createLinkOrigin(userInputs.link_6_direction, joint6frame);
        createLink(userInputs.link_6_length, link6origin);
        const link6end = createLinkEndFrame(userInputs.link_6_length, link6origin);

        // TCP (Tool Center Point)
        const tcp = createTCPframe(link6end);

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
            joint4frame,
            joint5frame,
            joint6frame,
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