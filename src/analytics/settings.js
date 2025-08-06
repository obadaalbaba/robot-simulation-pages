//settings.js

export default {
    config: {
      APIKey: "U9VAP2ABTDLFDKPBXF4DF3MTXCLKD83L", // Application Key is available on the dashboard
      gazeBatchSize: 64, // Number of Gaze snapshots stored in a batch before sending to server
      dynamicDataLimit: 64, // Number of Dynamic Object snapshots stored in a batch before sending to server
      customEventBatchSize: 64, // Number of Custom Event snapshots stored in a batch before sending to server
      sensorDataLimit: 64, // Number of Sensor snapshots stored in a batch before sending to server
      HMDType: "WindowsPCBrowserVR", // HMD Type for desktop/web usage - ensures accurate analytics categorization
      allSceneData: [
        // Scene data can be found on the Dashboard
        {
          sceneName: "YourSceneName",
          sceneId: "8407e9d0-0892-48b0-b20e-2d72c7af708c",
          versionNumber: "1",
        },
      ],
    },
  };