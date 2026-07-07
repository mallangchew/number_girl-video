const canvas = document.querySelector("#digits");
const ctx = canvas.getContext("2d", { alpha: true });
const sourceImage = document.querySelector(".angel-art");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const maskCanvas = document.createElement("canvas");
const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
const digitGlyphs = "0123456789".split("");
const looseGlyphs = "00112233445566778899".split("");
const maskPoints = [];
const rainColumns = [];
const pointer = {
  x: 0,
  y: 0,
  active: false,
  radius: 72,
  strength: 18,
};

let width = 0;
let height = 0;
let ratio = 1;
let frame = 0;
let cellX = 6;
let cellY = 8;

function random(min, max) {
  return min + Math.random() * (max - min);
}

function coverRect(imageWidth, imageHeight, targetWidth, targetHeight) {
  const scale = Math.max(targetWidth / imageWidth, targetHeight / imageHeight);
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;

  return {
    x: (targetWidth - drawWidth) / 2,
    y: (targetHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  };
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  cellX = Math.max(5, Math.round(width / 64));
  cellY = Math.max(7, Math.round(height / 104));
  rebuildMask();
  seedRainColumns();
}

function rebuildMask() {
  if (Array.isArray(window.ANGEL_MASK_POINTS) && window.ANGEL_MASK_POINTS.length > 0) {
    rebuildMaskFromEmbeddedData();
    return;
  }

  if (!sourceImage.complete || !sourceImage.naturalWidth) {
    return;
  }

  maskPoints.length = 0;
  maskCanvas.width = Math.max(1, Math.floor(width));
  maskCanvas.height = Math.max(1, Math.floor(height));
  maskCtx.clearRect(0, 0, width, height);
  maskCtx.filter = "grayscale(1) contrast(1.38) brightness(1.04)";

  const rect = coverRect(sourceImage.naturalWidth, sourceImage.naturalHeight, width, height);
  maskCtx.drawImage(sourceImage, rect.x, rect.y, rect.width, rect.height);
  let data;

  try {
    ({ data } = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height));
  } catch {
    rebuildFallbackMask();
    return;
  }

  for (let y = cellY; y < height - cellY; y += cellY) {
    for (let x = cellX; x < width - cellX; x += cellX) {
      const index = ((Math.floor(y) * maskCanvas.width) + Math.floor(x)) * 4;
      const brightness = (data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114) / 255;
      const leftBias = x < width * 0.58 ? 1 : 0.54;
      const threshold = x < width * 0.5 ? 0.08 : 0.16;

      if (brightness * leftBias > threshold) {
        maskPoints.push({
          x,
          y,
          brightness,
          glyph: digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)],
          phase: random(0, Math.PI * 2),
          size: random(cellY * 0.74, cellY * 0.98),
          edge: random(-0.8, 0.8),
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
        });
      }
    }
  }
}

function rebuildMaskFromEmbeddedData() {
  maskPoints.length = 0;

  for (const [xNorm, yNorm, brightness] of window.ANGEL_MASK_POINTS) {
    maskPoints.push({
      x: xNorm * width,
      y: yNorm * height,
      brightness,
      glyph: digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)],
      phase: random(0, Math.PI * 2),
      size: random(cellY * 0.74, cellY * 0.98),
      edge: random(-0.8, 0.8),
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
    });
  }
}

function rebuildFallbackMask() {
  maskPoints.length = 0;

  for (let y = height * 0.06; y < height * 0.88; y += cellY) {
    for (let x = width * 0.05; x < width * 0.64; x += cellX) {
      const face = Math.hypot((x - width * 0.24) / (width * 0.18), (y - height * 0.23) / (height * 0.15));
      const torso = Math.hypot((x - width * 0.23) / (width * 0.2), (y - height * 0.55) / (height * 0.28));
      const shoulder = Math.hypot((x - width * 0.38) / (width * 0.33), (y - height * 0.78) / (height * 0.12));
      const shape = Math.min(face, torso, shoulder);

      if (shape < 1) {
        maskPoints.push({
          x,
          y,
          brightness: Math.max(0.18, 1 - shape),
          glyph: digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)],
          phase: random(0, Math.PI * 2),
          size: random(cellY * 0.74, cellY * 0.98),
          edge: random(-0.8, 0.8),
          dx: 0,
          dy: 0,
          vx: 0,
          vy: 0,
        });
      }
    }
  }
}

function seedRainColumns() {
  rainColumns.length = 0;
  const columns = Math.floor(width / cellX);

  for (let index = 0; index < columns; index += 1) {
    rainColumns.push({
      x: index * cellX + random(-1, 1),
      offset: random(-height, height),
      speed: random(0.18, 0.72),
      alpha: random(0.04, 0.17),
      every: Math.random() > 0.7 ? 1 : 2,
    });
  }
}

