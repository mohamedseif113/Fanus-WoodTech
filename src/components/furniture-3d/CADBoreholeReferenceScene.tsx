"use client";

/**
 * CADBoreholeReferenceScene.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Technical CAD Reference View — Exact Reproduction of YouTube Video (0:22 / 2:05)
 * 
 * Accurately reproduces:
 * - Viewport: [+] [Perspective] [Standard] [Edged Faces]
 * - Clean white timber panel with top-corner notch cutout (4,5 cm x 6,5 cm)
 * - Milled corner borehole with circular callout ring and leader pointer
 * - Extension dimension lines: "4,5 cm" horizontal and "6,5 cm" vertical
 * - Circular metal flange connector with center hole and 4 countersunk perimeter screws
 * - Vertical latch / hinge fitting with dual screws
 * - Horizontal connecting profile rail with top channel groove & pilot hole
 * - Edged faces rendering with zero z-fighting (polygonOffset + LineSegments)
 */

import React, { useMemo, useRef } from "react";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

// ── Technical CAD Materials Palette ─────────────────────────────────────────
const CAD_WHITE_PANEL = "#f3f4f6";     // Smooth matte white timber
const CAD_WHITE_EDGE = "#090a0f";      // Sharp black CAD contour lines
const CAD_BEAM_FACE = "#e2e5e9";       // Connecting horizontal profile
const CAD_METAL_DARK = "#4b5563";      // Gunmetal steel for fittings
const CAD_METAL_CHROME = "#9ca3af";    // Bright steel for screws and latch pin
const CAD_HOLE_INTERIOR = "#181a1f";   // Deep milled hole interior

function EdgedBox({
  args,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  showEdges = true,
}: {
  args: [number, number, number];
  color: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  showEdges?: boolean;
}) {
  const geom = useMemo(() => new THREE.BoxGeometry(...args), [args]);
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(geom, 15), [geom]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geom}>
        <meshStandardMaterial
          color={color}
          roughness={0.92}
          metalness={0.01}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {showEdges && (
        <lineSegments geometry={edgesGeom}>
          <lineBasicMaterial color={CAD_WHITE_EDGE} linewidth={1.5} />
        </lineSegments>
      )}
    </group>
  );
}

function createLineGeometry(points: THREE.Vector3[]) {
  return new THREE.BufferGeometry().setFromPoints(points);
}

// ── Exact Measurement Line Component ─────────────────────────────────────────
interface CADDimLineProps {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  offset?: [number, number, number];
  labelOffset?: [number, number, number];
  showCircleRing?: boolean;
  circleRadius?: number;
}

function CADDimLine({
  start,
  end,
  label,
  offset = [0, 0, 0],
  labelOffset = [0, 0, 0],
  showCircleRing = false,
  circleRadius = 0.006,
}: CADDimLineProps) {
  const p1 = new THREE.Vector3(...start).add(new THREE.Vector3(...offset));
  const p2 = new THREE.Vector3(...end).add(new THREE.Vector3(...offset));
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5).add(new THREE.Vector3(...labelOffset));

  const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
  const normal = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
  const tickLen = 0.0035;

  const ext1 = [new THREE.Vector3(...start), p1];
  const ext2 = [new THREE.Vector3(...end), p2];

  const tick1a = p1.clone().add(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(tickLen * 0.45));
  const tick1b = p1.clone().add(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(-tickLen * 0.45));
  const tick2a = p2.clone().sub(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(tickLen * 0.45));
  const tick2b = p2.clone().sub(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(-tickLen * 0.45));

  return (
    <group>
      {/* Witness lines */}
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry(ext1)} />
        <lineBasicMaterial attach="material" color="#64748b" linewidth={1} />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry(ext2)} />
        <lineBasicMaterial attach="material" color="#64748b" linewidth={1} />
      </line>

      {/* Main dimension line */}
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry([p1, p2])} />
        <lineBasicMaterial attach="material" color="#090a0f" linewidth={1.8} />
      </line>

      {/* Arrows / CAD Ticks */}
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry([tick1a, p1, tick1b])} />
        <lineBasicMaterial attach="material" color="#090a0f" linewidth={2.2} />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry([tick2a, p2, tick2b])} />
        <lineBasicMaterial attach="material" color="#090a0f" linewidth={2.2} />
      </line>

      {/* Circular pointer ring matching YouTube 0:22 */}
      {showCircleRing && (
        <group position={start}>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[circleRadius, circleRadius + 0.0008, 36]} />
            <meshBasicMaterial color="#090a0f" side={THREE.DoubleSide} />
          </mesh>
          {/* Fine pointer line from circle to dimension */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...createLineGeometry([
                new THREE.Vector3(circleRadius * 0.7, circleRadius * 0.7, 0.001),
                new THREE.Vector3(circleRadius * 2.2, circleRadius * 2.2, 0.001),
              ])}
            />
            <lineBasicMaterial attach="material" color="#090a0f" linewidth={1.5} />
          </line>
        </group>
      )}

      {/* Clear, bold CAD text matching the reference typography */}
      <group position={[mid.x, mid.y, mid.z]}>
        <Billboard follow>
          <Text
            fontSize={0.0078}
            color="#090a0f"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.001}
            outlineColor="#ffffff"
          >
            {label}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

