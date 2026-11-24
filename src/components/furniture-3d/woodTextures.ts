import * as THREE from "three";
import { WoodMaterial, FinishType } from "@/types/furniture";

// Cache generated textures so we don't recreate them on every render
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getProceduralMaterial(
  material: WoodMaterial,
  finish: FinishType
): THREE.MeshStandardMaterial {
  const cacheKey = `${material}-${finish}`;

  let baseColor: string;
  let roughness: number;
  const metalness = 0.02;

  switch (material) {
    case "oak":
      baseColor = "#c89d66";
      roughness = finish === "gloss" ? 0.2 : finish === "matte" ? 0.75 : 0.45;
      break;
    case "walnut":
      baseColor = "#5d3e2b";
      roughness = finish === "gloss" ? 0.22 : finish === "matte" ? 0.8 : 0.48;
      break;
    case "beech":
      baseColor = "#dfbe99";
      roughness = finish === "gloss" ? 0.18 : finish === "matte" ? 0.7 : 0.42;
      break;
    case "white":
      baseColor = "#f4f3ef";
      roughness = finish === "gloss" ? 0.12 : finish === "matte" ? 0.6 : 0.35;
      break;
    case "black":
      baseColor = "#1a1918";
      roughness = finish === "gloss" ? 0.15 : finish === "matte" ? 0.65 : 0.38;
      break;
    case "anthracite":
      baseColor = "#2d3136";
      roughness = finish === "gloss" ? 0.16 : finish === "matte" ? 0.62 : 0.36;
      break;
  }

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(baseColor),
    roughness,
    metalness,
  });

  // Apply procedural wood grain map for wood finishes
  if (material === "oak" || material === "walnut" || material === "beech") {
    let woodTexture = textureCache.get(cacheKey);
    if (!woodTexture && typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Base fill
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 512, 512);

        // Draw fine organic grain lines
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        for (let i = 0; i < 500; i++) {
          const y = Math.random() * 512;
          const h = 1 + Math.random() * 2;
          ctx.fillRect(0, y, 512, h);
        }

        // Draw wood rings and wavy grain
        ctx.strokeStyle = material === "walnut" ? "rgba(40, 20, 10, 0.15)" : "rgba(80, 50, 20, 0.1)";
        ctx.lineWidth = 1.5;
        for (let j = 0; j < 30; j++) {
          ctx.beginPath();
          const y = j * 18 + Math.random() * 8;
          ctx.moveTo(0, y);
          for (let x = 0; x < 512; x += 32) {
            ctx.quadraticCurveTo(
              x + 16,
              y + Math.sin(x * 0.05 + j) * 8,
              x + 32,
              y + Math.cos(x * 0.02) * 4
            );
          }
          ctx.stroke();
        }

        woodTexture = new THREE.CanvasTexture(canvas);
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;
        woodTexture.repeat.set(2, 4);
        textureCache.set(cacheKey, woodTexture);
      }
    }

    if (woodTexture) {
      mat.map = woodTexture;
      mat.needsUpdate = true;
    }
  }

  return mat;
}
