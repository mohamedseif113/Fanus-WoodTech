"use client";

/**
 * CADScrewInstallationScene.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Technical CAD Furniture Assembly Animation — Proof of Concept
 * 
 * Accurately reproduces the reference image technical CAD viewport style:
 * - Pure graphite CAD background ([+] [Perspective] [Standard] [Edged Faces])
 * - Smooth white/light-gray furniture panels with crisp black edge outlines
 * - ZERO z-fighting or shadow artifacts (uses polygonOffset on edge outlines)
 * - Authentic 3.9 x 19 mm pan-head screw (Şapkalı Akıllı Vida -5) driving & rotating
 * - Stamped 150 mm corner bracket
 * - Elegant in-scene technical annotations (18 mm, 85 mm, 20 mm) with leader lines
 *   and precision callout circles matching the reference image.
 */

import React, { useRef } from "react";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

// ── CAD Engineering Palette ──────────────────────────────────────────────────
const CAD_PANEL_FACE = "#eaecef";       // Clean off-white/light-gray matte panel
const CAD_PANEL_SIDE = "#d5d9e0";       // Distinct side facet
const CAD_EDGE_LINE = "#0a0a0c";        // Sharp black CAD edge lines
const CAD_BRACKET_FACE = "#606b7b";     // Stamped dark steel metal fitting
const CAD_SCREW_METAL = "#8c96a4";      // Metallic steel screw
const CAD_HOLE_INTERIOR = "#181a1f";    // Milled hole interior

// Helper to create an edged box with zero z-fighting using LineSegments
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
  const geom = React.useMemo(() => new THREE.BoxGeometry(...args), [args]);
  const edgesGeom = React.useMemo(() => new THREE.EdgesGeometry(geom, 15), [geom]);

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geom}>
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.02}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {showEdges && (
        <lineSegments geometry={edgesGeom}>
          <lineBasicMaterial color={CAD_EDGE_LINE} linewidth={1.5} />
        </lineSegments>
      )}
    </group>
  );
}

// ── Fastener: 3.9 x 19 mm Self-Drilling Screw (-5) ───────────────────────────
interface ScrewProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  driveProgress: number; // 0.0 (retracted) -> 1.0 (tightened)
  showCallout?: boolean;
}

export function CADScrew({
  position,
  rotation = [0, 0, 0],
  driveProgress,
  showCallout = false,
}: ScrewProps) {
  const spinningRef = useRef<THREE.Group>(null);

  // Retraction distance: starts 50 mm out, drives flush into countersink
  const travelOffset = (1 - driveProgress) * 0.05;
  // Rotation: spins 8 full turns during driving
  const spinAngle = driveProgress * Math.PI * 16;

  return (
    <group position={position} rotation={rotation}>
      <group position={[0, 0, travelOffset]}>
        <group ref={spinningRef} rotation={[0, 0, spinAngle]}>
          {/* Pan head dome & washer flange */}
          <mesh position={[0, 0, 0.0012]}>
            <cylinderGeometry args={[0.0042, 0.0042, 0.0016, 24]} />
            <meshStandardMaterial color={CAD_SCREW_METAL} metalness={0.8} roughness={0.25} />
          </mesh>

          {/* Cross drive recess (Phillips/Pozi) */}
          <mesh position={[0, 0, 0.0021]}>
            <boxGeometry args={[0.0042, 0.001, 0.0006]} />
            <meshBasicMaterial color="#111317" />
          </mesh>
          <mesh position={[0, 0, 0.0021]}>
            <boxGeometry args={[0.001, 0.0042, 0.0006]} />
            <meshBasicMaterial color="#111317" />
          </mesh>

          {/* Screw Shank (19 mm length = 0.019m) */}
          <mesh position={[0, 0, -0.0095]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.00195, 0.00195, 0.019, 16]} />
            <meshStandardMaterial color={CAD_SCREW_METAL} metalness={0.85} roughness={0.3} />
          </mesh>

          {/* Thread rings */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <mesh
              key={i}
              position={[0, 0, -0.003 - i * 0.0022]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[0.0021, 0.0003, 6, 16]} />
              <meshStandardMaterial color="#47505d" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}

          {/* Pointed drill tip */}
          <mesh position={[0, 0, -0.0195]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.00195, 0.0035, 16]} />
            <meshStandardMaterial color={CAD_SCREW_METAL} metalness={0.85} roughness={0.3} />
          </mesh>
        </group>

        {/* Technical Callout Badge for Screw */}
        {showCallout && driveProgress < 0.88 && (
          <group position={[0.008, 0.015, 0.006]}>
            <Billboard follow>
              <Text
                position={[0.024, 0.003, 0]}
                fontSize={0.0055}
                color="#f8fafc"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                outlineWidth={0.0008}
                outlineColor="#090a0f"
              >
                {"Vida 3.9 x 19 (-5)"}
              </Text>
            </Billboard>
            {/* Fine leader line */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...createLineGeometry([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0.012, 0.012, 0),
                ])}
              />
              <lineBasicMaterial attach="material" color="#38bdf8" linewidth={1.5} />
            </line>
          </group>
        )}
      </group>
    </group>
  );
}

