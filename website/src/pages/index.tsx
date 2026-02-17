import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './index.module.css';
import React from 'react';
import Head from '@docusaurus/Head';
import { useColorMode } from '@docusaurus/theme-common';

/** ------- CONFIG -------- */
/** Load every image in /static/img/screenshots */
const req = (require as any).context(
  '@site/static/img/screenshots',
  false,
  /\.(png|jpe?g|webp)$/i
);
const ALL_SHOTS: string[] = req.keys().map((k: string) => req(k).default as string);
const HERO_DESCRIPTION =
  '1-click install NSFW Skyrim AE modlist built around Legacy of the Dragonborn with non-intrusive OStim, combat/graphics upgrades, new quests & followers!';
const FEATURES_TAGLINE = '"Unleash Power, Indulge Desire, Leave Heads Rolling"';
const SHOWCASE_TAGLINE = 'Join our Discord, share your screenshots, and we may feature them here!';
const HOME_META_DESCRIPTION =
  'Experience Licentia NEXT - a 1-click install NSFW Skyrim AE modlist with LotD, non-intrusive OStim, combat/graphics upgrades, new quests & followers!';
const HERO_BG_DARK = '/img/pages/licentia-social-card-bg.webp';
const HERO_BG_LIGHT = '/img/pages/licentia-social-card-bg-light.webp';

/** Main Hero function */
function Hero() {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();
  const [heroBgLoaded, setHeroBgLoaded] = React.useState(false);

  React.useEffect(() => {
    const bg = colorMode === 'light' ? HERO_BG_LIGHT : HERO_BG_DARK;
    setHeroBgLoaded(false);
    const img = new Image();
    img.onload = () => setHeroBgLoaded(true);
    img.onerror = () => setHeroBgLoaded(true);
    img.src = bg;
  }, [colorMode]);

  return (
    <section className={styles.hero}>
      <div className={clsx(styles.heroBg, heroBgLoaded && styles.heroBgReady)} />
      <div className={styles.heroOverlay} />

      <div className={clsx('container', styles.heroInner)}>
        <img
          className={styles.heroLogo}
          src="/img/licentia-social-card.webp"
          alt={`${siteConfig.title} logo`}
          width={400}
          height={260}
        />

        <p className={styles.description}>{HERO_DESCRIPTION}</p>

        <div className={styles.badges}>
          <span className={clsx('badge', styles.badge)}>Skyrim AE</span>
          <span className={clsx('badge', styles.badge)}>Wabbajack</span>
          <span className={clsx('badge', styles.badge)}>~1500 mods</span>
          <span className={clsx('badge', styles.badge)}>LotD</span>
          <span className={clsx('badge', styles.badge)}>OStim</span>
        </div>

        <div className={styles.ctaRow}>
          <a className={clsx('button button--primary button--lg', styles.ctaSolid)} href="/welcome">
            Install
          </a>
          <a className={clsx('button button--primary button--lg', styles.ctaSolid)} href="/how-to-update">
            Update
          </a>
        </div>
      </div>
    </section>
  );
}

