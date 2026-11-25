/**
 * scripts/render-cad-video.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Produces the complete 1080p 30 FPS MP4 video demonstration of the CAD
 * Edged-Faces Screw Installation (TEK KİŞİLİK YATAY BAZA - Stage 3).
 * Output: public/cad-screw-installation.mp4
 */

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";

const FFMPEG_PATH =
  "C:\\Users\\Mohamed Seif\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.1-full_build\\bin\\ffmpeg.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "public";
const FRAMES_DIR = path.join(OUTPUT_DIR, "cad_frames");
const OUTPUT_MP4 = path.join(OUTPUT_DIR, "cad-screw-installation.mp4");

function createCDPClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const cb = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) cb.reject(new Error(msg.error.message));
      else cb.resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  const waitOpen = () => {
    if (ws.readyState === WebSocket.OPEN) return Promise.resolve();
    return new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
  };

  return { ws, send, waitOpen };
}

async function main() {
  console.log("=== CAD Proof-of-Concept: Screw Installation Video Rendering ===");

  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  } else {
    // Clean old frames
    const oldFiles = fs.readdirSync(FRAMES_DIR);
    for (const f of oldFiles) {
      if (f.endsWith(".png")) fs.unlinkSync(path.join(FRAMES_DIR, f));
    }
  }

  // 1. Launch Chrome Headless
  console.log("[1/4] Launching Chrome Headless at 1920x1080...");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--no-sandbox",
    "--window-size=1920,1080",
    "--hide-scrollbars",
    "about:blank",
  ]);

  await sleep(1500);

  // 2. Connect CDP
  console.log("[2/4] Connecting to Chrome DevTools Protocol...");
  let pages;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const res = await fetch("http://127.0.0.1:9222/json");
      pages = await res.json();
      if (pages && pages.length > 0) break;
    } catch {
      await sleep(400);
    }
  }

  if (!pages || pages.length === 0) {
    throw new Error("Could not find open Chrome pages on port 9222");
  }

  const page = pages.find((p) => p.type === "page") || pages[0];
  const cdp = createCDPClient(page.webSocketDebuggerUrl);
  await cdp.waitOpen();

  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Navigate to cad-render page
  console.log("[3/4] Loading CAD Scene at http://localhost:3000/cad-render...");
  await cdp.send("Page.navigate", { url: "http://localhost:3000/cad-render" });

  for (let i = 0; i < 40; i++) {
    await sleep(400);
    const evalRes = await cdp.send("Runtime.evaluate", {
      expression: "window.isCADRenderReady === true",
      returnByValue: true,
    });
    if (evalRes?.result?.value === true) break;
  }

  console.log("CAD 3D Scene loaded. Generating 1080p frame sequence...");
  await sleep(1000);

  // Render a total of 180 frames at 30 fps = 6.0 seconds animation
  // Phase 1 (0 to 50 frames): Bracket alignment (progress 0.0 -> 0.35)
  // Phase 2 (50 to 140 frames): Screw rotational insertion (progress 0.35 -> 1.0)
  // Phase 3 (140 to 180 frames): Clamped joint inspection & slight orbital swing
  const TOTAL_FRAMES = 180;
  let frameIndex = 0;

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const t = f / (TOTAL_FRAMES - 1);
    let progress = 0;
    let camRot = 0;

    if (f < 50) {
      // Bracket gliding in
      const p = f / 50;
      progress = p * 0.35;
      camRot = 0;
    } else if (f < 140) {
      // Screws driving in and spinning
      const p = (f - 50) / (140 - 50);
      progress = 0.35 + p * 0.65;
      camRot = p * 0.08;
    } else {
      // Inspection hold & subtle perspective orbit
      const p = (f - 140) / (TOTAL_FRAMES - 140);
      progress = 1.0;
      camRot = 0.08 + Math.sin(p * Math.PI) * 0.06;
    }

    // Call evaluate to set frame state
    await cdp.send("Runtime.evaluate", {
      expression: `window.renderCADFrame(${progress.toFixed(4)}, ${camRot.toFixed(4)})`,
    });

    // Wait short delta for WebGL redraw
    await sleep(35);

    // Capture screenshot via CDP
    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    const frameFile = path.join(
      FRAMES_DIR,
      `frame_${String(frameIndex++).padStart(4, "0")}.png`
    );
    fs.writeFileSync(frameFile, Buffer.from(screenshot.data, "base64"));

    if (f % 30 === 0 || f === TOTAL_FRAMES - 1) {
      const pct = Math.round((f / TOTAL_FRAMES) * 100);
      console.log(`  [Frame ${f}/${TOTAL_FRAMES}] ${pct}% rendered (Progress: ${Math.round(progress * 100)}%)`);
    }
  }

  cdp.ws.close();
  chromeProcess.kill();

  console.log(`[4/4] Encoding ${TOTAL_FRAMES} frames to MP4 using FFmpeg...`);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG_PATH, [
      "-y",
      "-framerate", "30",
      "-i", path.join(FRAMES_DIR, "frame_%04d.png"),
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-crf", "18",
      "-preset", "slow",
      "-movflags", "+faststart",
      OUTPUT_MP4,
    ]);

    ffmpeg.stdout.on("data", (d) => process.stdout.write(d));
    ffmpeg.stderr.on("data", (d) => {
      const line = d.toString();
      if (line.includes("frame=") || line.includes("fps=")) {
        process.stdout.write(`\r${line.trim()}`);
      }
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("\nFFmpeg encoding complete!");
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });

  const stats = fs.statSync(OUTPUT_MP4);
  console.log(`\n======================================================`);
  console.log(`CAD Screw Installation MP4 Video successfully generated!`);
  console.log(`Path: ${OUTPUT_MP4}`);
  console.log(`Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`======================================================`);
}

main().catch((err) => {
  console.error("Video rendering failed:", err);
  process.exit(1);
});
