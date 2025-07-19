# g6-extension-vue

[![NPM version](https://img.shields.io/npm/v/g6-extension-vue.svg?style=flat)](https://npmjs.org/package/g6-extension-vue)
[![NPM downloads](http://img.shields.io/npm/dm/g6-extension-vue.svg?style=flat)](https://npmjs.org/package/g6-extension-vue)

This extension allows you to define G6 node by Vue component and JSX syntax.

## Usage

First, introduce css file:

```ts
import 'g6-extension-vue/dist/style.css';
```

Then, introduce components:

```html
<script setup lang="ts">
  import { Foo, Bar } from 'g6-extension-vue';
</script>
```

## Options

TODO

## Development

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm start

# build library source code
$ pnpm run build

# build library source code in watch mode
$ pnpm run build:watch

# build docs
$ pnpm run docs:build

# Locally preview the production build.
$ pnpm run docs:preview

# check your project for potential problems
$ pnpm run doctor

# Test
$ pnpm test

# Coverage
$ pnpm test:cov

# Lint
$ pnpm lint
```

## LICENSE

MIT
