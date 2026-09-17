const SELECTOR = 'img.zoomable, .markdown img';
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const DOUBLE_TAP_MS = 340;

/**
 * One zoomable picture.
 *
 * `placeholder` exists for images shown as a smaller copy of themselves — the homepage strip shows
 * 768px thumbnails and names the full file in `data-zoom-src`. The zoom opens on the thumbnail
 * (usually already downloaded and decoded) and swaps the full image in when it is ready, with a
 * small spinner over it if that takes long enough to notice. A skeleton shimmer over a picture you
 * can already see would read as broken; a picture that is there at once and sharpens reads as fast.
 */
type Item = { src: string; alt: string; placeholder?: string };

/** Bumped whenever the displayed image changes or the zoom closes, so a slow full-size load
 *  that lands afterwards knows it is no longer wanted. */
let imageToken = 0;

let overlay: HTMLDivElement | null = null;
let stageEl: HTMLDivElement | null = null;
let imageEl: HTMLImageElement | null = null;
let items: Item[] = [];
let currentIndex = 0;
let navEnabled = true;
let isBound = false;

let scale = 1;
let panX = 0;
let panY = 0;
let suppressCloseUntil = 0;
let lastTapTs = 0;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragPanStartX = 0;
let dragPanStartY = 0;
let dragStartedOnImage = false;

const activePointers = new Map<number, { x: number; y: number }>();
let isPinching = false;
let pinchStartDistance = 0;
let pinchStartScale = 1;
let pinchCenterX = 0;
let pinchCenterY = 0;
let isNavigating = false;

function getTargets(): HTMLImageElement[] {
  return Array.from(document.querySelectorAll<HTMLImageElement>(SELECTOR));
}

/**
 * Marks the thumbnail the overlay is currently showing.
 *
 * The overlay does not cover the page opaquely, so the picture you clicked is still
 * visible behind it -- and on a mouse it would drop its hover state the instant the
 * pointer moved onto the overlay: the frame snapped from gold back to grey and the image
 * un-zoomed while you were still looking at it. Touch has no hover to lose, which is why
 * phones already behaved the way they should. This gives every platform the touch
 * behaviour: the source keeps its raised look for as long as it is the one open, and
 * settles back once the overlay is gone.
 *
 * It follows the arrow keys too, so paging through a gallery moves the mark along with it.
 */
const SOURCE_CLASS = 'lx-zoom-source';

function markSource(index: number | null): void {
  document
    .querySelectorAll(`.${SOURCE_CLASS}`)
    .forEach((el) => el.classList.remove(SOURCE_CLASS));
  if (index === null) return;
  getTargets()[index]?.classList.add(SOURCE_CLASS);
}

function getItemFromImage(img: HTMLImageElement): Item {
  // currentSrc is empty until a lazy image has started loading, so fall back to the attribute.
  const shown = img.currentSrc || img.src;
  const alt = img.alt || '';
  // Absolute, so it compares equal to currentSrc-style URLs everywhere items are matched.
  const full = img.dataset.zoomSrc ? new URL(img.dataset.zoomSrc, window.location.href).href : '';
  if (!full || full === shown) return { src: shown, alt };
  return { src: full, alt, placeholder: shown };
}

/** The image holds a source that cannot be painted yet: hidden, and so wearing no glow. */
const PENDING_CLASS = 'lx-zoom-image--pending';
// On <html> while the zoom is open, for page styles that step aside (the showcase strip's arrows).
const ACTIVE_CLASS = 'lx-zoom-active';

/** Shows the spinner. Added only once loading has lasted SPINNER_DELAY_MS. */
const LOADING_CLASS = 'lx-zoom-overlay--loading';
/** Long enough that a fast load never shows a spinner at all; short enough to reassure on a slow one. */
const SPINNER_DELAY_MS = 280;
let spinnerTimer = 0;

/**
 * The spinner's delay lives here rather than as a CSS transition-delay, deliberately.
 *
 * The overlay is `display: none` while closed, and opening un-hides it in the same task that turns
 * loading on. An element that has just stopped being display:none has no previous style for a
 * transition to start from, so CSS skipped the delay entirely: the spinner appeared at full opacity
 * on the first frame of every opening and then faded out — a flash on exactly the fast loads it was
 * meant to stay invisible for. Added from a timer, the class always lands on a spinner that has
 * already been drawn at opacity 0, so the fade-in runs.
 */
