// src/renderer/components/GlobeComponent.tsx

import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { TextureLoader, ShaderMaterial, LinearFilter } from 'three';
import * as THREE from 'three';
import PQueue from 'p-queue';
import LRU from 'lru-cache';
import { debounce } from 'lodash';
import useUI from '../hooks/useUI';
import useData from '../hooks/useData';

// Placeholder texture (a simple gray color)
const placeholderTexture = new TextureLoader().load(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
);

// Polyfill for requestIdleCallback
const requestIdleCallbackPolyfill =
  window.requestIdleCallback ||
  function (cb: (deadline: { timeRemaining: () => number }) => void) {
    return setTimeout(() => {
      cb({
        timeRemaining: () => Infinity,
      });
    }, 1);
  };

const requestIdleCallbackFn =
  window.requestIdleCallback || requestIdleCallbackPolyfill;

// Define cache options
const cacheOptions = {
  max: 50, // Lower maximum to reduce memory usage
  ttl: 1000 * 60 * 30, // 30 minutes
  dispose: (tileId: string, texture: THREE.Texture) => {
    texture.dispose(); // Clean up texture when evicted
  },
};

// Initialize LRU cache
const textureLRUCache = new LRU<string, THREE.Texture>(cacheOptions);

// Initialize PQueue with a lower concurrency limit
const queue = new PQueue({ concurrency: 2 }); // Further reduced concurrency

interface TileTextures {
  [key: string]: THREE.Texture | null;
}

