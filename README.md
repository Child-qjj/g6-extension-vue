# G6 Extension Vue

一个用于在 G6 图可视化中使用 Vue 组件的扩展库，类似于 `@antv/g6-extension-react`。

## 特性

- 🎯 **Vue 节点支持**: 使用 Vue 组件作为 G6 节点
- 🔧 **Vue 2/3 兼容**: 同时支持 Vue 2 和 Vue 3
- 📦 **TypeScript 支持**: 完整的类型定义
- 🚀 **高性能**: 优化的渲染和更新机制

## 安装

```bash
npm install g6-extension-vue
# 或
yarn add g6-extension-vue
# 或
pnpm add g6-extension-vue
```

## 基础用法

### 1. Vue 节点 (VueNode)

使用 Vue 组件作为 G6 节点：

```vue
<template>
  <div>
    <Graph :options="options" />
  </div>
</template>

<script setup>
import { Graph } from '@antv/g6';
import { VueNode } from 'g6-extension-vue';
import { ExtensionCategory, register } from '@antv/g6';
import { h } from 'vue';

// 定义节点组件
const NodeComponent = ({ data }) => {
  return h('div', {
    style: {
      padding: '10px',
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
    }
  }, [
    h('h3', data.name),
    h('p', `Status: ${data.status}`)
  ]);
};

// 注册节点类型
register(ExtensionCategory.NODE, 'vue', VueNode);

const options = {
  data: {
    nodes: [
      {
        id: 'node1',
        data: { name: 'Node 1', status: 'active' },
        style: {
          component: NodeComponent,
          x: 100,
          y: 100,
        },
      },
    ],
  },
  node: {
    type: 'vue',
  },
};
</script>
```

## API 参考

### VueNode

用于渲染 Vue 组件的节点类型。

**属性:**
- `component`: Vue 组件或渲染函数
- 其他标准 G6 节点属性

### 工具函数

#### render(component, container, props?)

手动渲染 Vue 组件到指定容器。

**参数:**
- `component`: Vue 组件
- `container`: DOM 容器
- `props`: 组件属性

#### unmount(container)

卸载指定容器中的 Vue 组件。

**参数:**
- `container`: DOM 容器

## 示例

查看 `docs/examples/` 目录下的示例文件：

- `vue-node.vue`: Vue 节点示例
- `graph.vue`: 基础图示例

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

## 更新日志

### v0.0.1

- 初始版本发布
- 支持 VueNode
- Vue 2/3 兼容性支持
