# G6 Extension Vue

[English](./README.md) | **中文**

[![NPM Package][npm]][npm-url] [![Build Size][build-size]][build-size-url] [![NPM Downloads][npm-downloads]][npmtrends-url]

一个用于在 G6 图可视化中使用 Vue 组件的扩展库。
参照 [`@antv/g6-extension-react`](https://www.npmjs.com/package/@antv/g6-extension-react) 实现。

## 特性

- 🎯 **Vue 节点支持**: 使用 Vue 组件作为 G6 节点
- 🔧 **Vue 2/3 兼容**: 同时支持 Vue 2 和 Vue 3
- 📦 **TypeScript 支持**: 完整的类型定义

## 使用方法

### 1. 安装

```bash
npm install g6-extension-vue
# 或
yarn add g6-extension-vue
# 或
pnpm add g6-extension-vue
```

### 2. 导入和注册

```js
import { onMounted, defineComponent } from 'vue';
import { VueNode } from 'g6-extension-vue';
import { ExtensionCategory, register } from '@antv/g6';

register(ExtensionCategory.NODE, 'vue', VueNode); // 或在 onMounted 中注册
```

### 3. 定义节点

Vue Composition API:

```tsx
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

Vue 函数式组件:

```tsx
export default function VueNode(props) {
  return <div class="vue-node">{props.data.label}</div>;
}
```

### 4. 使用节点

```ts
const graph = new Graph({
  // ... 其他选项
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={{ ...data }} />, // 非响应式对象需要新的对象引用来触发副作用
    },
  },
});
```

## 常见问题

### 1. 为什么 watch props 不起作用？（vue3）

VueNode 会在节点属性发生变化时刷新（悬停、点击、拖拽等）。
确保节点数据是响应式的，更新非响应式数据可以触发副作用。

#### ✅ 正确示例：

```ts
// 方法1：使用展开运算符创建新对象
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={{ ...data }} />, // 创建新对象
    },
  },
});

// 方法2：使用 Object.assign 创建新对象
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={Object.assign({}, data)} />, // 创建新对象
    },
  },
});
```

#### ❌ 错误示例：

```ts
// 错误：直接引用 - 不会触发响应式更新
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={data} />, // 直接引用
    },
  },
});

// 错误：嵌套属性直接引用
const graph = new Graph({
  node: {
    type: 'vue',
    style: {
      component: (data) => <VueNode data={data.data} />, // 直接嵌套引用
    },
  },
});
```

**重要说明：** 非响应式对象需要新的对象引用来触发副作用。当你传递相同的对象引用时，Vue 无法知道数据已经改变，因此不会重新渲染组件。

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm run test

# 代码检查
npm run lint
```

## 兼容性

- Vue 2.6+
- Vue 3.0+
- G6 5.0+

## 许可证

MIT License @Child-qjj

## 贡献

欢迎提交 Issue 和 Pull Request！

[npm]: https://img.shields.io/npm/v/g6-extension-vue.svg
[npm-url]: https://www.npmjs.com/package/g6-extension-vue
[build-size]: https://img.shields.io/bundlephobia/minzip/g6-extension-vue
[build-size-url]: https://bundlephobia.com/package/g6-extension-vue
[npm-downloads]: https://img.shields.io/npm/dm/g6-extension-vue.svg
[npmtrends-url]: https://npmtrends.com/g6-extension-vue
