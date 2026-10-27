import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './index.module.css';
import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import SiteImage from '@site/src/components/SiteImage';
import useEmblaCarousel from 'embla-carousel-react';
import ShowcaseDrift from '@site/src/components/showcaseDrift';
import { ALL_SCREENSHOTS, type Screenshot } from '@site/src/data/screenshots';

/** ------- CONFIG -------- */
const ABOUT_TAGLINE = '"Unleash Power, Indulge Desire, Leave Heads Rolling"';
const FEATURES_TAGLINE = 'Everything you need, pre-configured and ready to play';
const SHOWCASE_TAGLINE = 'Join our Discord, share your screenshots, and we may feature them here!';
const SHOWCASE_CTA_LABEL = 'View full gallery';
const HOME_META_DESCRIPTION =
  'Licentia NEXT: The ultimate 1-click install NSFW Skyrim AE modlist built around LotD. Better combat, graphics, quests & more!';
/** Gold means "you can click this" everywhere else on the site, so the homepage only uses
 *  it on links. Mod names in the About copy are those links, to the Nexus page the load
 *  order points at (same URL shape as /load-order). */
function Mod({ nexus, children }: { nexus: number; children: ReactNode }) {
  return (
    <a href={`https://www.nexusmods.com/skyrimspecialedition/mods/${nexus}`} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/** The mod count, generated at build time from the list itself, so the number on the
 *  homepage cannot drift from what /load-order actually shows. See docusaurus.config.ts. */
function useModCount(): string {
  const { siteConfig } = useDocusaurusContext();
  return (siteConfig.customFields!.loadOrder as { mods: number }).mods.toLocaleString();
}

/** Main Hero function */
function Hero() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <section className={styles.hero}>
      <h1 className={styles.visuallyHidden}>Licentia NEXT: The Ultimate NSFW Skyrim AE Modlist</h1>
      <div className={styles.heroOverlay} />

      <div className={clsx('container', styles.heroInner)}>
        {/*
          `decoding="sync"`, not async, and deliberately.

          This logo carries its glow as `filter: drop-shadow()`, which follows the image's
          alpha channel -- so the browser has to have decoded the bitmap to know what shape
          to draw. `decoding="async"` explicitly permits presenting the frame before that
          has happened, and in that window the filter is rasterised against the element's
          BOX instead: a gold rectangle, for a frame or two, until the alpha arrives. That
          is the flash. Sync decoding closes the window, and this is a 154 KB image already
          marked high priority, so there is nothing to gain by deferring it anyway.
        */}
        {/*
          `decoding="sync"`, not async, and deliberately.

          This logo carries its glow as `filter: drop-shadow()`, which follows the image's
          alpha channel -- so the browser has to have decoded the bitmap to know what shape
          to draw. `decoding="async"` explicitly permits presenting the frame before that
          has happened, and in that window the filter is rasterised against the element's
          BOX instead: a gold rectangle, for a frame or two, until the alpha arrives.

          `wrapperStyle` is not optional. SiteImage reserves the box from the `width` prop,
          which is the file's intrinsic 700px, while this renders at 400 -- so without it
          the placeholder would be a rectangle three-quarters as wide again as the logo.
          The glow stays on the <img>, so the placeholder never wears it.
        */}
        <SiteImage
          className={styles.heroLogo}
          wrapperClassName={styles.heroLogoWrap}
          wrapperStyle={{ width: 'min(90%, 400px)' }}
          src="/img/licentia-next-hero-logo.webp"
          alt={`${siteConfig.title} logo`}
          width={700}
          height={659}
          decoding="sync"
          fetchPriority="high"
        />

        <p className={styles.description}>
          <strong>Licentia NEXT</strong> is a 1-click install NSFW
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
  const modCount = useModCount();

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
        {/*
          An intro, then one card per feature card above, in the same order, with the same
          glyph and an id the feature card's "Read more" jumps to. Everything a feature card
          lists is explained in its card here, so the two can't drift into different stories.

          The prose is the same as it was as seven paragraphs, merged into these five, plus
          the few things the feature cards named and this never did (landscape fixes, Lux,
          ORomance, PPA, Legacy of the Dragonborn as new content). It is most of the indexable text on the page -- the feature grid is
          data-nosnippet -- so the h3s keep the words people search for.
        */}
        <div className={styles.aboutBody}>
          <section id="what-is-licentia-next" className={styles.topic}>
            <span className={styles.topicGlyph} aria-hidden>🐉</span>
            <h3 className={styles.topicTitle}>What Licentia NEXT is</h3>
            <p>
            Licentia NEXT is the direct descendant of the legendary Licentia BLACK. It is a comprehensive, 1-click install NSFW Skyrim Anniversary Edition <a href="https://www.wabbajack.org/" target="_blank" rel="noopener noreferrer">Wabbajack</a> modlist built around the massive <Mod nexus={11802}>Legacy of the Dragonborn</Mod> expansion. Designed for players who want an uncompromising blend of beautiful graphics, intense gameplay, and extensive adult content, it transforms Skyrim into a truly next-generation experience. We have carefully curated <Link to="/load-order">{modCount} mods</Link> to deliver stability and seamless integration without the hassle of manual conflict resolution.
            </p>
            <p>
            Whether you're a seasoned veteran or returning to Tamriel for the first time in years, Licentia NEXT offers the ultimate customized Skyrim journey.
            </p>
          </section>
          <section id="combat" className={styles.topic}>
            <span className={styles.topicGlyph} aria-hidden>⚔️</span>
            <h3 className={styles.topicTitle}>Combat, magic and builds</h3>
            <p>
            At its core, Licentia NEXT overhauls Skyrim's combat to be fast-paced, visceral, and physics-based, featuring <Mod nexus={72347}>Precision</Mod>, <Mod nexus={33767}>Combat Gameplay Overhaul</Mod>, <Mod nexus={24296}>Archery Gameplay Overhaul</Mod> and <Mod nexus={126203}>Dismembering Framework</Mod> that make every encounter feel impactful. Mages are equally spoiled, with a huge spell toolbox built from overhauls like <Mod nexus={1090}>Apocalypse</Mod>, <Mod nexus={46000}>Odin</Mod>, and <Mod nexus={27839}>Mysticism</Mod>.
            </p>
            <p>
            Progression is equally ambitious. A customized <Mod nexus={89940}>Static Skill Leveling</Mod> setup and the massive <Mod nexus={26702}>Vokriinator Black</Mod> perk package open up a huge range of character builds, letting you lean fully into the kind of overpowered power fantasy Skyrim is at its best at, whether that means a godlike battlemage, an unstoppable warrior, or a deadly stealth specialist.
            </p>
          </section>
          <section id="graphics" className={styles.topic}>
            <span className={styles.topicGlyph} aria-hidden>🖼️</span>
            <h3 className={styles.topicTitle}>Graphics and visuals</h3>
            <p>
            Visuals are stunningly upgraded with <Mod nexus={91675}>Rudy ENB</Mod> with <Mod nexus={27141}>NAT 3</Mod> weathers, grass cache for lush grass stretching beautifully to the horizon, landscape fixes, <Mod nexus={43158}>Lux</Mod> lighting inside and out, and thousands of reworked high-resolution textures and meshes. A curated lineup of NPC overhauls, including <Mod nexus={19012}>Pandorable's</Mod>, <Mod nexus={11287}>Bijin</Mod>, and <Mod nexus={30247}>Kalilies</Mod>, helps the world feel just as beautiful up close, while still maintaining a performance-friendly framerate on modern systems.
            </p>
          </section>
          <section id="variety" className={styles.topic}>
            <span className={styles.topicGlyph} aria-hidden>🧩</span>
            <h3 className={styles.topicTitle}>New lands, quests and followers</h3>
            <p>
            Beyond combat and aesthetics, the modlist introduces a wealth of new content, built around <Mod nexus={11802}>Legacy of the Dragonborn</Mod> and its museum. Explore whole new lands in <Mod nexus={2057}>Falskaar</Mod> and <Mod nexus={45565}>Wyrmstooth</Mod>, and take on massive questlines like <Mod nexus={11849}>Vigilant</Mod>, <Mod nexus={1179}>The Forgotten City</Mod>, <Mod nexus={4155}>Clockwork</Mod>, <Mod nexus={5673}>Helgen Reborn</Mod> and <Mod nexus={4509}>The Gray Cowl of Nocturnal</Mod>.
            </p>
            <p>
            You are never short of company, either. Recruit unique, fully voiced followers like <Mod nexus={1461}>Inigo</Mod>, <Mod nexus={11278}>Auri</Mod>, <Mod nexus={51874}>Remiel</Mod>, <Mod nexus={20035}>Lucien</Mod> and <Mod nexus={19075}>Kaidan</Mod>, or travel with <Mod nexus={135085}>Ashe</Mod> and a Serana with far more to say thanks to the <Mod nexus={32161}>Serana Dialogue Add-On</Mod>. Vanilla companions get the same treatment: the Follower Dialogue Expansion series gives <Mod nexus={119226}>Lydia</Mod>, <Mod nexus={114801}>Aela</Mod>, <Mod nexus={116025}>Mjoll</Mod> and others new dialogue and improved interactions.
            </p>
          </section>
          <section id="adult" className={styles.topic}>
            <span className={styles.topicGlyph} aria-hidden>🔞</span>
            <h3 className={styles.topicTitle}>Adult systems</h3>
            <p>
            The adult systems are built on an optimized, non-intrusive <Mod nexus={98163}>OStim</Mod> foundation, with proper physics throughout from <Mod nexus={21224}>CBPC</Mod>, <Mod nexus={57339}>FSMP</Mod> and <Mod nexus={172002}>PPA</Mod>, and body variety from <Mod nexus={77016}>OBody</Mod>. Romance and relationships come through <Mod nexus={69248}>Amorous Adventures</Mod> and <Mod nexus={48564}>ORomance</Mod>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

function FeatureIcons() {
  const modCount = useModCount();

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
            <p className={styles.iconIntro}>Physics-based and gory, with deep builds:</p>
            <ul className={styles.iconList}>
              <li>Precision</li>
              <li>CGO + AGO</li>
              <li>Dismembering Framework</li>
              <li>Apocalypse, Odin, Mysticism</li>
              <li>Huge perk trees and new leveling system</li>
            </ul>
            <a className={styles.iconMore} href="#combat">Read more ↓</a>
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
              <li>Lux lighting overhaul</li>
            </ul>
            <a className={styles.iconMore} href="#graphics">Read more ↓</a>
          </div>

          {/* Variety */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>🧩</span>
            <div className={styles.iconTitle}>Variety</div>
            <p className={styles.iconIntro}>Tons of new content:</p>
            <ul className={styles.iconList}>
              <li>Legacy of the Dragonborn</li>
              <li>Huge quest mods like Vigilant</li>
              <li>New lands: Falskaar, Wyrmstooth</li>
              <li>Voiced followers: Inigo, Auri, Ashe</li>
              <li>Expanded Serana and vanilla followers</li>
            </ul>
            <a className={styles.iconMore} href="#variety">Read more ↓</a>
          </div>

          {/* Adult systems */}
          <div className={styles.iconCard}>
            <span className={styles.iconGlyph} aria-hidden>🔞</span>
            <div className={styles.iconTitle}>Adult systems</div>
            <p className={styles.iconIntro}>The full suite:</p>
            <ul className={styles.iconList}>
              <li>OStim based NSFW</li>
              <li>CBPC, FSMP and PPA physics</li>
              <li>OBody body variety</li>
              <li>Amorous Adventures</li>
              <li>ORomance and more</li>
            </ul>
            <a className={styles.iconMore} href="#adult">Read more ↓</a>
          </div>
        </div>

        {/* "How many mods is it, actually" is the question people ask before any other, and
            /load-order answers it with all of them by name. Same button as the gallery's,
            under the grid rather than inside a card, so it reads as a destination. */}
        <div className={styles.featuresCtaRow}>
          <a
            className={clsx('button button--primary button--lg', styles.ctaSolid, styles.ctaWide)}
            href="/load-order"
          >
            Browse all {modCount} mods
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * The showcase strip: an endless, slowly drifting row of screenshots you can also fling.
 *
 * Built on Embla rather than a native scroller, because a native scroller cannot be infinite —
 * it has to be faked with duplicated content and a `scrollLeft` jump at each end, and every
 * part of that fake depends on the browser reporting exact geometry. Browsers do not agree on
 * it, and two years of showcase bugs were each one of those numbers: a 5.75px lurch at the
 * wrap (the period was measured a half-gap short), judder (scrollLeft snaps to device pixels),
 * and screenshots running out on iPhone (WebKit sized the track ~3200px too wide).
 *
 * Embla owns the position as a plain number and draws it with a transform. It loops by moving
 * individual slides from one end to the other as the strip travels, so there is no edge to
 * reach, no duplicate DOM (24 tiles, not 48), and a fling in either direction just keeps going.
 * Its engine steps at a fixed 60Hz and interpolates on render, so the speed is the same on a
 * 60Hz laptop and a 120Hz iPhone.
 */
const SHOWCASE_SPEED_PX_PER_SEC = 36;
/**
 * How long a restart takes to reach cruising speed. Short enough that it plainly sets off
 * straight away, long enough not to lurch — it covers about 18px getting there.
 */
const SHOWCASE_EASE_IN_MS = 1000;
/** How long the strip waits after a swipe or fling has fully come to rest. */
const RESUME_AFTER_TOUCH_MS = 1200;
/** After the arrow buttons, measured from the end of their animation. */
const RESUME_AFTER_NAV_MS = 900;
/** After the zoom closes. */
const RESUME_AFTER_ZOOM_MS = 300;
/** After a mouse leaves the strip. */
const RESUME_AFTER_HOVER_MS = 200;
/** How much of the visible width one arrow press moves, as before. */
const NAV_STEP_OF_VIEWPORT = 0.6;

const SHOWCASE_EMBLA_OPTIONS = {
  loop: true,
  dragFree: true,
  align: 'start',
} as const;

/**
 * A MediaQueryList change listener that survives Safari before 14, which only had addListener.
 * Throwing here would take the whole homepage down with it, not just the strip.
 */
function onMediaChange(media: MediaQueryList, listener: () => void): () => void {
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }
  media.addListener(listener);
  return () => media.removeListener(listener);
}

/** Every reason the strip should be standing still. It drifts only when none of them hold. */
type Holds = {
  hovered: boolean;
  touching: boolean;
  zoomOpen: boolean;
  reducedMotion: boolean;
  offscreen: boolean;
};

function Showcase() {
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

  // One drift instance for the component's life. It never starts or stops itself: every play
  // and stop decision is made in sync() below. See showcaseDrift.ts for why this is not
  // embla-carousel-auto-scroll.
  const drift = React.useMemo(
    () => ShowcaseDrift({ speedPxPerSec: SHOWCASE_SPEED_PX_PER_SEC, easeInMs: SHOWCASE_EASE_IN_MS }),
    []
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(SHOWCASE_EMBLA_OPTIONS, [drift]);

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const holds = React.useRef<Holds>({
    hovered: false,
    touching: false,
    zoomOpen: false,
    reducedMotion: false,
    offscreen: true,
  });
  const resumeTimer = React.useRef<number | undefined>(undefined);
  // The delay a pending resume was scheduled with, so a strip still gliding can push it back.
  const pendingResumeMs = React.useRef<number | null>(null);

  const canPlay = React.useCallback(() => {
    const h = holds.current;
    return !h.hovered && !h.touching && !h.zoomOpen && !h.reducedMotion && !h.offscreen;
  }, []);

  /** Make the strip match the holds: stop now, or play after `delayMs`. */
  const sync = React.useCallback(
    (delayMs = 0) => {
      const plugin = emblaApi?.plugins().drift;
      if (!plugin) return;
      window.clearTimeout(resumeTimer.current);
      pendingResumeMs.current = null;

      if (!canPlay()) {
        plugin.stop();
        return;
      }
      if (plugin.isPlaying()) return;
      if (delayMs <= 0) {
        plugin.play();
        return;
      }
      pendingResumeMs.current = delayMs;
      resumeTimer.current = window.setTimeout(() => {
        pendingResumeMs.current = null;
        // Re-check: anything may have changed while we waited.
        if (canPlay()) emblaApi?.plugins().drift?.play();
      }, delayMs);
    },
    [emblaApi, canPlay]
  );

  // Drags, flings and taps.
  React.useEffect(() => {
    if (!emblaApi) return undefined;
    const onPointerDown = () => {
      holds.current.touching = true;
      sync();
    };
    const onPointerUp = () => {
      holds.current.touching = false;
      sync(RESUME_AFTER_TOUCH_MS);
    };
    // A fling keeps gliding after the finger lifts. While it does, keep pushing the resume
    // back, so the strip only picks up again once it has genuinely come to rest — resuming
    // mid-glide would swap the momentum for the slow drift in a single frame.
    const onScroll = () => {
      const plugin = emblaApi.plugins().drift;
      if (pendingResumeMs.current != null && plugin && !plugin.isPlaying()) {
        sync(pendingResumeMs.current);
      }
    };
    // Slides were re-measured (the shuffle after mount, a resize): the plugin is re-created
    // stopped, so start it again if nothing is holding it.
    const onReInit = () => sync();

    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onReInit);
    sync();
    return () => {
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('pointerUp', onPointerUp);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onReInit);
      window.clearTimeout(resumeTimer.current);
    };
  }, [emblaApi, sync]);

  // Hover pauses, but only for a real mouse. On a touchscreen "hover" is a tap that sticks.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const enter = () => {
      if (!fineHover.matches) return;
      holds.current.hovered = true;
      sync();
    };
    const leave = () => {
      if (!holds.current.hovered) return;
      holds.current.hovered = false;
      sync(RESUME_AFTER_HOVER_MS);
    };
    root.addEventListener('mouseenter', enter);
    root.addEventListener('mouseleave', leave);
    return () => {
      root.removeEventListener('mouseenter', enter);
      root.removeEventListener('mouseleave', leave);
    };
  }, [sync]);

  // Stand still while a screenshot is zoomed. custom-zoom announces open and close.
  React.useEffect(() => {
    const handle = (event: Event) => {
      const open = Boolean((event as CustomEvent<{ open?: boolean }>).detail?.open);
      holds.current.zoomOpen = open;
      // The overlay covering the strip fired mouseleave on the way in, so hover is already
      // clear; a mouse that is still over the strip sets it again on its next move.
      sync(open ? 0 : RESUME_AFTER_ZOOM_MS);
    };
    window.addEventListener('licentia-zoom-change', handle);
    return () => window.removeEventListener('licentia-zoom-change', handle);
  }, [sync]);

  // Respect reduced motion: the strip still drags and the arrows still work, it just never drifts.
  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      holds.current.reducedMotion = media.matches;
      sync();
    };
    apply();
    return onMediaChange(media, apply);
  }, [sync]);

  // Only animate while it can be seen. Otherwise the engine runs a frame loop for a strip
  // nobody is looking at, for as long as the page is open.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) {
      holds.current.offscreen = false;
      sync();
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => {
      holds.current.offscreen = !entry.isIntersecting;
      sync();
    });
    io.observe(root);
    return () => io.disconnect();
  }, [sync]);

  const scrollByAmount = React.useCallback(
    (dir: 1 | -1) => {
      if (!emblaApi) return;
      // Stop first: while the drift drives the engine it ignores scroll targets.
      emblaApi.plugins().drift?.stop();
      const viewport = emblaApi.rootNode().clientWidth;
      const slide = emblaApi.slideNodes()[0];
      const step = slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(slide).marginRight) : 268;
      const slides = Math.max(1, Math.round((viewport * NAV_STEP_OF_VIEWPORT) / step));
      emblaApi.scrollTo(emblaApi.selectedScrollSnap() + dir * slides);
      sync(RESUME_AFTER_NAV_MS);
    },
    [emblaApi, sync]
  );

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

      <div className={styles.marqueeOuter} ref={rootRef}>
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
        <div className={styles.emblaViewport} ref={viewportRef}>
          <div className={styles.emblaContainer}>
            {SHOTS.map((shot, i) => (
              // Embla writes a transform onto each slide to loop it, so the slide is a plain
              // wrapper it can own; the framed image inside stays React's.
              <div key={shot.id} className={styles.emblaSlide}>
                <SiteImage
                  // The tile shows the 768px thumbnail; the zoom opens the full file, and shows
                  // this thumbnail while the full one loads (see custom-zoom.ts).
                  src={shot.thumb}
                  data-zoom-src={shot.src}
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
              </div>
            ))}
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