function setLoading(on: boolean): void {
  window.clearTimeout(spinnerTimer);
  if (on) {
    spinnerTimer = window.setTimeout(() => overlay?.classList.add(LOADING_CLASS), SPINNER_DELAY_MS);
  } else {
    overlay?.classList.remove(LOADING_CLASS);
  }
}

/** Identifies the latest showSource call, so a load event for a source already replaced is ignored. */
let showSeq = 0;

/**
 * Put `src` into the zoom image, keeping it hidden until the browser can actually paint it.
 *
 * Shown straight away it was an empty box wearing the gold rim-light: open a screenshot whose tile
 * had not loaded and you got a glowing outline of nothing, then the picture popped in at a
 * different size. Now the element stays invisible until its image is ready, and is sized at that
 * moment from the image itself — so it no longer matters whether the tile had loaded.
 *
 * A source that is already decoded is revealed in the same task, with no fade, so opening a
 * picture you have seen before is as instant as it always was.
 */
function showSource(src: string, asPlaceholder: boolean, token: number, onShown?: () => void): void {
  if (!imageEl) return;
  const el = imageEl;
  const seq = ++showSeq;
  clearPlaceholderSize();
  el.classList.add(PENDING_CLASS);
  el.src = src;

  const reveal = (fadeIn: boolean) => {
    if (token !== imageToken || seq !== showSeq) return;
    if (asPlaceholder && el.naturalWidth > 0 && el.naturalHeight > 0) {
      sizeAsFullImage(el.naturalWidth / el.naturalHeight);
    }
    el.classList.remove(PENDING_CLASS);
    if (fadeIn) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    clampPan();
    applyTransform(false);
    onShown?.();
  };

  if (el.complete && el.naturalWidth > 0) {
    reveal(false);
    return;
  }
  const onLoad = () => reveal(true);
  el.addEventListener('load', onLoad, { once: true });
  el.addEventListener('error', onLoad, { once: true });
}

/**
 * Give the image element the size the FULL image will have, while it is showing the thumbnail.
 *
 * The zoom image is `width: auto` under max-width/max-height caps, so it takes its own pixel
 * size: a 768px thumbnail would open at 768px on a desktop and then jump to ~1224px when the
 * 1920px file replaced it. Here the box is fitted to the caps at the picture's proportions,
 * which is exactly where a full-size screenshot lands (the caps never exceed 1920x1080).
 */
function sizeAsFullImage(aspect: number | undefined): void {
  if (!imageEl || !aspect) return;
  const cs = window.getComputedStyle(imageEl);
  const maxW = parseFloat(cs.maxWidth);
  const maxH = parseFloat(cs.maxHeight);
  if (!(maxW > 0) || !(maxH > 0)) return;
  const width = Math.min(maxW, maxH * aspect);
  imageEl.style.width = `${width}px`;
  imageEl.style.height = `${width / aspect}px`;
}

function clearPlaceholderSize(): void {
  imageEl?.style.removeProperty('width');
  imageEl?.style.removeProperty('height');
}

/**
 * Fetch and decode the full image off-screen, then put it in place of the thumbnail.
 *
 * Decoding first is what makes the swap invisible: the browser already holds the pixels, so the
 * new source paints in the same frame instead of flashing blank while it loads. If the load fails
 * the thumbnail simply stays — a slightly soft picture beats a broken one.
 */
/**
 * The last few full-size images opened, held so the browser keeps them.
 *
 * Once a picture stopped being on screen, WebKit let its full-size file go from memory, so
 * reopening it a few seconds later started from the thumbnail and downloaded the 1920px file again
 * — measured on the iPhone profile: one new request for a picture opened three seconds earlier.
 * Chromium held on, which is why desktop never showed it. Holding a reference keeps the file in the
 * page's memory cache, so a reopen finds it complete immediately and goes straight to full size.
 * The cost is the encoded files (~219 KB each); decoded pixels stay the browser's to manage.
 */
const RECENT_FULL_LIMIT = 8;
const recentFull = new Map<string, HTMLImageElement>();

function rememberFull(img: HTMLImageElement): void {
  recentFull.delete(img.src);
  recentFull.set(img.src, img);
  while (recentFull.size > RECENT_FULL_LIMIT) {
    const oldest = recentFull.keys().next().value;
    if (oldest === undefined) break;
    recentFull.delete(oldest);
  }
}

