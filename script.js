const canvas = document.querySelector("#digits");
const ctx = canvas.getContext("2d", { alpha: true });
const intro = document.querySelector(".archive-intro");
const sourceImage = document.querySelector(".angel-art");
const enterButton = document.querySelector(".archive-enter");
const prologueScene = document.querySelector(".prologue-scene");
const preBroadcastMyth = document.querySelector(".prebroadcast-myth");
const archiveBackButton = document.querySelector(".archive-back");
const prologueEntryButtons = document.querySelectorAll(".prologue-copy");
const doctrineScene = document.querySelector(".doctrine-scene");
const doctrineCloserButtons = document.querySelectorAll("button.doctrine-closer");
const broadcastScene = document.querySelector(".broadcast-scene");
const broadcastCamera = document.querySelector(".broadcast-camera");
const broadcastAdVideo = document.querySelector(".broadcast-ad__video");
const broadcastAdAudio = document.querySelector(".broadcast-ad__audio");
const newsVideo = document.querySelector(".call-news__video");
const broadcastMediaSubtitle = document.querySelector(".broadcast-media-subtitle");
const broadcastCallButtons = document.querySelectorAll(".broadcast-call-target, .broadcast-subtitle-call");
const callSequence = document.querySelector(".call-sequence");
const callSequenceLayers = document.querySelectorAll("[data-call-layer]");
const interviewImages = document.querySelectorAll(".camcorder-frame__image");
const interviewCaptions = document.querySelectorAll(".camcorder-caption");
const callAdvanceButton = document.querySelector(".call-advance-outside");
const callMuteButton = document.querySelector(".call-mute");
const callLiveStatus = document.querySelector(".call-live-status");
const roomScene = document.querySelector(".story-scene--room");
const cityScene = document.querySelector(".story-scene--city");
const cityMythCaption = document.querySelector(".story-scene__myth-caption--city");
const friendsScene = document.querySelector(".story-scene--friends");
const flyerScene = document.querySelector(".story-scene--flyer");
const propagandaCaptionFirst = document.querySelector(".story-propaganda__caption--first");
const mailboxScene = document.querySelector(".story-scene--mailbox");
const mailboxMythCaption = document.querySelector(".story-scene__myth-caption--mailbox");
const mailboxPrompt = document.querySelector(".story-mailbox__prompt");
const mailboxNote = document.querySelector(".story-mailbox__note");
const mailboxMemory = document.querySelector(".story-mailbox__memory");
const mailboxImages = document.querySelectorAll(".story-mailbox__image");
const wishPriceScene = document.querySelector(".story-scene--wish-price");
const wishPriceLineOne = document.querySelector(".wish-price__line--one");
const wishPriceLineTwo = document.querySelector(".wish-price__line--two");
const wishPriceAdvance = document.querySelector(".wish-price__advance");
const mailboxTargets = {
  mailbox: document.querySelector(".story-mailbox__target--box"),
  photo: document.querySelector(".story-mailbox__target--photo"),
};
const roomAdvanceButton = document.querySelector(".story-scene__advance");
const cityAdvanceButton = document.querySelector(".story-scene__city-advance");
const globalNavButtons = document.querySelectorAll(".archive-global-nav__button[data-destination]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const storyPreview = new URLSearchParams(window.location.search).get("preview");
const isBridgePreview = storyPreview === "bridge";
const isPropagandaPreview = storyPreview === "propaganda";
const isMailboxPreview = storyPreview === "mailbox";
const isWishPricePreview = storyPreview === "wish";
const previewStateClasses = ["is-bridge-preview", "is-propaganda-preview", "is-mailbox-preview", "is-wish-preview"];

const layout = intro?.dataset.layout || "portrait";
const isWideDuo = layout === "wide-duo";
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
  radius: 64,
  strength: 12,
};

let width = 0;
let height = 0;
let ratio = 1;
let frame = 0;
let cellX = 6;
let cellY = 8;
let lastRenderTime = 0;

const maxFrameMs = 1000 / 24;
const archiveTimers = [];
const callTimers = [];
const callAudioNodes = new Set();
const callStateClasses = ["is-call-dialing", "is-call-answered", "is-call-ended", "is-love-news", "is-trend-interviews"];
const storyStateClasses = ["is-tv-powering-off", "is-room-revealing", "is-trend-room", "is-city-entering", "is-trend-city", "is-trend-friends", "is-story-ended", "is-coercion-flyer", "is-coercion-final", "is-mailbox-closed", "is-mailbox-open", "is-mailbox-contents", "is-mailbox-back", "is-mailbox-empty", "is-wish-price"];
const wishPricePhaseClasses = ["is-wish-price-cut", "is-wish-price-image-visible", "is-wish-price-line-one", "is-wish-price-line-two", "is-wish-price-awaiting", "is-wish-price-copy-leaving", "is-wish-price-image-leaving", "is-wish-price-ended"];
const canvasFontFamily = '"Arial Narrow", Arial, sans-serif';
const callDialingMs = 2800;
const callAnsweredReadMs = 9600;
const callEndedLockMs = 900;
const roomRingIntervals = [3300, 5200, 4100, 6800];
const newsSubtitleCues = [
  {
    start: 0,
    end: 6.24,
    text: "- 요즘 전국을 휩쓸고 있는 건\n단순한 유행이 아닙니다\n사랑을 향한 하나의 움직임이죠",
  },
  {
    start: 7.05,
    end: 10.95,
    text: "- 전문가들은 사랑의 부적을 다는 것이\n단순한 멋내기 이상의 의미를 지닌다고 말합니다",
  },
  {
    start: 11.38,
    end: 14.44,
    text: "- 마음으로 통하는 모두의 언어를\n받아들이는 일이라는 겁니다",
  },
];
const adSubtitleCues = [
  { start: 9.9, end: 11.96, text: "- 사랑의 힘을 느껴보세요" },
  { start: 12.42, end: 12.98, text: "- 언제든 좋아요" },
  { start: 13.24, end: 13.94, text: "- 지금 전화주세요" },
];
let archiveState = "idle";
let hasEnteredArchive = false;
let ritualStartedFrame = 0;
let callAudioContext = null;
let callAudioGain = null;
let isCallMuted = false;
let callAdvanceMode = null;
let roomRingCount = 0;
let isOpeningBroadcastRunning = false;
let mailboxAction = null;

function random(min, max) {
  return min + Math.random() * (max - min);
}

function smoothstep(edge0, edge1, value) {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));

  return x * x * (3 - 2 * x);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getInnerScatterVector(point) {
  const centerX = Math.max(width * 0.5, 1);
  const centerY = height * 0.52;
  const side = point.x < centerX ? -1 : 1;
  const innerDirection = side === -1 ? 1 : -1;
  const innerNorm = side === -1 ? point.x / centerX : (width - point.x) / centerX;
  const innerBias = smoothstep(0.1, 0.48, innerNorm);
  const verticalAim = (centerY - point.y) / Math.max(height, 1);
  const laneNoise = Math.sin(point.phase * 2.3 + frame * 0.1) * 0.32;

  return {
    innerDirection,
    innerBias,
    verticalAim,
    laneNoise,
  };
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
  ratio = Math.min(window.devicePixelRatio || 1, 1.35);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  cellX = Math.max(5, Math.round(width / 64));
  cellY = Math.max(7, Math.round(height / 104));
  ctx.font = `${Math.max(5, cellY * 0.86)}px ${canvasFontFamily}`;
  rebuildMask();
  seedRainColumns();
}

function rebuildMask() {
  if (Array.isArray(window.ANGEL_MASK_POINTS) && window.ANGEL_MASK_POINTS.length > 0) {
    rebuildMaskFromEmbeddedData();
    return;
  }

  if (!sourceImage || !sourceImage.complete || !sourceImage.naturalWidth) {
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
        if (!shouldKeepMaskPoint(x / width, y / height, brightness, maskPoints.length)) {
          continue;
        }

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

  if (isWideDuo) {
    rebuildWideDuoMaskFromEmbeddedData();
    return;
  }

  for (let index = 0; index < window.ANGEL_MASK_POINTS.length; index += 1) {
    const [xNorm, yNorm, brightness] = window.ANGEL_MASK_POINTS[index];

    if (!shouldKeepMaskPoint(xNorm, yNorm, brightness, index)) {
      continue;
    }

    addMaskPoint(xNorm * width, yNorm * height, brightness);
  }
}

function rebuildWideDuoMaskFromEmbeddedData() {
  const edgeInset = 0.04;
  const topLift = -0.018;
  const verticalScale = 1.06;

  for (let index = 0; index < window.ANGEL_MASK_POINTS.length; index += 1) {
    const [xNorm, yNorm, brightness] = window.ANGEL_MASK_POINTS[index];

    if (!shouldKeepWideDuoPoint(xNorm, yNorm, brightness, index)) {
      continue;
    }

    const y = (topLift + yNorm * verticalScale) * height;

    if (y < -cellY || y > height + cellY) {
      continue;
    }

    const shoulderDepth = Math.min(1, Math.max(0, (yNorm - 0.52) / 0.42));
    const halfWidth = 0.34 - shoulderDepth * 0.08;

    addMaskPoint((edgeInset + xNorm * halfWidth) * width, y, brightness);
    addMaskPoint((1 - edgeInset - xNorm * halfWidth) * width, y, brightness);
  }
}

function addMaskPoint(x, y, brightness) {
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

function shouldKeepMaskPoint(xNorm, yNorm, brightness, index) {
  if (brightness >= 0.5) {
    return true;
  }

  const hash = Math.abs(Math.sin((xNorm * 127.1 + yNorm * 311.7 + index * 0.013) * 43758.5453));

  if (brightness >= 0.26) {
    return hash % 1 < 0.86;
  }

  return hash % 1 < 0.45;
}

function shouldKeepWideDuoPoint(xNorm, yNorm, brightness, index) {
  if (!shouldKeepMaskPoint(xNorm, yNorm, brightness, index)) {
    return false;
  }

  if (xNorm > 0.58 || brightness < 0.18) {
    return false;
  }

  return !(xNorm > 0.44 && brightness < 0.3);
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
  const stepX = cellX * 3.6;
  const columns = Math.floor(width / stepX);

  for (let index = 0; index < columns; index += 1) {
    rainColumns.push({
      x: index * stepX + random(-1, 1),
      offset: random(-height, height),
      speed: random(0.05, 0.2),
      alpha: random(0.025, 0.08),
      every: Math.random() > 0.45 ? 3 : 4,
    });
  }
}

function drawBackgroundMatrix() {
  if (isWideDuo) {
    return;
  }

  ctx.save();
  ctx.font = `${Math.max(5, cellY * 0.78)}px ${canvasFontFamily}`;
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
      const glyphIndex = (Math.floor((frame + y * 0.35 + column.x * 0.35) / 28) % digitGlyphs.length + digitGlyphs.length) % digitGlyphs.length;
      ctx.fillText(digitGlyphs[glyphIndex], column.x, wrappedY);
    }
  }

  ctx.restore();
}

