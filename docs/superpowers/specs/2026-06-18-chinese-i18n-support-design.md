# Chinese i18n Support Design

## Goal

Add complete Simplified Chinese support for the current Docusaurus site by finishing the existing `zh-Hans` localization layer and correcting obvious untranslated content.

## Current Context

The project is a Docusaurus 3.10 site. `docusaurus.config.ts` already enables i18n with:

- default locale: `en`
- additional locale: `zh-Hans`
- locale label: `简体中文`

The repository already contains translated docs and theme JSON under `i18n/zh-Hans/`, including docs content, sidebar labels, navbar labels, and footer labels. The main missing area is React page/component text, especially the homepage, which currently contains hardcoded English strings.

## Scope

This work will:

1. Keep English as the default locale.
2. Keep `zh-Hans` as the Simplified Chinese locale.
3. Localize hardcoded React UI text with Docusaurus native translation APIs.
4. Generate or update `i18n/zh-Hans/code.json` if needed.
5. Review `i18n/zh-Hans` content for obvious English leftovers or severely awkward machine-style Chinese.
6. Fix only clear translation gaps and low-risk wording issues.
7. Build and typecheck the project after changes.

This work will not:

- Change the default locale to Chinese.
- Rewrite every documentation page for style.
- Change site routing, base URL, or deployment behavior.
- Add a third-party i18n library.

## Recommended Approach

Use Docusaurus native i18n.

React strings will be wrapped with `translate()` or `<Translate>` from `@docusaurus/Translate`. Structured data such as homepage card titles and descriptions will use stable translation IDs so generated translation files remain predictable.

Existing documentation translations will stay in `i18n/zh-Hans/docusaurus-plugin-content-docs/current/`. The implementation will search these files for obvious remaining English UI prose and correct only clear misses.

## Architecture

### Docusaurus Configuration

The existing i18n block in `docusaurus.config.ts` remains the source of truth. No locale migration is needed.

### React UI Translation

Homepage text in `src/pages/index.tsx` will be converted from hardcoded English to Docusaurus translation calls. This includes:

- layout description
- hero kicker
- hero heading and accent
- hero lead paragraph
- call-to-action button labels
- section heading and body
- module card titles and descriptions
- final CTA heading and button labels

If `HomepageFeatures` is unused, it will not be changed unless build or search results show it contributes to visible pages.

### Translation Files

The Docusaurus translation extraction flow will be used where possible:

```bash
npm run write-translations -- --locale zh-Hans
```

The generated or updated `i18n/zh-Hans/code.json` will then receive Simplified Chinese messages.

### Content Review

A targeted search will identify remaining English in Chinese locale files. The review will prioritize visible prose and navigation text. Code samples, command names, product names, API names, and URLs may intentionally remain English.

## Data Flow

1. User selects `简体中文` from the locale dropdown.
2. Docusaurus serves routes under `/zh-Hans/`.
3. Docs/blog/theme labels load from `i18n/zh-Hans`.
4. React UI strings resolve from `i18n/zh-Hans/code.json`.
5. Any untranslated string falls back according to Docusaurus behavior and will be caught during review.

## Error Handling

- If translation extraction fails, inspect the error and fix invalid translation usage before editing generated files.
- If generated JSON contains duplicate or unstable IDs, replace them with explicit stable IDs.
- If build fails due to translated MDX syntax, fix only the affected translated file.
- If a sentence is ambiguous, preserve technical accuracy over fluent rewriting.

## Testing

Run:

```bash
npm run typecheck
npm run build
```

Success criteria:

- The build completes without i18n errors.
- The Chinese locale is available through the locale dropdown.
- Homepage visible text appears in Simplified Chinese on the Chinese locale.
- Existing documentation routes remain available.
- No obvious untranslated English prose remains in Chinese locale files, excluding intentional technical terms.

## Approved Direction

The approved implementation direction is: structure completion plus targeted English-residue review. This keeps the work focused, low risk, and compatible with Docusaurus conventions.
