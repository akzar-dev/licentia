import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import clsx from 'clsx';
import styles from './media.module.css';

const shotsReq = (require as any).context(
  '@site/static/img/pages/main/screenshots',
  false,
  /\.(png|jpe?g|webp)$/i
);
type MediaShot = { id: string; src: string };
const ALL_SHOTS: MediaShot[] = shotsReq.keys().map((k: string) => ({
  id: k,
  src: shotsReq(k).default as string,
}));

const MEDIA_PAGE_URL = 'https://licentia.quest/media';
const MEDIA_PAGE_TITLE = 'Media 📸';
const MEDIA_SOCIAL_TITLE = 'Media 📸 | Licentia NEXT';
const MEDIA_PAGE_DESCRIPTION =
  'Explore the full Licentia NEXT screenshot gallery and watch the reviews.';
const MEDIA_SOCIAL_IMAGE = 'https://licentia.quest/img/social-cards/media-social.png';
const YOUTUBE_REVIEW_URL = '';

function toYoutubeEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  return null;
}

export default function MediaPage(): React.JSX.Element {
  const embedUrl = toYoutubeEmbedUrl(YOUTUBE_REVIEW_URL);

  return (
    <Layout title={MEDIA_PAGE_TITLE} description={MEDIA_PAGE_DESCRIPTION}>
      <Head>
        <link rel="canonical" href={MEDIA_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={MEDIA_SOCIAL_TITLE} />
        <meta property="og:description" content={MEDIA_PAGE_DESCRIPTION} />
        <meta property="og:url" content={MEDIA_PAGE_URL} />
        <meta property="og:image" content={MEDIA_SOCIAL_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={MEDIA_SOCIAL_TITLE} />
        <meta name="twitter:description" content={MEDIA_PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={MEDIA_SOCIAL_IMAGE} />
      </Head>

      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className={styles.visuallyHidden}>Media</h1>
            <img src="/img/pages/media/media-heading.png" alt="" aria-hidden className={styles.headingImg} />
            <div className={styles.separator} aria-hidden />
          </header>

          <section id="screenshots" className={styles.section} aria-label="Full screenshot gallery">
            <h2 className={styles.sectionTitle}>📸 Screenshots</h2>
            <div className={styles.grid}>
              {ALL_SHOTS.map((shot, i) => (
                <figure key={shot.id} className={styles.card}>
                  <img
                    src={shot.src}
                    alt={`Licentia NEXT media screenshot ${i + 1}`}
                    className={clsx('zoomable', styles.shot)}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </figure>
              ))}
            </div>
          </section>

          <section id="video" className={styles.section} aria-label="Review video">
            <h2 className={styles.sectionTitle}>🎬 Videos</h2>
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
