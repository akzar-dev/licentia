import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import data from '@site/src/data/load-order.json';
import styles from './load-order.module.css';

/**
 * The whole list, as it is actually ordered in Mod Organizer.
 *
 * The data is generated -- see website/tools/import-load-order.mjs, which reads the Kodex
 * support report out of the MO2 profile after a release and writes src/data/load-order.json.
 * Nothing here talks to MO2 or to Nexus at runtime; the page is static.
 *
 * Sections start collapsed. 1,562 mods is not a thing you read top to bottom -- you come
 * here to check whether one particular mod is in the list, or to see what a section is made
 * of, and both are faster against 118 headings than against a wall. The search box answers
 * the first question and opens whatever it matches.
 */

type Mod = { name: string; version?: string; nexus?: number; priority?: number; off?: boolean };
type Section = { name: string; mods: Mod[] };
type Group = { name: string; level: number; sections: Section[] };

const GROUPS = data.groups as Group[];
const SECTION_COUNT = GROUPS.reduce((n, g) => n + g.sections.length, 0);

const KODEX = 'https://www.nexusmods.com/skyrimspecialedition/mods/157869';

/**
 * The changelog's per-version anchor, as Docusaurus slugifies `## LICENTIA NEXT \`13.7.0\``.
 * If that heading is ever reworded the hash stops matching and the link simply lands at the
 * top of /changelog, which is a fine place to land.
 */
const changelogLink = (version: string | null) =>
  version ? `/changelog#licentia-next-${version.replace(/\./g, '')}` : '/changelog';

const DESCRIPTION = `Every mod in Licentia NEXT ${data.version}, in load order — ${data.mods} mods across ${SECTION_COUNT} sections, with Nexus links.`;
const PAGE_URL = 'https://licentia.quest/load-order';
const SOCIAL_TITLE = 'Load Order 📜 | Licentia NEXT';

/** A section's key has to survive two sections sharing a name in different groups. */
const keyOf = (group: Group, section: Section) => `${group.name}//${section.name}`;

/**
 * Opens and closes with a slide rather than a jump.
 *
 * `grid-template-rows: 0fr -> 1fr` is the one way to transition to a height nobody measured,
 * and the mount/unmount dance around it is what keeps 1,562 rows of markup out of the
 * document until something actually needs them.
 */
const SLIDE_BASE_MS = 220;
/** Close enough to the short-section 220ms that the two feel like the same control. */
const SLIDE_MAX_MS = 300;

/**
 * How the slide should run for content of this height.
 *
 * A fixed duration and a fixed curve are both wrong once a section is taller than the
 * window. `Graphics Base` is 76 rows and 2,957px: at 220ms the box passed the bottom of a
 * 900px screen after about 50 milliseconds and everything after that happened below the
 * fold, so it read as no animation at all -- which is exactly how it was reported.
 *
 * Two things fix it, and they are both about the part you can see:
 *
 *   * the duration scales with how much taller than the viewport the content is, capped,
 *     because matching the speed exactly would make that section take seven seconds;
 *   * past about one and a half screens the curve flips to slow-start/fast-finish. Normally
 *     an abrupt ending is bad, but here the ending is off the bottom of the screen -- so
 *     the time is spent where somebody is actually looking.
 */
const SLIDE_TALL = 1.5;

function slide(height: number) {
  const visible = Math.max(240, window.innerHeight * 0.75);
  const ratio = Math.max(1, height / visible);
  return {
    ms: Math.round(Math.min(SLIDE_MAX_MS, SLIDE_BASE_MS * ratio)),
    easing: ratio > SLIDE_TALL ? 'cubic-bezier(0.45, 0, 0.85, 0.6)' : 'ease',
  };
}