function drawAsciiMask() {
  ctx.save();
  ctx.textBaseline = "middle";
  ctx.font = `${Math.max(5, cellY * 0.86)}px ${canvasFontFamily}`;

  for (const point of maskPoints) {
    updatePointScatter(point);

    const flicker = prefersReducedMotion.matches
      ? 0.72
      : 0.55 + (Math.sin(frame * 0.075 + point.phase) * 0.22) + (Math.random() > 0.975 ? 0.35 : 0);
    const edgeBreak = point.edge + (point.x > width * 0.4 ? Math.sin(frame * 0.04 + point.phase) * 0.55 : 0);
    const verticalNoise = (frame + point.phase * 10) % 97 < 1 ? Math.sin(point.phase) * cellY * 0.45 : 0;
    const alpha = Math.min(0.94, Math.max(0.08, point.brightness * 1.08 * flicker));

    if (frame % 36 === 0 && point.phase % 1 < 0.08 && !prefersReducedMotion.matches) {
      point.glyph = digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)];
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = point.brightness > 0.7 ? "#fbf7ee" : "#d4cec3";
    ctx.fillText(point.glyph, point.x + point.dx + edgeBreak, point.y + point.dy + verticalNoise);
  }

  ctx.restore();
}

function updatePointScatter(point) {
  if (prefersReducedMotion.matches) {
    return;
  }

  const sleeping = Math.abs(point.dx) < 0.02 && Math.abs(point.dy) < 0.02 && Math.abs(point.vx) < 0.02 && Math.abs(point.vy) < 0.02;
  if (archiveState !== "ritual" && !pointer.active && sleeping) {
    point.dx = 0;
    point.dy = 0;
    point.vx = 0;
    point.vy = 0;
    return;
  }

  if (archiveState === "ritual") {
    const scatter = getInnerScatterVector(point);

    if (scatter.innerBias > 0.01) {
      const ritualProgress = smoothstep(0, 56, frame - ritualStartedFrame);
      const force = scatter.innerBias * (0.15 + ritualProgress * 0.46);

      point.vx += scatter.innerDirection * force;
      point.vy += (scatter.verticalAim * 0.32 + scatter.laneNoise * 0.18) * force;
    }
  }

  if (pointer.active && (archiveState === "idle" || archiveState === "ritual")) {
    const pointX = point.x + point.dx;
    const pointY = point.y + point.dy;
    const deltaX = pointX - pointer.x;
    const deltaY = pointY - pointer.y;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSquared = pointer.radius * pointer.radius;

    if (distanceSquared > 0 && distanceSquared < radiusSquared) {
      const distance = Math.sqrt(distanceSquared);
      const force = (1 - distance / pointer.radius) ** 2;
      const angle = Math.atan2(deltaY, deltaX);
      point.vx += Math.cos(angle) * force * pointer.strength;
      point.vy += Math.sin(angle) * force * pointer.strength;
    }
  }

  const restoreStrength = archiveState === "ritual" ? 0 : 0.12;
  const damping = archiveState === "ritual" ? 0.965 : 0.7;
  const maxSpeed = archiveState === "ritual" ? Math.max(cellX, cellY) * 1.35 : Infinity;

  point.vx += -point.dx * restoreStrength;
  point.vy += -point.dy * restoreStrength;
  point.vx *= damping;
  point.vy *= damping;
  point.vx = clamp(point.vx, -maxSpeed, maxSpeed);
  point.vy = clamp(point.vy, -maxSpeed, maxSpeed);
  point.dx += point.vx;
  point.dy += point.vy;
}

function clearArchiveTimers() {
  while (archiveTimers.length > 0) {
    window.clearTimeout(archiveTimers.pop());
  }
}

function clearCallTimers() {
  while (callTimers.length > 0) {
    window.clearTimeout(callTimers.pop());
  }
}

function scheduleCallStep(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  callTimers.push(timer);
}

function setBroadcastCallDisabled(disabled) {
  for (const button of broadcastCallButtons) {
    button.disabled = disabled;
    button.setAttribute("aria-disabled", String(disabled));
  }
}

function announceCallStatus(message) {
  if (callLiveStatus) {
    callLiveStatus.textContent = message;
  }
}

function setMailboxAction(action) {
  mailboxAction = action;
  const labels = {
    mailbox: "open >",
    photo: "turn over >",
  };

  let activeTarget = null;

  for (const [name, target] of Object.entries(mailboxTargets)) {
    if (!target) {
      continue;
    }

    const isActive = name === action;
    target.disabled = !isActive;
    target.setAttribute("aria-disabled", String(!isActive));

    if (isActive) {
      activeTarget = target;
    }
  }

  const hasAction = Boolean(action && labels[action]);
  intro.classList.toggle("is-mailbox-ready", hasAction);

  if (mailboxPrompt) {
    mailboxPrompt.textContent = hasAction ? labels[action] : "";
    mailboxPrompt.disabled = !hasAction;
    mailboxPrompt.setAttribute("aria-disabled", String(!hasAction));
    mailboxPrompt.setAttribute("aria-hidden", String(!hasAction));
  }

  if (hasAction && (mailboxPrompt || activeTarget)) {
    try {
      (mailboxPrompt || activeTarget).focus({ preventScroll: true });
    } catch {}
  }
}

function armCityAdvance(delay = 1220) {
  if (!cityAdvanceButton) {
    return;
  }

  cityAdvanceButton.disabled = true;
  cityAdvanceButton.setAttribute("aria-hidden", "true");
  scheduleCallStep(() => {
    if (archiveState !== "trend-city") {
      return;
    }

    cityAdvanceButton.disabled = false;
    cityAdvanceButton.setAttribute("aria-hidden", "false");
  }, delay);
}

function setMailboxMemoryVisible(isVisible) {
  intro.classList.toggle("is-mailbox-memory", isVisible);

  if (mailboxMemory) {
    mailboxMemory.setAttribute("aria-hidden", String(!isVisible));
  }
}

function setPropagandaCaption(mode) {
  intro.classList.toggle("is-propaganda-caption-first", mode === "first");

  propagandaCaptionFirst?.setAttribute("aria-hidden", String(mode !== "first"));
}

function resetWishPricePresentation() {
  intro.classList.remove(...wishPricePhaseClasses);

  if (wishPriceLineOne) {
    wishPriceLineOne.setAttribute("aria-hidden", "true");
  }

  if (wishPriceLineTwo) {
    wishPriceLineTwo.setAttribute("aria-hidden", "true");
  }

  if (wishPriceAdvance) {
    wishPriceAdvance.disabled = true;
    wishPriceAdvance.setAttribute("aria-hidden", "true");
  }
}

function updateCallLayerAccessibility(activeLayer) {
  if (callSequence) {
    const isVisible = Boolean(activeLayer);
    callSequence.setAttribute("aria-hidden", String(!isVisible));
    callSequence.inert = !isVisible;
  }

  for (const layer of callSequenceLayers) {
    const isActive = layer.dataset.callLayer === activeLayer;
    layer.setAttribute("aria-hidden", String(!isActive));
  }
}

function resetInterviewAccessibility() {
  for (const image of interviewImages) {
    image.setAttribute("aria-hidden", "true");
  }

  for (const caption of interviewCaptions) {
    caption.setAttribute("aria-hidden", "true");
  }
}

