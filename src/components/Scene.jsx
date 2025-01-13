import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSound } from '../hooks/useSound';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const FloatingCrystal = ({ position, onClick, color = '#ff6b6b', type, isActive }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);
  const { play } = useSound();
  const glowRef = useRef();

  const glowMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      glowIntensity: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float glowIntensity;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
        gl_FragColor = vec4(color, intensity * glowIntensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending
  }), [color]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;

      const glowIntensity = hovered || isActive ? 1.5 : 0.5;
      glowMaterial.uniforms.glowIntensity.value = THREE.MathUtils.lerp(
        glowMaterial.uniforms.glowIntensity.value,
        glowIntensity,
        0.1
      );
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered || isActive ? 1.2 : 1,
        y: hovered || isActive ? 1.2 : 1,
        z: hovered || isActive ? 1.2 : 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [hovered, isActive]);

  const handlePointerOver = () => {
    setHovered(true);
    play('hover');
  };

  const handleClick = () => {
    play(type.toLowerCase());
    onClick();
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        <mesh
          ref={meshRef}
          position={position}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={() => setHovered(false)}
        >
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            roughness={0}
            transmission={1}
            chromaticAberration={0.2}
            distortion={0.5}
            color={color}
            temporalDistortion={0.1}
          />
        </mesh>
        <mesh
          ref={glowRef}
          position={position}
          scale={[1.2, 1.2, 1.2]}
        >
          <octahedronGeometry args={[1, 0]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>
      </group>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef();
  const count = 2000;
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      color.setHSL(Math.random(), 0.5, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const Experience = ({ activeSection }) => {
  const { camera } = useThree();
  const scrollRef = useRef({ value: 0 });
  const { play, stop } = useSound();

  useEffect(() => {
    play('bgMusic');
    
    ScrollTrigger.create({
      trigger: "#scene-container",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollRef.current.value = self.progress;
        camera.position.y = 5 - self.progress * 3;
        camera.position.z = 8 - self.progress * 4;
        camera.lookAt(0, 0, 0);
      }
    });

    return () => {
      stop('bgMusic');
    };
  }, [camera]);

  return (
    <>
      <ParticleField />
      
      <FloatingCrystal 
        position={[-2, 2, 0]} 
        color="#ff6b6b"
        type="Combat"
        isActive={activeSection === 'features'}
        onClick={() => console.log('Combat clicked')}
      />
      <FloatingCrystal 
        position={[0, 0, 0]} 
        color="#6b6bff"
        type="Explore"
        isActive={activeSection === 'features'}
        onClick={() => console.log('Exploration clicked')}
      />
      <FloatingCrystal 
        position={[2, -2, 0]} 
        color="#6bff6b"
        type="Story"
        isActive={activeSection === 'features'}
        onClick={() => console.log('Story clicked')}
      />

      <Text
        position={[-2, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        COMBAT
      </Text>
      <Text
        position={[0, 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        EXPLORE
      </Text>
      <Text
        position={[2, -1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        STORY
      </Text>

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ff6b6b" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#6b6bff" />
    </>
  );
};

export const Scene = ({ activeSection }) => {
  return (
    <div id="scene-container" className="h-[300vh]">
      <div className="sticky top-0 h-screen">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 5, 8], fov: 45 }}
          className="h-full w-full"
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={['#000814']} />
          <fog attach="fog" args={['#000814', 5, 15]} />
          <Experience activeSection={activeSection} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
};