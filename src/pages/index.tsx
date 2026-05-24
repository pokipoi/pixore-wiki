import React, { useEffect, useRef, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

/* ── Data ── */

type ModuleCard = {
  title: string;
  description: string;
  meta: string;
  icon: string;
};

type Capability = {
  label: string;
  value: string;
  icon: string;
};

const modules: ModuleCard[] = [
  {
    title: 'Resize',
    description: 'Preset-driven batch resizing with smart trimming and parallel execution.',
    meta: 'Batch scale',
    icon: '↔',
  },
  {
    title: 'Compression',
    description: 'MozJPEG, Guetzli, pngquant, and ImageMagick orchestration for production assets.',
    meta: 'Quality target',
    icon: '◉',
  },
  {
    title: 'Workflows',
    description: 'Node graph pipelines with triggers, marketplace nodes, and reusable execution context.',
    meta: 'DAG engine',
    icon: '◎',
  },
  {
    title: 'Renamer',
    description: 'AI-assisted image naming with multi-modal models and repeatable naming strategies.',
    meta: 'AI powered',
    icon: '✦',
  },
  {
    title: 'Scissors',
    description: 'Canvas cutting, drawing tools, and batch auto-cut for creator workflows.',
    meta: 'Smart cut',
    icon: '✂',
  },
  {
    title: 'Bitdepth',
    description: 'Per-channel control, palettes, and dithering presets for pixel-level output.',
    meta: 'Color control',
    icon: '◈',
  },
];

const capabilities: Capability[] = [
  { label: 'Modules', value: '08', icon: '⬡' },
  { label: 'Pipeline', value: 'DAG', icon: '◇' },
  { label: 'License', value: 'GPL v3', icon: '⚖' },
  { label: 'Runtime', value: 'Desktop', icon: '▣' },
];

const features = [
  {
    num: '01',
    title: 'Visual workflow engine',
    desc: 'Build pipelines as directed acyclic graphs. Each node owns its behavior; the scheduler handles dependency order and parallel-ready stages.',
  },
  {
    num: '02',
    title: 'Batch-native execution',
    desc: 'Process folders through chunked concurrency, process pools, async thumbnail loading, and optional GPU acceleration.',
  },
  {
    num: '03',
    title: 'Extensible node ecosystem',
    desc: 'Install community nodes through the marketplace, validate manifests, resolve dependencies, and compose custom capability packs.',
  },
];

const stack = [
  { name: 'PyQt5', category: 'UI' },
  { name: 'Fluent UI', category: 'UI' },
  { name: 'Process Pool', category: 'Core' },
  { name: 'PyOpenCL', category: 'GPU' },
  { name: 'CuPy', category: 'GPU' },
  { name: 'OpenCV', category: 'Vision' },
  { name: 'Pillow', category: 'Vision' },
  { name: 'ImageMagick', category: 'CLI' },
];

/* ── Main Page ── */

export default function Home(): React.ReactElement {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection observer for scroll-in animations
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
    <Layout title="Pixore" description="Pixore is an all-in-one image workstation with a visual workflow engine.">
      <main className={styles.pageShell}>

        {/* ═══ HERO ═══ */}
        <section className={styles.hero} ref={heroRef}>
          <div className={styles.heroNoise} aria-hidden="true" />
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <fluent-badge appearance="accent" className={styles.kickerBadge}>
                <span className={styles.badgeDot} />
                Visual Image Workstation · Node-Based Pipeline
              </fluent-badge>

              <h1 className={styles.heroTitle}>
                Build image pipelines<br />
                <span className={styles.heroTitleAccent}>with surgical precision.</span>
              </h1>

              <p className={styles.heroLead}>
                Pixore combines eight focused image tools, AI-assisted operations, and a visual workflow engine into one elegant desktop workstation for creators, developers, and power users.
              </p>

              <div className={styles.heroActions}>
                <Link to="/docs/getting-started/installation" className={styles.primaryBtn}>
                  <fluent-button appearance="primary" size="large">Start building →</fluent-button>
                </Link>
                <Link to="/docs/architecture" className={styles.secondaryBtn}>
                  <fluent-button appearance="secondary" size="large">View architecture</fluent-button>
                </Link>
              </div>

              <div className={styles.statsRow}>
                {capabilities.map((cap) => (
                  <fluent-card key={cap.label} className={styles.statCard}>
                    <span className={styles.statIcon}>{cap.icon}</span>
                    <span className={styles.statValue}>{cap.value}</span>
                    <span className={styles.statLabel}>{cap.label}</span>
                  </fluent-card>
                ))}
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.graphFrame}>
                <div className={styles.graphTitlebar}>
                  <span className={styles.dot} />
                  <span className={styles.dotYellow} />
                  <span className={styles.dotGreen} />
                  <em>workflow.graph</em>
                </div>
                <div className={styles.graphBody}>
                  <svg viewBox="0 0 560 420" role="img" aria-label="Node pipeline preview">
                    <defs>
                      <linearGradient id="edgeGrad" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#9BD301" />
                        <stop offset="100%" stopColor="#39D0FF" />
                      </linearGradient>
                      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path className={styles.edgeLine} d="M116 120 C 190 120, 204 194, 278 194" />
                    <path className={styles.edgeLine} d="M116 294 C 190 294, 206 220, 278 220" />
                    <path className={styles.edgeLine} d="M352 206 C 412 206, 424 126, 488 126" />
                    <path className={styles.edgeLine} d="M352 218 C 412 218, 426 292, 488 292" />
                    <GraphNode x={62} y={82} title="Import" detail="folder/*.png" />
                    <GraphNode x={62} y={256} title="Watch" detail="trigger" />
                    <GraphNode x={256} y={168} title="Resize" detail="2x / webp" active />
                    <GraphNode x={430} y={88} title="Compress" detail="quality 82" />
                    <GraphNode x={430} y={254} title="Rename" detail="ai pattern" />
                    <circle className={styles.flowDot} r="5">
                      <animateMotion dur="3.2s" repeatCount="indefinite" path="M116 120 C 190 120, 204 194, 278 194" />
                    </circle>
                    <circle className={styles.flowDotAlt} r="4">
                      <animateMotion dur="3.8s" repeatCount="indefinite" path="M352 206 C 412 206, 424 126, 488 126" />
                    </circle>
                  </svg>
                </div>
                <div className={styles.graphFooter}>
                  <span>Execution context ready</span>
                  <strong>96 images queued</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ WHY PIXORE ═══ */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <fluent-badge appearance="outline" className={styles.sectionEyebrow}>Why Pixore</fluent-badge>
              <h2>One system for repeatable image production.</h2>
              <p>Replace scattered single-purpose utilities with a composable workflow model that scales from one-off cleanup to automated asset pipelines.</p>
            </div>

            <div className={styles.featuresGrid}>
              {features.map((f) => (
                <fluent-card key={f.num} className={styles.featureCard}>
                  <span className={styles.featureNum}>{f.num}</span>
                  <h3>{f.title}</h3>
                  <fluent-divider />
                  <p>{f.desc}</p>
                </fluent-card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TOOLKIT ═══ */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <fluent-badge appearance="outline" className={styles.sectionEyebrow}>Toolkit</fluent-badge>
              <h2>Focused modules, unified by one workflow language.</h2>
            </div>

            <div className={styles.modulesGrid}>
              {modules.map((mod) => (
                <fluent-card key={mod.title} className={styles.moduleCard}>
                  <div className={styles.moduleTop}>
                    <div className={styles.moduleIcon}>{mod.icon}</div>
                    <fluent-badge appearance="ghost" className={styles.moduleMeta}>{mod.meta}</fluent-badge>
                  </div>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                </fluent-card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STACK ═══ */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.sectionInner}>
            <div className={styles.stackLayout}>
              <div className={styles.stackText}>
                <fluent-badge appearance="outline" className={styles.sectionEyebrow}>Under the hood</fluent-badge>
                <h2>Desktop performance with modern system design.</h2>
                <p>Pixore separates UI, application services, workflow scheduling, node loading, and external processing tools. Result: clean boundaries, fast iteration, and a platform ready for advanced image automation.</p>
              </div>
              <div className={styles.stackBadges}>
                {stack.map((tech) => (
                  <fluent-card key={tech.name} className={styles.techBadge}>
                    <span className={styles.techCategory}>{tech.category}</span>
                    <span className={styles.techName}>{tech.name}</span>
                  </fluent-card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.sectionInner}>
            <fluent-card className={styles.ctaCard}>
              <div className={styles.ctaGlow} aria-hidden="true" />
              <fluent-badge appearance="accent" className={styles.ctaEyebrow}>Ready to ship assets faster?</fluent-badge>
              <h2>Design the pipeline once.<br />Run it everywhere.</h2>
              <p>Start with installation, build your first workflow, then extend Pixore with custom nodes.</p>
              <div className={styles.ctaActions}>
                <Link to="/docs/getting-started/first-workflow" className={styles.primaryBtn}>
                  <fluent-button appearance="primary" size="large">Build first workflow →</fluent-button>
                </Link>
                <Link to="/docs/node-development/overview" className={styles.secondaryBtn}>
                  <fluent-button appearance="secondary" size="large">Create nodes</fluent-button>
                </Link>
              </div>
            </fluent-card>
          </div>
        </section>

      </main>
    </Layout>
  );
}

/* ── SVG Node component ── */

function GraphNode({ x, y, title, detail, active = false }: {
  x: number; y: number; title: string; detail: string; active?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`} filter={active ? 'url(#glow)' : undefined}>
      <rect width="128" height="76" rx="16" className={active ? styles.nodeActive : styles.nodeBase} />
      <circle cx="22" cy="24" r="6" className={active ? styles.pinActive : styles.pinBase} />
      <text x="42" y="29" className={styles.nodeTitle}>{title}</text>
      <text x="22" y="54" className={styles.nodeDetail}>{detail}</text>
    </g>
  );
}
