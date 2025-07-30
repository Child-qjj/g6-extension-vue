import { defineConfig } from 'dumi';
import path from 'node:path';

export default defineConfig({
  apiParser: {},
  resolve: {
    entryFile: './api/index.ts',
  },
  outputPath: 'docs-dist',
  themeConfig: {
    logo: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
    name: 'G6 Extension Vue',
    footer: 'Open-source MIT Licensed | Copyright © 2025-present',
    socialLinks: {
      github: 'https://github.com/Child-qjj/g6-extension-vue', // GitHub 地址
    },
    nav: {
      'zh-CN': [
        {
          link: '/examples/euro-cup',
          title: 'vue',
        },
      ],
    },
  },
  styles: [
    '.dumi-default-header-content .dumi-default-header-left { width: 283px; }',
  ],
  vue: {
    tsconfigPath: path.resolve(__dirname, './tsconfig.vue.json'),
    checkerOptions: {
      externalSymbolLinkMappings: {
        typescript: {
          Promise:
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        },
        '@vue/runtime-core': {
          VNodeChild:
            'https://github.com/vuejs/core/blob/main/packages/runtime-core/src/vnode.ts#L136',
        },
      },
    },
  },
  alias: {
    'g6-extension-vue': path.resolve(__dirname, './src/index.ts'),
  },
  presets: [require.resolve('@dumijs/preset-vue')],
});