function upgradeToFull(full: HTMLImageElement, token: number): void {
  const src = full.src;
  const ready =
    typeof full.decode === 'function'
      ? full.decode()
      : new Promise<void>((resolve, reject) => {
          full.onload = () => resolve();
          full.onerror = () => reject(new Error('load failed'));
        });
  ready
    .then(() => {
      rememberFull(full);
      if (token !== imageToken || !imageEl) return;
      // Decoded, so showSource reveals it in this same task: no hidden frame, no size change.
      // Zoom and pan the reader already applied to the thumbnail are kept.
      showSource(src, false, token, () => setLoading(false));
    })
    .catch(() => {
      if (token === imageToken) setLoading(false);
    });
}

function syncItems(): void {
  items = getTargets().map(getItemFromImage);
}

function updateRouteUiState(): void {
  navEnabled = typeof window !== 'undefined' && window.location.pathname.startsWith('/media');
  if (!overlay) return;
  overlay.classList.toggle('lx-zoom-overlay--nav-disabled', !navEnabled);
}

function getDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getPanBounds(): { maxX: number; maxY: number } {
  if (!imageEl || !stageEl) return { maxX: 0, maxY: 0 };
  const baseW = imageEl.offsetWidth || 0;
  const baseH = imageEl.offsetHeight || 0;

  const style = window.getComputedStyle(stageEl);
  const pl = parseFloat(style.paddingLeft) || 0;
  const pr = parseFloat(style.paddingRight) || 0;
  const pt = parseFloat(style.paddingTop) || 0;
  const pb = parseFloat(style.paddingBottom) || 0;

  const stageW = Math.max(0, stageEl.clientWidth - pl - pr);
  const stageH = Math.max(0, stageEl.clientHeight - pt - pb);

  const scaledW = baseW * scale;
  const scaledH = baseH * scale;

  const maxX = Math.max(0, (scaledW - stageW) / 2);
  const maxY = Math.max(0, (scaledH - stageH) / 2);

  return { maxX, maxY };
}

function clampPan(): void {
  const { maxX, maxY } = getPanBounds();
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
}



function applyTransform(animate = false): void {
  if (!imageEl) return;
  if (animate) {
    // Force a reflow to ensure the transition is picked up
    void imageEl.offsetHeight;
    imageEl.style.transition = 'transform 360ms cubic-bezier(0.2, 0, 0.2, 1), opacity 240ms ease';
  } else {
    // When not animating, we keep transition empty so CSS doesn't interpolate
    imageEl.style.transition = '';
  }
  const [dx, dy] = wholePixelNudge();
  imageEl.style.transform = `translate3d(${panX + dx}px, ${panY + dy}px, 0) scale(${scale})`;
}

/**
 * How far to nudge the picture so its edges land on whole device pixels.
 *
 * A zoomed picture's left and top edges otherwise sit at whatever fraction of a pixel the zoom and the
 * pan add up to, and while it is dragged that fraction changes with every move. A sharp edge between
 * pixels is drawn half in one and half in the next, so the edge and its thin gold rim pulsed bright
 * and dark frame by frame. Measured on /media while dragging in small steps: the rim's brightest pixel
 * swung by 20%. With the edges on whole pixels it does not swing at all, and the picture still moves
 * with the pointer — never more than half a pixel away from where the pan puts it.
 *
 * Only the drawn position is nudged; panX/panY stay exact, so dragging and zooming maths are unchanged.
 * Skipped while the stage is animating in or out, when its box is not where it will settle.
 */
function wholePixelNudge(): [number, number] {
  if (!imageEl || !stageEl) return [0, 0];
  if (stageEl.getAnimations().some((a) => a.playState === 'running')) return [0, 0];
  const dpr = window.devicePixelRatio || 1;
  const stageBox = stageEl.getBoundingClientRect();
  const stageStyle = window.getComputedStyle(stageEl);
  const pl = parseFloat(stageStyle.paddingLeft) || 0;
  const pr = parseFloat(stageStyle.paddingRight) || 0;
  const pt = parseFloat(stageStyle.paddingTop) || 0;
  const pb = parseFloat(stageStyle.paddingBottom) || 0;
  const imageStyle = window.getComputedStyle(imageEl);
  const w = parseFloat(imageStyle.width) || 0;
  const h = parseFloat(imageStyle.height) || 0;
  if (!w || !h) return [0, 0];
  // The picture is centred in the stage's content box, and scaled about its own centre.
  const left = stageBox.left + pl + (stageBox.width - pl - pr) / 2 + panX - (w * scale) / 2;
  const top = stageBox.top + pt + (stageBox.height - pt - pb) / 2 + panY - (h * scale) / 2;
  const snap = (v: number) => Math.round(v * dpr) / dpr;
  return [snap(left) - left, snap(top) - top];
}

