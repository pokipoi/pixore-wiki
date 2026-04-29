import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

/* ═══════════════════════════════════════════════════════════
   Wodniack-style dramatic scroll animations
   Types: fade-up | scale-burst | slide-left | slide-right | clip-reveal
   ═══════════════════════════════════════════════════════════ */
type AnimType = 'fade-up' | 'scale-burst' | 'slide-left' | 'slide-right' | 'clip-reveal';

function useDramaticScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const type = (el.dataset.pxAnim || 'fade-up') as AnimType;
          const delay = parseFloat(el.dataset.pxDelay || '0');
          const duration = parseFloat(el.dataset.pxDur || '0.8');

          el.style.transition = buildTransition(type, duration, delay);
          el.style.opacity = '1';

          switch (type) {
            case 'fade-up':
              el.style.transform = 'translateY(0) scale(1)';
              break;
            case 'scale-burst':
              el.style.transform = 'scale(1)';
              break;
            case 'slide-left':
              el.style.transform = 'translateX(0)';
              break;
            case 'slide-right':
              el.style.transform = 'translateX(0)';
              break;
            case 'clip-reveal':
              el.style.clipPath = 'inset(0% 0% 0% 0%)';
              break;
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -24px 0px' }
    );

    document.querySelectorAll('[data-px-anim]').forEach((el) => {
      const type = (el as HTMLElement).dataset.pxAnim as AnimType;
      (el as HTMLElement).style.opacity = '0';
      switch (type) {
        case 'fade-up':
          (el as HTMLElement).style.transform = 'translateY(36px) scale(0.97)';
          break;
        case 'scale-burst':
          (el as HTMLElement).style.transform = 'scale(0.7)';
          break;
        case 'slide-left':
          (el as HTMLElement).style.transform = 'translateX(-40px)';
          break;
        case 'slide-right':
          (el as HTMLElement).style.transform = 'translateX(40px)';
          break;
        case 'clip-reveal':
          (el as HTMLElement).style.clipPath = 'inset(100% 0% 0% 0%)';
          break;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

function buildTransition(type: AnimType, dur: number, delay: number) {
  // Smoother easing — no overshoot, natural deceleration
  const ease = type === 'scale-burst'
    ? `transform ${dur}s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s, opacity ${dur * 0.5}s ease ${delay}s`
    : type === 'clip-reveal'
    ? `clip-path ${dur}s cubic-bezier(0.7, 0, 0.3, 1) ${delay}s, opacity ${dur * 0.3}s ease ${delay}s`
    : `opacity ${dur}s ease ${delay}s, transform ${dur}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`;
  return ease;
}

/* ═══════════════════════════════════════════
   Animated canvas background
   ═══════════════════════════════════════════ */
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let rid: number, t = 0;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    (function loop() {
      t += 0.003;
      ctx.clearRect(0, 0, c.width, c.height);
      const orbs = [
        { x: c.width * 0.25, y: c.height * 0.3, r: c.width * 0.35, c: 'rgba(155,211,1,0.04)' },
        { x: c.width * 0.75, y: c.height * 0.55, r: c.width * 0.4, c: 'rgba(112,100,87,0.05)' },
        { x: c.width * 0.5, y: c.height * 0.8, r: c.width * 0.3, c: 'rgba(231,229,208,0.06)' },
      ];
      orbs.forEach((o, i) => {
        const ox = o.x + Math.sin(t * 0.7 + i * 2.1) * 50;
        const oy = o.y + Math.cos(t * 0.55 + i * 1.7) * 40;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, o.c);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, c.width, c.height);
      });
      rid = requestAnimationFrame(loop);
    })();
    return () => { cancelAnimationFrame(rid); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className={styles.heroCanvas} />;
}

/* ═══════════════════════════════════════════
   Cursor glow
   ═══════════════════════════════════════════ */
function useCursorGlow() {
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'px-cursor';
    document.body.appendChild(el);
    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX - 150}px,${e.clientY - 150}px,0)`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); el.remove(); };
  }, []);
}

/* ═══════════════════════════════════════════
   Parallax on scroll
   ═══════════════════════════════════════════ */
function useHeroParallax() {
  useEffect(() => {
    const visual = document.querySelector('[data-hero-visual]') as HTMLElement;
    const crystal = document.querySelector('[data-hero-crystal]') as HTMLElement;
    if (!visual || !crystal) return;

    const onScroll = () => {
      const y = window.scrollY;
      visual.style.transform = `translateY(${y * 0.25}px)`;
      crystal.style.transform = `translateY(${y * -0.12}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

/* ═══════════════════════════════════════════
   Tilt card
   ═══════════════════════════════════════════ */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.015,1.015,1.015)`;
    el.style.transition = 'transform 0.15s ease-out';
  }, []);
  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    ref.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  }, []);
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Typewriter
   ═══════════════════════════════════════════ */
function Typewriter({ texts, speed = 80, pause = 2500 }: { texts: string[]; speed?: number; pause?: number }) {
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

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const modules = [
  { icon: '⬡', label: 'Home / Settings', color: '#706457' },
  { icon: '↔', label: 'Resize', color: '#9BD301' },
  { icon: '⊞', label: 'Drag & Drop', color: '#706457' },
  { icon: '↯', label: 'Compression', color: '#9BD301' },
  { icon: '◈', label: 'Bitdepth', color: '#5C5245' },
  { icon: '✂', label: 'Scissors', color: '#9A9182' },
  { icon: '✎', label: 'Renamer', color: '#706457' },
  { icon: '⚙', label: 'Workflows', color: '#9BD301' },
];

/* ═══════════════════════════════════════════
   HOME
   ═══════════════════════════════════════════ */
export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const heroImg = useBaseUrl('/img/hero-crystal.svg');
  const fwImg = useBaseUrl('/img/feature-workflow.svg');
  const fbImg = useBaseUrl('/img/feature-batch.svg');
  const fmImg = useBaseUrl('/img/feature-modules.svg');

  const features = [
    {
      img: fwImg, alt: 'Visual Workflow Editor',
      title: 'Visual Workflow Editor',
      desc: 'Drag, drop, and connect nodes to build image processing pipelines with zero code.',
      delay: '0', dir: 'slide-left' as AnimType,
    },
    {
      img: fbImg, alt: 'Batch Processing',
      title: 'Batch Process Thousands',
      desc: 'Process entire folders in one click. Resize, compress, rename — all in parallel with GPU acceleration.',
      delay: '0.15', dir: 'scale-burst' as AnimType,
    },
    {
      img: fmImg, alt: '8 Modules',
      title: '8 Specialized Modules',
      desc: 'Resize · Drag · Compress · Bitdepth · Scissors · Renamer · Workflows · Settings. One workstation, infinite combos.',
      delay: '0.3', dir: 'slide-right' as AnimType,
    },
  ];

  useCursorGlow();
  useDramaticScrollReveal();
  useHeroParallax();

  return (
    <Layout title="Pixore" description="An All-in-One Image Workstation with Visual Workflow Engine">
      <main className={styles.main}>

        {/* ═══ HERO ═══ */}
        <section className={styles.hero}>
          <HeroCanvas />
          <div className={styles.heroGrid} />

          <div className={styles.heroContent}>
            <div className={styles.heroBadge} data-px-anim="scale-burst" data-px-delay="0.1" data-px-dur="0.6">
              <span className={styles.heroDot} />
              v3.0 Beta · Open Source
            </div>

            <h1 className={styles.heroTitle} data-px-anim="fade-up" data-px-delay="0.15" data-px-dur="0.8">
              <span className={styles.heroTitleAccent}>Pixore</span>
              <br />
              <span className={styles.heroTitleSub}>
                <Typewriter
                  texts={['Visual Image Workstation', 'Batch Processing Engine', 'Node-Based Pipeline', '8 Powerful Modules']}
                  speed={100}
                  pause={2500}
                />
              </span>
            </h1>

            <p className={styles.heroDesc} data-px-anim="fade-up" data-px-delay="0.4">
              Build image processing pipelines visually. Drag nodes, connect workflows,
              and process thousands of images — all in an elegant, minimal interface.
            </p>

            <div className={styles.heroCta} data-px-anim="fade-up" data-px-delay="0.6">
              <Link className={styles.ctaPrimary} to="/docs/intro">
                <span>Get Started</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link className={styles.ctaGhost} to="https://github.com/pokipoi/pixore">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Link>
            </div>

            <div className={styles.heroStats} data-px-anim="fade-up" data-px-delay="0.8">
              {[{ n: '8', l: 'Modules' }, { n: '50+', l: 'Node Types' }, { n: '3', l: 'Platforms' }].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className={styles.statDiv} />}
                  <div className={styles.stat}>
                    <span className={styles.statNum}>{s.n}</span>
                    <span className={styles.statLabel}>{s.l}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual} data-hero-visual>
            <div className={styles.heroGlow} data-hero-crystal />
            <div className={styles.heroGlow2} data-hero-crystal />
            <img src={heroImg} alt="Pixore Crystal" className={styles.heroCrystal} data-hero-crystal loading="eager" />
            <div className={styles.heroRings}>
              <div className={styles.ring1} />
              <div className={styles.ring2} />
            </div>
          </div>
        </section>

        {/* ═══ FEATURES — 3-card dramatic stagger ═══ */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            {features.map((f, i) => (
              <TiltCard key={i} className={styles.featureCard}>
                <div data-px-anim={f.dir} data-px-delay={f.delay} data-px-dur="1">
                  <div className={styles.featureImgWrap}>
                    <img src={f.img} alt={f.alt} className={styles.featureImg} loading="lazy" />
                    <div className={styles.featureImgShine} />
                  </div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ═══ MODULES — grid burst ═══ */}
        <section className={styles.modulesSection}>
          <h2 className={styles.sectionTitle} data-px-anim="scale-burst" data-px-dur="0.8">
            Eight Modules<span className={styles.sectionTitleEm}>One Workstation</span>
          </h2>
          <div className={styles.modulesGrid}>
            {modules.map((m, i) => (
              <div
                key={i}
                className={styles.moduleItem}
                data-px-anim="scale-burst"
                data-px-delay={`${i * 0.06}`}
                data-px-dur="0.6"
              >
                <span
                  className={styles.moduleIcon}
                  style={{
                    color: m.color,
                    background: m.color === '#9A9182' ? 'rgba(112,100,87,0.12)' : `${m.color}18`,
                  }}
                >
                  {m.icon}
                </span>
                <span className={styles.moduleLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA — clip reveal ═══ */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard} data-px-anim="scale-burst" data-px-dur="1">
            <div className={styles.ctaNoise} />
            <h2 className={styles.ctaTitle}>Ready to transform your image workflow?</h2>
            <p className={styles.ctaDesc}>Open source. Cross-platform. Built for creators.</p>
            <Link className={styles.ctaPrimaryLight} to="/docs/getting-started/installation">
              Install Now →
            </Link>
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
