/**
 * scripts/render-assembly-video.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Produces the complete 1080p 30 FPS H.264 MP4 video: storage-bed-assembly.mp4
 *
 * Sequence:
 *   1. Exploded 3D view intro (components separated, converging)
 *   2. Complete 12-step assembly process with hardware & camera tracking
 *   3. Gas lift mechanism opening & closing showcase
 *   4. Full 360-degree orbital showcase of the assembled bed
 */

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs";
import path from "node:path";

const FFMPEG_PATH =
  "C:\\Users\\Mohamed Seif\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.1-full_build\\bin\\ffmpeg.exe";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "public";
const FRAMES_DIR = path.join(OUTPUT_DIR, "assembly_frames");
const OUTPUT_MP4 = path.join(OUTPUT_DIR, "storage-bed-assembly.mp4");

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
  console.log("=== Fanus WoodTech: 3D Storage Bed Assembly Full Video Production ===");

  if (!fs.existsSync(FRAMES_DIR)) {
    fs.mkdirSync(FRAMES_DIR, { recursive: true });
  } else {
    // Clear old frames
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

  console.log("3D Scene loaded. Generating continuous 1080p frame sequence...");
  await sleep(1000);

  /**
   * Total animation sequence: 480 continuous frames @ 30 FPS = 16 seconds
   * 
   * Segment 1 (Frames 0..40): Exploded View Intro (expRatio 1.0 -> 0.0)
   * Segment 2 (Frames 41..320): 12 Step Assembly Sequence (step 1 to 12, each ~23 frames)
   * Segment 3 (Frames 321..380): Gas Lift Opening & Closing (openRatio 0.0 -> 0.85 -> 0.0)
   * Segment 4 (Frames 381..480): 360-Degree Orbital Showcase (camRot 0 -> 2*PI)
   */
  const TOTAL_FRAMES = 480;

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    let step = 12;
    let progress = 1.0;
    let openRatio = 0.0;
    let camRot = 0.0;
    let expRatio = 0.0;

    if (f <= 40) {
      // 1. Exploded view intro
      step = 12;
      const t = f / 40;
      expRatio = (1 - t);
      camRot = t * 0.25;
    } else if (f <= 320) {
      // 2. 12 Assembly steps
      const t = (f - 40) / (320 - 40); // 0.0 to 1.0
      const exactStep = 1 + t * 11;
      step = Math.min(12, Math.floor(exactStep));
      progress = exactStep - Math.floor(exactStep);
      // Small camera panning per step
      camRot = 0.25 + (step * 0.12) + (progress * 0.06);
    } else if (f <= 380) {
      // 3. Bed opening and closing
      step = 12;
      const t = (f - 320) / (380 - 320); // 0.0 to 1.0
      openRatio = Math.sin(t * Math.PI) * 0.85;
      camRot = 1.8 + t * 0.35;
    } else {
      // 4. 360 orbital showcase
      step = 12;
      const t = (f - 380) / (TOTAL_FRAMES - 380); // 0.0 to 1.0
      camRot = 2.15 + t * (Math.PI * 2);
    }

    // Call window.renderAssemblyFrame
    await cdp.send("Runtime.evaluate", {
      expression: `window.renderAssemblyFrame(${step}, ${progress.toFixed(3)}, ${openRatio.toFixed(3)}, ${camRot.toFixed(3)}, ${expRatio.toFixed(3)})`,
    });

    await sleep(35);

    const shot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    const frameFile = path.join(
      FRAMES_DIR,
      `frame_${String(f).padStart(4, "0")}.png`
    );
    fs.writeFileSync(frameFile, Buffer.from(shot.data, "base64"));

    if (f % 40 === 0 || f === TOTAL_FRAMES - 1) {
      const pct = Math.round((f / TOTAL_FRAMES) * 100);
      console.log(`  [Frame ${f}/${TOTAL_FRAMES}] ${pct}% rendered (Step: ${step}, Exp: ${expRatio.toFixed(2)})`);
    }
  }

  cdp.ws.close();
  chromeProcess.kill();

  console.log(`\n[4/4] Encoding ${TOTAL_FRAMES} frames into 1080p 30 FPS MP4 via FFmpeg...`);

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG_PATH, [
      "-y",
      "-framerate", "30",
      "-i", path.join(FRAMES_DIR, "frame_%04d.png"),
      "-c:v", "libx264",
      "-pix_fmt", "yuv420p",
      "-crf", "19",
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
  console.log(`1080p Assembly Video successfully generated!`);
  console.log(`Path: ${OUTPUT_MP4}`);
  console.log(`Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`======================================================`);
}

main().catch((err) => {
  console.error("Video rendering failed:", err);
  process.exit(1);
});
