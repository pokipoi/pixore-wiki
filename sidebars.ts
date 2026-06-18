import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: {type: 'generated-index'},
      items: [
        'getting-started/installation',
        'getting-started/first-workflow',
      ],
    },
    'architecture',
    {
      type: 'category',
      label: 'Modules',
      link: {type: 'generated-index'},
      items: [
        'modules/home-settings',
        'modules/resize',
        'modules/drag',
        'modules/compression',
        'modules/bitdepth',
        'modules/scissors',
        'modules/renamer',
        'modules/workflows',
      ],
    },
    {
      type: 'category',
      label: 'Node Development',
      link: {type: 'generated-index'},
      items: [
        'node-development/overview',
        'node-development/manifest-spec',
        'node-development/api-reference',
        'node-development/marketplace',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/triggers',
        'advanced/gpu',
        'advanced/cli',
      ],
    },
    'contributing',
    'faq',
  ],
};

export default sidebars;
