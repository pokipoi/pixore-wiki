import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import styles from './index.module.css';

/* ── Data ── */

type ModuleCard = {
  title: string;
  description: string;
};

const modules: ModuleCard[] = [
  {
    title: translate({ id: 'homepage.modules.workflows.title', message: 'Workflows' }),
    description: translate({
      id: 'homepage.modules.workflows.description',
      message: 'Node-graph pipelines with triggers, marketplace nodes, and reusable execution context.',
    }),
  },
  {
    title: translate({ id: 'homepage.modules.resizeCompress.title', message: 'Resize & Compress' }),
    description: translate({
      id: 'homepage.modules.resizeCompress.description',
      message: 'Preset-driven batch resizing paired with MozJPEG, pngquant, and ImageMagick orchestration.',
    }),
  },
  {
    title: translate({ id: 'homepage.modules.aiRenamer.title', message: 'AI Renamer' }),
    description: translate({
      id: 'homepage.modules.aiRenamer.description',
      message: 'Multi-modal image naming with repeatable, deterministic naming strategies.',
    }),
  },
  {
    title: translate({ id: 'homepage.modules.scissorsBitdepth.title', message: 'Scissors & Bitdepth' }),
    description: translate({
      id: 'homepage.modules.scissorsBitdepth.description',
      message: 'Canvas cutting, batch auto-cut, per-channel control, palettes, and dithering presets.',
    }),
  },
];

/* ── Main Page ── */

export default function Home(): React.ReactElement {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll(`.${styles.reveal}`).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Layout
      title="Pixore"
      description={translate({
        id: 'homepage.layout.description',
        message: 'Pixore is an all-in-one image workstation with a visual workflow engine.',
      })}>
      <main className={styles.pageShell}>
        {/* ═══ HERO ═══ */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.kicker}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <Translate id="homepage.hero.kicker">Visual image workstation</Translate>
            </span>

            <h1 className={styles.heroTitle}>
              <Translate id="homepage.hero.title.line1">Image pipelines,</Translate>
              <br />
              <span className={styles.heroTitleAccent}>
                <Translate id="homepage.hero.title.accent">built once.</Translate>
              </span>
            </h1>

            <p className={styles.heroLead}>
              <Translate id="homepage.hero.lead">
                Pixore unifies focused image tools, AI-assisted operations, and a node-based workflow engine into a single, calm desktop workstation.
              </Translate>
            </p>

            <div className={styles.heroActions}>
              <Link to="/docs/getting-started/installation" className={styles.primaryBtn}>
                <Translate id="homepage.hero.primaryCta">Start building</Translate>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/docs/architecture" className={styles.linkBtn}>
                <Translate id="homepage.hero.secondaryCta">View architecture</Translate>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ MODULES ═══ */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.sectionInner}>
            <header className={styles.sectionHeader}>
              <h2>
                <Translate id="homepage.modules.heading">One workflow language. Focused modules.</Translate>
              </h2>
              <p>
                <Translate id="homepage.modules.lead">
                  Replace scattered single-purpose utilities with a composable model that scales from one-off cleanup to automated asset pipelines.
                </Translate>
              </p>
            </header>

            <div className={styles.modulesGrid}>
              {modules.map((mod, i) => (
                <article key={mod.title} className={styles.moduleCard}>
                  <span className={styles.moduleNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className={`${styles.section} ${styles.ctaSection} ${styles.reveal}`}>
          <div className={styles.ctaInner}>
            <h2>
              <Translate id="homepage.cta.heading.primary">Design the pipeline once.</Translate>{' '}
              <span className={styles.ctaMuted}>
                <Translate id="homepage.cta.heading.muted">Run it everywhere.</Translate>
              </span>
            </h2>
            <div className={styles.heroActions}>
              <Link to="/docs/getting-started/first-workflow" className={styles.primaryBtn}>
                <Translate id="homepage.cta.primaryButton">Build first workflow</Translate>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/docs/node-development/overview" className={styles.linkBtn}>
                <Translate id="homepage.cta.secondaryButton">Create nodes</Translate>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
