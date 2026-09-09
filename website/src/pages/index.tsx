import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './index.module.css';
import React from 'react';
import Head from '@docusaurus/Head';
import SiteImage from '@site/src/components/SiteImage';
import { ALL_SCREENSHOTS, type Screenshot } from '@site/src/data/screenshots';

/** ------- CONFIG -------- */
const ABOUT_TAGLINE = '"Unleash Power, Indulge Desire, Leave Heads Rolling"';
const FEATURES_TAGLINE = 'Everything you need, pre-configured and ready to play';
const SHOWCASE_TAGLINE = 'Join our Discord, share your screenshots, and we may feature them here!';
const SHOWCASE_CTA_LABEL = 'View full gallery';
const HOME_META_DESCRIPTION =
  'Licentia NEXT: The ultimate 1-click install NSFW Skyrim AE modlist built around LotD. Better combat, graphics, quests & more!';
/** Inline brand-gold emphasis. Wraps the highlight class so the long About copy
 *  doesn't repeat a verbose styles.highlightText span dozens of times. */
function Hl({ children }: { children: ReactNode }) {
  return <span className={styles.highlightText}>{children}</span>;
}

/** Main Hero function */
function Hero() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <section className={styles.hero}>
      <h1 className={styles.visuallyHidden}>Licentia NEXT: The Ultimate NSFW Skyrim AE Modlist</h1>
      <div className={styles.heroOverlay} />

      <div className={clsx('container', styles.heroInner)}>
        <img
          className={styles.heroLogo}
          src="/img/licentia-next-hero-logo.webp"
          alt={`${siteConfig.title} logo`}
          width={700}
          height={659}
          decoding="async"
          fetchPriority="high"
        />

        <p className={styles.description}>
          <Hl>Licentia NEXT</Hl> is a 1-click install NSFW
          Skyrim AE modlist built around Legacy of the Dragonborn with non-intrusive OStim,
          combat/graphics upgrades, new quests, and followers!
        </p>

        <div className={styles.heroJumpLinks} aria-label="Homepage sections">
          <a className={styles.heroJumpButton} href="#features">Features</a>
          <a className={styles.heroJumpButton} href="#showcase">Showcase</a>
          <a className={styles.heroJumpButton} href="#about">About</a>
        </div>

        <div className={styles.ctaRow}>
          <a className={clsx('button button--primary button--lg', styles.ctaSolid, styles.heroMainCta)} href="/welcome">
            Install
          </a>
          <a className={clsx('button button--primary button--lg', styles.ctaSolid, styles.heroMainCta)} href="/how-to-update">
            Update
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className={clsx(styles.aboutSection, styles.deferSection)}>
      <div className={clsx('container', styles.aboutContainer)}>
        <h2 className={styles.sectionTitle}>
          <span
            className="licentia-heading licentia-heading--display"
          >
            About
          </span>
          <span className={styles.visuallyHidden}>About Licentia NEXT</span>
        </h2>
        <p className={clsx(styles.tagline, styles.sectionTagline)}>
          <i>{ABOUT_TAGLINE}</i>
        </p>
        <div className={styles.aboutBody}>
          <p>
            <Hl>Licentia NEXT</Hl> is the direct descendant of the legendary <Hl>Licentia BLACK</Hl>. It is a comprehensive, 1-click install NSFW Skyrim Anniversary Edition <Hl>Wabbajack</Hl> modlist built around the massive <Hl>Legacy of the Dragonborn</Hl> expansion. Designed for players who want an uncompromising blend of beautiful graphics, intense gameplay, and extensive adult content, it transforms Skyrim into a truly next-generation experience. We have carefully curated over <Hl>1,600 mods</Hl> to deliver stability and seamless integration without the hassle of manual conflict resolution.
          </p>
          <p>
            At its core, <Hl>Licentia NEXT</Hl> overhauls Skyrim's combat to be fast-paced, visceral, and physics-based, featuring <Hl>Precision</Hl>, <Hl>Combat Gameplay Overhaul</Hl>, <Hl>Archery Gameplay Overhaul</Hl> and <Hl>Dismemberment Framework</Hl> that make every encounter feel impactful. Mages are equally spoiled, with a huge spell toolbox built from overhauls like <Hl>Apocalypse</Hl>, <Hl>Odin</Hl>, and <Hl>Mysticism</Hl>.
          </p>
          <p>
            Progression is equally ambitious. A customized <Hl>Static Skill Leveling</Hl> setup and the massive <Hl>Vokriinator Black</Hl> perk package open up a huge range of character builds, letting you lean fully into the kind of overpowered <Hl>power fantasy</Hl> Skyrim is at its best at, whether that means a godlike battlemage, an unstoppable warrior, or a deadly stealth specialist.
          </p>
          <p>
            Visuals are stunningly upgraded with <Hl>Rudy ENB</Hl> with <Hl>NAT 3</Hl> weathers, <Hl>grass cache</Hl> for lush grass stretching beautifully to the horizon, and thousands of reworked high-resolution textures and meshes. A curated lineup of NPC overhauls, including <Hl>Pandorable's</Hl>, <Hl>Bijin</Hl>, and <Hl>Kalilies</Hl>, helps the world feel just as beautiful up close, while still maintaining a performance-friendly framerate on modern systems.
          </p>
          <p>
            Beyond combat and aesthetics, the modlist introduces a wealth of new content. Explore new <Hl>lands</Hl>, complete massive <Hl>quests</Hl>, and recruit unique, fully voiced <Hl>followers</Hl> with improved interactions.
          </p>
          <p>
            The <Hl>adult systems</Hl> are built on an optimized, non-intrusive <Hl>OStim</Hl> foundation, integrating <Hl>CBPC</Hl> and <Hl>FSMP</Hl> physics, <Hl>OBody</Hl>, and <Hl>Amorous Adventures</Hl>.
          </p>
          <p>
            Whether you're a seasoned veteran or returning to Tamriel for the first time in years, <Hl>Licentia NEXT</Hl> offers the ultimate customized Skyrim journey.
          </p>
        </div>
      </div>
    </section>
  );
}

