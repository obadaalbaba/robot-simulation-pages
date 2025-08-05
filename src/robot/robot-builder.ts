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
import { RobotComponents, LinkIndex, JointNumber } from './types';
import { RobotDefinition } from './robot-definition';

export class RobotBuilder {
    private components: RobotComponents | null = null;
    private worldReferenceFrame: THREE.Object3D;

    constructor(worldReferenceFrame: THREE.Object3D) {
        this.worldReferenceFrame = worldReferenceFrame;
    }

    public buildRobot(userInputs: UserInputs): void {
        if (this.components) {
            this.destroyRobot();
        }

        this.components = this.constructRobotStructure(userInputs);
    }

    public rebuildRobot(userInputs: UserInputs): void {
        this.buildRobot(userInputs);
    }

    public updateJointAngles(userInputs: UserInputs): void {
        if (!this.components) {
            throw new Error('Robot must be built before updating joint angles');
        }

        const jointUpdates = [
            { frame: this.components.jointFrames[0], angle: userInputs.theta1, direction: userInputs.joint1_direction },
            { frame: this.components.jointFrames[1], angle: userInputs.theta2, direction: userInputs.joint2_direction },
            { frame: this.components.jointFrames[2], angle: userInputs.theta3, direction: userInputs.joint3_direction },
            { frame: this.components.jointFrames[3], angle: userInputs.theta4, direction: userInputs.joint4_direction },
            { frame: this.components.jointFrames[4], angle: userInputs.theta5, direction: userInputs.joint5_direction },
            { frame: this.components.jointFrames[5], angle: userInputs.theta6, direction: userInputs.joint6_direction },
        ];        
        const numJoints = Math.min(RobotDefinition.getNumJoints(), jointUpdates.length);

        for (let i = 0; i < numJoints; i++) {
            const { frame, angle, direction } = jointUpdates[i];
            this.updateJointRotation(frame, angle, direction);
        }
    }

    public getLinkEndFrame(linkIndex: LinkIndex): THREE.AxesHelper | null {
        return this.components?.linkEnds[linkIndex] || null;
    }

    public getLinkOriginFrame(linkIndex: LinkIndex): THREE.AxesHelper | null {
        return this.components?.linkOrigins[linkIndex] || null;
    }

    public getJointFrame(jointNumber: JointNumber): THREE.AxesHelper | null {
        // Convert joint number (1-6) to array index (0-5)
        const arrayIndex = jointNumber - 1;
        return this.components?.jointFrames[arrayIndex] || null;
    }

    public getTCP(): THREE.AxesHelper | null {
        return this.components?.tcp || null;
    }

    public calculateAndLogTransformations(): void {
        console.log('=== WORLD POSITIONS ===');
        for (let i = 0; i <= 6; i++) {
            const frame = this.getLinkEndFrame(i as any);
            const pos = new THREE.Vector3();
            frame?.getWorldPosition(pos);
            console.log(`Link ${i} end world position:`, pos);
        }

        console.log('\n=== WORLD MATRICES ===');
        console.log('robot link end frame 0', this.getLinkEndFrame(0)?.matrixWorld.elements);
        console.log('robot link end frame 1', this.getLinkEndFrame(1)?.matrixWorld.elements);
        console.log('robot link end frame 2', this.getLinkEndFrame(2)?.matrixWorld.elements);
        console.log('robot link end frame 3', this.getLinkEndFrame(3)?.matrixWorld.elements);
        console.log('robot link end frame 4', this.getLinkEndFrame(4)?.matrixWorld.elements);
        console.log('robot link end frame 5', this.getLinkEndFrame(5)?.matrixWorld.elements);
        console.log('robot link end frame 6', this.getLinkEndFrame(6)?.matrixWorld.elements);

        console.log('\n=== RELATIVE TRANSFORMS ===');
        const frame0 = this.getLinkEndFrame(0);
        const frame1 = this.getLinkEndFrame(1);
        if (frame0 && frame1) {
            console.log('robot link end frame 1 relative to link 0 end', frame0.matrixWorld.clone().invert().multiply(frame1.matrixWorld).elements);
        }
        
        const frame2 = this.getLinkEndFrame(2);
        if (frame1 && frame2) {
            console.log('robot link end frame 2 relative to link 1 end', frame1.matrixWorld.clone().invert().multiply(frame2.matrixWorld).elements);
        }
        
        const frame3 = this.getLinkEndFrame(3);
        if (frame2 && frame3) {
            console.log('robot link end frame 3 relative to link 2 end', frame2.matrixWorld.clone().invert().multiply(frame3.matrixWorld).elements);
        }
        
        const frame4 = this.getLinkEndFrame(4);
        if (frame3 && frame4) {
            console.log('robot link end frame 4 relative to link 3 end', frame3.matrixWorld.clone().invert().multiply(frame4.matrixWorld).elements);
        }
        
        const frame5 = this.getLinkEndFrame(5);
        if (frame4 && frame5) {
            console.log('robot link end frame 5 relative to link 4 end', frame4.matrixWorld.clone().invert().multiply(frame5.matrixWorld).elements);
        }
        
        const frame6 = this.getLinkEndFrame(6);
        if (frame5 && frame6) {
            console.log('robot link end frame 6 relative to link 5 end', frame5.matrixWorld.clone().invert().multiply(frame6.matrixWorld).elements);
        }
    }

    private destroyRobot(): void {
        if (this.components) {
            this.worldReferenceFrame.remove(this.components.linkOrigins[0]);
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
            linkOrigins: [link0origin, link1origin, link2origin, link3origin, link4origin, link5origin, link6origin],
            linkEnds: [link0end, link1end, link2end, link3end, link4end, link5end, link6end],
            jointFrames: [joint1frame, joint2frame, joint3frame, joint4frame, joint5frame, joint6frame],
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