import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Scene } from 'three';

/**
 * Utility class for exporting Three.js scenes to glTF format for Cognitive3D platform
 */
export class SceneExporter {
    private exporter: GLTFExporter;

    constructor() {
        this.exporter = new GLTFExporter();
    }

    /**
     * Export a Three.js scene to glTF and bin files for Cognitive3D upload
     * @param scene The Three.js scene to export
     */
    public exportForCognitive3D(scene: Scene): void {
        // Validate scene parameter
        if (scene === null || scene === undefined) {
            throw new Error('Scene parameter cannot be null or undefined');
        }
        
        console.log('🚀 Starting scene export for Cognitive3D...');
        
        this.exporter.parse(
            scene,
            (result: any) => {
                console.log('✅ Scene export completed');
                console.log('Export result type:', typeof result);
                console.log('Export result:', result);
                
                if (result instanceof ArrayBuffer) {
                    // This shouldn't happen with binary: false, but handle it
                    console.log('📦 Got binary GLB format');
                    this.saveArrayBuffer(result, 'scene.glb');
                } else {
                    // JSON format - create both .gltf and .bin files
                    console.log('📄 Got JSON format');
                    
                    // Check if there are buffers that should create .bin files
                    if (result.buffers && result.buffers.length > 0) {
                        console.log(`📊 Found ${result.buffers.length} buffer(s)`);
                        
                        result.buffers.forEach((buffer: any, index: number) => {
                            if (buffer.uri && buffer.uri.startsWith('data:')) {
                                try {
                                    // Convert embedded base64 to separate .bin file
                                    const base64Data = buffer.uri.split(',')[1];
                                    if (!base64Data) {
                                        throw new Error('No base64 data found in buffer URI');
                                    }
                                    
                                    const binaryData = atob(base64Data);
                                    const bytes = new Uint8Array(binaryData.length);
                                    for (let i = 0; i < binaryData.length; i++) {
                                        bytes[i] = binaryData.charCodeAt(i);
                                    }
                                    
                                    // Generate unique filename for each buffer
                                    const timestamp = Date.now();
                                    const binFilename = `scene_buffer_${index}_${timestamp}.bin`;
                                    
                                    // Update the buffer URI to point to external file
                                    buffer.uri = binFilename;
                                    
                                    // Save the binary file
                                    this.saveArrayBuffer(bytes.buffer, binFilename);
                                    console.log(`💾 Created ${binFilename} (${bytes.length} bytes)`);
                                } catch (error) {
                                    console.error(`❌ Failed to decode base64 buffer ${index}:`, error);
                                    console.warn(`Skipping buffer ${index} due to decoding error`);
                                    // Keep the original data URI as fallback
                                }
                            } else if (buffer.uri) {
                                console.log(`📁 Buffer already references external file: ${buffer.uri}`);
                            }
                        });
                    } else {
                        console.warn('⚠️ No buffers found - scene may be too simple');
                        console.warn('Consider adding more geometry, materials, or textures to create binary data');
                        
                        // Create a minimal .bin file to satisfy upload requirements
                        const emptyBuffer = new ArrayBuffer(8);
                        this.saveArrayBuffer(emptyBuffer, 'scene.bin');
                        
                        // Add a buffer reference to the glTF
                        if (!result.buffers) {
                            result.buffers = [];
                        }
                        result.buffers.push({
                            uri: 'scene.bin',
                            byteLength: 8
                        });
                        console.log('📦 Created minimal scene.bin file');
                    }
                    
                    // Save the .gltf file
                    const output = JSON.stringify(result, null, 2);
                    this.saveString(output, 'scene.gltf');
                    console.log('💾 Created scene.gltf');
                    
                    console.log('🎉 Export complete! Both scene.gltf and scene.bin should be downloaded.');
                    console.log('📋 Next steps:');
                    console.log('  1. Create a screenshot.png of your scene');
                    console.log('  2. Create a settings.json file');
                    console.log('  3. Upload using the c3d-upload-tools script');
                }
            },
            (error) => {
                console.error('❌ Error exporting GLTF:', error);
            },
            {
                binary: false,           // Keep as JSON to create separate files
                embedImages: false,      // Don't embed images in JSON
                includeCustomExtensions: false,
                truncateDrawRange: true,
                maxTextureSize: 1024,    // Force texture processing
                forceIndices: true       // Force index buffers
            }
        );
    }

    /**
     * Save an ArrayBuffer as a downloadable file
     */
    private saveArrayBuffer(buffer: ArrayBuffer, filename: string): void {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Save a string as a downloadable file
     */
    private saveString(text: string, filename: string): void {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}