function FeatureIcons() {
  return (
    <section id="features" className={clsx(styles.iconsSection, styles.deferSection)} data-nosnippet>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span
            className="licentia-heading licentia-heading--display"
            aria-hidden
          >
            Features
          </span>
          <span className={styles.visuallyHidden}>Features</span>
        </h2>
        <p className={clsx(styles.tagline, styles.sectionTagline)}>
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
              <li>Apocalypse, Odin, Mysticism</li>
            </ul>
          </div>

          {/* Graphics */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>🖼️</span>
            <div className={styles.iconTitle}>Graphics</div>
            <p className={styles.iconIntro}>Improved and performance friendly:</p>
            <ul className={styles.iconList}>
              <li>Rudy ENB + NAT 3 weathers</li>
              <li>Beautiful NPC replacers</li>
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
              <li>Huge perk trees and new leveling system</li>
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
  const MAX_UNIQUE_SHOWCASE_SHOTS = 24;
  // The server-rendered HTML and the first client render must be identical, so start from
  // a stable (unshuffled) slice. Math.random() at render time would produce a different
  // order on the client and cause an SSR hydration mismatch. Shuffle once after mount instead.
  const INITIAL_SHOTS = React.useMemo(
    () => ALL_SCREENSHOTS.slice(0, Math.min(MAX_UNIQUE_SHOWCASE_SHOTS, ALL_SCREENSHOTS.length)),
    []
  );
  const [SHOTS, setShots] = React.useState<Screenshot[]>(INITIAL_SHOTS);
  React.useEffect(() => {
    const a = [...ALL_SCREENSHOTS];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setShots(a.slice(0, Math.min(MAX_UNIQUE_SHOWCASE_SHOTS, a.length)));
  }, []);

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const unitWidthRef = React.useRef<number>(0); // width of one sequence
  const isPausedRef = React.useRef<boolean>(false);
  const isZoomOpenRef = React.useRef<boolean>(false);
  const canHoverPauseRef = React.useRef<boolean>(false);
  const ignoreScrollPauseUntilRef = React.useRef<number>(0);
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
      ignoreScrollPauseUntilRef.current = performance.now() + 80;
      scroller.scrollLeft = next;
      posRef.current = next;
      return;
    }
    // If we get too close to the right edge of the last copy, jump back
    if (left >= maxScrollable - near) {
      const next = left - uw;
      ignoreScrollPauseUntilRef.current = performance.now() + 80;
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
      if (scroller && !isPausedRef.current && unitWidthRef.current) {
        posRef.current += speedRef.current * dtSec;
        ignoreScrollPauseUntilRef.current = performance.now() + 80;
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

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => {
      canHoverPauseRef.current = media.matches;
    };
    apply();
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
    if (isZoomOpenRef.current) return;
    if (autoResumeTimerRef.current) window.clearTimeout(autoResumeTimerRef.current);
    autoResumeTimerRef.current = window.setTimeout(() => {
      if (isZoomOpenRef.current) {
        autoResumeTimerRef.current = null;
        return;
      }
      isPausedRef.current = false;
      autoResumeTimerRef.current = null;
    }, ms);
  }, []);

  // Handlers
  const onMouseEnter = () => {
    if (!canHoverPauseRef.current) return;
    pause();
  };
  const onMouseLeave = () => {
    if (!canHoverPauseRef.current) return;
    resumeSoon(200);
  };
  const onTouchStart = () => {
    pause();
  };
  const onTouchEnd = () => {
    if (isZoomOpenRef.current) return;
    resumeSoon(1200);
  };
  const onTouchCancel = () => {
    if (isZoomOpenRef.current) return;
    resumeSoon(1200);
  };
  const onWheel = () => {
    pause();
    resumeSoon(1500);
  };
  const onScroll = () => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const scroller = scrollerRef.current;
    if (scroller) posRef.current = scroller.scrollLeft;
    wrapIfNeeded();
    if (now < ignoreScrollPauseUntilRef.current) return;
    pause();
    resumeSoon(1200);
  };

  // Nav buttons
  const scrollByAmount = React.useCallback((dir: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    pause();
    const delta = Math.max(200, Math.round(scroller.clientWidth * 0.6)) * dir;
    scroller.scrollBy({ left: delta, behavior: 'smooth' });
    resumeSoon(900);
  }, [pause, resumeSoon]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (detail?.open) {
        isZoomOpenRef.current = true;
        pause();
      } else {
        isZoomOpenRef.current = false;
        if (autoResumeTimerRef.current) {
          window.clearTimeout(autoResumeTimerRef.current);
        }
        autoResumeTimerRef.current = window.setTimeout(() => {
          isPausedRef.current = false;
          autoResumeTimerRef.current = null;
        }, 300);
      }
    };

    window.addEventListener('licentia-zoom-change', handle as EventListener);
    return () => window.removeEventListener('licentia-zoom-change', handle as EventListener);
  }, [pause, resumeSoon]);

  return (
    <section id="showcase" className={clsx(styles.showcase, styles.altSection)} data-nosnippet>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span
            className="licentia-heading licentia-heading--display"
            aria-hidden
          >
            Showcase
          </span>
          <span className={styles.visuallyHidden}>Showcase</span>
        </h2>
        <p className={clsx(styles.tagline, styles.sectionTagline)}>
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
          onTouchCancel={onTouchCancel}
          onWheel={onWheel}
          onScroll={onScroll}
        >
          <div ref={trackRef} className={styles.marqueeTrack}>
            {loop.map((shot, i) => {
              const key = `${shot.id}-${i}`;
              return (
                <SiteImage
                  key={key}
                  src={shot.src}
                  alt={`Licentia NEXT showcase screenshot ${i + 1}`}
                  className={clsx('zoomable', styles.shot)}
                  wrapperClassName={styles.shotFrame}
                  wrapperStyle={{ width: 'auto' }}
                  width={320}
                  height={180}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={clsx('container', styles.showcaseCtaRow)}>
        <a className={clsx('button button--primary button--lg', styles.ctaSolid)} href="/media">
          {SHOWCASE_CTA_LABEL}
        </a>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout description={HOME_META_DESCRIPTION}>
      <Head>
        {/* description + og:description are emitted by <Layout description=...> below. */}
        {/* application-name + og:site_name are emitted site-wide via siteConfig.headTags. */}
        {/* Only tags not covered by those sources are set here, to avoid duplicates. */}
        <meta name="twitter:description" content={HOME_META_DESCRIPTION} />
        <meta property="og:title" content="Licentia NEXT" />
        <meta name="twitter:title" content="Licentia NEXT" />
        <link rel="apple-touch-icon" href="/img/licentia-next-logo-apple.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Licentia NEXT',
            description: HOME_META_DESCRIPTION,
            url: 'https://licentia.quest/',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Licentia NEXT',
              alternateName: ['Licentia', 'licentia.quest', 'LN'],
              url: 'https://licentia.quest/',
            },
            about: {
              '@type': 'Organization',
              name: 'Licentia NEXT',
              url: 'https://licentia.quest/',
            },
          })}
        </script>
      </Head>
      <Hero />
      <main>
        <hr className={styles.sectionDivider} />
        <FeatureIcons />
        <hr className={styles.sectionDivider} />
        <Showcase />
        <hr className={styles.sectionDivider} />
        <AboutSection />
      </main>
    </Layout>
  );
}