// ── Pilot Drill Hole ─────────────────────────────────────────────────────────
function PilotHole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cylindrical bore cavity */}
      <mesh position={[0, 0, -0.007]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.014, 20]} />
        <meshBasicMaterial color={CAD_HOLE_INTERIOR} />
      </mesh>
      {/* Entry chamfer ring */}
      <mesh position={[0, 0, 0.0002]}>
        <ringGeometry args={[0.00195, 0.0027, 24]} />
        <meshBasicMaterial color="#a0aab8" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function createLineGeometry(points: THREE.Vector3[]) {
  return new THREE.BufferGeometry().setFromPoints(points);
}

// ── Sleek In-Scene Technical Measurement Line (Matching Reference Video) ─────
interface DimensionProps {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
  offset?: [number, number, number];
  showHoleCircle?: boolean;
}

function CADMeasurementLine({
  start,
  end,
  label,
  offset = [0, 0, 0],
  showHoleCircle = false,
}: DimensionProps) {
  const p1 = new THREE.Vector3(...start).add(new THREE.Vector3(...offset));
  const p2 = new THREE.Vector3(...end).add(new THREE.Vector3(...offset));
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

  const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
  const normal = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
  const tickLen = 0.0035;

  const ext1 = [new THREE.Vector3(...start), p1];
  const ext2 = [new THREE.Vector3(...end), p2];

  const tick1a = p1.clone().add(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(tickLen * 0.4));
  const tick1b = p1.clone().add(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(-tickLen * 0.4));
  const tick2a = p2.clone().sub(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(tickLen * 0.4));
  const tick2b = p2.clone().sub(dir.clone().multiplyScalar(tickLen)).add(normal.clone().multiplyScalar(-tickLen * 0.4));

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
        <lineBasicMaterial attach="material" color="#0f172a" linewidth={1.5} />
      </line>

      {/* Arrows / Ticks */}
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry([tick1a, p1, tick1b])} />
        <lineBasicMaterial attach="material" color="#0f172a" linewidth={2} />
      </line>
      <line>
        <bufferGeometry attach="geometry" {...createLineGeometry([tick2a, p2, tick2b])} />
        <lineBasicMaterial attach="material" color="#0f172a" linewidth={2} />
      </line>

      {/* Circular ring around target hole (like in reference image) */}
      {showHoleCircle && (
        <mesh position={[start[0], start[1], start[2] + 0.001]}>
          <ringGeometry args={[0.0048, 0.0055, 32]} />
          <meshBasicMaterial color="#0f172a" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Sleek, readable CAD text */}
      <group position={[mid.x, mid.y, mid.z]}>
        <Billboard follow>
          <Text
            fontSize={0.0068}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            outlineWidth={0.0008}
            outlineColor="#ffffff"
          >
            {label}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

// ── Metal Corner Angle Bracket (150 mm) ──────────────────────────────────────
interface CornerBracketProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  bracketProgress: number; // 0.0 -> 1.0
}

function CornerAngleBracket({
  position,
  rotation = [0, 0, 0],
  bracketProgress,
}: CornerBracketProps) {
  const slideOffset = (1 - bracketProgress) * 0.035;

  return (
    <group position={position} rotation={rotation}>
      <group position={[0, 0, slideOffset]}>
        {/* Face A (flange against Headboard) */}
        <EdgedBox
          args={[0.032, 0.15, 0.002]}
          color={CAD_BRACKET_FACE}
          position={[0.016, 0.075, 0.001]}
        />

        {/* Face B (flange against Sideboard) */}
        <EdgedBox
          args={[0.002, 0.15, 0.032]}
          color={CAD_BRACKET_FACE}
          position={[-0.001, 0.075, 0.016]}
        />

        {/* Countersunk screw mounting holes on Face A */}
        <mesh position={[0.018, 0.02, 0.0022]}>
          <ringGeometry args={[0.0022, 0.0036, 24]} />
          <meshBasicMaterial color="#1e293b" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.018, 0.105, 0.0022]}>
          <ringGeometry args={[0.0022, 0.0036, 24]} />
          <meshBasicMaterial color="#1e293b" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// ── Main Proof of Concept 3D Assembly Scene ──────────────────────────────────
