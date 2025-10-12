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
      component: (data) => <VueNode data={Object.assign({}, data)} />, // new object to trigger effect
    },
  },
});
```

## Q&A

### 1. Why the watch props is not working? (vue3)

VueNode will refresh when g6 node property changes.(hover、click、drag、etc.)
And make sure that the node data is reactive.

#### ✅ Correct Examples:

```ts
// Method 1: Create new object with spread operator
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={{ ...data }} />, // Creates new object
    },
  },
});

// Method 2: Use Object.assign to create new object
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={Object.assign({}, data)} />, // Creates new object
    },
  },
});
```

#### ❌ Incorrect Examples:

```ts
// DON'T: Direct reference - won't trigger reactivity
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={data} />, // Direct reference
    },
  },
});

// DON'T: Nested property direct reference
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={data.data} />, // Direct nested reference
    },
  },
});
```

**Important Note:** Non-reactive objects need new object references to trigger side effects. When you pass the same object reference, Vue won't know the data has changed and won't re-render the component.

### 2. Custom node edge misalignment

> Tip: The starting point of custom node edges defaults to the top-left (not center). Please set `dx: -width/2` and `dy: -height/2` in your custom node to ensure the edge start is correct.

### 3. How to correctly display custom nodes in minimap

```js
// For G6 > 5.0.49, the minimap custom shape function supports the third parameter (target)
{
  type: 'minimap',
  shape: (id, elType, target) => {
    if (elType === 'node' && target.constructor.name === 'VueNode') {
      return target;
    }
    const shape = target.getShape('key');
    return shape.cloneNode();
  }
}
```

```js
// For G6 <= 5.0.49, the minimap custom shape function does not support the third parameter.
// You need to get the node element from the graph instance.
{
  type: 'minimap',
  shape: (id, elType) => {
    const element = graphRef.value.context.element;
    const target = element.getElement(id);
    if (elType === 'node' && target.constructor.name === 'VueNode') {
      return target;
    }
    const shape = target.getShape('key');
    return shape.cloneNode();
  }
}
```

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