function updateStorySceneAccessibility(state) {
  const isRoomVisible = ["room-revealing", "trend-room", "city-entering"].includes(state);
  const isCityVisible = ["city-entering", "trend-city"].includes(state);
  const isFriendsVisible = ["trend-friends", "story-ended", "coercion-flyer", "coercion-final"].includes(state);
  const isFlyerVisible = ["coercion-flyer", "coercion-final"].includes(state);
  const isMailboxVisible = ["mailbox-closed", "mailbox-open", "mailbox-contents", "mailbox-back", "mailbox-empty"].includes(state);
  const isWishPriceVisible = state === "wish-price";

  if (roomScene) {
    roomScene.setAttribute("aria-hidden", String(!isRoomVisible));
    roomScene.inert = !isRoomVisible;
  }

  if (cityScene) {
    cityScene.setAttribute("aria-hidden", String(!isCityVisible));
    cityScene.inert = !isCityVisible;
  }

  if (friendsScene) {
    friendsScene.setAttribute("aria-hidden", String(!isFriendsVisible));
    friendsScene.inert = !isFriendsVisible;
  }

  if (flyerScene) {
    flyerScene.setAttribute("aria-hidden", String(!isFlyerVisible));
    flyerScene.inert = !isFlyerVisible;
  }

  if (mailboxScene) {
    mailboxScene.setAttribute("aria-hidden", String(!isMailboxVisible));
    mailboxScene.inert = !isMailboxVisible;
  }

  const activeMailboxClass = state?.startsWith("mailbox-") ? `story-mailbox__image--${state.slice(8)}` : null;
  for (const image of mailboxImages) {
    image.setAttribute("aria-hidden", String(!activeMailboxClass || !image.classList.contains(activeMailboxClass)));
  }

  if (wishPriceScene) {
    wishPriceScene.setAttribute("aria-hidden", String(!isWishPriceVisible));
    wishPriceScene.inert = !isWishPriceVisible;
  }

  if (mailboxNote) {
    mailboxNote.setAttribute("aria-hidden", String(!["mailbox-back", "mailbox-empty"].includes(state)));
  }

  if (roomAdvanceButton) {
    roomAdvanceButton.disabled = state !== "trend-room";
  }

  if (cityAdvanceButton) {
    cityAdvanceButton.disabled = true;
    cityAdvanceButton.setAttribute("aria-hidden", "true");
  }

  cityMythCaption?.setAttribute("aria-hidden", String(state !== "trend-city"));
  mailboxMythCaption?.setAttribute("aria-hidden", String(state !== "mailbox-closed"));
}

function setCallState(state) {
  intro.classList.remove(...callStateClasses, ...storyStateClasses, "is-broadcast-called", "is-call-static-cut", "is-call-awaiting", "is-broadcast-power-cut", "is-broadcast-power-on", "is-call-ready", "is-mailbox-cut", "is-mailbox-ready", "is-mailbox-memory", "is-mailbox-charm-glitch");
  archiveState = state;
  intro.classList.add(`is-${state}`);
  updateCallLayerAccessibility(state);
  updateStorySceneAccessibility(null);
  setMailboxAction(null);
  setMailboxMemoryVisible(false);
  setPropagandaCaption(null);
  resetWishPricePresentation();
}

function setStoryState(state) {
  intro.classList.remove(...callStateClasses, ...storyStateClasses, "is-broadcast-called", "is-call-static-cut", "is-call-awaiting", "is-broadcast-power-cut", "is-broadcast-power-on", "is-call-ready", "is-mailbox-cut", "is-mailbox-ready", "is-mailbox-memory", "is-mailbox-charm-glitch");
  archiveState = state;
  intro.classList.add(`is-${state}`);
  setCallAdvanceMode(null);
  setMailboxAction(null);
  setMailboxMemoryVisible(false);
  setPropagandaCaption(null);
  resetWishPricePresentation();
  updateCallLayerAccessibility(null);
  updateStorySceneAccessibility(state);
}

function setCallAdvanceMode(mode) {
  callAdvanceMode = mode;
  intro.classList.toggle("is-call-awaiting", Boolean(mode));

  if (callSequence) {
    callSequence.tabIndex = mode ? 0 : -1;
  }

  if (callAdvanceButton) {
    callAdvanceButton.hidden = !mode;
    callAdvanceButton.disabled = !mode;
  }
}

function stopCallAudio() {
  for (const node of callAudioNodes) {
    try {
      if (typeof node.stop === "function") {
        node.stop();
      }
      node.disconnect();
    } catch {}
  }

  callAudioNodes.clear();
}

function prepareCallAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return false;
  }

  try {
    if (!callAudioContext || callAudioContext.state === "closed") {
      callAudioContext = new AudioContextClass();
      callAudioGain = callAudioContext.createGain();
      callAudioGain.gain.value = isCallMuted ? 0 : 1;
      callAudioGain.connect(callAudioContext.destination);
    }

    if (callAudioContext.state === "suspended") {
      callAudioContext.resume().catch(() => {});
    }

    return Boolean(callAudioGain);
  } catch {
    return false;
  }
}

function trackCallAudioNode(node) {
  callAudioNodes.add(node);
  node.addEventListener("ended", () => {
    callAudioNodes.delete(node);
    try {
      node.disconnect();
    } catch {}
  }, { once: true });
}

function playRingCue() {
  if (!prepareCallAudio() || !callAudioContext || !callAudioGain) {
    return;
  }

  try {
    const now = callAudioContext.currentTime;
    const cueGain = callAudioContext.createGain();
    const lowTone = callAudioContext.createOscillator();
    const overtone = callAudioContext.createOscillator();

    lowTone.type = "sine";
    lowTone.frequency.value = 188;
    overtone.type = "sine";
    overtone.frequency.value = 244;
    cueGain.gain.setValueAtTime(0.0001, now);
    cueGain.gain.exponentialRampToValueAtTime(0.055, now + 0.025);
    cueGain.gain.setValueAtTime(0.055, now + 0.24);
    cueGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
    lowTone.connect(cueGain);
    overtone.connect(cueGain);
    cueGain.connect(callAudioGain);
    lowTone.start(now);
    overtone.start(now);
    lowTone.stop(now + 0.54);
    overtone.stop(now + 0.54);
    trackCallAudioNode(lowTone);
    trackCallAudioNode(overtone);
  } catch {}
}

function playParkingLotAmbience(duration = 3.2) {
  if (!prepareCallAudio() || !callAudioContext || !callAudioGain) {
    return;
  }

  try {
    const now = callAudioContext.currentTime;
    const sampleRate = callAudioContext.sampleRate;
    const ambienceBuffer = callAudioContext.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
    const ambienceSamples = ambienceBuffer.getChannelData(0);
    const ambience = callAudioContext.createBufferSource();
    const ambienceFilter = callAudioContext.createBiquadFilter();
    const ambienceGain = callAudioContext.createGain();
    const parkingHum = callAudioContext.createOscillator();
    const parkingHumGain = callAudioContext.createGain();

    let smoothedNoise = 0;
    for (let index = 0; index < ambienceSamples.length; index += 1) {
      smoothedNoise = smoothedNoise * 0.985 + (Math.random() * 2 - 1) * 0.015;
      ambienceSamples[index] = smoothedNoise;
    }

    ambience.buffer = ambienceBuffer;
    ambienceFilter.type = "lowpass";
    ambienceFilter.frequency.value = 720;
    ambienceFilter.Q.value = 0.45;
    ambienceGain.gain.setValueAtTime(0.0001, now);
    ambienceGain.gain.exponentialRampToValueAtTime(0.016, now + 0.12);
    ambienceGain.gain.setValueAtTime(0.013, now + Math.max(0.2, duration - 0.42));
    ambienceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    ambience.connect(ambienceFilter);
    ambienceFilter.connect(ambienceGain);
    ambienceGain.connect(callAudioGain);

    parkingHum.type = "sine";
    parkingHum.frequency.value = 58;
    parkingHumGain.gain.setValueAtTime(0.0001, now);
    parkingHumGain.gain.exponentialRampToValueAtTime(0.006, now + 0.18);
    parkingHumGain.gain.setValueAtTime(0.005, now + Math.max(0.3, duration - 0.5));
    parkingHumGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    parkingHum.connect(parkingHumGain);
    parkingHumGain.connect(callAudioGain);

    ambience.start(now);
    ambience.stop(now + duration);
    parkingHum.start(now);
    parkingHum.stop(now + duration);
    trackCallAudioNode(ambience);
    trackCallAudioNode(parkingHum);

    ambience.addEventListener("ended", () => {
      try {
        ambienceFilter.disconnect();
        ambienceGain.disconnect();
      } catch {}
    }, { once: true });

    parkingHum.addEventListener("ended", () => {
      try {
        parkingHumGain.disconnect();
      } catch {}
    }, { once: true });

    const footstepOffsets = [0.34, 0.84, 1.36, 1.91, 2.5];
    footstepOffsets.forEach((offset, stepIndex) => {
      const stepDuration = 0.15;
      const stepBuffer = callAudioContext.createBuffer(1, Math.ceil(sampleRate * stepDuration), sampleRate);
      const stepSamples = stepBuffer.getChannelData(0);
      const step = callAudioContext.createBufferSource();
      const stepFilter = callAudioContext.createBiquadFilter();
      const stepGain = callAudioContext.createGain();
      const stepPeak = 0.028 * (1 - stepIndex * 0.13);

      for (let index = 0; index < stepSamples.length; index += 1) {
        const decay = Math.exp(-index / (sampleRate * 0.035));
        stepSamples[index] = (Math.random() * 2 - 1) * decay;
      }

      step.buffer = stepBuffer;
      stepFilter.type = "bandpass";
      stepFilter.frequency.value = 170 - stepIndex * 7;
      stepFilter.Q.value = 0.72;
      stepGain.gain.setValueAtTime(0.0001, now + offset);
      stepGain.gain.exponentialRampToValueAtTime(stepPeak, now + offset + 0.008);
      stepGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + stepDuration);
      step.connect(stepFilter);
      stepFilter.connect(stepGain);
      stepGain.connect(callAudioGain);
      step.start(now + offset);
      step.stop(now + offset + stepDuration);
      trackCallAudioNode(step);

      step.addEventListener("ended", () => {
        try {
          stepFilter.disconnect();
          stepGain.disconnect();
        } catch {}
      }, { once: true });
    });
  } catch {}
}

