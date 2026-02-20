const SELECTOR = 'img.zoomable, .markdown img:not([src*="-heading"])';
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const DOUBLE_TAP_MS = 340;

type Item = { src: string; alt: string };

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

function getItemFromImage(img: HTMLImageElement): Item {
  return {
    src: img.dataset.zoomSrc || img.currentSrc || img.src,
    alt: img.alt || '',
  };
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
  imageEl.style.transition = animate ? 'transform 320ms cubic-bezier(0.2, 0, 0.2, 1)' : 'none';
  imageEl.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;
  if (!animate) {
    requestAnimationFrame(() => {
      if (imageEl) imageEl.style.transition = '';
    });
  }
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

function setImage(index: number): void {
  if (!imageEl || !items.length) return;
  currentIndex = (index + items.length) % items.length;
  const item = items[currentIndex];
  imageEl.src = item.src;
  imageEl.alt = item.alt;
  imageEl.draggable = false;
  resetOpenedState();
  applyTransform(false);
}

function animateOpen(): void {
  if (!overlay || !imageEl || !stageEl) return;
  overlay.classList.add('lx-zoom-overlay--open');
  overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 230,
    easing: 'cubic-bezier(0.2, 0, 0.2, 1)',
    fill: 'forwards',
  });
  stageEl.animate(
    [
      { transform: 'scale(0.985)', opacity: 0.82 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    { duration: 230, easing: 'cubic-bezier(0.2, 0, 0.2, 1)', fill: 'none' }
  );
}

function animateClose(): Promise<void> {
  if (!overlay || !stageEl) return Promise.resolve();
  const overlayAnim = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 210,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards',
  });
  stageEl.animate(
    [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.985)', opacity: 0.82 },
    ],
    { duration: 210, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'none' }
  );
  return new Promise((resolve) => {
    overlayAnim.onfinish = () => resolve();
    overlayAnim.oncancel = () => resolve();
  });
}

function openOverlay(index: number): void {
  if (!overlay) return;
  setImage(index);
  overlay.style.display = '';
  document.body.style.overflow = 'hidden';
  animateOpen();
}

async function closeOverlay(): Promise<void> {
  if (!overlay) return;
  overlay.classList.remove('lx-zoom-overlay--zoomed');
  await animateClose();
  overlay.classList.remove('lx-zoom-overlay--open');
  overlay.style.display = 'none';
  document.body.style.removeProperty('overflow');
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
    setImage(currentIndex + direction);
    imageEl.style.opacity = '0';
    out.cancel(); // Stop the 'out' animation now that we've manually set opacity

    // Small delay to let browser start loading/parsing the new src
    await new Promise((r) => setTimeout(r, 40));

    const inn = imageEl.animate(
      [
        { transform: `translate3d(${direction * 40}px, 0, 0) scale(0.98)`, opacity: 0 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
      ],
      { duration: 240, easing: 'cubic-bezier(0.2, 0, 0.2, 1)', fill: 'forwards' }
    );
    await inn.finished;
    imageEl.style.opacity = '1';
    inn.cancel();

    applyTransform(false);
  } finally {
    isNavigating = false;
  }
}

function ensureOverlay(): void {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.className = 'lx-zoom-overlay';
  overlay.style.display = 'none';
  overlay.innerHTML = `
    <div class="lx-zoom-backdrop" aria-hidden="true"></div>
    <button class="lx-zoom-btn lx-zoom-close" aria-label="Close">✕</button>
    <button class="lx-zoom-btn lx-zoom-plus" aria-label="Zoom in">+</button>
    <button class="lx-zoom-btn lx-zoom-minus" aria-label="Zoom out">−</button>
    <button class="lx-zoom-btn lx-zoom-prev" aria-label="Previous">❮</button>
    <button class="lx-zoom-btn lx-zoom-next" aria-label="Next">❯</button>
    <div class="lx-zoom-stage"><img class="lx-zoom-image" alt="" /></div>
  `;
  stageEl = overlay.querySelector('.lx-zoom-stage');
  imageEl = overlay.querySelector('.lx-zoom-image');
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
    if (t.closest('.lx-zoom-btn')) return;
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

function onDocumentClick(event: MouseEvent): void {
  if (overlay?.classList.contains('lx-zoom-overlay--open')) {
    const targetEl = event.target as Element | null;
    if (targetEl?.closest('.lx-zoom-btn')) return;
    if (isPointInsideImage(event.clientX, event.clientY)) return;
    event.preventDefault();
    void closeOverlay();
    return;
  }

  const target = (event.target as Element | null)?.closest(SELECTOR) as HTMLImageElement | null;
  if (!target) return;
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
  document.addEventListener('click', onDocumentClick);
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