/**
 * Stops the page behind the zoom from scrolling.
 *
 * Where scrollbars take up room (a mouse-driven Windows or Linux browser), the scrollbar fades out
 * first and is hidden only once it is invisible (see "The page scrollbar" in custom.css): hiding it
 * straight away made it pop, and merely blocking scrolling let someone drag it while the page jerked
 * back. During the short fade the wheel, the scrolling keys and touch drags are blocked, and anything
 * else is put back.
 *
 * Where scrollbars float over the page (phones, macOS), hiding one changes nothing visible, so the
 * page is simply locked at once.
 */
const SCROLL_KEYS = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown']);
const SCROLLBAR_FADE_MS = 230;
let unlockScroll: (() => void) | null = null;
/** Whether the scrollbar is the fading kind, which comes back as the zoom starts to close. */
let scrollbarFades = false;

function lockScroll(): void {
  if (unlockScroll) return;
  const root = document.documentElement;
  const scrollbarTakesRoom = window.innerWidth - root.clientWidth > 0;
  scrollbarFades = scrollbarTakesRoom;
  if (!scrollbarTakesRoom) {
    root.classList.add('lx-scrollbar--locked');
    unlockScroll = () => root.classList.remove('lx-scrollbar--locked');
    return;
  }
  const keepX = window.scrollX;
  const keepY = window.scrollY;
  const block = (e: Event) => e.preventDefault();
  const blockKeys = (e: KeyboardEvent) => {
    // Space on a focused bar button presses it; only a Space aimed at the page would scroll.
    if (e.key === ' ' && (e.target as Element | null)?.closest?.('button')) return;
    if (SCROLL_KEYS.has(e.key)) e.preventDefault();
  };
  const putBack = () => {
    if (window.scrollX !== keepX || window.scrollY !== keepY) window.scrollTo(keepX, keepY);
  };
  window.addEventListener('wheel', block, { passive: false, capture: true });
  window.addEventListener('touchmove', block, { passive: false, capture: true });
  window.addEventListener('keydown', blockKeys, { capture: true });
  window.addEventListener('scroll', putBack);
  root.classList.add('lx-scrollbar--hidden');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lockTimer = window.setTimeout(
    () => root.classList.add('lx-scrollbar--keep-room', 'lx-scrollbar--locked'),
    reducedMotion ? 0 : SCROLLBAR_FADE_MS
  );
  unlockScroll = () => {
    window.clearTimeout(lockTimer);
    window.removeEventListener('wheel', block, { capture: true });
    window.removeEventListener('touchmove', block, { capture: true });
    window.removeEventListener('keydown', blockKeys, { capture: true });
    window.removeEventListener('scroll', putBack);
    // Back first, still invisible, then faded in once it has been drawn.
    root.classList.remove('lx-scrollbar--locked', 'lx-scrollbar--keep-room');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('lx-scrollbar--hidden')));
  };
}

function releaseScroll(): void {
  unlockScroll?.();
  unlockScroll = null;
}

function setScale(nextScale: number, animate = true): void {
  scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextScale));
  if (scale <= 1) {
    panX = 0;
    panY = 0;
  }
  overlay?.classList.toggle('lx-zoom-overlay--zoomed', scale > 1);
  clampPan();
  applyTransform(animate);
}

function setScaleAtPoint(nextScale: number, clientX: number, clientY: number, animate = true): void {
  if (!imageEl) {
    setScale(nextScale, animate);
    return;
  }
  const prev = scale;
  scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextScale));
  if (scale <= 1) {
    panX = 0;
    panY = 0;
  } else if (prev > 0) {
    const rect = imageEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const ratio = scale / prev;
    panX -= (clientX - cx) * (ratio - 1);
    panY -= (clientY - cy) * (ratio - 1);
  }
  overlay?.classList.toggle('lx-zoom-overlay--zoomed', scale > 1);
  clampPan();
  applyTransform(animate);
}

