import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

/* ═══════════════════════════════════════════════════════════
   Pixore — 3D + scroll montage homepage
   ═══════════════════════════════════════════════════════════ */

/* ── Reveal hook: fade/slide elements into view on scroll ── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.pxIn = '1';
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('[data-px-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Hero scroll progress: 0..1 over hero stage height ── */
function useScrollStage(ref: React.RefObject<HTMLElement | null>, progressRef: React.MutableRefObject<number>) {
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const passed = -rect.top;
      const p = Math.max(0, Math.min(1, passed / Math.max(1, total)));
      progressRef.current = p;
      el.style.setProperty('--px-progress', String(p));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, progressRef]);
}

/* ── Cursor glow ── */
function useCursorGlow() {
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'px-cursor';
    document.body.appendChild(el);
    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX - 200}px,${e.clientY - 200}px,0)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.remove();
    };
  }, []);
}

/* ── Typewriter ── */
function Typewriter({ texts, speed = 90, pause = 2200 }: { texts: string[]; speed?: number; pause?: number }) {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < texts[idx].length) setCharIdx((c) => c + 1);
        else setTimeout(() => setDeleting(true), pause);
      } else {
        if (charIdx > 0) setCharIdx((c) => c - 1);
        else { setDeleting(false); setIdx((i) => (i + 1) % texts.length); }
      }
    }, deleting ? speed * 0.4 : speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, idx, texts, speed, pause]);
  return (
    <span>
      {texts[idx].slice(0, charIdx)}
      <span className={styles.typewriterCursor}>|</span>
    </span>
  );
}

/* ── Magnetic button ── */
function MagneticButton({ children, className, to }: { children: React.ReactNode; className?: string; to: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <Link
      ref={ref as any}
      to={to}
      className={className}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
    >
      {children}
    </Link>
  );
}

/* ── DATA ── */
const modules = [
  { icon: '⬡', label: 'Home / Settings', desc: 'Workspace setup' },
  { icon: '↔', label: 'Resize', desc: 'Smart scaling' },
  { icon: '⊞', label: 'Drag & Drop', desc: 'Instant import' },
  { icon: '↯', label: 'Compression', desc: 'Pixel-perfect shrink' },
  { icon: '◈', label: 'Bitdepth', desc: '8/16/32-bit control' },
  { icon: '✂', label: 'Scissors', desc: 'Crop & slice' },
  { icon: '✎', label: 'Renamer', desc: 'Pattern rename' },
  { icon: '⚙', label: 'Workflows', desc: 'Pipeline engine' },
];

const showcase = [
  {
    no: '01',
    eyebrow: 'Visual Engine',
    title: 'Drop nodes.\nWatch pixels flow.',
    body: 'Every operation is a node. Every connection a stream. Build pipelines that read like circuit diagrams — and run like compiled code.',
  },
  {
    no: '02',
    eyebrow: 'Batch Native',
    title: 'One folder.\nThousands of images.',
    body: 'Resize, compress, rename — all in parallel with GPU acceleration. From mobile thumbnails to print-ready masters in a single click.',
  },
  {
    no: '03',
    eyebrow: 'Composable',
    title: 'Eight modules.\nInfinite combos.',
    body: 'Each module is a precision tool. Chain them, fork them, branch them. The workstation adapts to your craft, not the other way around.',
  },
];

