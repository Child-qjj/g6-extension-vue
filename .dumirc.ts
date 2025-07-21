import { defineConfig } from 'dumi';
import { repository } from './package.json';
import path from 'path';

export default defineConfig({
  apiParser: {},
  resolve: {
    entryFile: 'src/index.ts',
  },
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Vue G6 Extension',
    footer: 'Open-source MIT Licensed | Copyright © 2025-present',
    socialLinks: {
      github: repository, // GitHub 地址
    },
    nav: {
      'zh-CN': [
        {
          link: '/examples',
          title: '图表示例'
        },
      ]
    }
  },
  alias: {
    'g6-extension-vue': path.resolve(__dirname, 'src/index.ts'),
  },
  presets: ['@dumijs/preset-vue'],
});
