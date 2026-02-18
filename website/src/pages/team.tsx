import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './team.module.css';

type TeamMember = {
  name: string;
  subtitle?: string;
  avatar: string;
};

const CORE_TEAM: TeamMember[] = [
  { name: 'Akzar', subtitle: 'List maintainer', avatar: '/img/pages/team/akzar.webp' },
  { name: 'Catastrophic Apathy', subtitle: 'Support & Testing extraordinaire', avatar: '/img/pages/team/CatastrophicApathy.webp' },
  { name: 'ninjawaffle', subtitle: 'Scripting wizard', avatar: '/img/pages/team/ninjawaffle.webp' },
  { name: 'shadowlock', subtitle: 'Bodyslide expert', avatar: '/img/pages/team/shadowlock.webp' },
];

const INACTIVE_TEAM: TeamMember[] = [
  { name: 'Elegant Desklamp', avatar: '/img/pages/team/Elegant Desklamp.webp' },
  { name: 'Ryan156', avatar: '/img/pages/team/Ryan156.webp' },
  { name: 'Nazar🪬', avatar: '/img/pages/team/𝑁𝑎𝑧𝑎𝑟🪬.webp' },
];

const SPECIAL_THANKS: TeamMember[] = [
  {
    name: 'Vermillion',
    subtitle: 'The benevolent owner of our Discord server',
    avatar: '/img/pages/team/Vermillion.webp',
  },
  {
    name: 'LeoMaximus',
    subtitle: 'Our skillful Discord Moderator',
    avatar: '/img/pages/team/LeoMaximus.webp',
  },
  {
    name: 'Jake71887',
    subtitle: 'The most active Beta Tester and Bug Reporter',
    avatar: '/img/pages/team/Jake71887.webp',
  },
];

const TEAM_PAGE_DESCRIPTION = 'Meet the people behind Licentia NEXT!';
const TEAM_SOCIAL_IMAGE = 'https://licentia.quest/img/pages/licentia-team-social.png';
const TEAM_PAGE_URL = 'https://licentia.quest/team';

function TeamCard({
  member,
  large = false,
  showSubtitle = true,
}: {
  member: TeamMember;
  large?: boolean;
  showSubtitle?: boolean;
}) {
  return (
    <article className={`${styles.card} ${large ? styles.cardLarge : ''}`.trim()}>
      <img className={styles.avatar} src={member.avatar} alt={`${member.name} avatar`} width={160} height={160} />
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
        <meta property="og:title" content="Licentia Team" />
        <meta property="og:description" content={TEAM_PAGE_DESCRIPTION} />
        <meta property="og:url" content={TEAM_PAGE_URL} />
        <meta property="og:image" content={TEAM_SOCIAL_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Licentia Team" />
        <meta name="twitter:description" content={TEAM_PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={TEAM_SOCIAL_IMAGE} />
      </Head>
      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className={styles.visuallyHidden}>Licentia Team</h1>
            <img src="/img/pages/licentia-team.png" alt="Licentia Team" className={styles.headingImg} />
          </header>

          <section className={styles.gridCore} aria-label="Core team members">
            {CORE_TEAM.map((member) => (
              <TeamCard key={member.name} member={member} large showSubtitle />
            ))}
          </section>

          <div className={styles.separator} aria-hidden />
          <h2 className={styles.subheading}>⏳ Occasional Contributors</h2>

          <section className={styles.gridInactive} aria-label="Occasional contributors">
            {INACTIVE_TEAM.map((member) => (
              <TeamCard key={member.name} member={member} showSubtitle={false} />
            ))}
          </section>

          <div className={styles.separator} aria-hidden />
          <h2 className={styles.subheading}>❤️ Special Thanks</h2>

          <section className={styles.thanksGrid} aria-label="Special thanks">
            {SPECIAL_THANKS.map((person) => (
              <article key={person.name} className={styles.thanksCard}>
                <img className={styles.avatar} src={person.avatar} alt={`${person.name} avatar`} width={120} height={120} />
                <h3 className={styles.name}>{person.name}</h3>
                <p className={styles.role}>{person.subtitle}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}