// ── Circular Metal Flange / Connector Plate (as seen in reference 0:22) ──────
function FlangeFitting({ position }: { position: [number, number, number] }) {
  const outerR = 0.016; // 32 mm diameter
  const centerR = 0.004; // 8 mm center bore
  const screwPCD = 0.011; // pitch circle for screws

  return (
    <group position={position}>
      {/* Main Flange Disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[outerR, outerR, 0.002, 32]} />
        <meshStandardMaterial color={CAD_METAL_DARK} metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Outer edge ring */}
      <mesh position={[0, 0, 0.0011]}>
        <ringGeometry args={[outerR - 0.0006, outerR, 32]} />
        <meshBasicMaterial color="#090a0f" side={THREE.DoubleSide} />
      </mesh>

      {/* Center Socket Hole */}
      <mesh position={[0, 0, 0.0012]}>
        <ringGeometry args={[0, centerR, 24]} />
        <meshBasicMaterial color={CAD_HOLE_INTERIOR} side={THREE.DoubleSide} />
      </mesh>

      {/* 4 Perimeter Countersink Screw Holes */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const sx = Math.cos(angle) * screwPCD;
        const sy = Math.sin(angle) * screwPCD;
        return (
          <group key={idx} position={[sx, sy, 0.0012]}>
            {/* Hole */}
            <mesh>
              <ringGeometry args={[0, 0.0018, 16]} />
              <meshBasicMaterial color={CAD_HOLE_INTERIOR} side={THREE.DoubleSide} />
            </mesh>
            {/* Screw head cross */}
            <mesh position={[0, 0, 0.0001]}>
              <ringGeometry args={[0.0015, 0.0022, 16]} />
              <meshBasicMaterial color={CAD_METAL_CHROME} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ── Metal Latch / Hinge Fitting (as seen in reference 0:22) ──────────────────
function MetalLatchFitting({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base mounting plate */}
      <EdgedBox
        args={[0.010, 0.038, 0.0025]}
        color={CAD_METAL_DARK}
        position={[0, 0, 0.00125]}
      />

      {/* Cylindrical hinge/pin barrel */}
      <mesh position={[0, 0, 0.005]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.022, 16]} />
        <meshStandardMaterial color={CAD_METAL_CHROME} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Top and Bottom Screws */}
      <group position={[0, 0.012, 0.0026]}>
        <mesh>
          <ringGeometry args={[0, 0.0016, 16]} />
          <meshBasicMaterial color={CAD_HOLE_INTERIOR} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[0, -0.012, 0.0026]}>
        <mesh>
          <ringGeometry args={[0, 0.0016, 16]} />
          <meshBasicMaterial color={CAD_HOLE_INTERIOR} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ── Main Scene Component ─────────────────────────────────────────────────────
export interface CADBoreholeReferenceSceneProps {
  showDimensions?: boolean;
  showEdges?: boolean;
}

export function CADBoreholeReferenceScene({
  showDimensions = true,
  showEdges = true,
}: CADBoreholeReferenceSceneProps) {
  const THICKNESS = 0.018;   // 18 mm chipboard
  const NOTCH_W = 0.045;     // 4.5 cm notch width
  const NOTCH_H = 0.065;     // 6.5 cm notch depth
  const PANEL_W = 0.16;      // 16 cm total panel width
  const PANEL_H = 0.28;      // 28 cm panel height

  return (
    <group position={[-0.03, -0.05, 0]}>
      {/* ── 1. Vertical White Timber Panel with Notch ────────────────────────── */}
      {/* Lower full-width body */}
      <EdgedBox
        args={[PANEL_W, PANEL_H - NOTCH_H, THICKNESS]}
        color={CAD_WHITE_PANEL}
        position={[PANEL_W / 2, (PANEL_H - NOTCH_H) / 2, 0]}
        showEdges={showEdges}
      />

      {/* Upper right extension (past the notch) */}
      <EdgedBox
        args={[PANEL_W - NOTCH_W, NOTCH_H, THICKNESS]}
        color={CAD_WHITE_PANEL}
        position={[NOTCH_W + (PANEL_W - NOTCH_W) / 2, PANEL_H - NOTCH_H / 2, 0]}
        showEdges={showEdges}
      />

      {/* Left side face bevel / chamfer matching camera perspective */}
      <EdgedBox
        args={[THICKNESS, PANEL_H, 0.12]}
        color={CAD_WHITE_PANEL}
        position={[-THICKNESS / 2, PANEL_H / 2, -0.06 + THICKNESS / 2]}
        showEdges={showEdges}
      />

      {/* Milled cylindrical recess / borehole at inner notch corner */}
      <group position={[NOTCH_W, PANEL_H - NOTCH_H, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.010, 0.010, THICKNESS * 1.05, 32]} />
          <meshBasicMaterial color={CAD_HOLE_INTERIOR} />
        </mesh>
        {/* Chamfer edge line */}
        <mesh position={[0, 0, THICKNESS / 2 + 0.0002]}>
          <ringGeometry args={[0.0095, 0.0105, 32]} />
          <meshBasicMaterial color="#090a0f" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── 2. Horizontal Connecting Profile Rail ────────────────────────────── */}
      <group position={[NOTCH_W, PANEL_H - NOTCH_H + 0.02, 0]}>
        {/* Main rail beam */}
        <EdgedBox
          args={[0.26, 0.040, 0.060]}
          color={CAD_BEAM_FACE}
          position={[0.13, 0, 0.03 - THICKNESS / 2]}
          showEdges={showEdges}
        />

        {/* Top longitudinal groove / channel */}
        <EdgedBox
          args={[0.24, 0.010, 0.024]}
          color="#cfd3da"
          position={[0.13, 0.020, 0.03 - THICKNESS / 2]}
          showEdges={showEdges}
        />

        {/* Screw / bolt mounting hole on top face */}
        <group position={[0.11, 0.0205, 0.03 - THICKNESS / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0, 0.0035, 24]} />
            <meshBasicMaterial color={CAD_HOLE_INTERIOR} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.0001]}>
            <ringGeometry args={[0.0035, 0.0045, 24]} />
            <meshBasicMaterial color="#090a0f" side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ── 3. Metal Hardware Fittings (Matching Reference 0:22) ─────────────── */}
      {/* Circular Flange Connector */}
      <FlangeFitting position={[0.082, PANEL_H - NOTCH_H - 0.045, THICKNESS / 2 + 0.0005]} />

      {/* Vertical Metal Latch / Hinge Fitting */}
      <MetalLatchFitting position={[0.132, PANEL_H - NOTCH_H - 0.075, THICKNESS / 2 + 0.0005]} />

      {/* ── 4. Technical CAD Measurements & Leader Lines ─────────────────────── */}
      {showDimensions && (
        <group>
          {/* Horizontal Dimension: "4,5 cm" */}
          <CADDimLine
            start={[0.0, PANEL_H - NOTCH_H, THICKNESS / 2 + 0.003]}
            end={[NOTCH_W, PANEL_H - NOTCH_H, THICKNESS / 2 + 0.003]}
            label="4,5 cm"
            offset={[0, -0.018, 0]}
            showCircleRing={true}
            circleRadius={0.007}
          />

          {/* Vertical Dimension: "6,5 cm" */}
          <CADDimLine
            start={[NOTCH_W, PANEL_H - NOTCH_H, THICKNESS / 2 + 0.003]}
            end={[NOTCH_W, PANEL_H, THICKNESS / 2 + 0.003]}
            label="6,5 cm"
            offset={[0.016, 0, 0]}
            labelOffset={[0.008, 0, 0]}
          />
        </group>
      )}

      {/* ── 5. Dark CAD Ground Grid ──────────────────────────────────────────── */}
      <gridHelper
        args={[0.8, 16, "#333742", "#22252c"]}
        position={[0.1, -0.001, 0]}
      />
    </group>
  );
}

// ── Camera Controller Optimized for the 0:22 Perspective View ───────────────
export function CADBoreholeCameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={0.12}
      maxDistance={0.9}
      target={[0.05, 0.16, 0.02]}
    />
  );
}
