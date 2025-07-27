# G6 Extension Vue

**English** | [中文](./README-zh.md)

[![NPM Package][npm]][npm-url] [![Build Size][build-size]][build-size-url] [![NPM Downloads][npm-downloads]][npmtrends-url]

This extension allows you to define G6 nodes using Vue components.
It's inspired by [`@antv/g6-extension-react`](https://www.npmjs.com/package/@antv/g6-extension-react).

## Features

- 🎯 **Vue Node Support**: Use Vue components as G6 nodes
- 🔧 **Vue 2/3 Compatible**: Support both Vue 2 and Vue 3
- 📦 **TypeScript Support**: Full type definitions

## Usage

### 1. Install

```bash
npm install g6-extension-vue
# or
yarn add g6-extension-vue
# or
pnpm add g6-extension-vue
```

### 2. Import and Register

```js
import { onMounted, defineComponent } from 'vue';
import { VueNode } from 'g6-extension-vue';
import { ExtensionCategory, register } from '@antv/g6';

register(ExtensionCategory.NODE, 'vue', VueNode); // or in onMounted
```

### 3. Define Node

Vue Composition API:

```ts
import { defineComponent, h } from 'vue';
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => {
      return h(
        'div',
        {
          class: 'vue-node',
        },
        props.data.label,
      );
    };
  },
});
```

Vue Functional component:

```tsx
export default function VueNode(props) {
  return <div class="vue-node">
    {props.data.label}
  </div>
```

### 4. Use Node

```ts
const graph = new Graph({
  // ... other options
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={data} />, // data will be passed to VueNode, and refresh when data changes
    },
  },
});
```

## Q&A

### 1. Why the watch props is not working?

VueNode will refresh when g6 node property changes.(hover、click、drag、etc.)
And the props pass to VueNode will not be reactive.you can just use props in the template directly.It will display the latest value of props.

## Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## Compatibility

- Vue 2.6+
- Vue 3.0+
- G6 5.0+

## License

MIT License @Child-qjj

## Contributing

Welcome to submit Issues and Pull Requests!

[npm]: https://img.shields.io/npm/v/g6-extension-vue.svg
[npm-url]: https://www.npmjs.com/package/g6-extension-vue
[build-size]: https://img.shields.io/bundlephobia/minzip/g6-extension-vue
[build-size-url]: https://bundlephobia.com/package/g6-extension-vue
[npm-downloads]: https://img.shields.io/npm/dm/g6-extension-vue.svg
[npmtrends-url]: https://npmtrends.com/g6-extension-vue