function FeatureIcons() {
  return (
    <section className={styles.iconsSection} data-nosnippet>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <img
            src="/img/pages/index-features.png"
            alt="Features"
            className={styles.headingImg}
          />
        </h2>
        <p className={clsx(styles.tagline, styles.featuresTagline)}>
          <i>{FEATURES_TAGLINE}</i>
        </p>
        <div className={styles.iconRow}>
          {/* Combat */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>⚔️</span>
            <div className={styles.iconTitle}>Combat</div>
            <p className={styles.iconIntro}>Physics-based and gory:</p>
            <ul className={styles.iconList}>
              <li>Precision</li>
              <li>CGO + AGO</li>
              <li>Dismemberment Framework</li>
              <li>Sanguine Symphony</li>
            </ul>
          </div>

          {/* Graphics */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>🖼️</span>
            <div className={styles.iconTitle}>Graphics</div>
            <p className={styles.iconIntro}>Improved and performance friendly:</p>
            <ul className={styles.iconList}>
              <li>Rudy ENB</li>
              <li>NAT 3 weathers</li>
              <li>Reworked meshes and textures</li>
              <li>Landscape fixes, Grass cache</li>
            </ul>
          </div>

          {/* Variety */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>🧩</span>
            <div className={styles.iconTitle}>Variety</div>
            <p className={styles.iconIntro}>Tons of new content:</p>
            <ul className={styles.iconList}>
              <li>Legacy of the Dragonborn</li>
              <li>Huge quest mods</li>
              <li>New (and improved vanilla) followers</li>
              <li>New perk trees and leveling system</li>
            </ul>
          </div>

          {/* Adult systems */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>🔞</span>
            <div className={styles.iconTitle}>Adult systems</div>
            <p className={styles.iconIntro}>The full suite:</p>
            <ul className={styles.iconList}>
              <li>OStim based NSFW</li>
              <li>Physics and OBody</li>
              <li>Amorous Adventures</li>
              <li>ORomance and more</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const LOOP_COPIES = 2;
  const [loadedShots, setLoadedShots] = React.useState<Record<string, true>>({});
  // Shuffle ONCE for this page load
  const SHOTS = React.useMemo(() => {
    const a = [...ALL_SHOTS];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const unitWidthRef = React.useRef<number>(0); // width of one sequence
  const isPausedRef = React.useRef<boolean>(false);
  const autoResumeTimerRef = React.useRef<number | null>(null);
  const speedRef = React.useRef<number>(36); // px per second
  const posRef = React.useRef<number>(0); // fractional scroll position accumulator (Safari-safe)
  const lastTsRef = React.useRef<number | null>(null); // rAF timestamp for time-based scrolling

  // Build repeated list based on LOOP_COPIES.
  const loop = React.useMemo(
    () => Array.from({ length: LOOP_COPIES }, () => SHOTS).flat(),
    [SHOTS]
  );

  // Initialize unit width (one sequence) and center on middle copy
  React.useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    const total = track.scrollWidth || 0;
    if (!total) return;
    unitWidthRef.current = total / LOOP_COPIES;
    // jump to start of the middle copy
    scroller.scrollLeft = unitWidthRef.current;
    posRef.current = unitWidthRef.current;
  }, [loop.length, LOOP_COPIES]);

  // Safari/iOS: track width may be 0 until images load; observe and re-center when ready
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    const recompute = () => {
      const total = track.scrollWidth || 0;
      if (!total) return;
      const newUnit = total / LOOP_COPIES;
      const prevUnit = unitWidthRef.current || 0;
      unitWidthRef.current = newUnit;
      if (!isPausedRef.current && (prevUnit === 0 || Math.abs(newUnit - prevUnit) > 1)) {
        if (prevUnit > 0) {
          const relPrev = ((posRef.current % prevUnit) + prevUnit) % prevUnit;
          const target = newUnit + relPrev;
          scroller.scrollLeft = target;
          posRef.current = target;
        } else {
          scroller.scrollLeft = newUnit;
          posRef.current = newUnit;
        }
      }
    };

    // initial attempt
    recompute();

    let cleanup: (() => void) | undefined;
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => recompute());
      ro.observe(track);
      cleanup = () => ro.disconnect();
    } else {
      let timeoutId: number | null = null;
      const poll = () => {
        if (track.scrollWidth) {
          recompute();
          if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }
        } else {
          timeoutId = window.setTimeout(poll, 400);
        }
      };
      poll();
      cleanup = () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [loop.length, LOOP_COPIES]);
  // Wrap around when reaching edges to simulate infinite scroll
  const wrapIfNeeded = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const uw = unitWidthRef.current;
    if (!scroller || !uw) return;
    const left = scroller.scrollLeft;
    const viewport = scroller.clientWidth || 0;
    const total = uw * LOOP_COPIES; // total width with repeated copies
    const near = Math.max(40, viewport * 0.1);
    const maxScrollable = Math.max(0, total - viewport);
    // If we get too close to the left edge of the first copy, jump forward
    if (left <= near) {
      const next = left + uw;
      scroller.scrollLeft = next;
      posRef.current = next;
      return;
    }
    // If we get too close to the right edge of the last copy, jump back
    if (left >= maxScrollable - near) {
      const next = left - uw;
      scroller.scrollLeft = next;
      posRef.current = next;
    }
  }, [LOOP_COPIES]);

  // Auto-scroll via rAF while not paused
  React.useEffect(() => {
    let raf = 0;
    const tick = (ts: number) => {
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
      }
      const dtSec = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const scroller = scrollerRef.current;
      const zoomOpen =
        typeof document !== 'undefined' &&
        !!document.querySelector('.medium-zoom-image--opened');
      if (scroller && !isPausedRef.current && unitWidthRef.current && !zoomOpen) {
        posRef.current += speedRef.current * dtSec;
        scroller.scrollLeft = posRef.current;
        wrapIfNeeded();
      } else {
        // keep timestamp fresh while paused or unavailable to avoid large jumps
        lastTsRef.current = ts;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [wrapIfNeeded]);

  // Respect reduced motion: disable auto-scroll when user prefers reduced motion
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      speedRef.current = media.matches ? 0 : 36;
    };
    apply();
    // Safari compatibility: addEventListener not supported on older versions
    const mql: any = media as any;
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(apply);
      return () => mql.removeListener(apply);
    }
    return;
  }, []);

  // Pause/resume helpers
  const pause = React.useCallback(() => {
    isPausedRef.current = true;
    if (autoResumeTimerRef.current) {
      window.clearTimeout(autoResumeTimerRef.current);
      autoResumeTimerRef.current = null;
    }
  }, []);
  const resumeSoon = React.useCallback((ms = 1200) => {
    if (autoResumeTimerRef.current) window.clearTimeout(autoResumeTimerRef.current);
    autoResumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
      autoResumeTimerRef.current = null;
    }, ms);
  }, []);

  // Handlers
  const onMouseEnter = () => pause();
  const onMouseLeave = () => resumeSoon(200);
  const onTouchStart = () => pause();
  const onTouchEnd = () => resumeSoon(1200);
  const onWheel = () => {
    pause();
    resumeSoon(1500);
  };
  const onScroll = () => {
    const scroller = scrollerRef.current;
    if (scroller) posRef.current = scroller.scrollLeft;
    wrapIfNeeded();
  };

  const markLoaded = React.useCallback((key: string) => {
    setLoadedShots((prev) => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
  }, []);

  // Nav buttons
  const scrollByAmount = React.useCallback((dir: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    pause();
    const delta = Math.max(200, Math.round(scroller.clientWidth * 0.6)) * dir;
    scroller.scrollBy({ left: delta, behavior: 'smooth' });
    resumeSoon(900);
  }, [pause, resumeSoon]);

  // Observe medium-zoom overlay to keep auto-scroll paused while zoomed
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = () => {
      const zoomOpen = !!document.querySelector('.medium-zoom-image--opened');
      if (zoomOpen) {
        pause();
      } else {
        // resume shortly after overlay closes
        resumeSoon(300);
      }
    };
    const observer = new MutationObserver(handle);
    observer.observe(document.body, { childList: true, subtree: true, attributes: false });
    // initial check
    handle();
    return () => observer.disconnect();
  }, [pause, resumeSoon]);

  return (
    <section className={styles.showcase} data-nosnippet>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <img src="/img/pages/index-showcase.png" alt="Showcase" className={styles.headingImg} />
        </h2>
        <p className={clsx(styles.tagline, styles.showcaseTagline)}>
          <i>{SHOWCASE_TAGLINE}</i>
        </p>
      </div>

      <div className={styles.marqueeOuter}>
        <button
          type="button"
          aria-label="Scroll left"
          className={clsx(styles.navBtn, styles.navBtnLeft)}
          onClick={() => scrollByAmount(-1)}
        >
          <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          className={clsx(styles.navBtn, styles.navBtnRight)}
          onClick={() => scrollByAmount(1)}
        >
          <svg viewBox="0 0 24 24" className={styles.navIcon} aria-hidden="true">
            <path fill="currentColor" d="m10 6-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
        <div
          className={styles.scroller}
          ref={scrollerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onWheel={onWheel}
          onScroll={onScroll}
        >
          <div ref={trackRef} className={styles.marqueeTrack}>
            {loop.map((src, i) => {
              const key = `${src}-${i}`;
              const isLoaded = !!loadedShots[key];
              return (
                <div key={key} className={styles.shotFrame}>
                  {!isLoaded && <span className={styles.shotSkeleton} aria-hidden="true" />}
                  <img
                    src={src}
                    alt={`screenshot ${i + 1}`}
                    className={clsx('zoomable', styles.shot, isLoaded && styles.shotLoaded)}
                    loading="eager"
                    decoding="sync"
                    ref={(img) => {
                      // On client-side navigation back to home, cached images can be
                      // already complete before onLoad re-fires. Mark them loaded here
                      // to avoid keeping the showcase visually hidden.
                      if (img && img.complete && img.naturalWidth > 0) {
                        markLoaded(key);
                      }
                    }}
                    onLoad={() => markLoaded(key)}
                    onError={() => markLoaded(key)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.tagline}
      description={HOME_META_DESCRIPTION}>
      <Head>
        <meta name="description" content={HOME_META_DESCRIPTION} />
        <meta property="og:description" content={HOME_META_DESCRIPTION} />
        <meta name="twitter:description" content={HOME_META_DESCRIPTION} />
      </Head>
      <Hero />
      <main>
        <FeatureIcons />
        <Showcase />
      </main>
    </Layout>
  );
}