/* ═══════════════════════════════════════════ */
export default function Home(): React.ReactElement {
  useDocusaurusContext();
  useCursorGlow();
  useReveal();

  const heroRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  useScrollStage(heroRef, progressRef);

  return (
    <Layout title="Pixore" description="Visual Image Workstation — drop nodes, batch process thousands.">
      <main className={styles.main}>

        {/* ═══ HERO STAGE: split layout — text LEFT, 3D RIGHT ═══ */}
        <section ref={heroRef} className={styles.heroStage}>
          <div className={styles.heroSticky}>

            {/* Bauhaus background blocks (CSS shapes, behind everything) */}
            <div className={styles.heroBlocks} aria-hidden>
              <span className={`${styles.block} ${styles.blockYellow}`} />
              <span className={`${styles.block} ${styles.blockPink}`} />
              <span className={`${styles.block} ${styles.blockBlue}`} />
              <span className={`${styles.block} ${styles.blockMint}`} />
              <span className={`${styles.block} ${styles.blockCoralHalf}`} />
              <span className={`${styles.block} ${styles.blockTriangle}`} />
              <span className={`${styles.block} ${styles.blockStripe}`} />
            </div>

            <div className={styles.heroLayout}>

              {/* LEFT — text */}
              <div className={styles.heroOverlay}>
                <div className={styles.heroBadge} data-px-reveal>
                  <span className={styles.heroDot} />
                  v3.0 Beta · Open Source · GPL v3
                </div>

                <h1 className={styles.heroTitle} data-px-reveal>
                  <span className={styles.heroTitleAccent}>Pixore</span>
                  <span className={styles.heroTitleSub}>
                    <Typewriter
                      texts={['Visual Image Workstation', 'Batch Processing Engine', 'Node-Based Pipeline', 'Eight Modules. One Tool.']}
                    />
                  </span>
                </h1>

                <p className={styles.heroDesc} data-px-reveal>
                  Drop nodes, connect workflows, process thousands of images.
                  A composable image workstation that thinks in pipelines.
                </p>

                <div className={styles.heroCta} data-px-reveal>
                  <MagneticButton className={styles.ctaPrimary} to="/docs/intro">
                    <span>Get Started</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </MagneticButton>
                  <MagneticButton className={styles.ctaGhost} to="https://github.com/pokipoi/pixore">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </MagneticButton>
                </div>

                <div className={styles.heroHint} data-px-reveal>
                  <span>drag the shapes</span>
                  <span className={styles.heroHintArrow}>↗</span>
                  <span>scroll to dive in</span>
                </div>
              </div>

              {/* RIGHT — 3D shape stage */}
              <div className={styles.heroCanvas}>
                <BrowserOnly fallback={<div className={styles.heroFallback} />}>
                  {() => {
                    const ShapeStage3D = require('../components/ShapeStage3D').default;
                    return <ShapeStage3D className={styles.canvasInner} scrollProgressRef={progressRef} />;
                  }}
                </BrowserOnly>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MARQUEE: keyword strip ═══ */}
        <section className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className={styles.marqueeRow}>
                {['NODE-BASED', 'GPU ACCELERATED', 'BATCH PIPELINE', 'OPEN SOURCE', 'CROSS-PLATFORM', 'EIGHT MODULES', 'VISUAL', 'COMPOSABLE'].map((w, i) => (
                  <span key={i} className={styles.marqueeItem}>
                    {w}
                    <span className={styles.marqueeDot}>◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SHOWCASE: alternating montage rows ═══ */}
        <section className={styles.showcase}>
          {showcase.map((s, i) => (
            <article key={i} className={styles.showcaseRow} data-side={i % 2 === 0 ? 'left' : 'right'}>
              <div className={styles.showcaseText} data-px-reveal>
                <div className={styles.showcaseNo}>{s.no}</div>
                <div className={styles.showcaseEyebrow}>{s.eyebrow}</div>
                <h2 className={styles.showcaseTitle}>
                  {s.title.split('\n').map((line, k) => (
                    <span key={k}>{line}<br /></span>
                  ))}
                </h2>
                <p className={styles.showcaseBody}>{s.body}</p>
              </div>
              <div className={styles.showcaseVisual} data-px-reveal>
                <div className={styles.showcaseFrame}>
                  <div className={styles.showcaseFrameInner} data-variant={i}>
                    {/* SVG diagram per row */}
                    {i === 0 && <NodeDiagram />}
                    {i === 1 && <BatchDiagram />}
                    {i === 2 && <ModulesDiagram />}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ═══ MODULES grid ═══ */}
        <section className={styles.modulesSection}>
          <div className={styles.modulesHeader} data-px-reveal>
            <div className={styles.modulesEyebrow}>The Toolkit</div>
            <h2 className={styles.modulesTitle}>Eight modules. One workstation.</h2>
            <p className={styles.modulesSub}>Each one a precision instrument. Together, an image processing studio.</p>
          </div>
          <div className={styles.modulesGrid}>
            {modules.map((m, i) => (
              <div
                key={i}
                className={styles.moduleCard}
                data-px-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={styles.moduleIcon}>{m.icon}</div>
                <div className={styles.moduleLabel}>{m.label}</div>
                <div className={styles.moduleDesc}>{m.desc}</div>
                <div className={styles.moduleArrow}>→</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard} data-px-reveal>
            <div className={styles.ctaNoise} />
            <div className={styles.ctaInner}>
              <div className={styles.ctaEyebrow}>Ready when you are</div>
              <h2 className={styles.ctaTitle}>
                Stop fighting your tools.<br />
                <span className={styles.ctaTitleAccent}>Build your pipeline.</span>
              </h2>
              <p className={styles.ctaDesc}>
                Open source. Cross-platform. Built for creators who think in workflows.
              </p>
              <div className={styles.ctaButtons}>
                <MagneticButton className={styles.ctaPrimaryLight} to="/docs/getting-started/installation">
                  Install Now →
                </MagneticButton>
                <MagneticButton className={styles.ctaGhostLight} to="/docs/intro">
                  Read Docs
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>Pixore</span>
              <span className={styles.footerTagline}>Visual Image Workstation</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="https://github.com/pokipoi/pixore" target="_blank" rel="noopener">GitHub</a>
              <span className={styles.footerDot} />
              <a href="https://github.com/pokipoi/pixore_node" target="_blank" rel="noopener">Marketplace</a>
              <span className={styles.footerDot} />
              <a href="https://github.com/pokipoi/pixore/issues" target="_blank" rel="noopener">Issues</a>
            </div>
          </div>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} Pixore · GPL v3 License</p>
        </footer>

      </main>
    </Layout>
  );
}

/* ═══════════════════════════════════════════
   Inline SVG diagrams for showcase rows
   ═══════════════════════════════════════════ */
function NodeDiagram() {
  return (
    <svg viewBox="0 0 400 280" className={styles.diagram}>
      <defs>
        <linearGradient id="ndg" x1="0" x2="1">
          <stop offset="0" stopColor="#9bd301" stopOpacity="0.9" />
          <stop offset="1" stopColor="#9bd301" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* connections */}
      <g stroke="url(#ndg)" strokeWidth="1.5" fill="none">
        <path d="M70 80 C 140 80, 160 140, 230 140" />
        <path d="M70 200 C 140 200, 160 140, 230 140" />
        <path d="M230 140 C 290 140, 300 90, 350 90" />
        <path d="M230 140 C 290 140, 300 190, 350 190" />
      </g>
      {/* flowing dots */}
      <circle r="4" fill="#9bd301">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M70 80 C 140 80, 160 140, 230 140" />
      </circle>
      <circle r="4" fill="#b8f030">
        <animateMotion dur="2.8s" repeatCount="indefinite" path="M70 200 C 140 200, 160 140, 230 140" />
      </circle>
      <circle r="4" fill="#9bd301">
        <animateMotion dur="2.2s" begin="0.6s" repeatCount="indefinite" path="M230 140 C 290 140, 300 90, 350 90" />
      </circle>
      {/* nodes */}
      {[
        { x: 70, y: 80, l: 'IN' },
        { x: 70, y: 200, l: 'IN' },
        { x: 230, y: 140, l: 'OP' },
        { x: 350, y: 90, l: 'OUT' },
        { x: 350, y: 190, l: 'OUT' },
      ].map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`}>
          <rect x="-28" y="-18" width="56" height="36" rx="8" fill="#1c1914" stroke="#9bd301" strokeWidth="1.2" />
          <text textAnchor="middle" dy="5" fontFamily="JetBrains Mono" fontSize="11" fill="#9bd301">{n.l}</text>
        </g>
      ))}
    </svg>
  );
}

function BatchDiagram() {
  return (
    <svg viewBox="0 0 400 280" className={styles.diagram}>
      <g>
        {Array.from({ length: 24 }).map((_, i) => {
          const x = 30 + (i % 6) * 28;
          const y = 30 + Math.floor(i / 6) * 28;
          const delay = (i * 0.06).toFixed(2);
          return (
            <rect key={i} x={x} y={y} width="22" height="22" rx="3" fill="#706457" opacity="0.35">
              <animate attributeName="fill" values="#706457;#9bd301;#706457" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;1;0.35" dur="3s" begin={`${delay}s`} repeatCount="indefinite" />
            </rect>
          );
        })}
      </g>
      <g transform="translate(220 140)">
        <rect x="-10" y="-90" width="170" height="180" rx="10" fill="#1c1914" stroke="#9bd301" strokeWidth="1.4" />
        <text x="75" y="-60" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="#9bd301">PIPELINE</text>
        {['resize → 50%', 'compress 80q', 'rename {n}_v2', 'export webp'].map((t, i) => (
          <g key={i} transform={`translate(0 ${-30 + i * 30})`}>
            <rect x="0" y="0" width="150" height="22" rx="5" fill="#9bd30115" stroke="#9bd30140" />
            <text x="10" y="15" fontFamily="JetBrains Mono" fontSize="10" fill="#e8e4d8">{t}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function ModulesDiagram() {
  const ms = ['⬡', '↔', '⊞', '↯', '◈', '✂', '✎', '⚙'];
  return (
    <svg viewBox="0 0 400 280" className={styles.diagram}>
      <g transform="translate(200 140)">
        {ms.map((g, i) => {
          const angle = (i / ms.length) * Math.PI * 2 - Math.PI / 2;
          const r = 95;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="22" fill="#1c1914" stroke="#9bd301" strokeWidth="1.2" />
              <text textAnchor="middle" dy="6" fontSize="18" fill="#9bd301">{g}</text>
              <line x1="0" y1="0" x2={-x * 0.6} y2={-y * 0.6} stroke="#9bd30130" strokeWidth="1" />
            </g>
          );
        })}
        <circle r="34" fill="#1c1914" stroke="#9bd301" strokeWidth="1.6" />
        <text textAnchor="middle" dy="6" fontFamily="JetBrains Mono" fontSize="12" fontWeight="700" fill="#9bd301">CORE</text>
      </g>
    </svg>
  );
}