function drawBackgroundMatrix() {
  ctx.save();
  ctx.font = `${Math.max(5, cellY * 0.78)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textBaseline = "middle";

  for (const column of rainColumns) {
    column.offset += prefersReducedMotion.matches ? 0 : column.speed;
    if (column.offset > height + cellY * 3) {
      column.offset = random(-height * 0.5, 0);
    }

    for (let y = -cellY * 2; y < height + cellY * 2; y += cellY * column.every) {
      const wrappedY = (y + column.offset + height) % (height + cellY * 4) - cellY * 2;
      const rightFade = column.x > width * 0.54 ? 0.82 : 0.62;
      const gapFade = column.x > width * 0.44 && column.x < width * 0.78 ? 0.52 : 1;
      const pulse = Math.sin(frame * 0.025 + column.x * 0.02 + y * 0.01) * 0.5 + 0.5;
      const alpha = column.alpha * rightFade * gapFade * (0.45 + pulse * 0.55);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#d8d4cc";
      const glyphIndex = (Math.floor((frame + y + column.x) / 9) % digitGlyphs.length + digitGlyphs.length) % digitGlyphs.length;
      ctx.fillText(digitGlyphs[glyphIndex], column.x, wrappedY);
    }
  }

  ctx.restore();
}

function drawAsciiMask() {
  ctx.save();
  ctx.textBaseline = "middle";

  for (const point of maskPoints) {
    updatePointScatter(point);

    const flicker = prefersReducedMotion.matches
      ? 0.72
      : 0.55 + (Math.sin(frame * 0.075 + point.phase) * 0.22) + (Math.random() > 0.975 ? 0.35 : 0);
    const edgeBreak = point.edge + (point.x > width * 0.4 ? Math.sin(frame * 0.04 + point.phase) * 0.55 : 0);
    const verticalNoise = Math.random() > 0.992 ? random(-cellY * 0.55, cellY * 0.55) : 0;
    const alpha = Math.min(0.94, Math.max(0.08, point.brightness * 1.08 * flicker));

    if (Math.random() < 0.055 && !prefersReducedMotion.matches) {
      point.glyph = digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)];
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = point.brightness > 0.7 ? "#fbf7ee" : "#d4cec3";
    ctx.font = `${point.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    ctx.fillText(point.glyph, point.x + point.dx + edgeBreak, point.y + point.dy + verticalNoise);
  }

  ctx.restore();
}

function updatePointScatter(point) {
  if (prefersReducedMotion.matches) {
    return;
  }

  if (pointer.active) {
    const pointX = point.x + point.dx;
    const pointY = point.y + point.dy;
    const deltaX = pointX - pointer.x;
    const deltaY = pointY - pointer.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 0 && distance < pointer.radius) {
      const force = (1 - distance / pointer.radius) ** 2;
      const angle = Math.atan2(deltaY, deltaX);
      point.vx += Math.cos(angle) * force * pointer.strength;
      point.vy += Math.sin(angle) * force * pointer.strength;
    }
  }

  point.vx += -point.dx * 0.09;
  point.vy += -point.dy * 0.09;
  point.vx *= 0.78;
  point.vy *= 0.78;
  point.dx += point.vx;
  point.dy += point.vy;
}

function drawSignalTears() {
  ctx.save();
  ctx.font = `${Math.max(6, cellY * 0.95)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textBaseline = "middle";

  for (let index = 0; index < 28; index += 1) {
    const x = random(width * 0.28, width * 0.6);
    const y = random(height * 0.08, height * 0.86);
    const length = random(2, 9);
    const alpha = random(0.1, 0.32);

    for (let step = 0; step < length; step += 1) {
      ctx.globalAlpha = alpha * (1 - step / length);
      ctx.fillStyle = "#ede8df";
      ctx.fillText(looseGlyphs[Math.floor(Math.random() * looseGlyphs.length)], x + step * cellX, y);
    }
  }

  ctx.restore();
}

function drawReferenceStyleCaptionMarks() {
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#c9c5bd";
  ctx.font = `${Math.max(5, cellY * 0.68)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textBaseline = "middle";

  for (let x = width * 0.06; x < width * 0.38; x += cellX * 1.45) {
    if (Math.random() > 0.32) {
      ctx.fillText(digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)], x, height * 0.93 + random(-2, 2));
    }
  }

  ctx.restore();
}

function render() {
  frame += 1;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  drawBackgroundMatrix();
  drawAsciiMask();

  if (!prefersReducedMotion.matches && frame % 5 === 0) {
    drawSignalTears();
  }

  drawReferenceStyleCaptionMarks();
  requestAnimationFrame(render);
}

function start() {
  resize();
  render();
}

if (sourceImage.complete) {
  start();
} else {
  sourceImage.addEventListener("load", start, { once: true });
}

window.addEventListener("resize", resize);

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
  pointer.active = true;
});

canvas.addEventListener("pointerenter", () => {
  pointer.active = true;
});

canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
});

canvas.addEventListener("pointerdown", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
  pointer.active = true;
  pointer.strength = 30;
});

canvas.addEventListener("pointerup", () => {
  pointer.strength = 18;
});
