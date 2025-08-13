# Robot Simulation

Link: https://obadaalbaba.github.io/r
 obot-simulation-pages/

## Summary
This TypeScript-based application renders a customizable 4-link robotic arm with 3 rotary joints. The goal of this project is to create a comprehensive tool that allows users to visualize different robot configurations, perform forward kinematics calculations in a 3D environment, and monitor performance metrics through integrated analytics. The application combines robot simulation with real-time performance tracking and user behavior analytics.

## Features
- **4-Link Robot**: Configurable robot with links 0-3 and joints 1-3
- **Real-time Visualization**: Interactive 3D environment with orbit controls
- **Customizable Parameters**: Modify joint angles, link lengths, and orientations
- **Forward Kinematics**: Visualize coordinate frames and TCP (Tool Center Point)
- **Performance Analytics**: Real-time FPS monitoring with Cognitive3D integration
- **User Behavior Tracking**: Gaze tracking and interaction analytics capabilities
- **Modern Architecture**: Modular TypeScript codebase with comprehensive type safety

## How to Run the Code

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation & Development
1. Clone the repository:
   ```bash
   git clone https://github.com/obadaalbaba/RobotVisualization.git
   cd robot-simulation-pages
   ```

2. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp env.example .env
   ```
   
   Then edit the `.env` file and replace the placeholder values with your actual Cognitive3D credentials:
   - `VITE_C3D_API_KEY`: Your Cognitive3D API key from the dashboard
   - `VITE_C3D_SCENE_NAME`: The name of your scene in Cognitive3D  
   - `VITE_C3D_SCENE_ID`: The unique ID of your scene (found in Cognitive3D dashboard)
   - `VITE_C3D_VERSION`: Version number for your scene (typically starts at 1)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the provided local URL (typically `http://localhost:5173`)

### Build for Production
```bash
npm run build
npm run preview
```

## Project Structure
The codebase is organized into modular TypeScript components:

```
src/
├── main.ts              # Application entry point
├── constants.ts         # Global constants
├── vite-env.d.ts        # Vite environment type definitions
├── analytics/           # Performance monitoring and analytics
│   ├── analytics-monitor.ts   # Performance analytics and Cognitive3D integration
│   └── index.ts         # Module exports
├── robot/               # Robot construction and management
│   ├── robot-builder.ts # Main robot building logic
│   ├── functions.ts     # Robot component creation functions
│   ├── types.ts         # Robot-related type definitions
│   └── index.ts         # Module exports
├── scene/               # 3D scene management
│   ├── scene-manager.ts # Scene initialization and animation
│   ├── functions.ts     # Scene creation utilities
│   ├── config.ts        # Scene configuration
│   ├── types.ts         # Scene-related type definitions
│   └── index.ts         # Module exports
├── user-inputs/         # User interface and input handling
│   ├── input-manager.ts # Input monitoring and callbacks
│   ├── gui.ts           # dat.GUI interface setup
│   ├── config.ts        # GUI configuration
│   ├── types.ts         # Input-related type definitions
│   └── index.ts         # Module exports
├── shared/              # Shared types and utilities
│   ├── types.ts         # Common type definitions
│   └── index.ts         # Module exports
└── types/               # External library type definitions
    └── cognitive3d.d.ts # Cognitive3D analytics type declarations
```

## Architecture

### Core Components
1. **SceneManager**: Manages the 3D environment, camera, lights, and animation loop
2. **UserInputManager**: Handles dat.GUI interface and monitors user input changes
3. **RobotBuilder**: Constructs and updates the robot based on user parameters
4. **AnalyticsMonitor**: Tracks performance metrics and integrates with Cognitive3D analytics platform

### Key Classes and Modules
- `SceneManager`: Initializes Three.js scene, camera, renderer, and controls
- `UserInputManager`: Provides real-time input monitoring with callbacks for structural changes and joint updates
- `RobotBuilder`: Handles robot construction, destruction, and joint angle updates
- `AnalyticsMonitor`: Integrates with Cognitive3D analytics for performance tracking, gaze recording, and sensor data collection
- Modular functions for creating links, joints, coordinate frames, and TCP

### Analytics Integration
The application integrates with **Cognitive3D**, a platform for spatial analytics and user behavior tracking:
- **Performance Monitoring**: Real-time FPS tracking with visual display and data logging
- **Gaze Tracking**: Capability to record user gaze patterns (camera-based tracking available)
- **Sensor Data**: Integration for recording custom sensor data and user interactions
- **Scene Analytics**: Detailed scene usage analytics and user engagement metrics

## Robot Configuration
The robot supports the following customizable parameters:

### Links (4 total: Link 0-3)
- **Length**: Adjustable length for each link
- **Orientation**: Each link can be oriented along X, Y, or Z axis

### Joints (3 total: Joint 1-3)
- **Angles**: θ1, θ2, θ3 (configurable range)
- **Orientation**: Each joint can rotate around X, Y, or Z axis

### Coordinate Frames
- World reference frame
- Link origin frames (4)
- Link end frames (4)
- Joint frames (3)
- Tool Center Point (TCP)

## Technologies Used

### Core Libraries
- **Three.js**: 3D graphics and rendering
- **dat.GUI**: Real-time parameter control interface
- **Cognitive3D Analytics**: Performance monitoring and user behavior analytics
- **TypeScript**: Type-safe development
- **Vite**: Modern build tool and development server

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript Compiler**: Type checking and compilation
- **Node.js**: Development environment

## Implementation Highlights

### Modular Architecture
The application uses a clean separation of concerns:
- Scene management is isolated from robot logic
- User inputs are decoupled from robot construction
- Analytics and performance monitoring operate independently
- Type-safe interfaces ensure reliable component interaction

### Real-time Updates
- Efficient monitoring of user input changes
- Separate handling for structural changes (requiring robot rebuild) vs. joint angle updates
- Optimized animation loop for smooth 3D rendering

### Forward Kinematics Visualization
- Visual representation of all coordinate frames
- Real-time TCP calculation and display
- Support for complex multi-axis joint orientations

### Performance Analytics Integration
- Real-time FPS monitoring with visual feedback
- Comprehensive scene analytics through Cognitive3D platform
- Automated performance data collection and reporting
- Extensible sensor data recording for custom metrics

## Future Enhancements
1. **Inverse Kinematics**: Add inverse kinematics solver
2. **Trajectory Planning**: Implement path planning capabilities  
3. **Prismatic Joints**: Add support for linear joints
4. **More DOF**: Extend to 6+ degree-of-freedom robots
5. **Robot Models**: Support for different robot architectures
6. **Export Functionality**: Save robot configurations and animations
