<template>
  <div>
    <Graph
      :options="graphOptions"
      :on-render="onGraphRender"
      style="width: 100%; height: 600px;"
    />
  </div>
</template>

<script setup>
import { computed,h } from 'vue';
import { register, ExtensionCategory } from '@antv/g6';
import { VueNode } from 'g6-extension-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Select,
  Space,
  Typography
} from 'ant-design-vue';
import Graph from './graph-component.vue';

const { Title, Text } = Typography;
const { Option } = Select;

// 注册Vue节点类型
register(ExtensionCategory.NODE, 'vue-node', VueNode);

let graph = null;

// 身份证卡片组件
const IDCardNode = (props) => {
  const { id, data } = props;
  const { name, idNumber, address, expanded, selected } = data;

  const toggleExpand = (e) => {
    e.stopPropagation();
    if (!graph) return;
    graph.updateNodeData([
      {
        id,
        data: { expanded: !expanded },
      },
    ]);
    graph.render();
  };

  const handleSelect = (value) => {
    if (!graph) return;
    graph.updateNodeData([
      {
        id,
        data: { selected: value !== 0 },
      },
    ]);
    if (value === 2) {
      // 获取与当前节点相连的所有节点
      const connectedNodes = graph.getNeighborNodesData(id);

      connectedNodes.forEach((node) => {
        graph.updateNodeData([
          {
            id: node.id,
            data: { selected: true },
          },
        ]);
      });
    }
    graph.render();
  };

  const CardTitle = h('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, [
    h(Space, {}, {
      default: () => [
        h(Avatar, {
          shape: 'square',
          size: 'small',
          icon: h(UserOutlined)
        }),
        h(Title, {
          level: 5,
          style: { margin: 0 }
        }, { default: () => name }),
        h(Select, {
          value: selected ? data.selectedOption || 1 : 0,
          style: { width: '150px', marginRight: '8px' },
          onChange: handleSelect
        }, {
          default: () => [
            h(Option, { value: 0 }, { default: () => 'None' }),
            h(Option, { value: 1 }, { default: () => 'Node' }),
            h(Option, { value: 2 }, { default: () => 'Connected' })
          ]
        })
      ]
    }),
    h(Button, {
      type: 'link',
      onClick: toggleExpand,
      style: { padding: 0 }
    }, { default: () => expanded ? 'fold' : 'expand' })
  ]);

  return h(Card, {
    size: 'small',
    title: CardTitle,
    style: {
      width: '340px',
      padding: '10px',
      borderRadius: '8px',
      borderWidth: '2px',
      borderColor: selected ? 'orange' : '#eee',
      cursor: 'pointer'
    }
  }, {
    default: () => [
      expanded
        ? h(Descriptions, {
            bordered: true,
            column: 1,
            style: { width: '100%', textAlign: 'center' }
          }, {
            default: () => [
              h(Descriptions.Item, { label: 'ID Number' }, { default: () => idNumber }),
              h(Descriptions.Item, { label: 'Address' }, { default: () => address })
            ]
          })
        : h(Text, { style: { textAlign: 'center' } }, { default: () => 'IDCard Information' })
    ]
  });
};

// 图形数据
const data = {
  nodes: [
    {
      id: 'node1',
      data: {
        name: 'Alice',
        idNumber: 'IDUSAASD2131734',
        address: '1234 Broadway, Apt 5B, New York, NY 10001',
        expanded: false,
        selected: false,
        selectedOption: 1
      },
      style: { x: 50, y: 50 }
    },
    {
      id: 'node2',
      data: {
        name: 'Bob',
        idNumber: 'IDUSAASD1431920',
        address: '3030 Chestnut St, Philadelphia, PA 19104',
        expanded: false,
        selected: false,
        selectedOption: 0
      },
      style: { x: 700, y: 100 }
    },
    {
      id: 'node3',
      data: {
        name: 'Charlie',
        idNumber: 'IDUSAASD1431921',
        address: '4040 Elm St, Chicago, IL 60611',
        expanded: false,
        selected: true,
        selectedOption: 0
      }
    },
    {
      id: 'node4',
      data: {
        name: 'David',
        idNumber: 'IDUSAASD1431922',
        address: '5050 Oak St, Houston, TX 77002',
        expanded: false,
        selected: false,
        selectedOption: 0
      }
    },
    {
      id: 'node5',
      data: {
        name: 'Eve',
        idNumber: 'IDUSAASD1431923',
        address: '6060 Pine St, Phoenix, AZ 85001',
        expanded: false,
        selected: false,
        selectedOption: 0
      }
    }
  ],
  edges: [
    { source: 'node1', target: 'node2' },
    { source: 'node2', target: 'node3' },
    { source: 'node3', target: 'node4' },
    { source: 'node4', target: 'node5' }
  ]
};

// 图形配置
const graphOptions = computed(() => ({
  autoFit: 'view',
  data,
  node: {
    type: 'vue-node',
    style: {
      size: (datum) => (datum.data.expanded ? [340, 236] : [340, 105]),
      component: (nodeData) => IDCardNode({ id: nodeData.id, data: Object.assign({}, nodeData.data) }) // 修改引用数据，触发组件更新
    }
  },
  behaviors: ['drag-element', 'zoom-canvas', 'drag-canvas'],
  layout: {
    type: 'snake',
    cols: 2,
    rowGap: 100,
    colGap: 220
  }
}));

// 图形渲染完成回调
const onGraphRender = (g6Graph) => {
  graph = g6Graph;
  console.log('Graph rendered successfully');
};
</script>

<style scoped>
/* 可以添加一些自定义样式 */
</style>
