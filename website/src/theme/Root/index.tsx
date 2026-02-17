import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';

const resizeObservers = new WeakMap<HTMLImageElement, ResizeObserver>();

function shouldSkip(img: HTMLImageElement): boolean {
  return (
    img.classList.contains('shot') ||
    !!img.closest('.shotFrame') ||
    !!img.closest('.navbar') ||
    !!img.closest('footer') ||
    !!img.closest('h1') ||
    !!img.closest('h2')
  );
}

function reserveSize(img: HTMLImageElement): { width: string; height: string } {
  const parentWidth = img.parentElement?.clientWidth ?? 0;
  const attrW = Number(img.getAttribute('width') || 0);
  const attrH = Number(img.getAttribute('height') || 0);
  const attrRatio = attrW > 0 && attrH > 0 ? attrW / attrH : 0;
  const rect = img.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    return { width: `${Math.round(rect.width)}px`, height: `${Math.round(rect.height)}px` };
  }

  if (attrW > 0 && attrH > 0) {
    return { width: `${attrW}px`, height: `${attrH}px` };
  }

  if (img.closest('.navbar__brand')) return { width: '160px', height: '40px' };
  if (img.closest('footer')) return { width: '160px', height: '48px' };
  if (img.closest('h1')) {
    const width = parentWidth > 0 ? Math.min(parentWidth, 420) : 420;
    return { width: `${Math.round(width)}px`, height: '120px' };
  }
  if (img.closest('h2')) {
    const width = parentWidth > 0 ? Math.min(parentWidth, 320) : 320;
    return { width: `${Math.round(width)}px`, height: '80px' };
  }
  if (img.closest('.theme-doc-markdown')) {
    // Most guide screenshots are close to 16:9. Keep placeholder near final shape
    // to minimize layout jump before decode.
    const ratio = attrRatio || 16 / 9;
    const width = rect.width > 0
      ? rect.width
      : parentWidth > 0
        ? Math.min(parentWidth, 860)
        : 640;
    const h = Math.max(90, Math.round(width / ratio));
    return { width: `${Math.round(width)}px`, height: `${h}px` };
  }

  if (rect.width > 0) {
    const ratio = attrRatio || 16 / 9;
    const guessed = Math.max(60, Math.round(rect.width / ratio));
    return { width: `${Math.round(rect.width)}px`, height: `${guessed}px` };
  }

  return { width: '220px', height: '124px' };
}

function positionSkeleton(img: HTMLImageElement, skeleton: HTMLSpanElement, parent: HTMLElement): void {
  const imgRect = img.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const cs = window.getComputedStyle(img);
  const fallback = reserveSize(img);

  const top = Math.max(0, imgRect.top - parentRect.top);
  const left = Math.max(0, imgRect.left - parentRect.left);
  const width = imgRect.width > 0 ? imgRect.width : Number.parseFloat(fallback.width) || 220;
  const height = imgRect.height > 0 ? imgRect.height : Number.parseFloat(fallback.height) || 124;

  skeleton.style.top = `${Math.round(top)}px`;
  skeleton.style.left = `${Math.round(left)}px`;
  skeleton.style.width = `${Math.round(width)}px`;
  skeleton.style.height = `${Math.round(height)}px`;
  skeleton.style.borderRadius = cs.borderRadius;
}

function watchSkeletonSize(img: HTMLImageElement, skeleton: HTMLSpanElement, parent: HTMLElement): void {
  const old = resizeObservers.get(img);
  if (old) old.disconnect();
  const ro = new ResizeObserver(() => {
    positionSkeleton(img, skeleton, parent);
  });
  ro.observe(img);
  ro.observe(parent);
  resizeObservers.set(img, ro);
}

function clearSkeleton(img: HTMLImageElement): void {
  const ro = resizeObservers.get(img);
  if (ro) {
    ro.disconnect();
    resizeObservers.delete(img);
  }

  const skeletonId = img.dataset.skeletonNodeId;
  if (skeletonId) {
    const node = document.getElementById(skeletonId);
    if (node instanceof HTMLElement) {
      node.classList.add('img-inline-skeleton-fadeout');
      const cleanup = () => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      };
      node.addEventListener('transitionend', cleanup, { once: true });
      window.setTimeout(cleanup, 180);
    }
    delete img.dataset.skeletonNodeId;
  }
  img.classList.remove('img-loading');
  img.classList.add('img-loaded');
}

function bindImageState(img: HTMLImageElement, forceRebind = false): void {
  if (shouldSkip(img)) return;
  if (!forceRebind && img.dataset.skeletonBound === '1') return;
  img.dataset.skeletonBound = '1';

  clearSkeleton(img);

  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('img-loaded');
    return;
  }

  const parent = img.parentElement;
  if (!parent) return;
  const parentStyle = window.getComputedStyle(parent);
  if (parentStyle.position === 'static') {
    parent.style.position = 'relative';
  }

  const skeleton = document.createElement('span');
  const uid = `img-skeleton-${Math.random().toString(36).slice(2)}`;
  skeleton.id = uid;
  skeleton.className = 'img-inline-skeleton';
  positionSkeleton(img, skeleton, parent);

  parent.appendChild(skeleton);
  watchSkeletonSize(img, skeleton, parent);
  img.dataset.skeletonNodeId = uid;
  img.classList.add('img-loading');
  img.classList.remove('img-loaded');

  const onDone = () => clearSkeleton(img);
  img.addEventListener('load', onDone, { once: true });
  img.addEventListener('error', onDone, { once: true });
  // Prevent a race where image completes before listeners are attached.
  if (img.complete) {
    clearSkeleton(img);
  }
}

function scanImages(root: ParentNode): void {
  root.querySelectorAll('img').forEach((node) => {
    if (node instanceof HTMLImageElement) bindImageState(node);
  });
}

export default function Root({ children }: PropsWithChildren): React.ReactElement {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    scanImages(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) {
          bindImageState(mutation.target, true);
          continue;
        }
        for (const node of Array.from(mutation.addedNodes)) {
          if (node instanceof HTMLImageElement) {
            bindImageState(node);
          } else if (node instanceof HTMLElement) {
            scanImages(node);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset'],
    });
    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