function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  /**
   * The start value is written by hand, and a layout read is forced between the two.
   *
   * Closing animated and opening did not, which is the giveaway: on close the element has
   * been sitting at 1fr for a while, so the browser has a computed value to transition
   * FROM. On open it has just been inserted, and a transition whose start value was never
   * computed simply snaps to the end. Asking React to give us a frame in between (one
   * requestAnimationFrame, or even two) is not a guarantee -- it worked once and then
   * didn't, because it depends on when React chooses to flush. Reading offsetHeight is a
   * guarantee: it forces style and layout right there, which is exactly what the
   * transition needs and all it needs.
   */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { ms, easing } = slide(el.firstElementChild?.scrollHeight ?? 0);
    el.style.transitionDuration = `${ms}ms`;
    el.style.transitionTimingFunction = easing;
    if (open) {
      el.style.gridTemplateRows = '0fr';
      void el.offsetHeight;
      el.style.gridTemplateRows = '1fr';
    } else {
      el.style.gridTemplateRows = '0fr';
    }
  }, [open, mounted]);

  useEffect(() => {
    if (open) return;
    // Whatever the slide is actually taking, plus a little; the rows come out after it.
    const { ms } = slide(ref.current?.firstElementChild?.scrollHeight ?? 0);
    const timer = setTimeout(() => setMounted(false), ms + 40);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;
  return (
    <div ref={ref} className={styles.collapse}>
      <div className={styles.collapseInner}>{children}</div>
    </div>
  );
}

function ModTable({ mods }: { mods: Mod[] }) {
  return (
    <div className={styles.table} role="table">
      <div className={styles.headRow} role="row">
        <span role="columnheader">Mod Name</span>
        <span role="columnheader">Mod Version</span>
        <span role="columnheader">Is Enabled</span>
        <span role="columnheader">Priority</span>
      </div>
      {mods.map((mod, i) => (
        <div className={styles.row} role="row" key={`${mod.name}-${i}`}>
          <span className={styles.cellName} role="cell" data-label="Mod Name">
            {mod.nexus ? (
              <a
                href={`https://www.nexusmods.com/skyrimspecialedition/mods/${mod.nexus}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {mod.name}
              </a>
            ) : (
              mod.name
            )}
            {/* On a phone this pill rides along with the name; the "Is Enabled" column and
                its label disappear there, because "True" 1,555 times is not information. */}
            {mod.off && (
              <span
                className={styles.offInline}
                title="Ships with the list, switched off by default"
              >
                Off by default
              </span>
            )}
          </span>
          <span className={styles.cellVersion} role="cell" data-label="Mod Version">
            {mod.version || '—'}
          </span>
          <span className={styles.cellEnabled} role="cell" data-label="Is Enabled">
            {mod.off ? (
              <span className={styles.off}>Off by default</span>
            ) : (
              <span className={styles.on}>True</span>
            )}
          </span>
          <span className={styles.cellPriority} role="cell" data-label="Priority">
            {mod.priority ?? '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function LoadOrderPage(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const needle = query.trim().toLowerCase();

  /**
   * Searching rewrites the page rather than highlighting inside it: sections that match
   * keep only their matching mods, and sections that match nothing disappear. Otherwise a
   * search for "Auri" leaves you scrolling 118 headings looking for the one that went bold.
   */
  const shown = useMemo(() => {
    if (!needle) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      sections: group.sections
        .map((section) => ({
          ...section,
          mods: section.mods.filter((m) => m.name.toLowerCase().includes(needle)),
        }))
        .filter((section) => section.mods.length),
    })).filter((group) => group.sections.length);
  }, [needle]);

  const hits = useMemo(
    () => shown.reduce((n, g) => n + g.sections.reduce((m, s) => m + s.mods.length, 0), 0),
    [shown]
  );

  const setAll = (value: boolean) => {
    const next: Record<string, boolean> = {};
    for (const group of GROUPS) for (const section of group.sections) next[keyOf(group, section)] = value;
    setOpen(next);
  };

  // While searching, every surviving section is open: the point of a search is to see the
  // hits, not to be handed a set of closed boxes that contain them.
  const isOpen = (key: string) => Boolean(needle) || Boolean(open[key]);

  const { plugins, standardSlots } = data;
  const percent = Math.round((plugins.standard / standardSlots) * 100);

  return (
    <Layout title="Load Order 📜" description={DESCRIPTION}>
      <Head>
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={SOCIAL_TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SOCIAL_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Head>

      <main className={styles.main}>
        <div className="container">
          <header className={styles.header}>
            <h1 className="licentia-heading licentia-heading--h1">Load Order</h1>
            <div className={styles.headerSeparator} aria-hidden />
            <p className={styles.lede}>
              All {data.mods.toLocaleString()} mods in{' '}
              <a href={changelogLink(data.version)}>
                <strong>Licentia NEXT {data.version}</strong>
              </a>
              , in the order Mod Organizer loads them.
            </p>
            <p className={styles.provenance}>
              Exported from the list itself with the help of <a href={KODEX}>Kodex</a>, and
              processed by our own tooling.
            </p>
          </header>

          <section className={styles.counts} aria-label="Plugin counts">
            {/* Two rows on purpose. The bar underneath is about the plugin breakdown, so
                the three numbers it explains sit together directly above it, and the two
                totals that are not part of that sum lead. */}
            <div className={styles.countRow}>
              <div className={styles.count}>
                <span className={styles.countValue}>{data.mods.toLocaleString()}</span>
                <span className={styles.countLabel}>mods</span>
              </div>
              <div className={styles.count}>
                <span className={styles.countValue}>{plugins.total.toLocaleString()}</span>
                <span className={styles.countLabel}>plugins</span>
              </div>
            </div>

            <div className={styles.countRow}>
              <div className={styles.count}>
                <span className={styles.countValue}>{plugins.esm}</span>
                <span className={styles.countLabel}>esm</span>
              </div>
              <div className={styles.count}>
                <span className={styles.countValue}>{plugins.esp}</span>
                <span className={styles.countLabel}>esp</span>
              </div>
              <div className={styles.count}>
                <span className={styles.countValue}>{plugins.esl.toLocaleString()}</span>
                <span className={styles.countLabel}>esl</span>
              </div>
            </div>

            <div className={styles.slots}>
              <div className={styles.slotBar}>
                <div className={styles.slotFill} style={{ width: `${percent}%` }} />
              </div>
              <p className={styles.slotNote}>
                <strong>
                  {plugins.standard} of {standardSlots} standard plugin slots used
                </strong>{' '}
                — room for {plugins.free} more non-light plugins.
              </p>
            </div>
          </section>

          <div className={styles.controls}>
            <input
              className={styles.search}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a mod…"
              aria-label="Find a mod in the load order"
            />
            <select
              className={styles.jump}
              value=""
              aria-label="Jump to a section"
              onChange={(e) => {
                const id = e.target.value;
                if (!id) return;
                setOpen((prev) => ({ ...prev, [id]: true }));
                // The section has to exist before it can be scrolled to.
                requestAnimationFrame(() =>
                  document.getElementById(id)?.scrollIntoView({ block: 'start' })
                );
              }}
            >
              <option value="">Jump to section…</option>
              {GROUPS.map((group) => (
                <optgroup key={group.name} label={group.name}>
                  {group.sections.map((section) => (
                    <option key={keyOf(group, section)} value={keyOf(group, section)}>
                      {section.name} ({section.mods.length})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button type="button" className={styles.action} onClick={() => setAll(true)}>
              Expand all
            </button>
            <button type="button" className={styles.action} onClick={() => setAll(false)}>
              Collapse all
            </button>
          </div>

          {needle && (
            <p className={styles.hits} role="status">
              {hits === 0
                ? `Nothing in the list matches “${query.trim()}”.`
                : `${hits} mod${hits === 1 ? '' : 's'} matching “${query.trim()}”.`}
            </p>
          )}

          {shown.map((group) => (
            <section key={group.name} className={styles.group}>
              <h2 className={group.level > 1 ? styles.subGroupName : styles.groupName}>
                {group.name}
              </h2>
              <div
                className={group.level > 1 ? styles.subGroupRule : styles.groupRule}
                aria-hidden
              />

              {group.sections.map((section) => {
                const key = keyOf(group, section);
                const expanded = isOpen(key);
                return (
                  <div key={key} id={key} className={styles.section} data-open={expanded ? '' : undefined}>
                    <button
                      type="button"
                      className={styles.sectionHead}
                      aria-expanded={expanded}
                      onClick={() => setOpen((prev) => ({ ...prev, [key]: !expanded }))}
                    >
                      {/* The same filled gold triangle a docs <details> draws, built the
                          same way (a CSS border trick), on the same side. */}
                      <span className={styles.chevron} aria-hidden />
                      <span className={styles.sectionName}>{section.name}</span>
                      <span className={styles.sectionCount}>
                        {section.mods.length} {section.mods.length === 1 ? 'mod' : 'mods'}
                      </span>
                    </button>

                    <Collapsible open={expanded}>
                      <ModTable mods={section.mods} />
                    </Collapsible>
                  </div>
                );
              })}
            </section>
          ))}

          <p className={styles.footnote}>
            The same list is also on{' '}
            <a href="https://modlistgrimoire.com/modlists/licentia-next">Modlist Grimoire</a> and{' '}
            <a href="https://loadorderlibrary.com/lists/licentia-next">Load Order Library</a>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
