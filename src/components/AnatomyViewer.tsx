'use client';

import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '@/context/LanguageContext';

interface BodyPartProps {
  name: string;
  labelKey: string;
  position: [number, number, number];
  args: number[];
  type: 'box' | 'sphere' | 'cylinder';
  color: string;
  onSelect: (part: { name: string, labelKey: string }) => void;
  isSelected: boolean;
}

function BodyPart({ name, labelKey, position, args, type, color, onSelect, isSelected }: BodyPartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {type === 'box' && (
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ name, labelKey });
          }}
        >
          <boxGeometry args={args as [width?: number, height?: number, depth?: number]} />
          <meshStandardMaterial 
            color={isSelected ? '#3b82f6' : hovered ? '#93c5fd' : color} 
          />
        </mesh>
      )}
      {type === 'sphere' && (
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ name, labelKey });
          }}
        >
          <sphereGeometry args={args as [radius?: number, widthSegments?: number, heightSegments?: number]} />
          <meshStandardMaterial 
            color={isSelected ? '#3b82f6' : hovered ? '#93c5fd' : color} 
          />
        </mesh>
      )}
      {type === 'cylinder' && (
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect({ name, labelKey });
          }}
        >
          <cylinderGeometry args={args as [radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number]} />
          <meshStandardMaterial 
            color={isSelected ? '#3b82f6' : hovered ? '#93c5fd' : color} 
          />
        </mesh>
      )}
      
      {(hovered || isSelected) && (
        <Html distanceFactor={10}>
          <div className="bg-white px-2 py-1 rounded shadow-lg border border-gray-200 pointer-events-none whitespace-nowrap">
            <p className="text-xs font-bold text-gray-800">{name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function AnatomyViewer() {
  const { t } = useLanguage();
  const [selectedPart, setSelectedPart] = useState<{ name: string, labelKey: string } | null>(null);

  const parts = [
    { name: 'Skull (Kranium)', labelKey: 'skull', type: 'sphere' as const, position: [0, 1.6, 0] as [number, number, number], args: [0.2, 32, 32], color: '#fef3c7' },
    { name: 'Torso (Bål)', labelKey: 'torso', type: 'box' as const, position: [0, 0.7, 0] as [number, number, number], args: [0.6, 1, 0.3], color: '#fef3c7' },
    { name: 'Right Humerus (Överarm)', labelKey: 'humerus', type: 'cylinder' as const, position: [-0.45, 0.8, 0] as [number, number, number], args: [0.07, 0.07, 0.6], color: '#fef3c7' },
    { name: 'Left Humerus (Överarm)', labelKey: 'humerus', type: 'cylinder' as const, position: [0.45, 0.8, 0] as [number, number, number], args: [0.07, 0.07, 0.6], color: '#fef3c7' },
    { name: 'Right Femur (Lårben)', labelKey: 'femur', type: 'cylinder' as const, position: [-0.2, -0.2, 0] as [number, number, number], args: [0.09, 0.09, 0.8], color: '#fef3c7' },
    { name: 'Left Femur (Lårben)', labelKey: 'femur', type: 'cylinder' as const, position: [0.2, -0.2, 0] as [number, number, number], args: [0.09, 0.09, 0.8], color: '#fef3c7' },
  ];

  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1, 4]} />
        <OrbitControls target={[0, 0.5, 0]} minDistance={1.5} maxDistance={10} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <group position={[0, -0.5, 0]}>
          {parts.map((part, index) => (
            <BodyPart
              key={`${part.name}-${index}`}
              {...part}
              onSelect={setSelectedPart}
              isSelected={selectedPart?.name === part.name}
            />
          ))}
        </group>
        
        <gridHelper args={[20, 20, 0x888888, 0xcccccc]} position={[0, -1.3, 0]} />
        <Environment preset="city" />
      </Canvas>
      
      {selectedPart && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-lg shadow-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2 z-10">
          <h3 className="text-lg font-bold text-blue-800">{selectedPart.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {t(`atlas.${selectedPart.labelKey}_desc`)}
          </p>
          <button 
            onClick={() => setSelectedPart(null)}
            className="mt-3 text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            {t('atlas.clear_selection')}
          </button>
        </div>
      )}
      
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 shadow-sm border border-gray-200">
        {t('atlas.instructions')}
      </div>
    </div>
  );
}
