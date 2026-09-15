import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import clsx from 'clsx';
import styles from './media.module.css';
import SiteImage from '@site/src/components/SiteImage';
import { ALL_SCREENSHOTS } from '@site/src/data/screenshots';

const MEDIA_PAGE_URL = 'https://licentia.quest/media';
const MEDIA_PAGE_TITLE = 'Media 📸';
const MEDIA_SOCIAL_TITLE = 'Media 📸 | Licentia NEXT';
const MEDIA_PAGE_DESCRIPTION =
  'Explore the full Licentia NEXT screenshot gallery and watch the reviews.';
const MEDIA_SOCIAL_IMAGE = 'https://licentia.quest/img/social-cards/media-social.jpg';
const YOUTUBE_REVIEW_URL = '';

/**
 * The no-cookie host, not youtube.com.
 *
 * This site sets no cookies and contacts no third party -- checked in the browser, on
 * production: no cookies, nothing in sessionStorage, no requests off-origin. A plain
 * youtube.com embed ends that the moment a video is configured here, because the player
 * writes tracking cookies as soon as the iframe loads, whether or not anybody presses
 * play. youtube-nocookie.com serves the same player without them.
 *
 * Worth keeping that way: it is the difference between needing a consent banner and not.
 */
const YOUTUBE_EMBED_HOST = 'https://www.youtube-nocookie.com/embed';

function toYoutubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return `${YOUTUBE_EMBED_HOST}/${watchMatch[1]}`;

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) return `${YOUTUBE_EMBED_HOST}/${shortMatch[1]}`;

  const embedMatch = trimmed.match(/youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) return `${YOUTUBE_EMBED_HOST}/${embedMatch[1]}`;

  return null;
}

type Tab = 'screenshots' | 'videos';

const TABS: [Tab, string][] = [
  ['screenshots', 'Screenshots'],
  ['videos', 'Videos'],
];

export default function MediaPage(): React.JSX.Element {
  const embedUrl = toYoutubeEmbedUrl(YOUTUBE_REVIEW_URL);
  const [tab, setTab] = useState<Tab>('screenshots');

  // Both panels stay in the document and are hidden with `hidden`, rather than one of them
  // being unmounted: the gallery is what this page is for SEO, the old #screenshots and
  // #video anchors keep working, and a deep link to one of them opens the right tab.
  useEffect(() => {
    if (window.location.hash === '#video' || window.location.hash === '#videos') {
      setTab('videos');
    }
  }, []);

  return (
    <Layout title={MEDIA_PAGE_TITLE} description={MEDIA_PAGE_DESCRIPTION}>
      <Head>
        <link rel="canonical" href={MEDIA_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={MEDIA_SOCIAL_TITLE} />
        <meta property="og:description" content={MEDIA_PAGE_DESCRIPTION} />
        <meta property="og:url" content={MEDIA_PAGE_URL} />
        <meta property="og:image" content={MEDIA_SOCIAL_IMAGE} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={MEDIA_SOCIAL_TITLE} />
        <meta name="twitter:description" content={MEDIA_PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={MEDIA_SOCIAL_IMAGE} />
      </Head>

      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1
              className="licentia-heading licentia-heading--h1"
            >
              Media
            </h1>
            <div className={styles.separator} aria-hidden />
          </header>

          <div className={styles.switch} role="tablist" aria-label="Media type">
            {TABS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                className={tab === id ? styles.switchOn : styles.switchOff}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <section
            id="screenshots"
            className={styles.section}
            role="tabpanel"
            aria-labelledby="tab-screenshots"
            hidden={tab !== 'screenshots'}
          >
            <p className={styles.hint}>
              {ALL_SCREENSHOTS.length} shots from the list — click any one to open it full
              size, then use ← and → to move through them.
            </p>
            <div className={styles.grid}>
              {ALL_SCREENSHOTS.map((shot, i) => (
                <figure key={shot.id} className={styles.card}>
                  <SiteImage
                    src={shot.src}
                    alt={`Licentia NEXT media screenshot ${i + 1}`}
                    className={clsx('zoomable', styles.shot)}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    width={1600}
                    height={900}
                  />
                </figure>
              ))}
            </div>
          </section>

          <section
            id="video"
            className={styles.section}
            role="tabpanel"
            aria-labelledby="tab-videos"
            hidden={tab !== 'videos'}
          >
            {embedUrl ? (
              <div className={styles.videoWrap}>
                <iframe
                  className={styles.video}
                  src={embedUrl}
                  title="Licentia NEXT review video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className={styles.videoPlaceholder}>
                <p>Review video is coming soon 😉</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}
