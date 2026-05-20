'use client';
import type { Product } from '@/lib/types';
import {
  ContactShadows,
  Environment,
  PerformanceMonitor,
  PresentationControls,
  Sparkles,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, DepthOfField, EffectComposer, Noise } from '@react-three/postprocessing';
import { gsap } from 'gsap';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CAMERA_PRESETS = {
  FRENTE: {
    position: [0, 0.2, 2.4] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  LADO: { position: [2.2, 0.2, 0], target: [0, 0, 0] },
  ESPALDA: { position: [0, 0.2, -2.4], target: [0, 0, 0] },
  DETALLE: { position: [0.6, 0.0, 1.0], target: [0.3, 0.1, 0.5] },
} as const satisfies Record<
  string,
  { position: [number, number, number]; target: [number, number, number] }
>;

type CamKey = keyof typeof CAMERA_PRESETS;

function ProductBillboard({
  src,
  hasInteracted,
}: {
  src: string;
  hasInteracted: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!src) return;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
    });
  }, [src]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!hasInteracted) {
      ref.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={ref}>
      {tex ? (
        <mesh castShadow>
          <planeGeometry args={[1.4, 1.9]} />
          <meshPhysicalMaterial
            map={tex}
            roughness={0.5}
            metalness={0.05}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
            envMapIntensity={0.9}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ) : (
        <mesh>
          <planeGeometry args={[1.4, 1.9]} />
          <meshStandardMaterial color="#15151a" />
        </mesh>
      )}
    </group>
  );
}

function CameraRig({ cam }: { cam: CamKey }) {
  const { camera, controls } = useThree() as unknown as {
    camera: THREE.PerspectiveCamera;
    controls: { target?: THREE.Vector3 } | null;
  };
  useEffect(() => {
    const preset = CAMERA_PRESETS[cam];
    gsap.to(camera.position, {
      x: preset.position[0],
      y: preset.position[1],
      z: preset.position[2],
      duration: 1.2,
      ease: 'p1-inOut',
    });
    if (controls?.target) {
      gsap.to(controls.target, {
        x: preset.target[0],
        y: preset.target[1],
        z: preset.target[2],
        duration: 1.2,
        ease: 'p1-inOut',
        onUpdate: () => camera.lookAt(preset.target[0], preset.target[1], preset.target[2]),
      });
    } else {
      gsap.to(
        {},
        {
          duration: 1.2,
          ease: 'p1-inOut',
          onUpdate: () => camera.lookAt(preset.target[0], preset.target[1], preset.target[2]),
        },
      );
    }
  }, [cam, camera, controls]);
  return null;
}

export function Viewer3D({ product }: { product: Product }) {
  const [cam, setCam] = useState<CamKey>('FRENTE');
  const [interacted, setInteracted] = useState(false);
  const [hiPerf, setHiPerf] = useState(true);
  const firstImg = product.images[0];

  return (
    <div
      className="relative w-full h-[100dvh] md:h-full bg-[var(--bg-void)] overflow-hidden"
      onPointerDown={() => setInteracted(true)}
    >
      <Canvas
        shadows
        dpr={hiPerf ? [1, 2] : [1, 1.5]}
        camera={{ position: CAMERA_PRESETS.FRENTE.position, fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor onIncline={() => setHiPerf(true)} onDecline={() => setHiPerf(false)} />
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.4} />
        </Suspense>
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 3]} intensity={0.6} castShadow />
        <pointLight position={[-3, 1, 2]} intensity={1.2} color="#CCFF00" distance={5} />
        <pointLight position={[3, -1, -2]} intensity={0.8} color="#FF1F6A" distance={4} />
        <ContactShadows position={[0, -1.0, 0]} opacity={0.45} scale={4} blur={2.4} far={1.2} />
        <PresentationControls
          global
          polar={[-Math.PI / 8, Math.PI / 8]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
          snap={false}
        >
          {firstImg ? <ProductBillboard src={firstImg.src} hasInteracted={interacted} /> : null}
        </PresentationControls>
        <Sparkles count={80} scale={3} size={2} speed={0.3} color="#F5F1E8" opacity={0.4} />
        <CameraRig cam={cam} />
        {hiPerf ? (
          <EffectComposer>
            <DepthOfField focusDistance={0.012} focalLength={0.025} bokehScale={2} />
            <Bloom intensity={0.7} luminanceThreshold={0.85} luminanceSmoothing={0.4} />
            <Noise opacity={0.04} />
          </EffectComposer>
        ) : (
          <EffectComposer>
            <Noise opacity={0.04} />
          </EffectComposer>
        )}
      </Canvas>

      {/* HUD */}
      <div className="absolute bottom-6 left-6 font-mono text-micro uppercase tracking-[0.18em] text-[var(--ink-mute)] pointer-events-none">
        ARRASTRA · ZOOM · DETALLE 1.0×
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-display tracking-[-0.04em] text-[var(--ink)] mix-blend-difference pointer-events-none">
        {product.edition}
      </div>

      {/* Botones de cámara */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-3">
        {(Object.keys(CAMERA_PRESETS) as CamKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCam(key)}
            data-cursor="button"
            aria-pressed={cam === key}
            className={`font-mono text-micro uppercase tracking-[0.18em] px-3 py-1 transition-colors ${
              cam === key ? 'text-[var(--acid)]' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