export interface CADAssemblySceneProps {
  screwProgress?: number;      // 0.0 -> 1.0
  bracketProgress?: number;    // 0.0 -> 1.0
  showDimensions?: boolean;
  showEdges?: boolean;
}

export function CADScrewInstallationScene({
  screwProgress = 1.0,
  bracketProgress = 1.0,
  showDimensions = true,
  showEdges = true,
}: CADAssemblySceneProps) {
  const THICKNESS = 0.018; // 18 mm chipboard per PDF

  return (
    <group position={[-0.01, -0.02, 0]}>
      {/* ── 1. Vertical Headboard Panel (Back Board) ───────────────────────── */}
      <EdgedBox
        args={[0.22, 0.24, THICKNESS]}
        color={CAD_PANEL_FACE}
        position={[0.11, 0.12, -THICKNESS / 2]}
        showEdges={showEdges}
      />

      {/* ── 2. Connecting Horizontal Sideboard Panel (Left Board) ──────────── */}
      <EdgedBox
        args={[THICKNESS, 0.24, 0.22]}
        color={CAD_PANEL_SIDE}
        position={[-THICKNESS / 2, 0.12, 0.11]}
        showEdges={showEdges}
      />

      {/* ── 3. Exact PDF Pilot Holes on Headboard ────────────────────────────── */}
      <PilotHole position={[0.018, 0.02, 0]} />
      <PilotHole position={[0.018, 0.105, 0]} />

      {/* ── 4. Metal Corner Angle Bracket (150 mm) ─────────────────────────── */}
      <CornerAngleBracket
        position={[0, 0, 0]}
        bracketProgress={bracketProgress}
      />

      {/* ── 5. Screws (-5: 3.9 x 19 mm Akıllı Vida) ──────────────────────────── */}
      {/* Lower Screw at 20 mm */}
      <CADScrew
        position={[0.018, 0.02, 0.002]}
        rotation={[0, 0, 0]}
        driveProgress={screwProgress}
        showCallout={showDimensions}
      />

      {/* Upper Screw at 105 mm (85 mm pitch) */}
      <CADScrew
        position={[0.018, 0.105, 0.002]}
        rotation={[0, 0, 0]}
        driveProgress={screwProgress}
        showCallout={false}
      />

      {/* ── 6. In-Scene CAD Technical Dimension Lines (Matching Reference) ──── */}
      {showDimensions && (
        <group>
          {/* Dimension: 18 mm from edge to screw centerline */}
          <CADMeasurementLine
            start={[0.0, 0.105, 0.004]}
            end={[0.018, 0.105, 0.004]}
            label="18 mm"
            offset={[0, 0.022, 0.002]}
            showHoleCircle={true}
          />

          {/* Dimension: 85 mm vertical pitch between screw centers */}
          <CADMeasurementLine
            start={[0.018, 0.02, 0.004]}
            end={[0.018, 0.105, 0.004]}
            label="85 mm"
            offset={[0.032, 0, 0.002]}
          />

          {/* Dimension: 20 mm clearance from bottom edge */}
          <CADMeasurementLine
            start={[0.018, 0.0, 0.004]}
            end={[0.018, 0.02, 0.004]}
            label="20 mm"
            offset={[0.032, 0, 0.002]}
          />

          {/* Bracket Label */}
          <group position={[-0.018, 0.165, 0.02]}>
            <Billboard follow>
              <Text
                fontSize={0.0055}
                color="#0284c7"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                outlineWidth={0.0008}
                outlineColor="#ffffff"
              >
                {"Köşe Sacı (150 mm)"}
              </Text>
            </Billboard>
            <line>
              <bufferGeometry
                attach="geometry"
                {...createLineGeometry([
                  new THREE.Vector3(0, -0.008, 0),
                  new THREE.Vector3(0.018, -0.02, -0.01),
                ])}
              />
              <lineBasicMaterial attach="material" color="#0284c7" linewidth={1.5} />
            </line>
          </group>
        </group>
      )}

      {/* ── 7. Subtle CAD Floor Grid ────────────────────────────────────────── */}
      <gridHelper
        args={[0.6, 12, "#333742", "#22252c"]}
        position={[0.05, -0.001, 0.05]}
      />
    </group>
  );
}

// ── Orbit Controls for Inspection ────────────────────────────────────────────
export function CADCameraController() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={0.08}
      maxDistance={0.9}
      target={[0.04, 0.08, 0.03]}
    />
  );
}