function playRoomTelephoneRing() {
  if (!prepareCallAudio() || !callAudioContext || !callAudioGain) {
    return;
  }

  try {
    const now = callAudioContext.currentTime;
    const bellGain = callAudioContext.createGain();
    const bellFilter = callAudioContext.createBiquadFilter();
    const bellPanner = typeof callAudioContext.createStereoPanner === "function"
      ? callAudioContext.createStereoPanner()
      : null;
    const lowerBell = callAudioContext.createOscillator();
    const upperBell = callAudioContext.createOscillator();
    const strikes = [0, 0.3, 0.82, 1.12];

    lowerBell.type = "square";
    lowerBell.frequency.value = 510;
    lowerBell.detune.value = -7;
    upperBell.type = "sine";
    upperBell.frequency.value = 690;
    upperBell.detune.value = 9;
    bellFilter.type = "bandpass";
    bellFilter.frequency.value = 760;
    bellFilter.Q.value = 1.25;
    if (bellPanner) {
      bellPanner.pan.value = -0.72;
    }
    bellGain.gain.setValueAtTime(0.0001, now);

    for (const offset of strikes) {
      bellGain.gain.setValueAtTime(0.0001, now + offset);
      bellGain.gain.exponentialRampToValueAtTime(0.068, now + offset + 0.012);
      bellGain.gain.setValueAtTime(0.052, now + offset + 0.09);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.28);
    }

    lowerBell.connect(bellFilter);
    upperBell.connect(bellFilter);
    bellFilter.connect(bellGain);
    if (bellPanner) {
      bellGain.connect(bellPanner);
      bellPanner.connect(callAudioGain);
    } else {
      bellGain.connect(callAudioGain);
    }
    lowerBell.start(now);
    upperBell.start(now);
    lowerBell.stop(now + 1.48);
    upperBell.stop(now + 1.48);
    trackCallAudioNode(lowerBell);
    trackCallAudioNode(upperBell);
  } catch {}
}

function resetRoomTelephoneSequence() {
  roomRingCount = 0;
  intro.classList.remove("is-room-phone-question", "is-room-phone-entering", "is-room-phone-pulse");
  document.querySelector(".story-scene__phone-subtitle")?.setAttribute("aria-hidden", "true");
}

function scheduleRoomTelephoneRing(delay) {
  scheduleCallStep(() => {
    if (archiveState !== "trend-room") {
      return;
    }

    playRoomTelephoneRing();
    roomRingCount += 1;

    if (roomRingCount === 1) {
      announceCallStatus("The billboard illuminates the room. The telephone rings.");
    } else if (roomRingCount === 2) {
      intro.classList.add("is-room-phone-question", "is-room-phone-entering");
      document.querySelector(".story-scene__phone-subtitle")?.setAttribute("aria-hidden", "false");
      announceCallStatus("After the broadcast ended, the ringing remained.");
    } else {
      intro.classList.remove("is-room-phone-pulse");
      void intro.offsetWidth;
      intro.classList.add("is-room-phone-pulse");
    }

    const nextDelay = roomRingIntervals[(roomRingCount - 1) % roomRingIntervals.length];
    scheduleRoomTelephoneRing(nextDelay);
  }, delay);
}

function playStaticCut(gainLevel = 0.075) {
  intro.classList.add("is-call-static-cut");
  scheduleCallStep(() => intro.classList.remove("is-call-static-cut"), 180);

  if (!prepareCallAudio() || !callAudioContext || !callAudioGain) {
    return;
  }

  try {
    const duration = 0.16;
    const frameCount = Math.ceil(callAudioContext.sampleRate * duration);
    const buffer = callAudioContext.createBuffer(1, frameCount, callAudioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    const source = callAudioContext.createBufferSource();
    const cutGain = callAudioContext.createGain();
    const now = callAudioContext.currentTime;

    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }

    source.buffer = buffer;
    cutGain.gain.setValueAtTime(gainLevel, now);
    cutGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(cutGain);
    cutGain.connect(callAudioGain);
    source.start(now);
    source.stop(now + duration);
    trackCallAudioNode(source);
  } catch {}
}

function playMailboxCut(duration = 140) {
  playStaticCut();
  intro.style.setProperty("--mailbox-cut-duration", `${duration}ms`);
  intro.classList.add("is-mailbox-cut");
  scheduleCallStep(() => intro.classList.remove("is-mailbox-cut"), duration);
}

function playCharmGlitch() {
  intro.classList.add("is-mailbox-charm-glitch");

  scheduleCallStep(() => {
    intro.classList.remove("is-mailbox-charm-glitch");
  }, 200);
}

function playMailboxFoley(kind) {
  if (!prepareCallAudio() || !callAudioContext || !callAudioGain) {
    return;
  }

  try {
    const now = callAudioContext.currentTime;
    const duration = kind === "latch" ? 0.18 : 0.24;
    const buffer = callAudioContext.createBuffer(1, Math.ceil(callAudioContext.sampleRate * duration), callAudioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    const source = callAudioContext.createBufferSource();
    const filter = callAudioContext.createBiquadFilter();
    const gain = callAudioContext.createGain();

    for (let index = 0; index < samples.length; index += 1) {
      const decay = Math.exp(-index / (callAudioContext.sampleRate * (kind === "latch" ? 0.045 : 0.11)));
      samples[index] = (Math.random() * 2 - 1) * decay;
    }

    source.buffer = buffer;
    filter.type = kind === "latch" ? "bandpass" : "lowpass";
    filter.frequency.value = kind === "latch" ? 1150 : 980;
    filter.Q.value = kind === "latch" ? 2.1 : 0.7;
    gain.gain.setValueAtTime(kind === "latch" ? 0.052 : 0.032, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(callAudioGain);
    source.start(now);
    source.stop(now + duration);
    trackCallAudioNode(source);
  } catch {}
}

function playNewsPowerAudio() {
  if (!prepareCallAudio() || !callAudioContext || !callAudioGain) {
    return;
  }

  try {
    const now = callAudioContext.currentTime;
    const clickGain = callAudioContext.createGain();
    const clickOsc = callAudioContext.createOscillator();

    clickOsc.type = "square";
    clickOsc.frequency.value = 74;
    clickGain.gain.setValueAtTime(0.0001, now);
    clickGain.gain.exponentialRampToValueAtTime(0.12, now + 0.006);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    clickOsc.connect(clickGain);
    clickGain.connect(callAudioGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.085);
    trackCallAudioNode(clickOsc);

    const noiseDuration = 0.38;
    const frameCount = Math.ceil(callAudioContext.sampleRate * noiseDuration);
    const buffer = callAudioContext.createBuffer(1, frameCount, callAudioContext.sampleRate);
    const channel = buffer.getChannelData(0);
    const noise = callAudioContext.createBufferSource();
    const filter = callAudioContext.createBiquadFilter();
    const noiseGain = callAudioContext.createGain();

    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
    }

    noise.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1850, now + 0.24);
    filter.Q.setValueAtTime(4.2, now + 0.24);
    noiseGain.gain.setValueAtTime(0.0001, now + 0.22);
    noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 0.27);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(callAudioGain);
    noise.start(now + 0.22);
    noise.stop(now + 0.62);
    trackCallAudioNode(noise);

    const humGain = callAudioContext.createGain();
    const hum = callAudioContext.createOscillator();

    hum.type = "sine";
    hum.frequency.value = 92;
    humGain.gain.setValueAtTime(0.0001, now + 0.58);
    humGain.gain.exponentialRampToValueAtTime(0.035, now + 0.66);
    humGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.18);
    hum.connect(humGain);
    humGain.connect(callAudioGain);
    hum.start(now + 0.58);
    hum.stop(now + 1.2);
    trackCallAudioNode(hum);
  } catch {}
}

function setBroadcastMediaSubtitle(text = "") {
  const hasText = Boolean(text);

  intro.classList.toggle("has-media-subtitle", hasText);

  if (!broadcastMediaSubtitle) {
    return;
  }

  broadcastMediaSubtitle.textContent = text;
  broadcastMediaSubtitle.setAttribute("aria-hidden", String(!hasText));
}

function updateNewsSubtitle() {
  if (!newsVideo || !isOpeningBroadcastRunning || archiveState !== "love-news") {
    return;
  }

  const cue = newsSubtitleCues.find(({ start, end }) => newsVideo.currentTime >= start && newsVideo.currentTime < end);
  setBroadcastMediaSubtitle(cue?.text || "");
}

function updateAdSubtitle() {
  if (!broadcastAdVideo || !isOpeningBroadcastRunning || archiveState !== "broadcast") {
    return;
  }

  const cue = adSubtitleCues.find(({ start, end }) => broadcastAdVideo.currentTime >= start && broadcastAdVideo.currentTime < end);
  setBroadcastMediaSubtitle(cue?.text || "");
}

function resetCallSequence() {
  clearCallTimers();
  stopCallAudio();
  resetRoomTelephoneSequence();
  isOpeningBroadcastRunning = false;
  stopBroadcastAdMedia();
  stopNewsVideo();
  setBroadcastMediaSubtitle();
  setCallAdvanceMode(null);
  intro.classList.remove(...callStateClasses, ...storyStateClasses, ...previewStateClasses, "is-broadcast-called", "is-call-static-cut", "is-call-awaiting", "is-broadcast-power-cut", "is-broadcast-power-on", "is-broadcast-video-ready", "is-opening-broadcast", "is-call-ready", "is-mailbox-cut", "is-mailbox-ready");
  setMailboxAction(null);
  updateCallLayerAccessibility(null);
  resetInterviewAccessibility();
  updateStorySceneAccessibility(null);
  setBroadcastCallDisabled(archiveState !== "broadcast");

  if (callMuteButton) {
    callMuteButton.hidden = true;
  }
}

