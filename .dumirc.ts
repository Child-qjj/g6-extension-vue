import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  // apiParser: {},
  // resolve: {
  //   entryFile: './src/index.ts',
  // },
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
        // {
        //   link: '/vue2/vue-node',
        //   title: 'vue2',
        // },
      ],
    },
  },
  styles: [
    '.dumi-default-header-content .dumi-default-header-left { width: 283px; }',
  ],
  vue: {
    tsconfigPath: path.resolve(__dirname, './tsconfig.vue.json'),
  },
  alias: {
    'g6-extension-vue': path.resolve(__dirname, './src/index.ts'),
  },
  presets: ['@dumijs/preset-vue'],
});