const GlobeComponent: React.FC = () => {
  const globeRef = useRef<any>(null);
  const { samplingEventData, locations } = useData();
  const { setSelectedRightItem, openRightSidebar } = useUI();

  // Use useRef to store textures to avoid frequent React state updates
  const texturesRef = useRef<TileTextures>({
    A1: placeholderTexture,
    A2: placeholderTexture,
    B1: placeholderTexture,
    B2: placeholderTexture,
    C1: placeholderTexture,
    C2: placeholderTexture,
    D1: placeholderTexture,
    D2: placeholderTexture,
  });

  const { getGlobeTile } = window.electron;

  // Shader material ref
  const shaderMaterialRef = useRef<ShaderMaterial | null>(null);

  // Debounce the shader update function
  const updateShader = useMemo(
    () =>
      debounce(() => {
        if (shaderMaterialRef.current) {
          shaderMaterialRef.current.needsUpdate = true;
        }
      }, 100), // Adjust debounce delay as needed
    [],
  );

  // Function to load a tile texture with p-queue and LRU caching
  const loadTile = (tileId: string) => {
    // Check if texture is already in LRU cache
    const cachedTexture = textureLRUCache.get(tileId);
    if (cachedTexture) {
      texturesRef.current[tileId] = cachedTexture;
      if (shaderMaterialRef.current) {
        shaderMaterialRef.current.uniforms[`texture${tileId}`].value =
          cachedTexture;
        shaderMaterialRef.current.uniforms[`texture${tileId}`].needsUpdate =
          true;
        updateShader();
      }
      return;
    }

    // Schedule texture loading during idle time
    requestIdleCallbackFn(() => {
      queue
        .add(async () => {
          try {
            const response = await getGlobeTile(tileId);
            if (response.success && response.data) {
              const textureLoader = new TextureLoader();
              return new Promise<void>((resolve, reject) => {
                textureLoader.load(
                  `data:image/jpeg;base64,${response.data}`,
                  (texture) => {
                    // Optimize texture: set min/mag filters and encoding
                    texture.minFilter = LinearFilter;
                    texture.magFilter = LinearFilter;

                    // Add texture to LRU cache
                    textureLRUCache.set(tileId, texture);
                    // Update texturesRef
                    texturesRef.current[tileId] = texture;
                    // Update shader material's uniform
                    if (shaderMaterialRef.current) {
                      shaderMaterialRef.current.uniforms[
                        `texture${tileId}`
                      ].value = texture;
                      shaderMaterialRef.current.uniforms[
                        `texture${tileId}`
                      ].needsUpdate = true;
                      updateShader();
                    }
                    resolve();
                  },
                  undefined,
                  (error) => {
                    console.error(
                      `Error loading texture for tile ${tileId}:`,
                      error,
                    );
                    reject(error);
                  },
                );
              });
            }
            console.error(`Failed to load tile ${tileId}:`, response.message);
          } catch (error) {
            console.error(`Error fetching tile ${tileId}:`, error);
          }
        })
        .catch((error) => {
          console.error(`Queued task failed for tile ${tileId}:`, error);
        });
    });
  };

  // Lazy load tiles based on visibility or other logic
  // For simplicity, we'll load tiles when the component mounts
  useEffect(() => {
    const tileIds = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
    tileIds.forEach((tileId) => {
      loadTile(tileId);
    });
  }, []);

  // Extract the set of location IDs that have sampling events
  const locIdsWithSamplingEvents = useMemo(
    () =>
      new Set(Object.values(samplingEventData).map((event) => event.loc_id)),
    [samplingEventData],
  );

  // Prepare data for plotting
  const pointsData = useMemo(
    () =>
      locations
        .filter(
          (loc) =>
            loc.lat != null &&
            loc.long != null &&
            locIdsWithSamplingEvents.has(loc.id),
        )
        .map((location) => ({
          lat: location.lat,
          lng: location.long,
          name: location.label,
          id: location.id,
        })),
    [locations, locIdsWithSamplingEvents],
  );

  // Calculate average position for initial camera position
  const averagePosition = useMemo(() => {
    if (pointsData.length === 0) return { lat: 0, lng: 0 };
    return pointsData.reduce(
      (acc, point, _, { length }) => {
        acc.lat += point.lat / length;
        acc.lng += point.lng / length;
        return acc;
      },
      { lat: 0, lng: 0 },
    );
  }, [pointsData]);

  // Set the camera position after the component has mounted
  useEffect(() => {
    if (globeRef.current && pointsData.length > 0) {
      globeRef.current.pointOfView(
        {
          lat: averagePosition.lat,
          lng: averagePosition.lng,
          altitude: 0.5,
        },
        0, // Duration in milliseconds (0 for immediate)
      );
    }
  }, [pointsData, averagePosition]);

  const handlePointClick = (point: any) => {
    const selectedLocation = locations.find((loc) => loc.id === point.id);
    if (selectedLocation) {
      console.log('Point clicked:', selectedLocation);
      setSelectedRightItem(selectedLocation);
      openRightSidebar();
    }
  };

  // Create the custom globe material with dynamic textures
  const globeMaterial = useMemo(() => {
    // Create custom uniforms for each texture
    const customUniforms: { [key: string]: any } = {
      tileCountX: { value: 4 }, // Example value
      tileCountY: { value: 2 }, // Example value
    };

    // Initialize texture uniforms with placeholders
    Object.keys(texturesRef.current).forEach((key) => {
      customUniforms[`texture${key}`] = { value: texturesRef.current[key] };
    });

    // Vertex shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Fragment shader
    const fragmentShader = `
      precision highp float;

      uniform int tileCountX;
      uniform int tileCountY;

      uniform sampler2D textureA1;
      uniform sampler2D textureA2;
      uniform sampler2D textureB1;
      uniform sampler2D textureB2;
      uniform sampler2D textureC1;
      uniform sampler2D textureC2;
      uniform sampler2D textureD1;
      uniform sampler2D textureD2;

      varying vec2 vUv;

      void main() {
        vec2 tileUv = vUv;

        float tileX = floor(tileUv.x * float(tileCountX));
        float tileY = floor(tileUv.y * float(tileCountY));
        int tileIndex = int(tileY * float(tileCountX) + tileX);

        vec2 uvInTile = vec2(
          fract(tileUv.x * float(tileCountX)),
          fract(tileUv.y * float(tileCountY))
        );

        vec4 color;

        if (tileIndex == 0) {
          color = texture2D(textureA2, uvInTile);
        } else if (tileIndex == 1) {
          color = texture2D(textureB2, uvInTile);
        } else if (tileIndex == 2) {
          color = texture2D(textureC2, uvInTile);
        } else if (tileIndex == 3) {
          color = texture2D(textureD2, uvInTile);
        } else if (tileIndex == 4) {
          color = texture2D(textureA1, uvInTile);
        } else if (tileIndex == 5) {
          color = texture2D(textureB1, uvInTile);
        } else if (tileIndex == 6) {
          color = texture2D(textureC1, uvInTile);
        } else if (tileIndex == 7) {
          color = texture2D(textureD1, uvInTile);
        } else {
          color = vec4(1.0); // Default color
        }

        gl_FragColor = color;
      }
    `;

    // Create ShaderMaterial
    const material = new ShaderMaterial({
      uniforms: customUniforms,
      vertexShader,
      fragmentShader,
      transparent: false,
    });

    // Store material in ref for later updates
    shaderMaterialRef.current = material;

    return material;
  }, []);

  // Ensure shader updates are debounced
  useEffect(() => {
    return () => {
      updateShader.cancel();
    };
  }, [updateShader]);

  // Optional: Monitor cache status
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Current cache size:', textureLRUCache.size);
      console.log('Cached keys:', textureLRUCache.keys());
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="globe-container">
      <Globe
        ref={globeRef}
        globeMaterial={globeMaterial}
        pointsData={pointsData}
        onPointClick={handlePointClick}
        pointAltitude={0.1}
        pointRadius={0.05}
        pointColor={() => 'cyan'}
        pointLabel="name"
        backgroundColor="#000000"
        ambientLight={0.5}
        directionalLight={1.0}
      />
    </div>
  );
};

export default GlobeComponent;
