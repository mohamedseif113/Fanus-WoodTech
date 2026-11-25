/**
 * scripts/render-assembly-video.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Produces the complete 1080p 30 FPS H.264 MP4 video: storage-bed-assembly.mp4
 * Captures all 12 assembly steps + intro + outro, then compiles using FFmpeg.
 */

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";

const FFMPEG_PATH =
  "C:\\Users\\Mohamed Seif\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.1-full_build\\bin\\ffmpeg.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "public";
const FRAMES_DIR = path.join(OUTPUT_DIR, "video_frames");
const OUTPUT_MP4 = path.join(OUTPUT_DIR, "storage-bed-assembly.mp4");
const PREVIEW_MP4 = path.join(OUTPUT_DIR, "storage-bed-assembly-preview.mp4");

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
  console.log("=== Fanus WoodTech: 3D Storage Bed Assembly Video Production ===");

  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  }

  // 1. Launch Chrome Headless
  console.log("[1/4] Launching Chrome Headless at 1920x1080...");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--no-sandbox",
    "--disable-gpu",
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

  // Navigate to storage-bed-render
  console.log("[3/4] Loading 3D Scene at http://localhost:3000/storage-bed-render...");
  await cdp.send("Page.navigate", { url: "http://localhost:3000/storage-bed-render" });

  for (let i = 0; i < 40; i++) {
    await sleep(400);
    const evalRes = await cdp.send("Runtime.evaluate", {
      expression: "window.isRenderReady === true",
      returnByValue: true,
    });
    if (evalRes?.result?.value === true) break;
  }

  console.log("3D Scene loaded. Generating instructional keyframes...");
  await sleep(800);

  // Define keyframe shots for all 12 steps
  const keyframes = [
    // Intro
    { step: 0, progress: 0.0, open: 0.0, rot: 0.0, duration: 2.2, label: "Intro" },

    // Step 1: Handles on profile
    { step: 1, progress: 0.4, open: 0.0, rot: 0.0, duration: 0.9, label: "Step 1 (Approach)" },
    { step: 1, progress: 1.0, open: 0.0, rot: 0.1, duration: 1.4, label: "Step 1 (Complete)" },

    // Step 2: Metal base frame assembly
    { step: 2, progress: 0.45, open: 0.0, rot: 0.0, duration: 0.9, label: "Step 2 (Approach)" },
    { step: 2, progress: 1.0, open: 0.0, rot: 0.12, duration: 1.4, label: "Step 2 (Complete)" },

    // Step 3: Wooden box assembly
    { step: 3, progress: 0.45, open: 0.0, rot: 0.0, duration: 0.9, label: "Step 3 (Approach)" },
    { step: 3, progress: 1.0, open: 0.0, rot: 0.12, duration: 1.5, label: "Step 3 (Complete)" },

    // Step 4: Bottom cross tie bars
    { step: 4, progress: 0.45, open: 0.0, rot: 0.0, duration: 0.8, label: "Step 4 (Approach)" },
    { step: 4, progress: 1.0, open: 0.0, rot: 0.1, duration: 1.4, label: "Step 4 (Complete)" },

    // Step 5: Bed base stoppers
    { step: 5, progress: 0.4, open: 0.0, rot: 0.0, duration: 0.8, label: "Step 5 (Approach)" },
    { step: 5, progress: 1.0, open: 0.0, rot: 0.1, duration: 1.4, label: "Step 5 (Complete)" },

    // Step 6: Feet / legs
    { step: 6, progress: 0.4, open: 0.0, rot: 0.0, duration: 0.8, label: "Step 6 (Approach)" },
    { step: 6, progress: 1.0, open: 0.0, rot: 0.12, duration: 1.4, label: "Step 6 (Complete)" },

    // Step 7: Floor mat panels
    { step: 7, progress: 0.45, open: 0.0, rot: 0.0, duration: 0.8, label: "Step 7 (Approach)" },
    { step: 7, progress: 1.0, open: 0.0, rot: 0.12, duration: 1.4, label: "Step 7 (Complete)" },

    // Step 8: Slats assembly
    { step: 8, progress: 0.45, open: 0.0, rot: 0.0, duration: 0.9, label: "Step 8 (Approach)" },
    { step: 8, progress: 1.0, open: 0.0, rot: 0.14, duration: 1.5, label: "Step 8 (Complete)" },

    // Step 9: Scissor mechanisms & gas pistons
    { step: 9, progress: 0.4, open: 0.0, rot: 0.0, duration: 0.9, label: "Step 9 (Approach)" },
    { step: 9, progress: 1.0, open: 0.0, rot: 0.14, duration: 1.5, label: "Step 9 (Complete)" },

    // Step 10: Mattress corner retainers
    { step: 10, progress: 0.4, open: 0.0, rot: 0.0, duration: 0.8, label: "Step 10 (Approach)" },
    { step: 10, progress: 1.0, open: 0.0, rot: 0.1, duration: 1.4, label: "Step 10 (Complete)" },

    // Step 11: Mounting slatted deck to mechanism
    { step: 11, progress: 0.45, open: 0.0, rot: 0.0, duration: 0.9, label: "Step 11 (Approach)" },
    { step: 11, progress: 1.0, open: 0.0, rot: 0.15, duration: 1.6, label: "Step 11 (Complete)" },

    // Step 12: Finished bed opening & closing
    { step: 12, progress: 1.0, open: 0.0, rot: 0.0, duration: 1.2, label: "Step 12 (Closed)" },
    { step: 12, progress: 1.0, open: 0.85, rot: 0.25, duration: 2.2, label: "Step 12 (Open Showcase)" },
    { step: 12, progress: 1.0, open: 0.0, rot: 0.5, duration: 1.5, label: "Step 12 (Closing)" },

    // Outro
    { step: 13, progress: 1.0, open: 0.0, rot: 0.65, duration: 2.5, label: "Outro" },
  ];

  // Capture each keyframe
  const concatListPath = path.join(OUTPUT_DIR, "concat_list.txt");
  let concatContent = "";

  for (let i = 0; i < keyframes.length; i++) {
    const kf = keyframes[i];
    const framePath = path.join(FRAMES_DIR, `frame_${String(i).padStart(3, "0")}.png`);

    await cdp.send("Runtime.evaluate", {
      expression: `window.renderAssemblyFrame(${kf.step}, ${kf.progress}, ${kf.open}, ${kf.rot})`,
    });

    await sleep(250); // let Three.js render frame

    const shot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    const buffer = Buffer.from(shot.data, "base64");
    fs.writeFileSync(framePath, buffer);

    console.log(`[${i + 1}/${keyframes.length}] Captured: ${kf.label} (${kf.duration}s)`);

    // Concat file format for FFmpeg
    const relativePath = path.basename(framePath);
    concatContent += `file 'video_frames/${relativePath}'\nduration ${kf.duration}\n`;
  }

  // Duplicate last frame to prevent truncation in concat demuxer
  const lastFrame = path.basename(path.join(FRAMES_DIR, `frame_${String(keyframes.length - 1).padStart(3, "0")}.png`));
  concatContent += `file 'video_frames/${lastFrame}'\n`;

  fs.writeFileSync(concatListPath, concatContent);

  cdp.ws.close();
  chromeProcess.kill();

  // 4. Encode to 1080p 30 FPS H.264 MP4 using FFmpeg
  console.log(`\n[4/4] Encoding 1080p 30 FPS H.264 MP4 via FFmpeg -> ${OUTPUT_MP4}...`);
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG_PATH, [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", concatListPath,
      "-vf", "fps=30,format=yuv420p",
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "18",
      "-movflags", "+faststart",
      OUTPUT_MP4,
    ]);

    ffmpeg.stderr.on("data", (d) => {
      const s = d.toString();
      if (s.includes("frame=") || s.includes("time=")) {
        process.stdout.write(`\r${s.trim().slice(0, 75)}`);
      }
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });

  if (fs.existsSync(OUTPUT_MP4)) {
    fs.copyFileSync(OUTPUT_MP4, PREVIEW_MP4);
    const stats = fs.statSync(OUTPUT_MP4);
    console.log("\n========================================================");
    console.log("SUCCESS! Video generation complete:");
    console.log(`Path: ${OUTPUT_MP4}`);
    console.log(`Preview: ${PREVIEW_MP4}`);
    console.log(`Resolution: 1920x1080 (Full HD)`);
    console.log(`Framerate: 30 FPS`);
    console.log(`Format: H.264 / MP4`);
    console.log(`Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log("========================================================\n");
  }
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
