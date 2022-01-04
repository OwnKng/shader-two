import { noise } from "./noise"

export const vertexShader = /* glsl */ `
    precision highp float;

	uniform mat4 modelViewMatrix;
	uniform mat4 projectionMatrix;
	uniform float uTime;
    uniform vec2 uTextureSize; 

    uniform sampler2D uTexture;
    uniform vec2 uMouse; 
   
	attribute vec3 position;
	attribute vec2 uv;
	attribute vec3 offset;
    attribute float pindex; 


    varying vec2 particleuv; 

    varying float vWave;
    varying float vWaveEdge; 
    varying float vTime; 
    varying float vStrength; 


    float random(float n) {
	    return fract(sin(n) * 43758.5453123);
    }

    ${noise}
 
    void main() {
        vec3 displaced = offset; 

        //_ particle uv coords
        particleuv = offset.xy / uTextureSize;
        float rndz = (random(pindex) + cnoise(vec3(pindex * 0.1, uTime * 0.1, 0.1))) * 4.0; 

        //_ get the lighter image areas
        vec4 col = texture2D(uTexture, particleuv);
        float strength = col.r * 0.21 + col.g * 0.71 + col.b * 0.07;

        //_ randomise the particle position
        displaced.xy += (strength + cnoise(vec3(pindex * 0.1, uTime * 0.1, 0.1))) * 1.0;
        displaced.z += strength * 50.0;

        //_ interaction
        float wave = step(uMouse.y, particleuv.y);
        float waveEdge = step(uMouse.y, particleuv.y) + (1.0 - step(uMouse.y + 0.01, particleuv.y)) - 1.0;

        displaced.xyz += wave * 2.0;
        displaced.z += waveEdge * 40.0;

        //_ scale the particles
        float psize = (cnoise(vec3(uTime, pindex, 1.0) * 0.5) + 2.0);
        psize *= 0.5;
        psize *= max(strength, 0.2);
         
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        mvPosition.xyz += position * psize;
         
        gl_Position = projectionMatrix * mvPosition;

        //_ pass the varyings
        vWave = wave; 
        vWaveEdge = waveEdge; 
        vTime = uTime;
        vStrength = strength;
    }
`
