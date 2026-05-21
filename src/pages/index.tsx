import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

type ModuleCard = {
  title: string;
  description: string;
  meta: string;
};

type Capability = {
  label: string;
  value: string;
};

const modules: ModuleCard[] = [
  {
    title: 'Resize',
    description: 'Preset-driven batch resizing with smart trimming and parallel execution.',
    meta: 'Batch scale',
  },
  {
    title: 'Compression',
    description: 'MozJPEG, Guetzli, pngquant, and ImageMagick orchestration for production assets.',
    meta: 'Quality target',
  },
  {
    title: 'Workflows',
    description: 'Node graph pipelines with triggers, marketplace nodes, and reusable execution context.',
    meta: 'DAG engine',
  },
  {
    title: 'Renamer',
    description: 'AI-assisted image naming with multi-modal models and repeatable naming strategies.',
    meta: 'AI powered',
  },
  {
    title: 'Scissors',
    description: 'Canvas cutting, drawing tools, and batch auto-cut for creator workflows.',
    meta: 'Smart cut',
  },
  {
    title: 'Bitdepth',
    description: 'Per-channel control, palettes, and dithering presets for pixel-level output.',
    meta: 'Color control',
  },
];

const capabilities: Capability[] = [
  { label: 'Modules', value: '08' },
  { label: 'Pipeline model', value: 'DAG' },
  { label: 'License', value: 'GPL v3' },
  { label: 'Runtime', value: 'Desktop' },
];

const stack = ['PyQt5', 'Fluent UI', 'Process Pool', 'PyOpenCL', 'CuPy', 'OpenCV', 'Pillow', 'ImageMagick'];

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Pixore"
      description="Pixore is an all-in-one image workstation with a visual workflow engine."
    >
      <main className={styles.pageShell}>
        <section className={styles.hero}>
          <div className={styles.heroBackground} aria-hidden="true" />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>
                <span className={styles.statusDot} />
                Visual Image Workstation · Node-Based Pipeline
              </div>

              <h1 className={styles.heroTitle}>
                Build image pipelines with surgical precision.
              </h1>

              <p className={styles.heroLead}>
                Pixore combines eight focused image tools, AI-assisted operations, and a visual workflow engine into one elegant desktop workstation for creators, developers, and power users.
              </p>

              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} to="/docs/getting-started/installation">
                  Start building
                  <span aria-hidden="true">→</span>
                </Link>
                <Link className={styles.secondaryButton} to="/docs/architecture">
                  View architecture
                </Link>
              </div>

              <div className={styles.heroStats} aria-label="Pixore highlights">
                {capabilities.map((item) => (
                  <div className={styles.statCard} key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.productPanel} aria-label="Pixore workflow preview">
              <div className={styles.panelHeader}>
                <span />
                <span />
                <span />
                <em>workflow.graph</em>
              </div>
              <div className={styles.graphCanvas}>
                <svg viewBox="0 0 560 420" role="img" aria-label="Node pipeline preview">
                  <defs>
                    <linearGradient id="edgeGradient" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#9BD301" />
                      <stop offset="100%" stopColor="#39D0FF" />
                    </linearGradient>
                    <filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">
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
                  <Node x={62} y={82} title="Import" detail="folder/*.png" />
                  <Node x={62} y={256} title="Watch" detail="trigger" />
                  <Node x={256} y={168} title="Resize" detail="2x / webp" active />
                  <Node x={430} y={88} title="Compress" detail="quality 82" />
                  <Node x={430} y={254} title="Rename" detail="ai pattern" />
                  <circle className={styles.flowDot} r="5">
                    <animateMotion dur="3.2s" repeatCount="indefinite" path="M116 120 C 190 120, 204 194, 278 194" />
                  </circle>
                  <circle className={styles.flowDotAlt} r="4">
                    <animateMotion dur="3.8s" repeatCount="indefinite" path="M352 206 C 412 206, 424 126, 488 126" />
                  </circle>
                </svg>
              </div>
              <div className={styles.panelFooter}>
                <span>Execution context ready</span>
                <strong>96 images queued</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Why Pixore</span>
            <h2>One system for repeatable image production.</h2>
            <p>
              Replace scattered single-purpose utilities with a composable workflow model that scales from one-off cleanup to automated asset pipelines.
            </p>
          </div>
          <div className={styles.featureRail}>
            <article>
              <span>01</span>
              <h3>Visual workflow engine</h3>
              <p>Build pipelines as directed acyclic graphs. Each node owns its behavior; the scheduler handles dependency order and parallel-ready stages.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Batch-native execution</h3>
              <p>Process folders through chunked concurrency, process pools, async thumbnail loading, and optional GPU acceleration.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Extensible node ecosystem</h3>
              <p>Install community nodes through the marketplace, validate manifests, resolve dependencies, and compose custom capability packs.</p>
            </article>
          </div>
        </section>

        <section className={styles.modulesSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Toolkit</span>
            <h2>Focused modules, unified by one workflow language.</h2>
          </div>
          <div className={styles.modulesGrid}>
            {modules.map((module) => (
              <article className={styles.moduleCard} key={module.title}>
                <div>
                  <span>{module.meta}</span>
                  <h3>{module.title}</h3>
                </div>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.stackSection}>
          <div>
            <span className={styles.eyebrow}>Under the hood</span>
            <h2>Desktop performance with modern system design.</h2>
            <p>
              Pixore separates UI, application services, workflow scheduling, node loading, and external processing tools. Result: clean boundaries, fast iteration, and a platform ready for advanced image automation.
            </p>
          </div>
          <div className={styles.stackGrid}>
            {stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <span className={styles.eyebrow}>Ready to ship assets faster?</span>
            <h2>Design the pipeline once. Run it everywhere.</h2>
            <p>Start with installation, build your first workflow, then extend Pixore with custom nodes.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} to="/docs/getting-started/first-workflow">
                Build first workflow
                <span aria-hidden="true">→</span>
              </Link>
              <Link className={styles.secondaryButton} to="/docs/node-development/overview">
                Create nodes
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function Node({ x, y, title, detail, active = false }: { x: number; y: number; title: string; detail: string; active?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} filter={active ? 'url(#nodeGlow)' : undefined}>
      <rect width="128" height="76" rx="18" className={active ? styles.nodeRectActive : styles.nodeRect} />
      <circle cx="22" cy="24" r="6" className={active ? styles.nodePinActive : styles.nodePin} />
      <text x="42" y="29" className={styles.nodeTitle}>{title}</text>
      <text x="22" y="54" className={styles.nodeDetail}>{detail}</text>
    </g>
  );
}
