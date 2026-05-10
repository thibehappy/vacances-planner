"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/stylized_forest_-_scene_may_holiday.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={1} />
    </group>
  );
}

export default function ModelViewer() {
  return (
    <div className="w-full h-[350px]">
      <Canvas
        camera={{ position: [0, 2.5, 8], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
