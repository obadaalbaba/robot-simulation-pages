import * as THREE from 'three';
import {
  createLinkOrigin,
  createLink,
  createLinkEndFrame,
  createJoint,
  createJointFrame,
  createTCPframe
} from '../functions';
import { VISUAL_CONSTANTS } from '../robot-definition';
import { type Axis } from '../../shared/types';

// Mock THREE.js to avoid WebGL context issues in tests
jest.mock('three');

describe('Robot Functions', () => {
  let mockParent: THREE.Object3D;

  beforeEach(() => {
    // Create a mock parent object for each test
    mockParent = new THREE.Object3D();
    mockParent.add = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLinkOrigin', () => {
    it('should create an AxesHelper with correct size', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateZ: jest.fn(),
        rotateX: jest.fn(),
        rotateY: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      const result = createLinkOrigin('y', mockParent);
      
      expect(THREE.AxesHelper).toHaveBeenCalledWith(VISUAL_CONSTANTS.LINK_ORIGIN_AXES_SIZE);
      expect(mockParent.add).toHaveBeenCalledWith(result);
    });

    it('should rotate correctly for x-axis direction', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateZ: jest.fn(),
        rotateX: jest.fn(),
        rotateY: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      createLinkOrigin('x', mockParent);

      expect(mockAxesHelper.rotateZ).toHaveBeenCalledWith(-Math.PI / 2);
      expect(mockAxesHelper.rotateX).not.toHaveBeenCalled();
    });

    it('should not rotate for y-axis direction', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateZ: jest.fn(),
        rotateX: jest.fn(),
        rotateY: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      createLinkOrigin('y', mockParent);

      expect(mockAxesHelper.rotateZ).not.toHaveBeenCalled();
      expect(mockAxesHelper.rotateX).not.toHaveBeenCalled();
    });

    it('should rotate correctly for z-axis direction', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateZ: jest.fn(),
        rotateX: jest.fn(),
        rotateY: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      createLinkOrigin('z', mockParent);

      expect(mockAxesHelper.rotateX).toHaveBeenCalledWith(Math.PI / 2);
      expect(mockAxesHelper.rotateZ).not.toHaveBeenCalled();
    });

    it('should set line width correctly', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateZ: jest.fn(),
        rotateX: jest.fn(),
        rotateY: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      createLinkOrigin('y', mockParent);

      expect(mockAxesHelper.material.linewidth).toBe(VISUAL_CONSTANTS.STANDARD_LINE_WIDTH);
    });
  });

  describe('createLink', () => {
    let mockGeometry: THREE.CylinderGeometry;
    let mockMaterial: THREE.MeshBasicMaterial;
    let mockMesh: THREE.Mesh;

    beforeEach(() => {
      mockGeometry = {} as THREE.CylinderGeometry;
      mockMaterial = {} as THREE.MeshBasicMaterial;
      mockMesh = {
        position: { y: 0 }
      } as THREE.Mesh;

      (THREE.CylinderGeometry as jest.Mock).mockReturnValue(mockGeometry);
      (THREE.MeshBasicMaterial as jest.Mock).mockReturnValue(mockMaterial);
      (THREE.Mesh as jest.Mock).mockReturnValue(mockMesh);
    });

    it('should create a cylinder with correct geometry parameters', () => {
      const length = 10;
      createLink(length, mockParent);

      expect(THREE.CylinderGeometry).toHaveBeenCalledWith(
        VISUAL_CONSTANTS.LINK_RADIUS,
        VISUAL_CONSTANTS.LINK_RADIUS,
        length,
        VISUAL_CONSTANTS.CYLINDER_RADIAL_SEGMENTS
      );
    });

    it('should create a material with correct color', () => {
      createLink(10, mockParent);

      expect(THREE.MeshBasicMaterial).toHaveBeenCalledWith({
        color: VISUAL_CONSTANTS.LINK_COLOR
      });
    });

    it('should position the link correctly along y-axis', () => {
      const length = 10;
      createLink(length, mockParent);

      expect(mockMesh.position.y).toBe(length / 2);
    });

    it('should add the mesh to parent', () => {
      const result = createLink(10, mockParent);

      expect(mockParent.add).toHaveBeenCalledWith(result);
    });

    it('should handle default length parameter', () => {
      createLink(undefined, mockParent);

      expect(THREE.CylinderGeometry).toHaveBeenCalledWith(
        VISUAL_CONSTANTS.LINK_RADIUS,
        VISUAL_CONSTANTS.LINK_RADIUS,
        0,
        VISUAL_CONSTANTS.CYLINDER_RADIAL_SEGMENTS
      );
    });
  });

  describe('createLinkEndFrame', () => {
    it('should create an AxesHelper with correct size', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        position: { x: 0, y: 0, z: 0 }
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      createLinkEndFrame(10, mockParent);

      expect(THREE.AxesHelper).toHaveBeenCalledWith(VISUAL_CONSTANTS.LINK_END_AXES_SIZE);
    });

    it('should position the frame at the end of the link', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        position: { y: 0 }
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      const length = 15;
      createLinkEndFrame(length, mockParent);

      expect(mockAxesHelper.position.y).toBe(length);
    });

    it('should set line width correctly', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        position: { y: 0 }
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      createLinkEndFrame(10, mockParent);

      expect(mockAxesHelper.material.linewidth).toBe(VISUAL_CONSTANTS.STANDARD_LINE_WIDTH);
    });

    it('should add the frame to parent', () => {
      const result = createLinkEndFrame(10, mockParent);

      expect(mockParent.add).toHaveBeenCalledWith(result);
    });
  });

  describe('createJoint', () => {
    let mockGeometry: THREE.CylinderGeometry;
    let mockMaterial: THREE.MeshBasicMaterial;
    let mockMesh: THREE.Mesh;

    beforeEach(() => {
      mockGeometry = {} as THREE.CylinderGeometry;
      mockMaterial = {} as THREE.MeshBasicMaterial;
      mockMesh = {
        rotation: { x: 0, y: 0, z: 0 }
      } as THREE.Mesh;

      (THREE.CylinderGeometry as jest.Mock).mockReturnValue(mockGeometry);
      (THREE.MeshBasicMaterial as jest.Mock).mockReturnValue(mockMaterial);
      (THREE.Mesh as jest.Mock).mockReturnValue(mockMesh);
    });

    it('should create a cylinder with correct geometry parameters', () => {
      createJoint(mockParent, 'y');

      expect(THREE.CylinderGeometry).toHaveBeenCalledWith(
        VISUAL_CONSTANTS.JOINT_RADIUS,
        VISUAL_CONSTANTS.JOINT_RADIUS,
        VISUAL_CONSTANTS.JOINT_HEIGHT,
        VISUAL_CONSTANTS.CYLINDER_RADIAL_SEGMENTS
      );
    });

    it('should create a material with correct color', () => {
      createJoint(mockParent, 'y');

      expect(THREE.MeshBasicMaterial).toHaveBeenCalledWith({
        color: VISUAL_CONSTANTS.JOINT_COLOR
      });
    });

    it('should rotate correctly for x-axis direction', () => {
      createJoint(mockParent, 'x');

      expect(mockMesh.rotation.z).toBe(Math.PI / 2);
    });

    it('should not rotate for y-axis direction', () => {
      createJoint(mockParent, 'y');

      expect(mockMesh.rotation.x).toBe(0);
      expect(mockMesh.rotation.z).toBe(0);
    });

    it('should rotate correctly for z-axis direction', () => {
      createJoint(mockParent, 'z');

      expect(mockMesh.rotation.x).toBe(Math.PI / 2);
    });

    it('should add the joint to parent', () => {
      const result = createJoint(mockParent, 'y');

      expect(mockParent.add).toHaveBeenCalledWith(result);
    });
  });

  describe('createJointFrame', () => {
    let mockAxesHelper: any;

    beforeEach(() => {
      mockAxesHelper = {
        material: { linewidth: 0 },
        rotateX: jest.fn(),
        rotateY: jest.fn(),
        rotateZ: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);
    });

    it('should create an AxesHelper with correct size', () => {
      createJointFrame(45, 'y', mockParent);

      expect(THREE.AxesHelper).toHaveBeenCalledWith(VISUAL_CONSTANTS.JOINT_FRAME_AXES_SIZE);
    });

    it('should set thick line width', () => {
      createJointFrame(45, 'y', mockParent);

      expect(mockAxesHelper.material.linewidth).toBe(VISUAL_CONSTANTS.THICK_LINE_WIDTH);
    });

    it('should rotate correctly around x-axis', () => {
      const theta = 45;
      const expectedAngle = (theta * Math.PI) / VISUAL_CONSTANTS.DEGREES_TO_RADIANS;
      
      createJointFrame(theta, 'x', mockParent);

      expect(mockAxesHelper.rotateX).toHaveBeenCalledWith(expectedAngle);
      expect(mockAxesHelper.rotateY).not.toHaveBeenCalled();
      expect(mockAxesHelper.rotateZ).not.toHaveBeenCalled();
    });

    it('should rotate correctly around y-axis', () => {
      const theta = 90;
      const expectedAngle = (theta * Math.PI) / VISUAL_CONSTANTS.DEGREES_TO_RADIANS;
      
      createJointFrame(theta, 'y', mockParent);

      expect(mockAxesHelper.rotateY).toHaveBeenCalledWith(expectedAngle);
      expect(mockAxesHelper.rotateX).not.toHaveBeenCalled();
      expect(mockAxesHelper.rotateZ).not.toHaveBeenCalled();
    });

    it('should rotate correctly around z-axis', () => {
      const theta = -30;
      const expectedAngle = (theta * Math.PI) / VISUAL_CONSTANTS.DEGREES_TO_RADIANS;
      
      createJointFrame(theta, 'z', mockParent);

      expect(mockAxesHelper.rotateZ).toHaveBeenCalledWith(expectedAngle);
      expect(mockAxesHelper.rotateX).not.toHaveBeenCalled();
      expect(mockAxesHelper.rotateY).not.toHaveBeenCalled();
    });

    it('should convert degrees to radians correctly', () => {
      const theta = 180;
      const expectedAngle = Math.PI; // 180 degrees = π radians
      
      createJointFrame(theta, 'y', mockParent);

      expect(mockAxesHelper.rotateY).toHaveBeenCalledWith(expectedAngle);
    });

    it('should add the frame to parent', () => {
      const result = createJointFrame(45, 'y', mockParent);

      expect(mockParent.add).toHaveBeenCalledWith(result);
    });
  });

  describe('createTCPframe', () => {
    it('should create an AxesHelper with correct size', () => {
      createTCPframe(mockParent);

      expect(THREE.AxesHelper).toHaveBeenCalledWith(VISUAL_CONSTANTS.TCP_FRAME_AXES_SIZE);
    });

    it('should add the frame to parent', () => {
      const result = createTCPframe(mockParent);

      expect(mockParent.add).toHaveBeenCalledWith(result);
    });

    it('should return the created AxesHelper', () => {
      const mockAxesHelper = { material: { linewidth: 0 } };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      const result = createTCPframe(mockParent);

      expect(result).toBe(mockAxesHelper);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle zero length links', () => {
      const mockMesh = {
        position: { x: 0, y: 0, z: 0 }
      };
      (THREE.Mesh as jest.Mock).mockReturnValue(mockMesh);

      expect(() => createLink(0, mockParent)).not.toThrow();
    });

    it('should handle negative angles in joint frames', () => {
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateX: jest.fn(),
        rotateY: jest.fn(),
        rotateZ: jest.fn()
      };
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);

      expect(() => createJointFrame(-90, 'x', mockParent)).not.toThrow();
    });

    it('should handle all valid axis values', () => {
      const axes: Axis[] = ['x', 'y', 'z'];
      
      // Setup mocks for all functions
      const mockAxesHelper = {
        material: { linewidth: 0 },
        rotateX: jest.fn(),
        rotateY: jest.fn(),
        rotateZ: jest.fn()
      };
      const mockMesh = {
        rotation: { x: 0, y: 0, z: 0 }
      };
      
      (THREE.AxesHelper as jest.Mock).mockReturnValue(mockAxesHelper);
      (THREE.Mesh as jest.Mock).mockReturnValue(mockMesh);
      
      axes.forEach(axis => {
        expect(() => createLinkOrigin(axis, mockParent)).not.toThrow();
        expect(() => createJoint(mockParent, axis)).not.toThrow();
        expect(() => createJointFrame(45, axis, mockParent)).not.toThrow();
      });
    });
  });
});