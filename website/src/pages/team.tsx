import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './team.module.css';
import SiteImage from '@site/src/components/SiteImage';
// Avatars are imported as modules rather than referenced by URL string, so the bundler
// resolves them at build time: a renamed or missing file becomes a build error instead of
// a silent broken image, and the emitted filenames are content-hashed for cache busting.
import avatarAkzar from '@site/static/img/pages/team/akzar.webp';
import avatarCatastrophicApathy from '@site/static/img/pages/team/CatastrophicApathy.webp';
import avatarNinjawaffle from '@site/static/img/pages/team/ninjawaffle.webp';
import avatarShadowlock from '@site/static/img/pages/team/shadowlock.webp';
import avatarElegantDesklamp from '@site/static/img/pages/team/Elegant Desklamp.webp';
import avatarRyan156 from '@site/static/img/pages/team/Ryan156.webp';
import avatarNazar from '@site/static/img/pages/team/𝑁𝑎𝑧𝑎𝑟🪬.webp';
import avatarVermillion from '@site/static/img/pages/team/Vermillion.webp';
import avatarLeoMaximus from '@site/static/img/pages/team/LeoMaximus.webp';
import avatarJake71887 from '@site/static/img/pages/team/Jake71887.webp';

type TeamMember = {
  name: string;
  subtitle?: string;
  avatar: string;
};

const CORE_TEAM: TeamMember[] = [
  { name: 'akzar', avatar: avatarAkzar },
  { name: 'Catastrophic Apathy', avatar: avatarCatastrophicApathy },
  { name: 'ninjawaffle', avatar: avatarNinjawaffle },
  { name: 'shadowlock', avatar: avatarShadowlock },
];

const INACTIVE_TEAM: TeamMember[] = [
  { name: 'Elegant Desklamp', avatar: avatarElegantDesklamp },
  { name: 'Ryan156', avatar: avatarRyan156 },
  { name: 'Nazar🪬', avatar: avatarNazar },
];

const SPECIAL_THANKS: TeamMember[] = [
  {
    name: 'Vermillion',
    subtitle: 'The benevolent owner of our Discord server',
    avatar: avatarVermillion,
  },
  {
    name: 'LeoMaximus',
    subtitle: 'Our skillful Discord Moderator',
    avatar: avatarLeoMaximus,
  },
  {
    name: 'Jake71887',
    subtitle: 'The most active Beta Tester and Bug Reporter',
    avatar: avatarJake71887,
  },
];

const TEAM_PAGE_DESCRIPTION = 'Meet the people behind Licentia NEXT!';
const TEAM_SOCIAL_IMAGE = 'https://licentia.quest/img/social-cards/licentia-team-social.png';
const TEAM_PAGE_URL = 'https://licentia.quest/team';
const TEAM_SOCIAL_TITLE = 'Licentia Team 🤖 | Licentia NEXT';

function TeamCard({
  member,
  large = false,
  showSubtitle = true,
}: {
  member: TeamMember;
  large?: boolean;
  showSubtitle?: boolean;
}) {
  const avatarSize = large ? 148 : 120;
  return (
    <article className={`${styles.card} ${large ? styles.cardLarge : ''}`.trim()}>
      <SiteImage
        className={styles.avatar}
        wrapperClassName={styles.avatarWrap}
        src={member.avatar}
        alt={`${member.name} avatar`}
        width={avatarSize}
        height={avatarSize}
        loading="lazy"
      />
      <h3 className={styles.name}>{member.name}</h3>
      {showSubtitle && member.subtitle ? <p className={styles.role}>{member.subtitle}</p> : null}
    </article>
  );
}

export default function TeamPage(): React.JSX.Element {
  return (
    <Layout title="Licentia Team 🤖" description={TEAM_PAGE_DESCRIPTION}>
      <Head>
        <link rel="canonical" href={TEAM_PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TEAM_SOCIAL_TITLE} />
        <meta property="og:description" content={TEAM_PAGE_DESCRIPTION} />
        <meta property="og:url" content={TEAM_PAGE_URL} />
        <meta property="og:image" content={TEAM_SOCIAL_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TEAM_SOCIAL_TITLE} />
        <meta name="twitter:description" content={TEAM_PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={TEAM_SOCIAL_IMAGE} />
      </Head>
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1
              className="licentia-heading licentia-heading--h1"
            >
              Licentia Team
            </h1>
            <div className={styles.headerSeparator} aria-hidden />
          </header>

          <section className={styles.gridCore} aria-label="Core team members">
            {CORE_TEAM.map((member) => (
              <TeamCard key={member.name} member={member} large showSubtitle={false} />
            ))}
          </section>

          <div className={styles.separator} aria-hidden />
          <h2 className={styles.subheading}>❤️ Special Thanks</h2>

          <section className={styles.thanksGrid} aria-label="Special thanks">
            {SPECIAL_THANKS.map((person) => (
              <article key={person.name} className={styles.thanksCard}>
                <SiteImage
                  className={styles.avatar}
                  wrapperClassName={styles.avatarWrap}
                  src={person.avatar}
                  alt={`${person.name} avatar`}
                  width={120}
                  height={120}
                  loading="lazy"
                />
                <h3 className={styles.name}>{person.name}</h3>
                <p className={styles.role}>{person.subtitle}</p>
              </article>
            ))}
          </section>

          <div className={styles.separator} aria-hidden />
          <h2 className={styles.subheading}>⏳ Occasional Contributors</h2>

          <section className={styles.gridInactive} aria-label="Occasional contributors">
            {INACTIVE_TEAM.map((member) => (
              <TeamCard key={member.name} member={member} showSubtitle={false} />
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}