function stopBroadcastAdMedia() {
  intro.classList.remove("is-broadcast-video-ready");

  for (const media of [broadcastAdVideo, broadcastAdAudio]) {
    if (!media) {
      continue;
    }

    media.pause();
    try {
      media.currentTime = 0;
    } catch {}
  }
}

function showBroadcastAdFinalFrame() {
  if (broadcastAdAudio) {
    broadcastAdAudio.pause();
  }

  if (!broadcastAdVideo) {
    return;
  }

  broadcastAdVideo.pause();
  broadcastAdVideo.muted = true;
  broadcastAdVideo.loop = false;

  const seekToFinalFrame = () => {
    if (!Number.isFinite(broadcastAdVideo.duration) || broadcastAdVideo.duration <= 0) {
      return;
    }

    try {
      broadcastAdVideo.currentTime = Math.max(0, broadcastAdVideo.duration - 0.08);
    } catch {}
  };

  seekToFinalFrame();
  window.requestAnimationFrame(seekToFinalFrame);

  intro.classList.add("is-broadcast-video-ready");
}

function stopNewsVideo() {
  if (!newsVideo) {
    return;
  }

  newsVideo.pause();
  try {
    newsVideo.currentTime = 0;
  } catch {}
}

function playNewsVideo() {
  if (!newsVideo) {
    return Promise.reject(new Error("News video is unavailable."));
  }

  try {
    newsVideo.currentTime = 0;
  } catch {}
  newsVideo.loop = false;
  return newsVideo.play();
}

function playBroadcastAdMedia() {
  let videoPlayback = Promise.resolve();

  if (broadcastAdVideo) {
    try {
      broadcastAdVideo.currentTime = 0;
    } catch {}

    broadcastAdVideo.muted = true;
    broadcastAdVideo.loop = false;
    videoPlayback = broadcastAdVideo.play()
      .then(() => intro.classList.add("is-broadcast-video-ready"))
      .catch((error) => {
        intro.classList.remove("is-broadcast-video-ready");
        throw error;
      });
  }

  if (broadcastAdAudio) {
    try {
      broadcastAdAudio.currentTime = 0;
    } catch {}

    broadcastAdAudio.loop = false;
    broadcastAdAudio.play().catch(() => {});
  }

  return videoPlayback;
}

function scheduleArchiveStep(callback, delay) {
  const timer = window.setTimeout(callback, prefersReducedMotion.matches ? 0 : delay);
  archiveTimers.push(timer);
}

function triggerArchiveScatter() {
  for (const point of maskPoints) {
    const scatter = getInnerScatterVector(point);
    const force = random(1.2, 3.6) * scatter.innerBias;

    if (scatter.innerBias < 0.02) {
      continue;
    }

    point.vx += scatter.innerDirection * force + random(-0.22, 0.22) * scatter.innerBias;
    point.vy += (scatter.verticalAim * 0.34 + scatter.laneNoise * 0.24) * force;
    point.dx += scatter.innerDirection * random(cellX * 0.2, cellX * 1.5) * scatter.innerBias;
    point.dy += (scatter.verticalAim + scatter.laneNoise * 0.36) * random(cellY * 0.08, cellY * 0.7) * scatter.innerBias;
  }
}

function resetArchiveScatter() {
  for (const point of maskPoints) {
    point.dx = 0;
    point.dy = 0;
    point.vx = 0;
    point.vy = 0;
  }
}

function setPrologueEntryDisabled(disabled) {
  for (const button of prologueEntryButtons) {
    button.disabled = disabled;
  }
}

function setDoctrineCloserDisabled(disabled) {
  for (const button of doctrineCloserButtons) {
    button.disabled = disabled;
  }
}

function enterArchive() {
  if (!enterButton || !prologueScene || archiveState !== "idle" || hasEnteredArchive) {
    return;
  }

  archiveState = "ritual";
  hasEnteredArchive = true;
  ritualStartedFrame = frame;
  pointer.active = false;
  intro.classList.remove("is-prologue", "is-dissolving", "is-entering", "is-resetting");
  intro.classList.add("is-ritual");
  enterButton.disabled = true;
  triggerArchiveScatter();

  scheduleArchiveStep(() => {
    intro.classList.add("is-dissolving");
  }, 1360);

  scheduleArchiveStep(() => {
    intro.classList.add("is-prologue");
    prologueScene.setAttribute("aria-hidden", "false");
    setPrologueEntryDisabled(false);

    if (archiveBackButton) {
      archiveBackButton.disabled = false;
    }
  }, 2180);

  scheduleArchiveStep(() => {
    archiveState = "prologue";
    intro.classList.remove("is-ritual", "is-dissolving");
  }, 3300);
}

function enterMythBeforeBroadcast() {
  if (!prologueScene || !preBroadcastMyth || !broadcastScene || archiveState !== "prologue") {
    return;
  }

  clearArchiveTimers();
  clearCallTimers();
  archiveState = "prebroadcast-myth";
  pointer.active = false;
  setPrologueEntryDisabled(true);
  setDoctrineCloserDisabled(true);
  setBroadcastCallDisabled(true);
  doctrineScene?.setAttribute("aria-hidden", "true");
  broadcastScene.setAttribute("aria-hidden", "true");
  preBroadcastMyth.setAttribute("aria-hidden", "false");
  intro.classList.remove("is-prologue-leaving", "is-prebroadcast-myth-leaving");
  intro.classList.add("is-prologue-myth");
  announceCallStatus("And the world answered her.");

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }

  scheduleCallStep(() => {
    if (archiveState === "prebroadcast-myth") {
      intro.classList.add("is-prebroadcast-myth-leaving");
    }
  }, 2650);

  scheduleCallStep(beginBroadcastFromMyth, 2900);
}

function beginBroadcastFromMyth() {
  if (!broadcastScene || archiveState !== "prebroadcast-myth") {
    return;
  }

  archiveState = "broadcast-entering";
  intro.classList.remove("is-prologue-myth");
  intro.classList.add("is-prologue-leaving", "is-prebroadcast-myth-leaving", "is-broadcast-entering");
  broadcastScene.setAttribute("aria-hidden", "false");
  setBroadcastCallDisabled(true);

  scheduleCallStep(() => {
    if (archiveState !== "broadcast-entering") {
      return;
    }

    prologueScene?.setAttribute("aria-hidden", "true");
    preBroadcastMyth?.setAttribute("aria-hidden", "true");
    intro.classList.remove("is-prologue", "is-prologue-leaving", "is-prebroadcast-myth-leaving");
  }, 650);

  scheduleCallStep(completeBroadcast, 4200);
}

function enterDoctrine() {
  if (!prologueScene || !doctrineScene || archiveState !== "prologue") {
    return;
  }

  archiveState = "doctrine-entering";
  intro.classList.remove(
    "is-resetting",
    "is-doctrine",
    "is-doctrine-hover",
    "is-doctrine-accepted",
    "is-broadcast-entering",
    "is-broadcast",
    "is-broadcast-called",
    ...callStateClasses,
  );
  intro.classList.add("is-prologue-leaving", "is-doctrine-entering");
  doctrineScene.setAttribute("aria-hidden", "false");
  if (broadcastScene) {
    broadcastScene.setAttribute("aria-hidden", "true");
  }
  setPrologueEntryDisabled(true);

  scheduleArchiveStep(() => {
    prologueScene.setAttribute("aria-hidden", "true");
    intro.classList.remove("is-prologue");
  }, 1600);

  scheduleArchiveStep(() => {
    archiveState = "doctrine";
    intro.classList.remove("is-prologue-leaving", "is-doctrine-entering", "is-dissolving");
    intro.classList.add("is-doctrine");
    setDoctrineCloserDisabled(false);
  }, 2600);
}

function returnToPrologue() {
  if (!prologueScene || !doctrineScene) {
    return;
  }

  clearArchiveTimers();
  resetCallSequence();
  archiveState = "prologue";
  pointer.active = false;
  intro.classList.remove(
    "is-prologue-myth",
    "is-prebroadcast-myth-leaving",
    "is-prologue-leaving",
    "is-doctrine",
    "is-doctrine-entering",
    "is-doctrine-hover",
    "is-doctrine-accepted",
    "is-broadcast-entering",
    "is-broadcast",
    "is-broadcast-called",
    ...callStateClasses,
  );
  intro.classList.add("is-prologue");
  prologueScene.setAttribute("aria-hidden", "false");
  preBroadcastMyth?.setAttribute("aria-hidden", "true");
  doctrineScene.setAttribute("aria-hidden", "true");
  if (broadcastScene) {
    broadcastScene.setAttribute("aria-hidden", "true");
  }
  setPrologueEntryDisabled(false);
  setDoctrineCloserDisabled(true);

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }
}

function returnToIntro() {
  if (!prologueScene) {
    return;
  }

  clearArchiveTimers();
  resetCallSequence();
  archiveState = "idle";
  hasEnteredArchive = false;
  ritualStartedFrame = 0;
  pointer.active = false;
  intro.classList.remove(
    "is-prologue",
    "is-prologue-myth",
    "is-prebroadcast-myth-leaving",
    "is-prologue-leaving",
    "is-ritual",
    "is-dissolving",
    "is-entering",
    "is-doctrine",
    "is-doctrine-entering",
    "is-doctrine-hover",
    "is-doctrine-accepted",
    "is-broadcast-entering",
    "is-broadcast",
    "is-broadcast-called",
    ...callStateClasses,
  );
  intro.classList.add("is-resetting");
  prologueScene.setAttribute("aria-hidden", "true");
  preBroadcastMyth?.setAttribute("aria-hidden", "true");

  if (doctrineScene) {
    doctrineScene.setAttribute("aria-hidden", "true");
  }

  if (broadcastScene) {
    broadcastScene.setAttribute("aria-hidden", "true");
  }

  resetArchiveScatter();
  setPrologueEntryDisabled(true);
  setDoctrineCloserDisabled(true);

  if (enterButton) {
    enterButton.disabled = false;
  }

  if (archiveBackButton) {
    archiveBackButton.disabled = true;
  }

  scheduleArchiveStep(() => {
    intro.classList.remove("is-resetting");
  }, 80);
}