function setImage(index: number, opacity = '1'): void {
  if (!imageEl || !items.length) return;
  currentIndex = (index + items.length) % items.length;
  const item = items[currentIndex];
  const token = ++imageToken;

  imageEl.alt = item.alt;
  imageEl.style.opacity = opacity;
  imageEl.draggable = false;
  markSource(currentIndex);
  resetOpenedState();
  setLoading(true);

  if (!item.placeholder) {
    showSource(item.src, false, token, () => setLoading(false));
  } else {
    // Already fetched and decoded earlier in this visit? Then go straight to the full image.
    // Showing the thumbnail first regardless is what made a picture you had already opened
    // re-sharpen every single time. Checking `complete` on a fresh Image does not start a second
    // download: if it is not cached, the same object is handed to upgradeToFull below.
    const kept = recentFull.get(item.src);
    const full = kept ?? new Image();
    if (!kept) full.src = item.src;
    if (full.complete && full.naturalWidth > 0) {
      rememberFull(full);
      showSource(item.src, false, token, () => setLoading(false));
    } else {
      showSource(item.placeholder, true, token);
      upgradeToFull(full, token);
    }
  }
  applyTransform(false);
}

function resetOpenedState(): void {
  scale = 1;
  panX = 0;
  panY = 0;
  activePointers.clear();
  isPinching = false;
  isDragging = false;
  dragStartedOnImage = false;
  overlay?.classList.remove('lx-zoom-overlay--zoomed');
}

/**
 * The layers that fade when the zoom opens and closes: the tint and the button bar. The stage has its
 * own scale-and-fade below.
 *
 * Safari 26 on iPhone paints a band under its toolbar coloured from a full-screen layer like the tint,
 * and while the tint fades it recolours that band in visible steps. That is Safari's doing; every
 * workaround tried cost more elsewhere than it saved there, so the tint simply fades like everywhere.
 */
function fadeLayers(): HTMLElement[] {
  if (!overlay) return [];
  return Array.from(overlay.children).filter((el): el is HTMLElement => el !== stageEl);
}

function animateOpen(): void {
  if (!overlay || !imageEl || !stageEl) return;
  overlay.classList.add('lx-zoom-overlay--open');
  document.documentElement.classList.add(ACTIVE_CLASS);
  window.dispatchEvent(new CustomEvent('licentia-zoom-change', { detail: { open: true } }));
  for (const layer of fadeLayers()) {
    layer.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 230,
      easing: 'cubic-bezier(0.2, 0, 0.2, 1)',
      fill: 'forwards',
    });
  }
  stageEl.animate(
    [
      { transform: 'scale(0.97)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    { duration: 230, easing: 'cubic-bezier(0.2, 0, 0.2, 1)', fill: 'forwards' }
  );
}

function animateClose(): Promise<void> {
  if (!overlay || !stageEl) return Promise.resolve();
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  for (const layer of fadeLayers()) {
    layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 210, easing, fill: 'forwards' });
  }
  // Now fades all the way out itself (the overlay used to take it to 0), and holds there until the
  // overlay is hidden, so it cannot flash back for a frame first. The next open replaces it.
  const stageAnim = stageEl.animate(
    [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.985)', opacity: 0 },
    ],
    { duration: 210, easing, fill: 'forwards' }
  );
  return new Promise((resolve) => {
    stageAnim.onfinish = () => resolve();
    stageAnim.oncancel = () => resolve();
  });
}

function openOverlay(index: number): void {
  if (!overlay) return;
  // Shown before setImage, so sizeAsFullImage reads the caps from a laid-out element. The overlay
  // is still transparent until animateOpen, so nothing is seen early.
  overlay.style.display = '';
  setImage(index);

  lockScroll();

  animateOpen();
}

async function closeOverlay(): Promise<void> {
  if (!overlay) return;
  overlay.classList.remove('lx-zoom-overlay--zoomed');
  // Dropped as the close starts, so what the zoom hid fades back in while the zoom fades out.
  document.documentElement.classList.remove(ACTIVE_CLASS);
  // A fading scrollbar fades back in alongside the zoom fading out. A phone's lock stays until the
  // zoom is gone: changing the page's overflow mid-fade is the kind of thing Safari's toolbar reacts to.
  if (scrollbarFades) releaseScroll();
  await animateClose();
  overlay.classList.remove('lx-zoom-overlay--open');
  overlay.style.display = 'none';
  releaseScroll();
  // Released only once the overlay is out of the way, so the thumbnail is seen settling.
  markSource(null);
  window.dispatchEvent(new CustomEvent('licentia-zoom-change', { detail: { open: false } }));

  // Completely blank the image to prevent stale pixels on next open
  imageToken += 1; // and a full-size load still in flight must not land in a closed zoom
  setLoading(false);
  if (imageEl) {
    imageEl.removeAttribute('src');
    imageEl.style.opacity = '0';
    imageEl.classList.remove(PENDING_CLASS);
    clearPlaceholderSize();
  }

  resetOpenedState();
}

