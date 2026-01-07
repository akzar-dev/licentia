import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './index.module.css';
import React from 'react';
import Head from '@docusaurus/Head';

/** ------- CONFIG -------- */
/** Load every image in /static/img/screenshots */
const req = (require as any).context(
  '@site/static/img/screenshots',
  false,
  /\.(png|jpe?g|webp)$/i
);
const ALL_SHOTS: string[] = req.keys().map((k: string) => req(k).default as string);

/** Main Hero function */
function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <section className={styles.hero}>
      {/* background */}
      <div className={styles.heroBg} />
      <div className={styles.heroOverlay} />

      <div className={clsx('container', styles.heroInner)}>
        <img
          className={styles.heroLogo}
          src="/img/licentia-social-card.webp"
          alt={`${siteConfig.title} logo`}
          width={520}
          height={260}
        />

        <p className={styles.tagline}>
          <i>"Unleash Power, Indulge Desire, Leave Heads Rolling"</i>
        </p>

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

/** Tiny icon row for Features */
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
  const speedRef = React.useRef<number>(0.35); // px per frame

  // Build 2x repeated list to keep DOM light while allowing seamless wrap
  const loop = React.useMemo(() => [...SHOTS, ...SHOTS], [SHOTS]);

  // Initialize unit width (one sequence) and center on middle copy
  React.useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    const total = track.scrollWidth || 0;
    if (!total) return;
    unitWidthRef.current = total / 2;
    // jump to start of the second copy
    scroller.scrollLeft = unitWidthRef.current;
  }, [loop.length]);

  // Wrap around when reaching edges to simulate infinite scroll
  const wrapIfNeeded = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const uw = unitWidthRef.current;
    if (!scroller || !uw) return;
    const left = scroller.scrollLeft;
    const viewport = scroller.clientWidth || 0;
    const total = uw * 2; // total width with 2× duplication
    const near = Math.max(40, viewport * 0.1);
    const maxScrollable = Math.max(0, total - viewport);
    // If we get too close to the left edge of the first copy, jump forward
    if (left <= near) {
      scroller.scrollLeft = left + uw;
      return;
    }
    // If we get too close to the right edge of the second copy, jump back
    if (left >= maxScrollable - near) {
      scroller.scrollLeft = left - uw;
    }
  }, []);

  // Auto-scroll via rAF while not paused
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const scroller = scrollerRef.current;
      const zoomOpen =
        typeof document !== 'undefined' &&
        (document.querySelector('.medium-zoom-image--opened') ||
          document.querySelector('.medium-zoom-overlay'));
      if (scroller && !isPausedRef.current && unitWidthRef.current && !zoomOpen) {
        scroller.scrollLeft += speedRef.current;
        wrapIfNeeded();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [wrapIfNeeded]);

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
  const onScroll = () => wrapIfNeeded();

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
      const zoomOpen = !!document.querySelector('.medium-zoom-overlay');
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
            {loop.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt={`screenshot ${i + 1}`}
                className="zoomable"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const description = "Experience Licentia NEXT — a one-click install Skyrim AE modlist with LotD, non‑intrusive OStim, combat/graphics upgrades, new quests & followers!"
  return (
    <Layout
      title={siteConfig.tagline}
      description={description}>
      <Head>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
      </Head>
      <Hero />
      <main>
        <FeatureIcons />
        <Showcase />
      </main>
    </Layout>
  );
}
