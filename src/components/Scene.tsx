import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const FloatingCrystal = ({ position, onClick, color = '#ff6b6b' }) => {
  const meshRef = useRef<THREE.Mesh>();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: hovered ? 1.2 : 1,
        y: hovered ? 1.2 : 1,
        z: hovered ? 1.2 : 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [hovered]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
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
        />
      </mesh>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>();
  const count = 1000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ff6b6b"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const Experience = () => {
  const { camera } = useThree();
  const scrollRef = useRef({ value: 0 });

  useEffect(() => {
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
  }, [camera]);

  return (
    <>
      <ParticleField />
      
      <FloatingCrystal 
        position={[-2, 2, 0]} 
        color="#ff6b6b"
        onClick={() => console.log('Combat clicked')}
      />
      <FloatingCrystal 
        position={[0, 0, 0]} 
        color="#6b6bff"
        onClick={() => console.log('Exploration clicked')}
      />
      <FloatingCrystal 
        position={[2, -2, 0]} 
        color="#6bff6b"
        onClick={() => console.log('Story clicked')}
      />

      <Text
        position={[-2, 3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        COMBAT
      </Text>
      <Text
        position={[0, 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        EXPLORE
      </Text>
      <Text
        position={[2, -1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
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

export const Scene = () => {
  return (
    <div id="scene-container" className="h-[300vh]">
      <div className="sticky top-0 h-screen">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 5, 8], fov: 45 }}
          className="h-full w-full"
        >
          <color attach="background" args={['#000814']} />
          <fog attach="fog" args={['#000814', 5, 15]} />
          <Experience />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
    </div>
  );
};