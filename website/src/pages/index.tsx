import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './index.module.css';
import React from 'react';

/** ------- CONFIG -------- */
/** Load every image in /static/img/screenshots */
const req = require.context(
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
    <section className={styles.iconsSection}>
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

  // Repeat enough times so the track is always wider than the viewport
  const [repeat, setRepeat] = React.useState(2);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  // Build the repeated list (no mid-loop reshuffle)
  const loop = React.useMemo(
    () => Array.from({ length: repeat }).flatMap(() => SHOTS),
    [SHOTS, repeat]
  );

  // Measure widths and ensure the track is at least 2× the viewport
  const ensureRepeat = React.useCallback(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    const total = track.scrollWidth || 0; // width of current repeats
    if (!total) return;
    const one = total / repeat;           // width of one sequence

    const needed = Math.max(2, Math.ceil((scroller.clientWidth * 2) / one));
    if (needed !== repeat) setRepeat(needed);
  }, [repeat]);

  React.useEffect(() => {
    const id = requestAnimationFrame(ensureRepeat);
    return () => cancelAnimationFrame(id);
  }, [ensureRepeat, loop.length]);

  React.useEffect(() => {
    const ro = new ResizeObserver(() => ensureRepeat());
    if (trackRef.current) ro.observe(trackRef.current);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    const onResize = () => ensureRepeat();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [ensureRepeat]);

  // Move exactly 1 sequence per animation loop (seamless)
  const marqueeEnd = `-${100 / repeat}%`;

  return (
    <section className={styles.showcase}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <img src="/img/pages/index-showcase.png" alt="Showcase" className={styles.headingImg} />
        </h2>
      </div>

      <div className={styles.marqueeOuter}>
        <div className={styles.scroller} ref={scrollerRef}>
          <div ref={trackRef} className={styles.marqueeTrack} style={{ ['--marqueeEnd' as any]: marqueeEnd }}>
            {loop.map((src, i) => (
              <img key={`${src}-${i}`} src={src} alt={`screenshot ${i + 1}`} className="zoomable" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const description = "An official website of Licentia NEXT - NSFW Skyrim Modlist with LotD, OStim, lots of fun and variety"
  return (
    <Layout
      title={siteConfig.tagline}
      description={description}>
      <Hero />
      <main>
        <FeatureIcons />
        <Showcase />
      </main>
    </Layout>
  );
}