function isPointInsideImage(clientX: number, clientY: number): boolean {
  if (!imageEl) return false;
  const rect = imageEl.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

async function navigate(direction: 1 | -1): Promise<void> {
  if (!navEnabled || items.length < 2 || !imageEl || isNavigating) return;
  isNavigating = true;
  try {
    const out = imageEl.animate(
      [
        { transform: `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`, opacity: 1 },
        { transform: `translate3d(${panX + direction * -40}px, ${panY}px, 0) scale(${scale})`, opacity: 0 },
      ],
      { duration: 180, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
    );
    await out.finished;

    // Change source while invisible
    const nextIdx = (currentIndex + direction + items.length) % items.length;
    // Wait for what will be shown first — the thumbnail if there is one. setImage fetches the
    // full image behind it, so paging never waits on a 1920px download.
    const nextSrc = items[nextIdx].placeholder ?? items[nextIdx].src;

    // Preload & wait for actual load to avoid the "old image flash"
    // We use .decode() for modern browsers to ensure it's ready to paint
    const imgObj = new Image();
    imgObj.src = nextSrc;
    await new Promise((resolve) => {
      const finish = () => {
        if ('decode' in imgObj) {
          imgObj.decode().then(resolve).catch(resolve);
        } else {
          resolve(null);
        }
      };

      if (imgObj.complete && imgObj.naturalWidth > 0) finish();
      else {
        imgObj.onload = finish;
        imgObj.onerror = () => resolve(null);
        setTimeout(resolve, 2000); // Safety timeout
      }
    });

    setImage(nextIdx, '0');
    out.cancel();

    const inn = imageEl.animate(
      [
        { transform: `translate3d(${direction * 40}px, 0, 0) scale(0.98)`, opacity: 0 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
      ],
      { duration: 240, easing: 'cubic-bezier(0.2, 0, 0.2, 1)', fill: 'forwards' }
    );
    await inn.finished;
    imageEl.style.opacity = '1';
    applyTransform(false);

    setTimeout(() => {
      try {
        inn.cancel();
      } catch (e) {
        // ignore
      }
    }, 30);
  } finally {
    isNavigating = false;
  }
}

function ensureOverlay(): void {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.className = 'lx-zoom-overlay';
  overlay.style.display = 'none';
  // Icons are drawn, not typed: text symbols sit differently in every font, so they were never
  // reliably centred in their circles. Each path is centred on its 24-unit box.
  const icon = (d: string) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  overlay.innerHTML = `
    <div class="lx-zoom-dim" aria-hidden="true"></div>
    <div class="lx-zoom-bar">
      <button type="button" class="lx-zoom-btn lx-zoom-prev" aria-label="Previous">${icon('M15 6l-6 6 6 6')}</button>
      <button type="button" class="lx-zoom-btn lx-zoom-minus" aria-label="Zoom out">${icon('M5 12h14')}</button>
      <button type="button" class="lx-zoom-btn lx-zoom-close" aria-label="Close">${icon('M6 6l12 12M18 6L6 18')}</button>
      <button type="button" class="lx-zoom-btn lx-zoom-plus" aria-label="Zoom in">${icon('M12 5v14M5 12h14')}</button>
      <button type="button" class="lx-zoom-btn lx-zoom-next" aria-label="Next">${icon('M9 6l6 6-6 6')}</button>
    </div>
    <div class="lx-zoom-stage"><img class="lx-zoom-image" alt="" /><span class="lx-zoom-spinner" aria-hidden="true"></span></div>
  `;
  stageEl = overlay.querySelector('.lx-zoom-stage');
  imageEl = overlay.querySelector('.lx-zoom-image');

  // The picture re-centres and its size caps change with the window; keep the pan inside them.
  window.addEventListener('resize', () => {
    if (!overlay?.classList.contains('lx-zoom-overlay--open')) return;
    clampPan();
    applyTransform(false);
  });
  if (!stageEl || !imageEl) return;

  const closeBtn = overlay.querySelector('.lx-zoom-close') as HTMLButtonElement;
  const plusBtn = overlay.querySelector('.lx-zoom-plus') as HTMLButtonElement;
  const minusBtn = overlay.querySelector('.lx-zoom-minus') as HTMLButtonElement;
  const prevBtn = overlay.querySelector('.lx-zoom-prev') as HTMLButtonElement;
  const nextBtn = overlay.querySelector('.lx-zoom-next') as HTMLButtonElement;

  closeBtn.addEventListener('click', () => void closeOverlay());
  plusBtn.addEventListener('click', () => setScale(scale + 0.25, true));
  minusBtn.addEventListener('click', () => setScale(scale - 0.25, true));
  prevBtn.addEventListener('click', () => void navigate(-1));
  nextBtn.addEventListener('click', () => void navigate(1));

  imageEl.addEventListener('click', (e) => e.stopPropagation());
  imageEl.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = Math.abs(scale - 1) > 0.02 ? 1 : 2;
    setScaleAtPoint(next, e.clientX, e.clientY, true);
    suppressCloseUntil = Date.now() + 260;
  });

  stageEl.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
      setScaleAtPoint(scale * factor, e.clientX, e.clientY, false);
    },
    { passive: false }
  );

  stageEl.addEventListener('pointerdown', (e) => {
    if (!overlay?.classList.contains('lx-zoom-overlay--open')) return;
    const t = e.target as Element | null;
    if (t?.closest('.lx-zoom-btn')) return;
    const startedOnImage = !!t?.closest('.lx-zoom-image');
    if (!startedOnImage) return;

    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size === 2) {
      const [p1, p2] = Array.from(activePointers.values());
      pinchStartDistance = getDistance(p1, p2);
      pinchStartScale = scale;
      pinchCenterX = (p1.x + p2.x) / 2;
      pinchCenterY = (p1.y + p2.y) / 2;
      isPinching = pinchStartDistance > 0;
      isDragging = false;
      dragStartedOnImage = false;
      return;
    }

    isDragging = true;
    dragStartedOnImage = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragPanStartX = panX;
    dragPanStartY = panY;
    stageEl?.setPointerCapture(e.pointerId);
    overlay.classList.add('lx-zoom-overlay--dragging');
  });

  stageEl.addEventListener('pointermove', (e) => {
    if (activePointers.has(e.pointerId)) activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (isPinching && activePointers.size >= 2) {
      const [p1, p2] = Array.from(activePointers.values());
      const dist = getDistance(p1, p2);
      if (pinchStartDistance > 0) {
        const next = pinchStartScale * (dist / pinchStartDistance);
        setScaleAtPoint(next, pinchCenterX, pinchCenterY, false);
      }
      return;
    }

    if (!isDragging || scale <= 1) return;
    let tx = dragPanStartX + (e.clientX - dragStartX);
    let ty = dragPanStartY + (e.clientY - dragStartY);

    const { maxX, maxY } = getPanBounds();
    const overX = Math.max(0, Math.abs(tx) - maxX);
    const overY = Math.max(0, Math.abs(ty) - maxY);

    if (overX > 0) {
      const sign = tx > 0 ? 1 : -1;
      tx = sign * (maxX + overX * 0.38);
    }
    if (overY > 0) {
      const sign = ty > 0 ? 1 : -1;
      ty = sign * (maxY + overY * 0.38);
    }

    panX = tx;
    panY = ty;
    applyTransform(false);
  });

  stageEl.addEventListener('pointerup', (e) => {
    activePointers.delete(e.pointerId);
    if (isPinching && activePointers.size < 2) {
      isPinching = false;
      return;
    }
    if (!isDragging) return;
    isDragging = false;
    if (stageEl?.hasPointerCapture(e.pointerId)) stageEl.releasePointerCapture(e.pointerId);
    overlay?.classList.remove('lx-zoom-overlay--dragging');

    const { maxX, maxY } = getPanBounds();
    if (Math.abs(panX) > maxX || Math.abs(panY) > maxY) {
      clampPan();
      applyTransform(true);
    }

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Date.now() < suppressCloseUntil) {
      dragStartedOnImage = false;
      return;
    }

    if (absX < 8 && absY < 8 && dragStartedOnImage) {
      const now = Date.now();
      if (now - lastTapTs < DOUBLE_TAP_MS) {
        const next = Math.abs(scale - 1) > 0.02 ? 1 : 2;
        setScaleAtPoint(next, e.clientX, e.clientY, true);
        suppressCloseUntil = now + 260;
        lastTapTs = 0;
        dragStartedOnImage = false;
        return;
      }
      lastTapTs = now;
    }

    if (scale <= 1 && navEnabled && dragStartedOnImage && absX > 48 && absX > absY * 1.1) {
      if (dx < 0) void navigate(1);
      else void navigate(-1);
      dragStartedOnImage = false;
      return;
    }
    dragStartedOnImage = false;
  });

  stageEl.addEventListener('pointercancel', (e) => {
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) isPinching = false;
    if (isDragging && stageEl?.hasPointerCapture(e.pointerId)) stageEl.releasePointerCapture(e.pointerId);
    isDragging = false;
    overlay?.classList.remove('lx-zoom-overlay--dragging');
  });

  overlay.addEventListener('click', (e) => {
    if (Date.now() < suppressCloseUntil) return;
    const t = e.target as Element | null;
    if (!t) return;
    // The whole bar, not only its buttons: a tap on the bar between two buttons is a miss, not a close.
    if (t.closest('.lx-zoom-bar')) return;
    const me = e as MouseEvent;
    if (isPointInsideImage(me.clientX, me.clientY)) return;
    void closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay?.classList.contains('lx-zoom-overlay--open')) return;
    if (e.key === 'Escape') void closeOverlay();
    if (!navEnabled) return;
    if (e.key === 'ArrowLeft') void navigate(-1);
    if (e.key === 'ArrowRight') void navigate(1);
  });

  document.body.appendChild(overlay);
  updateRouteUiState();
}