function restoreDoctrineFromAccepted() {
  if (archiveState !== "doctrine-accepted") {
    return;
  }

  archiveState = "doctrine";
  intro.classList.remove("is-doctrine-accepted");
  intro.classList.add("is-doctrine");
  setDoctrineCloserDisabled(false);
}

function returnToDoctrineFromBroadcast() {
  if (!doctrineScene || !broadcastScene) {
    return;
  }

  clearArchiveTimers();
  resetCallSequence();
  archiveState = "doctrine";
  setBroadcastCallDisabled(true);
  pointer.active = false;
  intro.classList.remove(
    "is-broadcast-entering",
    "is-broadcast",
    "is-broadcast-called",
    ...callStateClasses,
    "is-doctrine-hover",
    "is-doctrine-accepted",
  );
  intro.classList.add("is-doctrine");
  doctrineScene.setAttribute("aria-hidden", "false");
  broadcastScene.setAttribute("aria-hidden", "true");
  setDoctrineCloserDisabled(false);

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }
}

function goBack() {
  if (isOpeningBroadcastRunning) {
    returnToPrologue();
    return;
  }

  if (archiveState === "wish-price") {
    restoreMailboxState("mailbox-empty", null, "The Love World keychain is gone. The photograph remains face down.");
    return;
  }

  if (archiveState === "mailbox-empty") {
    restoreMailboxState("mailbox-back", null, "The message on the back of the photograph is visible again.");
    return;
  }

  if (archiveState === "mailbox-back") {
    restoreMailboxState("mailbox-contents", "photo", "The photograph and Love World keychain are visible.");
    return;
  }

  if (archiveState === "mailbox-contents") {
    restoreMailboxState("mailbox-closed", "mailbox", "The mailbox is closed again.");
    return;
  }

  if (archiveState === "mailbox-open") {
    restoreMailboxState("mailbox-closed", "mailbox", "The mailbox is closed again.");
    return;
  }

  if (archiveState === "mailbox-closed") {
    clearCallTimers();
    stopCallAudio();
    setStoryState("coercion-final");
    setPropagandaCaption("first");
    announceCallStatus("Everyone belongs in love. The parking-lot image is visible again.");
    return;
  }

  if (["trend-friends", "story-ended", "coercion-flyer", "coercion-final"].includes(archiveState)) {
    returnToTrendCity();
    return;
  }

  if (archiveState === "trend-city" || archiveState === "city-entering") {
    returnToTrendRoom();
    return;
  }

  if (archiveState === "trend-room" || archiveState === "room-revealing" || archiveState === "tv-powering-off") {
    showTrendInterviews();
    return;
  }

  if (["call-dialing", "call-answered", "call-ended", "love-news", "trend-interviews"].includes(archiveState)) {
    returnToOriginalBroadcast();
    return;
  }

  if (archiveState === "prebroadcast-myth") {
    returnToPrologue();
    return;
  }

  if (archiveState === "prologue") {
    returnToIntro();
    return;
  }

  if (archiveState === "doctrine" || archiveState === "doctrine-entering") {
    returnToPrologue();
    return;
  }

  if (archiveState === "doctrine-accepted") {
    restoreDoctrineFromAccepted();
    return;
  }

  if (archiveState === "broadcast-entering" || archiveState === "broadcast") {
    returnToPrologue();
  }
}

function setDoctrineHover(isHovering) {
  if (archiveState !== "doctrine") {
    return;
  }

  intro.classList.toggle("is-doctrine-hover", isHovering);
}

function acceptDoctrine() {
  if (archiveState !== "doctrine") {
    return;
  }

  archiveState = "doctrine-accepted";
  intro.classList.remove("is-doctrine-hover");
  intro.classList.add("is-doctrine-accepted");
  setDoctrineCloserDisabled(true);
}

function enterBroadcast() {
  if (!broadcastScene || archiveState !== "doctrine") {
    return;
  }

  clearArchiveTimers();
  resetCallSequence();
  archiveState = "broadcast-entering";
  pointer.active = false;
  intro.classList.remove("is-doctrine-hover", "is-doctrine-accepted", "is-broadcast", "is-broadcast-called");
  intro.classList.add("is-broadcast-entering");
  broadcastScene.setAttribute("aria-hidden", "false");
  setDoctrineCloserDisabled(true);
  setBroadcastCallDisabled(true);

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }

  scheduleArchiveStep(completeBroadcast, 4200);
}

function completeBroadcast() {
  if (archiveState !== "broadcast-entering") {
    return;
  }

  archiveState = "broadcast";
  intro.classList.remove("is-broadcast-entering", "is-doctrine");
  intro.classList.add("is-broadcast");
  setBroadcastCallDisabled(true);

  if (doctrineScene) {
    doctrineScene.setAttribute("aria-hidden", "true");
  }

  startOpeningNews();
}

function returnToOriginalBroadcast() {
  resetCallSequence();
  archiveState = "broadcast";
  setBroadcastCallDisabled(false);
  intro.classList.remove(...callStateClasses, ...storyStateClasses, "is-broadcast-called", "is-call-static-cut", "is-broadcast-power-cut", "is-broadcast-power-on");
  intro.classList.add("is-broadcast", "is-call-ready");
  showBroadcastAdFinalFrame();
  announceCallStatus("Call cancelled. LOVE WORLD broadcast restored.");
}

function startOpeningNews() {
  isOpeningBroadcastRunning = true;
  setCallAdvanceMode(null);
  clearCallTimers();
  intro.classList.add("is-opening-broadcast");
  setCallState("love-news");
  setBroadcastCallDisabled(true);
  announceCallStatus("LOVE WORLD news broadcast.");
  updateNewsSubtitle();

  playNewsVideo().catch(() => {
    scheduleCallStep(() => {
      if (isOpeningBroadcastRunning && archiveState === "love-news") {
        transitionOpeningNewsToAdvertisement();
      }
    }, 1200);
  });
}

function transitionOpeningNewsToAdvertisement() {
  if (!isOpeningBroadcastRunning || archiveState !== "love-news") {
    return;
  }

  setBroadcastMediaSubtitle();
  playNewsPowerAudio();
  announceCallStatus("The news broadcast has ended.");

  scheduleCallStep(() => {
    startOpeningAdvertisement();
  }, 180);
}

function startOpeningAdvertisement() {
  if (!isOpeningBroadcastRunning || archiveState !== "love-news") {
    return;
  }

  stopNewsVideo();
  setCallState("broadcast");
  intro.classList.add("is-opening-broadcast");
  updateCallLayerAccessibility(null);
  setBroadcastCallDisabled(true);
  announceCallStatus("LOVE CHARM advertisement.");
  updateAdSubtitle();

  playBroadcastAdMedia().catch(() => {
    scheduleCallStep(() => {
      if (isOpeningBroadcastRunning && archiveState === "broadcast") {
        finishOpeningBroadcast();
      }
    }, 1200);
  });
}

function finishOpeningBroadcast() {
  if (!isOpeningBroadcastRunning || archiveState !== "broadcast") {
    return;
  }

  isOpeningBroadcastRunning = false;
  setBroadcastMediaSubtitle();
  intro.classList.remove("is-opening-broadcast", "is-broadcast-power-cut", "is-broadcast-power-on");
  showBroadcastAdFinalFrame();
  setBroadcastCallDisabled(true);
  intro.classList.remove("is-call-ready");
  announceCallStatus("The advertisement has ended.");

  scheduleCallStep(() => {
    if (archiveState !== "broadcast" || isOpeningBroadcastRunning) {
      return;
    }

    intro.classList.add("is-call-ready");
    setBroadcastCallDisabled(false);
    announceCallStatus("The advertisement has ended. Call her.");
  }, 420);
}

function showTrendInterviews() {
  setCallAdvanceMode(null);
  clearCallTimers();
  setCallState("trend-interviews");
  resetInterviewAccessibility();
  document.querySelector(".camcorder-frame__image--away")?.setAttribute("aria-hidden", "false");
  announceCallStatus("LOVE WORLD interviews begin.");

  const captionWindows = [
    [".camcorder-caption--1", 650, 2350],
    [".camcorder-caption--2", 2600, 4300],
    [".camcorder-caption--3", 4550, 6250],
    [".camcorder-caption--4", 6500, 8200],
    [".camcorder-caption--final", 8760, 11800],
  ];

  for (const [selector, start, end] of captionWindows) {
    scheduleCallStep(() => {
      if (archiveState === "trend-interviews") {
        document.querySelector(selector)?.setAttribute("aria-hidden", "false");
      }
    }, start);
    scheduleCallStep(() => document.querySelector(selector)?.setAttribute("aria-hidden", "true"), end);
  }

  scheduleCallStep(() => {
    if (archiveState !== "trend-interviews") {
      return;
    }

    document.querySelector(".camcorder-frame__image--away")?.setAttribute("aria-hidden", "true");
    document.querySelector(".camcorder-frame__image--stare")?.setAttribute("aria-hidden", "false");
  }, 8480);

  scheduleCallStep(() => {
    if (archiveState === "trend-interviews") {
      startRoomReveal();
    }
  }, 11800);
}

