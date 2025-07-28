# 身份证卡片节点

这个示例展示了如何使用 Vue 组件创建复杂的 G6 节点，包括：

- 使用 Ant Design Vue 组件库
- 节点状态管理（展开/收缩、选中状态）
- 节点间的交互（选择相邻节点）
- 动态样式更新

## 功能特性

1. **卡片展开/收缩**：点击"expand"/"fold"按钮可以展开或收缩节点内容
2. **选择模式**：
   - None：不选中任何节点
   - Node：只选中当前节点
   - Connected：选中当前节点及其所有相邻节点
3. **视觉反馈**：选中的节点会显示橙色边框
4. **响应式布局**：节点大小会根据内容自动调整

## 代码示例

<code src="./id-card-node.vue"></code>

## 关键实现

### Vue 组件定义

使用 Vue 的`h`函数创建虚拟 DOM，结合 Ant Design Vue 组件：

```javascript
const IDCardNode = (props) => {
  const { id, data } = props;
  const { name, idNumber, address, expanded, selected } = data;

  // 组件逻辑...

  return h(
    Card,
    {
      // 卡片属性
    },
    [
      // 卡片内容
    ],
  );
};
```

### 状态管理

通过 G6 的`updateNodeData`方法更新节点状态：

```javascript
const toggleExpand = (e) => {
  e.stopPropagation();
  graph.updateNodeData([
    {
      id,
      data: { expanded: !expanded },
    },
  ]);
  graph.render();
};
```

### 节点注册

```javascript
import { VueNode } from 'g6-extension-vue';
register(ExtensionCategory.NODE, 'vue-node', VueNode);
```

## 注意事项

1. 确保已安装`ant-design-vue`和`@ant-design/icons-vue`
2. 组件内部的事件处理需要调用`graph.render()`来更新视图
3. 使用`h`函数时注意属性和事件的正确绑定
4. 节点大小需要根据内容动态调整
