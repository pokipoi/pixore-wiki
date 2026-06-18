# Chinese i18n Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Simplified Chinese support for the Docusaurus site by localizing React homepage text, updating `zh-Hans` translation JSON, and fixing obvious untranslated Chinese-locale content.

**Architecture:** Use Docusaurus native i18n only. React homepage strings resolve through `@docusaurus/Translate`; extracted messages live in `i18n/zh-Hans/code.json`; docs/theme translations remain in existing `i18n/zh-Hans` folders.

**Tech Stack:** Docusaurus 3.10, React 19, TypeScript, MDX, Docusaurus i18n JSON files.

---

## File Structure

- Modify: `src/pages/index.tsx`
  - Responsibility: visible homepage UI and homepage translation message IDs.
- Create/Modify: `i18n/zh-Hans/code.json`
  - Responsibility: Simplified Chinese translations for React code strings extracted from `src`.
- Modify as needed: `i18n/zh-Hans/docusaurus-plugin-content-docs/current/**/*.mdx`
  - Responsibility: translated documentation content. Only fix clear English residue or broken Chinese-locale prose.
- Modify as needed: `i18n/zh-Hans/docusaurus-theme-classic/*.json`
  - Responsibility: translated navbar/footer labels. Only fix clear English residue.

## Task 1: Localize Homepage React Strings

**Files:**
- Modify: `src/pages/index.tsx`

- [ ] **Step 1: Replace imports**

Change the import block at the top of `src/pages/index.tsx` to include Docusaurus translation helpers:

```tsx
import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import styles from './index.module.css';
```

- [ ] **Step 2: Replace module data with translation IDs**

Replace the existing `modules` array with this implementation:

```tsx
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
```

- [ ] **Step 3: Localize Layout metadata**

Replace the `Layout` opening tag with:

```tsx
<Layout
  title="Pixore"
  description={translate({
    id: 'homepage.layout.description',
    message: 'Pixore is an all-in-one image workstation with a visual workflow engine.',
  })}>
```

- [ ] **Step 4: Wrap visible hero strings**

Replace the hero kicker, title, lead, and action labels with:

```tsx
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
```

- [ ] **Step 5: Wrap module section strings**

Replace the module section header with:

```tsx
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
```

- [ ] **Step 6: Wrap final CTA strings**

Replace the CTA heading and buttons with:

```tsx
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
```

- [ ] **Step 7: Typecheck homepage changes**

Run:

```bash
npm run typecheck
```

Expected: TypeScript completes without errors.

- [ ] **Step 8: Commit homepage localization**

Run:

```bash
git add src/pages/index.tsx
git commit -m "feat: localize homepage strings"
```

## Task 2: Generate and Fill Chinese Code Translations

**Files:**
- Create/Modify: `i18n/zh-Hans/code.json`

- [ ] **Step 1: Extract Docusaurus code translations**

Run:

```bash
npm run write-translations -- --locale zh-Hans
```

Expected: Docusaurus writes translation files under `i18n/zh-Hans/`, including `code.json` if code messages are detected.

- [ ] **Step 2: Set `i18n/zh-Hans/code.json` content**

Ensure `i18n/zh-Hans/code.json` contains these translations. Preserve any additional generated keys by translating them if they are visible UI text; keep intentional product names unchanged.

```json
{
  "homepage.layout.description": {
    "message": "Pixore 是一款集成可视化工作流引擎的一站式图像工作站。",
    "description": "The homepage layout meta description"
  },
  "homepage.modules.workflows.title": {
    "message": "工作流",
    "description": "Homepage module card title"
  },
  "homepage.modules.workflows.description": {
    "message": "基于节点图的流水线，支持触发器、市场节点和可复用的执行上下文。",
    "description": "Homepage module card description"
  },
  "homepage.modules.resizeCompress.title": {
    "message": "调整尺寸与压缩",
    "description": "Homepage module card title"
  },
  "homepage.modules.resizeCompress.description": {
    "message": "以预设驱动批量缩放，并编排 MozJPEG、pngquant 与 ImageMagick。",
    "description": "Homepage module card description"
  },
  "homepage.modules.aiRenamer.title": {
    "message": "AI 重命名",
    "description": "Homepage module card title"
  },
  "homepage.modules.aiRenamer.description": {
    "message": "基于多模态图像理解生成名称，支持可重复、确定性的命名策略。",
    "description": "Homepage module card description"
  },
  "homepage.modules.scissorsBitdepth.title": {
    "message": "裁切与位深",
    "description": "Homepage module card title"
  },
  "homepage.modules.scissorsBitdepth.description": {
    "message": "支持画布裁切、批量自动裁切、通道级控制、调色板与抖动预设。",
    "description": "Homepage module card description"
  },
  "homepage.hero.kicker": {
    "message": "可视化图像工作站",
    "description": "Homepage hero kicker"
  },
  "homepage.hero.title.line1": {
    "message": "图像流水线，",
    "description": "Homepage hero title first line"
  },
  "homepage.hero.title.accent": {
    "message": "一次构建。",
    "description": "Homepage hero title accent"
  },
  "homepage.hero.lead": {
    "message": "Pixore 将专注的图像工具、AI 辅助操作与基于节点的工作流引擎整合到一个平静高效的桌面工作站中。",
    "description": "Homepage hero lead paragraph"
  },
  "homepage.hero.primaryCta": {
    "message": "开始构建",
    "description": "Homepage hero primary call to action"
  },
  "homepage.hero.secondaryCta": {
    "message": "查看架构",
    "description": "Homepage hero secondary call to action"
  },
  "homepage.modules.heading": {
    "message": "统一的工作流语言。专注的功能模块。",
    "description": "Homepage modules section heading"
  },
  "homepage.modules.lead": {
    "message": "用可组合的模型替代分散的单用途工具，从一次性清理扩展到自动化素材流水线。",
    "description": "Homepage modules section lead"
  },
  "homepage.cta.heading.primary": {
    "message": "一次设计流水线。",
    "description": "Homepage final CTA heading primary text"
  },
  "homepage.cta.heading.muted": {
    "message": "随处运行。",
    "description": "Homepage final CTA heading muted text"
  },
  "homepage.cta.primaryButton": {
    "message": "构建第一个工作流",
    "description": "Homepage final CTA primary button"
  },
  "homepage.cta.secondaryButton": {
    "message": "创建节点",
    "description": "Homepage final CTA secondary button"
  }
}
```