function startRoomReveal() {
  if (archiveState !== "trend-interviews" || !roomScene) {
    return;
  }

  clearCallTimers();
  stopCallAudio();
  resetRoomTelephoneSequence();
  stopBroadcastAdMedia();
  stopNewsVideo();
  setBroadcastCallDisabled(true);
  setStoryState("tv-powering-off");
  playNewsPowerAudio();
  announceCallStatus("The television signal is powering off.");

  scheduleCallStep(() => {
    if (archiveState !== "tv-powering-off") {
      return;
    }

    setStoryState("room-revealing");
    announceCallStatus("The television is off. Love World is already in the room.");

    scheduleCallStep(() => {
      if (archiveState !== "room-revealing") {
        return;
      }

      setStoryState("trend-room");

      if (roomAdvanceButton) {
        roomAdvanceButton.disabled = true;
      }

      announceCallStatus("The room is adjusting to the remaining signal.");

      scheduleRoomTelephoneRing(prefersReducedMotion.matches ? 100 : 900);

      scheduleCallStep(() => {
        if (archiveState !== "trend-room") {
          return;
        }

        if (roomAdvanceButton) {
          roomAdvanceButton.disabled = false;
        }

        announceCallStatus("The room remains under observation.");
      }, prefersReducedMotion.matches ? 3600 : 5900);
    }, prefersReducedMotion.matches ? 80 : 3400);
  }, prefersReducedMotion.matches ? 40 : 620);
}

function startCityTransition() {
  if (archiveState !== "trend-room" || !cityScene) {
    return;
  }

  clearCallTimers();
  stopCallAudio();
  resetRoomTelephoneSequence();
  setStoryState("city-entering");
  announceCallStatus("The billboard flashes. Love World spreads into the city.");

  scheduleCallStep(() => {
    if (archiveState !== "city-entering") {
      return;
    }

    setStoryState("trend-city");
    armCityAdvance();
    announceCallStatus("Love World has spread through the city. Look closer to continue.");
  }, prefersReducedMotion.matches ? 60 : 2200);
}

function startFriendsEnding() {
  if (archiveState !== "trend-city" || !friendsScene) {
    return;
  }

  clearCallTimers();
  stopCallAudio();
  setStoryState("trend-friends");
  playParkingLotAmbience();
  announceCallStatus("Four friends wearing Love World charms walk away across a parking lot. One person without a charm remains behind.");

  scheduleCallStep(() => {
    if (archiveState !== "trend-friends") {
      return;
    }

    setStoryState("coercion-flyer");
    announceCallStatus("The parking-lot image freezes.");
  }, 3200);

  scheduleCallStep(() => {
    if (archiveState !== "coercion-flyer") {
      return;
    }

    setPropagandaCaption("first");
    announceCallStatus("Everyone belongs in love.");
  }, 4400);

  scheduleCallStep(() => {
    if (archiveState !== "coercion-flyer") {
      return;
    }

    setStoryState("coercion-final");
    setPropagandaCaption("first");
    announceCallStatus("Everyone belongs in love. The parking-lot image remains still.");
  }, 7600);

  scheduleCallStep(() => {
    if (archiveState !== "coercion-final") {
      return;
    }

    showMailboxClosed({ withCut: false });
  }, 10400);
}

function showMailboxClosed({ withLongCut = false, withCut = true } = {}) {
  if (!mailboxScene) {
    return;
  }

  clearCallTimers();
  stopCallAudio();
  setStoryState("mailbox-closed");

  if (withCut) {
    playMailboxCut(withLongCut ? 190 : 140);
  }
  announceCallStatus("A closed mailbox stands beside a quiet suburban road.");

  scheduleCallStep(() => {
    if (archiveState !== "mailbox-closed") {
      return;
    }

    setMailboxAction("mailbox");
    announceCallStatus("There is something inside the mailbox.");
  }, 900);
}

function openMailbox() {
  if (archiveState !== "mailbox-closed" || mailboxAction !== "mailbox") {
    return;
  }

  clearCallTimers();
  setMailboxAction(null);
  playMailboxFoley("latch");
  setStoryState("mailbox-open");
  playMailboxCut(90);
  announceCallStatus("The mailbox opens. A faded pink envelope is inside.");

  scheduleCallStep(() => {
    if (archiveState !== "mailbox-open") {
      return;
    }

    playMailboxFoley("paper");
    setStoryState("mailbox-contents");
    playMailboxCut(85);
    announceCallStatus("Inside are a photograph of four friends and a Love World heart-and-cat keychain.");

    scheduleCallStep(() => {
      if (archiveState === "mailbox-contents") {
        setMailboxAction("photo");
      }
    }, 900);
  }, 1000);
}

function turnMailboxPhoto() {
  if (archiveState !== "mailbox-contents" || mailboxAction !== "photo") {
    return;
  }

  clearCallTimers();
  setMailboxAction(null);
  playMailboxFoley("paper");
  setStoryState("mailbox-back");
  playMailboxCut(90);
  announceCallStatus("The back of the photograph reads: We saved yours.");

  scheduleCallStep(() => {
    if (archiveState !== "mailbox-back") {
      return;
    }

    setMailboxMemoryVisible(true);
    announceCallStatus("You don't remember leaving it behind.");
  }, 2400);

  scheduleCallStep(() => {
    if (archiveState !== "mailbox-back") {
      return;
    }

    showCharmGone();
  }, 5200);
}

function showCharmGone() {
  if (archiveState !== "mailbox-back") {
    return;
  }

  clearCallTimers();
  setMailboxAction(null);
  playMailboxFoley("latch");
  setStoryState("mailbox-empty");
  playCharmGlitch();
  announceCallStatus("The Love World keychain is gone. The photograph remains face down.");

  scheduleCallStep(() => {
    if (archiveState === "mailbox-empty") {
      startWishPriceEpilogue();
    }
  }, 1600);
}

function startWishPriceEpilogue() {
  if (archiveState !== "mailbox-empty" || !wishPriceScene) {
    return;
  }

  clearCallTimers();
  stopCallAudio();
  setStoryState("wish-price");
  announceCallStatus("The mailbox fades into the image of the angel.");

  scheduleCallStep(() => {
    if (archiveState === "wish-price") {
      intro.classList.add("is-wish-price-image-visible");
    }
  }, 120);

  scheduleCallStep(() => {
    if (archiveState !== "wish-price") {
      return;
    }

    intro.classList.add("is-wish-price-line-one");
    wishPriceLineOne?.setAttribute("aria-hidden", "false");
    announceCallStatus("But every wish...");
  }, 1800);

  scheduleCallStep(() => {
    if (archiveState !== "wish-price") {
      return;
    }

    intro.classList.add("is-wish-price-line-two");
    wishPriceLineTwo?.setAttribute("aria-hidden", "false");
    announceCallStatus("But every wish asks for something in return.");
  }, 3100);

  scheduleCallStep(() => {
    if (archiveState !== "wish-price" || !wishPriceAdvance) {
      return;
    }

    intro.classList.add("is-wish-price-awaiting");
    wishPriceAdvance.disabled = false;
    wishPriceAdvance.setAttribute("aria-hidden", "false");
    announceCallStatus("The wish remains on screen. Click to continue.");
  }, 4200);
}

function finishWishPriceEpilogue() {
  if (archiveState !== "wish-price" || !wishPriceAdvance || wishPriceAdvance.disabled) {
    return;
  }

  clearCallTimers();
  wishPriceAdvance.disabled = true;
  wishPriceAdvance.setAttribute("aria-hidden", "true");
  intro.classList.remove("is-wish-price-awaiting");
  intro.classList.add("is-wish-price-copy-leaving");

  scheduleCallStep(() => {
    if (archiveState === "wish-price") {
      intro.classList.add("is-wish-price-image-leaving");
    }
  }, 850);

  scheduleCallStep(() => {
    if (archiveState !== "wish-price") {
      return;
    }

    intro.classList.add("is-wish-price-ended");
    wishPriceLineOne?.setAttribute("aria-hidden", "true");
    wishPriceLineTwo?.setAttribute("aria-hidden", "true");
    announceCallStatus("The screen is dark.");
  }, 2150);
}

function restoreMailboxState(state, action, status) {
  clearCallTimers();
  stopCallAudio();
  setStoryState(state);
  setMailboxAction(action);
  announceCallStatus(status);
}

function activateMailboxAction() {
  if (mailboxAction === "mailbox") {
    openMailbox();
  } else if (mailboxAction === "photo") {
    turnMailboxPhoto();
  }
}

function returnToTrendCity() {
  clearCallTimers();
  stopCallAudio();
  resetRoomTelephoneSequence();
  setStoryState("trend-city");
  armCityAdvance();
  announceCallStatus("Love World has spread through the city.");
}

function returnToTrendRoom() {
  clearCallTimers();
  stopCallAudio();
  resetRoomTelephoneSequence();
  setStoryState("trend-room");
  scheduleRoomTelephoneRing(prefersReducedMotion.matches ? 100 : 900);
  announceCallStatus("Observation may continue through the window.");
}

function showCallEndedState() {
  setCallAdvanceMode(null);
  setCallState("call-ended");
  playStaticCut();
  stopCallAudio();

  if (callMuteButton) {
    callMuteButton.hidden = true;
  }

  announceCallStatus("Signal lost. Thank you for calling. Have a lovely day.");
  scheduleCallStep(() => {
    if (archiveState === "call-ended") {
      setCallAdvanceMode("to-trend-interviews");
      announceCallStatus("Signal lost. Click to continue.");
    }
  }, callEndedLockMs);
}

function continueCallSequence() {
  if (callAdvanceMode === "to-ended" && archiveState === "call-answered") {
    showCallEndedState();
    return;
  }

  if (callAdvanceMode === "to-trend-interviews" && archiveState === "call-ended") {
    showTrendInterviews();
    return;
  }

}