/**
 * How far a press may move and still count as a click. The same figure the carousel uses for
 * its own drag threshold, so the two agree on where a tap ends and a drag begins.
 */
const DRAG_CLICK_SLOP_PX = 10;
let pressStartX = 0;
let pressStartY = 0;
let pressTracked = false;

function onDocumentPointerDown(event: PointerEvent): void {
  if (!event.isPrimary) return;
  pressStartX = event.clientX;
  pressStartY = event.clientY;
  pressTracked = true;
}

/** Distance between where the press went down and where its click landed. 0 if untracked. */
function pressTravel(event: MouseEvent): number {
  if (!pressTracked) return 0;
  pressTracked = false;
  return Math.hypot(event.clientX - pressStartX, event.clientY - pressStartY);
}

function onDocumentClick(event: MouseEvent): void {
  if (overlay?.classList.contains('lx-zoom-overlay--open')) {
    const targetEl = event.target as Element | null;
    if (targetEl?.closest('.lx-zoom-bar')) return;
    if (isPointInsideImage(event.clientX, event.clientY)) return;
    event.preventDefault();
    void closeOverlay();
    return;
  }

  const target = (event.target as Element | null)?.closest(SELECTOR) as HTMLImageElement | null;
  if (!target) return;
  // A press that travelled was a drag, not a click. Browsers still deliver a click when a drag
  // ends over the same element it started on — dragging the showcase strip and letting go over
  // a screenshot would otherwise open that screenshot. The carousel does try to swallow that
  // click, but from a listener on its own root, and this one runs first: capture on `document`
  // precedes every descendant. So the check has to live here.
  if (pressTravel(event) > DRAG_CLICK_SLOP_PX) return;
  event.preventDefault();
  syncItems();
  const clicked = getItemFromImage(target).src;
  const idx = Math.max(0, items.findIndex((it) => it.src === clicked));
  ensureOverlay();
  openOverlay(idx);
}

function bind(): void {
  if (isBound) return;
  isBound = true;
  // Use the CAPTURE phase, not bubble. Some theme components legitimately call
  // event.stopPropagation() on clicks inside them -- Docusaurus's <Details> (used by every
  // collapsible `<details>` block) does it unconditionally to isolate nested summaries. A
  // bubble-phase listener on `document` sits above React's delegation root, so those clicks
  // never arrived here and images inside collapsibles were unzoomable (CSS still showed the
  // zoom cursor, so it looked clickable). Capture runs before any descendant handler and
  // cannot be vetoed by them. This handler no-ops for non-image targets, so summary clicks
  // and the collapse toggle are unaffected.
  document.addEventListener('click', onDocumentClick, true);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
}

export default (() => {
  if (typeof window === 'undefined') return null;
  return {
    onRouteUpdate() {
      bind();
      syncItems();
      ensureOverlay();
      updateRouteUiState();
    },
  };
})();