- [ ] **Step 3: Build Chinese translation files**

Run:

```bash
npm run build
```

Expected: Docusaurus builds all locales successfully.

- [ ] **Step 4: Commit code translations**

Run:

```bash
git add i18n/zh-Hans/code.json
git commit -m "feat: add Chinese code translations"
```

## Task 3: Targeted Chinese Locale Residue Review

**Files:**
- Modify as needed: `i18n/zh-Hans/docusaurus-plugin-content-docs/current/**/*.mdx`
- Modify as needed: `i18n/zh-Hans/docusaurus-theme-classic/*.json`

- [ ] **Step 1: Search for likely untranslated English prose**

Run:

```bash
python - <<'PY'
from pathlib import Path
import re
root = Path('i18n/zh-Hans')
for path in sorted(root.rglob('*')):
    if path.suffix.lower() not in {'.md', '.mdx', '.json'}:
        continue
    for i, line in enumerate(path.read_text(encoding='utf-8').splitlines(), 1):
        text = line.strip()
        if not text or text.startswith(('import ', 'export ', '```', '<', '{', '}', '|')):
            continue
        letters = len(re.findall(r'[A-Za-z]', text))
        cjk = len(re.findall(r'[\u4e00-\u9fff]', text))
        if letters >= 24 and cjk == 0 and not any(token in text for token in ['http', 'npm ', 'git ', 'Pixore', 'API', 'CLI', 'GPU', 'JSON', 'Python', 'ImageMagick']):
            print(f'{path}:{i}: {text}')
PY
```

Expected: Output lists candidate untranslated prose lines. Code blocks, commands, product names, and API names may appear and can be ignored.

- [ ] **Step 2: Fix only clear untranslated visible prose**

For each candidate line that is normal documentation prose, translate it to Simplified Chinese in place. Do not translate commands, URLs, API identifiers, file paths, frontmatter keys, product names, or code block contents.

Example safe edit pattern:

```mdx
Before:
This page explains how Pixore workflows are structured.

After:
本页说明 Pixore 工作流的结构方式。
```

- [ ] **Step 3: Validate JSON syntax**

Run:

```bash
node -e "for (const f of ['i18n/zh-Hans/code.json','i18n/zh-Hans/docusaurus-theme-classic/navbar.json','i18n/zh-Hans/docusaurus-theme-classic/footer.json','i18n/zh-Hans/docusaurus-plugin-content-docs/current.json']) JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('ok')"
```

Expected: prints `ok`.

- [ ] **Step 4: Commit residue fixes if any**

If files changed, run:

```bash
git add i18n/zh-Hans
git commit -m "fix: polish Chinese locale translations"
```

If no files changed, skip this commit.

## Task 4: Final Verification

**Files:**
- No planned file changes.

- [ ] **Step 1: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: completes without TypeScript errors.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: Docusaurus builds English and `zh-Hans` locales successfully.

- [ ] **Step 3: Verify generated Chinese homepage route exists**

Run:

```bash
node -e "const fs=require('fs'); const p='build/zh-Hans/index.html'; if(!fs.existsSync(p)) throw new Error(p+' missing'); const html=fs.readFileSync(p,'utf8'); for (const s of ['可视化图像工作站','开始构建','统一的工作流语言','构建第一个工作流']) { if(!html.includes(s)) throw new Error('missing '+s); } console.log('Chinese homepage verified')"
```

Expected: prints `Chinese homepage verified`.

- [ ] **Step 4: Final commit if verification caused generated tracked changes**

Run:

```bash
git status --short
```

Expected: only intentional source/i18n changes are tracked. If any intentional file remains uncommitted, run:

```bash
git add src/pages/index.tsx i18n/zh-Hans docs/superpowers/specs/2026-06-18-chinese-i18n-support-design.md docs/superpowers/plans/2026-06-18-chinese-i18n-support.md
git commit -m "feat: complete Chinese i18n support"
```

## Self-Review

- Spec coverage: homepage React strings, code translations, targeted residue review, typecheck, and build verification are covered.
- Placeholder scan: no TBD/TODO/later placeholders are present.
- Type consistency: translation IDs in `src/pages/index.tsx` match `i18n/zh-Hans/code.json` keys.
