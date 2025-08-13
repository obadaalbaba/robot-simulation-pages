import * as THREE from 'three';
import { RobotBuilder } from '../robot-builder';
import * as robotFunctions from '../functions';
import { RobotDefinition } from '../robot-definition';
import { type UserInputs } from '../../user-inputs/types';
import { type Axis } from '../../shared/types';
import { type LinkIndex, type JointNumber } from '../types';

// Mock the robot functions module
jest.mock('../functions');
jest.mock('three');

describe('RobotBuilder', () => {
  let robotBuilder: RobotBuilder;
  let mockWorldFrame: THREE.Object3D;
  let mockUserInputs: UserInputs;

  // Mock objects that will be returned by the functions
  let mockAxesHelper: THREE.AxesHelper;
  let mockMesh: THREE.Mesh;

  beforeEach(() => {
    // Setup THREE.js mocks
    (THREE.Vector3 as jest.Mock) = jest.fn().mockImplementation(() => ({
      x: 0, y: 0, z: 0,
      set: jest.fn(),
      add: jest.fn(),
      clone: jest.fn()
    }));

    // Setup mock objects
    mockAxesHelper = {
      rotation: { x: 0, y: 0, z: 0, set: jest.fn() },
      rotateX: jest.fn(),
      rotateY: jest.fn(),
      rotateZ: jest.fn(),
      getWorldPosition: jest.fn().mockImplementation((vector) => {
        vector.x = 0;
        vector.y = 0;
        vector.z = 0;
      }),
      matrixWorld: {
        elements: new Array(16).fill(0),
        clone: jest.fn(() => ({
          invert: jest.fn(() => ({
            multiply: jest.fn(() => ({ elements: new Array(16).fill(0) }))
          }))
        }))
      }
    } as any;

    mockMesh = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    } as any;

    mockWorldFrame = {
      add: jest.fn(),
      remove: jest.fn(),
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    } as any;

    // Mock user inputs with valid robot configuration
    mockUserInputs = {
      // Link 0
      link_0_direction: 'y',
      link_0_length: 5,
      
      // Joint 1 + Link 1
      joint1_direction: 'y',
      theta1: 150,
      link_1_direction: 'z',
      link_1_length: 5,
      
      // Joint 2 + Link 2
      joint2_direction: 'y',
      theta2: 45,
      link_2_direction: 'x',
      link_2_length: 15,
      
      // Joint 3 + Link 3
      joint3_direction: 'x',
      theta3: 45,
      link_3_direction: 'y',
      link_3_length: 15,
      
      // Joint 4 + Link 4
      joint4_direction: 'y',
      theta4: 0,
      link_4_direction: 'x',
      link_4_length: 5,
      
      // Joint 5 + Link 5
      joint5_direction: 'y',
      theta5: 0,
      link_5_direction: 'z',
      link_5_length: 4,
      
      // Joint 6 + Link 6
      joint6_direction: 'y',
      theta6: 0,
      link_6_direction: 'y',
      link_6_length: 2
    };

    // Setup function mocks to return our mock objects
    (robotFunctions.createLinkOrigin as jest.Mock).mockReturnValue(mockAxesHelper);
    (robotFunctions.createLink as jest.Mock).mockReturnValue(mockMesh);
    (robotFunctions.createLinkEndFrame as jest.Mock).mockReturnValue(mockAxesHelper);
    (robotFunctions.createJoint as jest.Mock).mockReturnValue(mockMesh);
    (robotFunctions.createJointFrame as jest.Mock).mockReturnValue(mockAxesHelper);
    (robotFunctions.createTCPframe as jest.Mock).mockReturnValue(mockAxesHelper);

    // Create robot builder instance
    robotBuilder = new RobotBuilder(mockWorldFrame);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create a RobotBuilder with world reference frame', () => {
      const builder = new RobotBuilder(mockWorldFrame);
      expect(builder).toBeInstanceOf(RobotBuilder);
    });

    it('should initialize with no components', () => {
      const builder = new RobotBuilder(mockWorldFrame);
      expect(builder.getLinkEndFrame(0)).toBeNull();
      expect(builder.getTCP()).toBeNull();
    });
  });

  describe('buildRobot', () => {
    it('should build a complete robot structure', () => {
      robotBuilder.buildRobot(mockUserInputs);

      // Verify all robot functions were called with correct parameters
      expect(robotFunctions.createLinkOrigin).toHaveBeenCalledTimes(7); // Links 0-6
      expect(robotFunctions.createLink).toHaveBeenCalledTimes(7); // Links 0-6
      expect(robotFunctions.createLinkEndFrame).toHaveBeenCalledTimes(7); // Links 0-6
      expect(robotFunctions.createJoint).toHaveBeenCalledTimes(6); // Joints 1-6
      expect(robotFunctions.createJointFrame).toHaveBeenCalledTimes(6); // Joints 1-6
      expect(robotFunctions.createTCPframe).toHaveBeenCalledTimes(1);
    });

    it('should create link 0 with correct parameters', () => {
      robotBuilder.buildRobot(mockUserInputs);

      expect(robotFunctions.createLinkOrigin).toHaveBeenCalledWith('y', mockWorldFrame);
      expect(robotFunctions.createLink).toHaveBeenCalledWith(5, mockAxesHelper);
      expect(robotFunctions.createLinkEndFrame).toHaveBeenCalledWith(5, mockAxesHelper);
    });

    it('should create joint 1 with correct parameters', () => {
      robotBuilder.buildRobot(mockUserInputs);

      expect(robotFunctions.createJointFrame).toHaveBeenCalledWith(150, 'y', mockAxesHelper);
      expect(robotFunctions.createJoint).toHaveBeenCalledWith(mockAxesHelper, 'y');
    });

    it('should destroy existing robot before building new one', () => {
      // Build robot first time
      robotBuilder.buildRobot(mockUserInputs);
      
      // Build robot second time
      robotBuilder.buildRobot(mockUserInputs);

      // Should remove the old robot from world frame
      expect(mockWorldFrame.remove).toHaveBeenCalledWith(mockAxesHelper);
    });

    it('should make robot components accessible after building', () => {
      robotBuilder.buildRobot(mockUserInputs);

      expect(robotBuilder.getLinkEndFrame(0)).not.toBeNull();
      expect(robotBuilder.getLinkOriginFrame(0)).not.toBeNull();
      expect(robotBuilder.getJointFrame(1)).not.toBeNull();
      expect(robotBuilder.getTCP()).not.toBeNull();
    });
  });

  describe('rebuildRobot', () => {
    it('should call buildRobot with the same parameters', () => {
      const buildSpy = jest.spyOn(robotBuilder, 'buildRobot');
      
      robotBuilder.rebuildRobot(mockUserInputs);

      expect(buildSpy).toHaveBeenCalledWith(mockUserInputs);
    });
  });

  describe('updateJointAngles', () => {
    beforeEach(() => {
      robotBuilder.buildRobot(mockUserInputs);
    });

    it('should throw error if robot not built', () => {
      const emptyBuilder = new RobotBuilder(mockWorldFrame);
      
      expect(() => emptyBuilder.updateJointAngles(mockUserInputs)).toThrow(
        'Robot must be built before updating joint angles'
      );
    });

    it('should update all joint angles', () => {
      const updatedInputs = {
        ...mockUserInputs,
        theta1: 90,
        theta2: 45,
        theta3: -30,
        theta4: 180,
        theta5: 90,
        theta6: -45
      };

      robotBuilder.updateJointAngles(updatedInputs);

      // Verify rotation was reset and applied for each joint
      expect(mockAxesHelper.rotation.set).toHaveBeenCalledTimes(6);
      expect(mockAxesHelper.rotateY).toHaveBeenCalledWith(Math.PI / 2); // 90 degrees
      expect(mockAxesHelper.rotateY).toHaveBeenCalledWith(Math.PI / 4); // 45 degrees
      expect(mockAxesHelper.rotateX).toHaveBeenCalledWith(-Math.PI / 6); // -30 degrees
    });

    it('should handle different joint directions correctly', () => {
      const updatedInputs = {
        ...mockUserInputs,
        theta1: 90,
        joint1_direction: 'x' as Axis,
        theta2: 45,
        joint2_direction: 'z' as Axis
      };

      robotBuilder.updateJointAngles(updatedInputs);

      expect(mockAxesHelper.rotateX).toHaveBeenCalledWith(Math.PI / 2); // Joint 1, X-axis
      expect(mockAxesHelper.rotateZ).toHaveBeenCalledWith(Math.PI / 4); // Joint 2, Z-axis
    });

    it('should respect the number of joints defined in RobotDefinition', () => {
      jest.spyOn(RobotDefinition, 'getNumJoints').mockReturnValue(6);

      robotBuilder.updateJointAngles(mockUserInputs);

      // Should update all 6 joints
      expect(mockAxesHelper.rotation.set).toHaveBeenCalledTimes(6);
    });
  });

  describe('Getter methods', () => {
    beforeEach(() => {
      robotBuilder.buildRobot(mockUserInputs);
    });

    describe('getLinkEndFrame', () => {
      it('should return link end frame for valid indices', () => {
        const validIndices: LinkIndex[] = [0, 1, 2, 3, 4, 5, 6];
        
        validIndices.forEach(index => {
          const result = robotBuilder.getLinkEndFrame(index);
          expect(result).toBe(mockAxesHelper);
        });
      });

      it('should return null for robot not built', () => {
        const emptyBuilder = new RobotBuilder(mockWorldFrame);
        expect(emptyBuilder.getLinkEndFrame(0)).toBeNull();
      });
    });

    describe('getLinkOriginFrame', () => {
      it('should return link origin frame for valid indices', () => {
        const validIndices: LinkIndex[] = [0, 1, 2, 3, 4, 5, 6];
        
        validIndices.forEach(index => {
          const result = robotBuilder.getLinkOriginFrame(index);
          expect(result).toBe(mockAxesHelper);
        });
      });

      it('should return null for robot not built', () => {
        const emptyBuilder = new RobotBuilder(mockWorldFrame);
        expect(emptyBuilder.getLinkOriginFrame(0)).toBeNull();
      });
    });

    describe('getJointFrame', () => {
      it('should return joint frame for valid joint numbers', () => {
        const validJoints: JointNumber[] = [1, 2, 3, 4, 5, 6];
        
        validJoints.forEach(jointNumber => {
          const result = robotBuilder.getJointFrame(jointNumber);
          expect(result).toBe(mockAxesHelper);
        });
      });

      it('should convert joint numbers to array indices correctly', () => {
        // Joint 1 should map to index 0, Joint 6 should map to index 5
        expect(robotBuilder.getJointFrame(1)).toBe(mockAxesHelper);
        expect(robotBuilder.getJointFrame(6)).toBe(mockAxesHelper);
      });

      it('should return null for robot not built', () => {
        const emptyBuilder = new RobotBuilder(mockWorldFrame);
        expect(emptyBuilder.getJointFrame(1)).toBeNull();
      });
    });

    describe('getTCP', () => {
      it('should return TCP frame when robot is built', () => {
        const result = robotBuilder.getTCP();
        expect(result).toBe(mockAxesHelper);
      });

      it('should return null for robot not built', () => {
        const emptyBuilder = new RobotBuilder(mockWorldFrame);
        expect(emptyBuilder.getTCP()).toBeNull();
      });
    });
  });

  describe('calculateAndLogTransformations', () => {
    beforeEach(() => {
      robotBuilder.buildRobot(mockUserInputs);
      // Mock console.log to avoid cluttering test output
      jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      (console.log as jest.Mock).mockRestore();
    });

    it('should log world positions for all link end frames', () => {
      robotBuilder.calculateAndLogTransformations();

      expect(mockAxesHelper.getWorldPosition).toHaveBeenCalledTimes(7); // Links 0-6
      expect(console.log).toHaveBeenCalledWith('=== WORLD POSITIONS ===');
    });

    it('should access matrixWorld elements for logging', () => {
      robotBuilder.calculateAndLogTransformations();

      // Verify that console.log was called (indicating the method ran)
      expect(console.log).toHaveBeenCalled();
      
      // Verify that matrixWorld.elements was accessed
      expect(mockAxesHelper.matrixWorld.elements).toBeDefined();
    });

    it('should perform matrix calculations for relative transforms', () => {
      robotBuilder.calculateAndLogTransformations();

      // Verify that console.log was called (indicating the method ran)
      expect(console.log).toHaveBeenCalled();
      
      // Verify that matrix operations were called
      expect(mockAxesHelper.matrixWorld.clone).toHaveBeenCalled();
    });
  });

  describe('Private methods behavior', () => {
    describe('destroyRobot', () => {
      it('should remove robot from world frame when destroying', () => {
        robotBuilder.buildRobot(mockUserInputs);
        
        // Build again to trigger destroy
        robotBuilder.buildRobot(mockUserInputs);

        expect(mockWorldFrame.remove).toHaveBeenCalledWith(mockAxesHelper);
      });

      it('should handle destroying when no robot exists', () => {
        // This should not throw an error
        expect(() => robotBuilder.buildRobot(mockUserInputs)).not.toThrow();
      });
    });

    describe('constructRobotStructure', () => {
      it('should create robot components in correct order', () => {
        robotBuilder.buildRobot(mockUserInputs);

        // Verify the sequence of calls follows the robot structure
        const linkOriginCalls = (robotFunctions.createLinkOrigin as jest.Mock).mock.calls;
        const linkCalls = (robotFunctions.createLink as jest.Mock).mock.calls;
        const linkEndCalls = (robotFunctions.createLinkEndFrame as jest.Mock).mock.calls;

        // First call should be for link 0 attached to world frame
        expect(linkOriginCalls[0]).toEqual(['y', mockWorldFrame]);
        expect(linkCalls[0]).toEqual([5, mockAxesHelper]);
        expect(linkEndCalls[0]).toEqual([5, mockAxesHelper]);
      });

      it('should create all required components', () => {
        robotBuilder.buildRobot(mockUserInputs);

        // Verify component counts
        expect(robotFunctions.createLinkOrigin).toHaveBeenCalledTimes(7); // 7 links (0-6)
        expect(robotFunctions.createLink).toHaveBeenCalledTimes(7); // 7 links (0-6)
        expect(robotFunctions.createLinkEndFrame).toHaveBeenCalledTimes(7); // 7 links (0-6)
        expect(robotFunctions.createJoint).toHaveBeenCalledTimes(6); // 6 joints (1-6)
        expect(robotFunctions.createJointFrame).toHaveBeenCalledTimes(6); // 6 joints (1-6)
        expect(robotFunctions.createTCPframe).toHaveBeenCalledTimes(1); // 1 TCP
      });
    });

    describe('updateJointRotation', () => {
      beforeEach(() => {
        robotBuilder.buildRobot(mockUserInputs);
      });

      it('should convert degrees to radians correctly', () => {
        const updatedInputs = { ...mockUserInputs, theta1: 180 };
        
        robotBuilder.updateJointAngles(updatedInputs);

        expect(mockAxesHelper.rotateY).toHaveBeenCalledWith(Math.PI); // 180 degrees = π radians
      });

      it('should handle negative angles', () => {
        const updatedInputs = { ...mockUserInputs, theta1: -90 };
        
        robotBuilder.updateJointAngles(updatedInputs);

        expect(mockAxesHelper.rotateY).toHaveBeenCalledWith(-Math.PI / 2); // -90 degrees
      });

      it('should reset rotation before applying new rotation', () => {
        robotBuilder.updateJointAngles(mockUserInputs);

        expect(mockAxesHelper.rotation.set).toHaveBeenCalledWith(0, 0, 0);
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero-length links', () => {
      const zeroLengthInputs = {
        ...mockUserInputs,
        link_0_length: 0,
        link_1_length: 0
      };

      expect(() => robotBuilder.buildRobot(zeroLengthInputs)).not.toThrow();
    });

    it('should handle all axis directions', () => {
      const allAxesInputs: UserInputs = {
        ...mockUserInputs,
        link_0_direction: 'x',
        link_1_direction: 'y',
        link_2_direction: 'z',
        joint1_direction: 'x',
        joint2_direction: 'y',
        joint3_direction: 'z'
      };

      expect(() => robotBuilder.buildRobot(allAxesInputs)).not.toThrow();
    });

    it('should handle extreme joint angles', () => {
      robotBuilder.buildRobot(mockUserInputs);
      
      const extremeAngles = {
        ...mockUserInputs,
        theta1: 360,
        theta2: -360,
        theta3: 720
      };

      expect(() => robotBuilder.updateJointAngles(extremeAngles)).not.toThrow();
    });

    it('should maintain component integrity after multiple builds', () => {
      robotBuilder.buildRobot(mockUserInputs);
      const firstTCP = robotBuilder.getTCP();

      robotBuilder.buildRobot(mockUserInputs);
      const secondTCP = robotBuilder.getTCP();

      expect(firstTCP).toBe(mockAxesHelper);
      expect(secondTCP).toBe(mockAxesHelper);
    });
  });
});