function startCallSequence() {
  if (archiveState !== "broadcast") {
    return;
  }

  clearCallTimers();
  stopCallAudio();
  showBroadcastAdFinalFrame();
  setCallState("call-dialing");
  setBroadcastCallDisabled(true);

  if (callMuteButton) {
    callMuteButton.hidden = false;
    callMuteButton.setAttribute("aria-pressed", String(isCallMuted));
    callMuteButton.textContent = isCallMuted ? "UNMUTE" : "MUTE";
    callMuteButton.setAttribute("aria-label", isCallMuted ? "Unmute call audio" : "Mute call audio");
    window.requestAnimationFrame(() => callMuteButton.focus({ preventScroll: true }));
  }

  announceCallStatus("Calling live line 001, the girl.");
  prepareCallAudio();
  playRingCue();
  scheduleCallStep(playRingCue, 850);
  scheduleCallStep(playRingCue, 1700);

  scheduleCallStep(() => {
    setCallState("call-answered");
    announceCallStatus("The girl answers: hello? Are you watching? They said I wished for—");
  }, callDialingMs);

  scheduleCallStep(() => {
    if (archiveState === "call-answered") {
      setCallAdvanceMode("to-ended");
      announceCallStatus("The girl stops. Click to continue.");
    }
  }, callDialingMs + callAnsweredReadMs);
}

function toggleCallMute() {
  isCallMuted = !isCallMuted;

  if (callAudioGain && callAudioContext) {
    callAudioGain.gain.setValueAtTime(isCallMuted ? 0 : 1, callAudioContext.currentTime);
  }

  if (callMuteButton) {
    callMuteButton.setAttribute("aria-pressed", String(isCallMuted));
    callMuteButton.textContent = isCallMuted ? "UNMUTE" : "MUTE";
    callMuteButton.setAttribute("aria-label", isCallMuted ? "Unmute call audio" : "Mute call audio");
  }
}

function drawSignalTears() {
  ctx.save();
  ctx.font = `${Math.max(6, cellY * 0.95)}px ${canvasFontFamily}`;
  ctx.textBaseline = "middle";

  for (let index = 0; index < 14; index += 1) {
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
  ctx.font = `${Math.max(5, cellY * 0.68)}px ${canvasFontFamily}`;
  ctx.textBaseline = "middle";

  if (isWideDuo) {
    drawCaptionMarkRange(width * 0.06, width * 0.3);
    drawCaptionMarkRange(width * 0.7, width * 0.94);
    ctx.restore();
    return;
  }

  drawCaptionMarkRange(width * 0.06, width * 0.38);

  ctx.restore();
}

function drawCaptionMarkRange(startX, endX) {
  for (let x = startX; x < endX; x += cellX * 1.45) {
    if (Math.random() > 0.32) {
      ctx.fillText(digitGlyphs[Math.floor(Math.random() * digitGlyphs.length)], x, height * 0.93 + random(-2, 2));
    }
  }
}

function render(timestamp = 0) {
  const elapsed = timestamp - lastRenderTime;

  if (elapsed < maxFrameMs) {
    requestAnimationFrame(render);
    return;
  }

  lastRenderTime = timestamp - (elapsed % maxFrameMs);
  frame += 1;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);

  drawBackgroundMatrix();
  drawAsciiMask();

  if (!isWideDuo && !prefersReducedMotion.matches && frame % 24 === 0) {
    drawSignalTears();
  }

  drawReferenceStyleCaptionMarks();
  requestAnimationFrame(render);
}

function start() {
  resize();
  render();
}

if (!sourceImage || sourceImage.complete) {
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
  pointer.strength = 18;
});

canvas.addEventListener("pointerup", () => {
  pointer.strength = 12;
});

if (enterButton && prologueScene) {
  enterButton.addEventListener("click", enterArchive);
}

if (archiveBackButton) {
  archiveBackButton.addEventListener("click", goBack);
}

for (const button of prologueEntryButtons) {
  button.addEventListener("click", enterMythBeforeBroadcast);
}

for (const button of doctrineCloserButtons) {
  button.addEventListener("mouseenter", () => setDoctrineHover(true));
  button.addEventListener("mouseleave", () => setDoctrineHover(false));
  button.addEventListener("focus", () => setDoctrineHover(true));
  button.addEventListener("blur", () => setDoctrineHover(false));
  button.addEventListener("click", () => {
    if (button.closest(".doctrine-copy--final")) {
      enterBroadcast();
      return;
    }

    acceptDoctrine();
  });
}

if (broadcastCamera) {
  broadcastCamera.addEventListener("animationend", (event) => {
    if (event.animationName === "broadcastAdTuneIn") {
      completeBroadcast();
    }
  });
}

for (const button of broadcastCallButtons) {
  button.addEventListener("click", startCallSequence);
}

if (broadcastAdVideo) {
  broadcastAdVideo.addEventListener("timeupdate", updateAdSubtitle);
  broadcastAdVideo.addEventListener("ended", finishOpeningBroadcast);
  broadcastAdVideo.addEventListener("playing", () => {
    intro.classList.add("is-broadcast-video-ready");
  });
  broadcastAdVideo.addEventListener("error", () => {
    intro.classList.remove("is-broadcast-video-ready");

    if (isOpeningBroadcastRunning && archiveState === "broadcast") {
      finishOpeningBroadcast();
    }
  });
  broadcastAdVideo.addEventListener("emptied", () => {
    intro.classList.remove("is-broadcast-video-ready");
  });
}

if (newsVideo) {
  newsVideo.addEventListener("timeupdate", updateNewsSubtitle);
  newsVideo.addEventListener("ended", transitionOpeningNewsToAdvertisement);
  newsVideo.addEventListener("error", () => {
    if (isOpeningBroadcastRunning && archiveState === "love-news") {
      transitionOpeningNewsToAdvertisement();
    }
  });
}

if (callSequence) {
  callSequence.addEventListener("click", () => {
    continueCallSequence();
  });
  callSequence.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();

    continueCallSequence();
  });
}

if (roomAdvanceButton) {
  roomAdvanceButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startCityTransition();
  });
}

if (cityAdvanceButton) {
  cityAdvanceButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startFriendsEnding();
  });
  cityAdvanceButton.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    startFriendsEnding();
  });
}

if (mailboxTargets.mailbox) {
  mailboxTargets.mailbox.addEventListener("click", openMailbox);
}

if (mailboxTargets.photo) {
  mailboxTargets.photo.addEventListener("click", turnMailboxPhoto);
}

if (mailboxPrompt) {
  mailboxPrompt.addEventListener("click", activateMailboxAction);
  mailboxPrompt.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    activateMailboxAction();
  });
}

if (wishPriceAdvance) {
  wishPriceAdvance.addEventListener("click", finishWishPriceEpilogue);
}

if (mailboxScene) {
  mailboxScene.addEventListener("keydown", (event) => {
    if ((event.key !== "Enter" && event.key !== " ") || !event.target.closest(".story-mailbox__target")) {
      return;
    }

    event.preventDefault();
    activateMailboxAction();
  });
}

for (const button of globalNavButtons) {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const destination = button.dataset.destination;

    if (!destination) {
      return;
    }

    window.dispatchEvent(new CustomEvent("loveworld:navigate", {
      detail: {
        destination,
        fromState: archiveState,
      },
    }));
  });
}

if (callAdvanceButton) {
  callAdvanceButton.addEventListener("click", continueCallSequence);
}

if (callMuteButton) {
  callMuteButton.addEventListener("click", toggleCallMute);
}

resetCallSequence();

if (isBridgePreview) {
  hasEnteredArchive = true;
  archiveState = "prologue";
  intro.classList.add("is-prologue", "is-bridge-preview");
  prologueScene?.setAttribute("aria-hidden", "false");
  doctrineScene?.setAttribute("aria-hidden", "true");
  broadcastScene?.setAttribute("aria-hidden", "true");
  setPrologueEntryDisabled(false);

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }

  enterMythBeforeBroadcast();
}

if (isPropagandaPreview && flyerScene) {
  hasEnteredArchive = true;
  intro.classList.add("is-broadcast", "is-propaganda-preview");
  setStoryState("trend-friends");

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }

  playParkingLotAmbience();
  announceCallStatus("LOVE WORLD parking-lot preview. Four friends leave while one person remains behind.");

  scheduleCallStep(() => {
    if (archiveState !== "trend-friends") {
      return;
    }

    setStoryState("coercion-flyer");
    announceCallStatus("The parking-lot image freezes.");
  }, 3200);

  scheduleCallStep(() => {
    if (archiveState !== "coercion-flyer") {
      return;
    }

    setPropagandaCaption("first");
    announceCallStatus("Everyone belongs in love.");
  }, 4400);

  scheduleCallStep(() => {
    if (archiveState !== "coercion-flyer") {
      return;
    }

    setStoryState("coercion-final");
    setPropagandaCaption("first");
    announceCallStatus("Everyone belongs in love. The parking-lot image remains still.");
  }, 7600);

  scheduleCallStep(() => {
    if (archiveState !== "coercion-final") {
      return;
    }

    showMailboxClosed({ withCut: false });
  }, 10400);
}

if (isMailboxPreview && mailboxScene) {
  hasEnteredArchive = true;
  intro.classList.add("is-broadcast", "is-mailbox-preview");

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }

  showMailboxClosed();
}

if (isWishPricePreview && wishPriceScene) {
  hasEnteredArchive = true;
  intro.classList.add("is-broadcast", "is-wish-preview");

  if (archiveBackButton) {
    archiveBackButton.disabled = false;
  }

  setStoryState("mailbox-empty");
  startWishPriceEpilogue();
}
