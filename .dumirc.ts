import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  // apiParser: {},
  // resolve: {
  //   entryFile: './src/index.ts',
  // },
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Vue G6 Extension',
    footer: 'Open-source MIT Licensed | Copyright © 2025-present',
    socialLinks: {
      github: 'https://github.com/Child-qjj/g6-extension-vue', // GitHub 地址
    },
    nav: {
      'zh-CN': [
        {
          link: '/examples/vue-node',
          title: 'vue3',
        },
        {
          link: '/vue2/vue-node',
          title: 'vue2',
        },
      ],
    },
  },
  vue: {
    tsconfigPath: path.resolve(__dirname, './tsconfig.vue.json'),
  },
  alias: {
    'g6-extension-vue': path.resolve(__dirname, './src/index.ts'),
  },
  presets: ['@dumijs/preset-vue'],
});
