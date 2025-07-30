<template>
  <Layout style="width: 100%; height: 800px">
    <Content style="height: 400px">
      <Graph :options="options" :on-render="handleGraphRender" key="vue-node" />
    </Content>
    <Footer style="padding-bottom: 0;">
      <Form :model="formModel" layout="vertical">
        <Form.Item label="Server Type" name="serverType">
          <Select
            v-model:value="formModel.serverType"
            :options="serverTypeOptions"
            style="width: 200px"
          />
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button
              style="width: 100%"
              type="primary"
              @click="handleAddNode"
              :disabled="!graphRef"
            >
              Add Node
            </Button>
            <Button
              @click="handleUpdateNode"
              :disabled="!graphRef || !hasNodes"
            >
              Update Node
            </Button>
            <Button
              danger
              @click="handleRemoveNode"
              :disabled="!graphRef || !hasNodes"
            >
              Remove Node
            </Button>
          </Button.Group>
        </Form.Item>
      </Form>

      <Table
        :columns="tableColumns"
        :dataSource="tableDataSource"
        :scroll="{ y: 124 }"
        size="small"
        :pagination="false"
      />
    </Footer>
  </Layout>
</template>

<script setup lang="ts">
import type { Graph as G6Graph, GraphOptions, NodeData } from '@antv/g6';
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode as VueNodeExtension } from 'g6-extension-vue';
import { Button, Form, Layout, Select, Table, message } from 'ant-design-vue';
import { onMounted, reactive, ref, computed, h, nextTick } from 'vue';
import Graph from './graph-component.vue';
import Node from './Node.vue';

// 类型定义
interface Datum {
  id?: string;
  name?: string;
  status: 'success' | 'error' | 'warning';
  type: 'local' | 'remote';
  url?: string;
}

interface ServerTypeOption {
  label: string;
  value: string;
}

interface TableColumn {
  title: string;
  key: string;
  dataIndex: string;
}

interface TableDataItem {
  key: string;
  server: string;
  url: string;
}

// 工具函数
const isValidUrl = (url: string): boolean => {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(url);
};

const { Content, Footer } = Layout;

// 响应式数据
const graphRef = ref<G6Graph | null>(null);
const formModel = reactive({
  serverType: 'local' as 'local' | 'remote'
});

// 常量配置
const serverTypeOptions: ServerTypeOption[] = [
  { label: 'Local', value: 'local' },
  { label: 'Remote', value: 'remote' },
];

const tableColumns: TableColumn[] = [
  { title: 'Server', key: 'server', dataIndex: 'server' },
  { title: 'URL', key: 'url', dataIndex: 'url' },
];

// 图配置
const options = ref<GraphOptions>({
  data: {
    nodes: [
      {
        id: 'local-server-1',
        data: {
          status: 'success',
          type: 'local',
          url: 'http://localhost:3000'
        } as Datum,
        style: { x: 50, y: 50 },
      },
      {
        id: 'remote-server-1',
        data: {
          status: 'warning',
          type: 'remote'
        } as Datum,
        style: { x: 350, y: 50 },
      },
    ],
    edges: [{ source: 'local-server-1', target: 'remote-server-1' }],
  },
  node: {
    type: 'vue',
    style: {
      size: [240, 100],
      component: (data: NodeData) => {
        return h(Node, {
          data: { ...data.data } as Datum,
          onChange: handleNodeChange(data),
        });
      },
    },
  },
  behaviors: ['drag-element', 'zoom-canvas', 'drag-canvas'],
});

// 计算属性
const hasNodes = computed(() => {
  return (options.value.data?.nodes || []).length > 0;
});

const tableDataSource = computed((): TableDataItem[] => {
  return (options.value.data?.nodes || []).map((node) => ({
    key: node.id!,
    server: node.id!,
    url: (node?.data as Datum)?.url || 'Not Configured',
  }));
});

// 事件处理函数
const handleGraphRender = (graph: G6Graph) => {
  graphRef.value = graph;
};

const handleNodeChange = (nodeData: NodeData) => {
  return (url: string) => {
    try {
      if (!graphRef.value || graphRef.value.destroyed) {
        console.warn('Graph is not available');
        return;
      }

      const nodes = graphRef.value.getNodeData();
      const nodeIndex = nodes.findIndex((node) => node.id === nodeData.id);

      if (nodeIndex === -1) {
        console.warn('Node not found');
        return;
      }

      const node = nodes[nodeIndex];
      const updatedDatum: Datum = {
        ...node.data as Datum,
        url,
        status: url === '' ? 'warning' : isValidUrl(url) ? 'success' : 'error',
      };

      nodes[nodeIndex] = { ...node, data: updatedDatum };

      updateOptions({
        ...options.value,
        data: {
          ...options.value.data!,
          nodes
        }
      });

    } catch (error) {
      console.error('Error updating node:', error);
      message.error('Failed to update node');
    }
  };
};

const handleAddNode = async () => {
  try {
    if (!graphRef.value || graphRef.value.destroyed) {
      message.warning('Graph is not ready');
      return;
    }

    const type = formModel.serverType;
    const status: Datum['status'] = 'warning';
    const existingNodes = options.value.data?.nodes || [];
    const sameTypeNodes = existingNodes.filter(
      (node) => (node?.data as Datum)?.type === type
    );
    const length = sameTypeNodes.length;

    const newNode = {
      id: `${type}-server-${length + 1}`,
      data: { type, status } as Datum,
      style: {
        x: type === 'local' ? 50 : 350,
        y: 50 + length * 120
      },
    };

    const currentNodes = graphRef.value.getNodeData();

    updateOptions({
      ...options.value,
      data: {
        ...options.value.data!,
        nodes: [...currentNodes, newNode],
      },
    });

    message.success(`Added ${type} server node`);

  } catch (error) {
    console.error('Error adding node:', error);
    message.error('Failed to add node');
  }
};

const handleUpdateNode = () => {
  try {
    const nodes = options.value.data?.nodes || [];

    if (nodes.length === 0) {
      message.warning('No nodes to update');
      return;
    }

    const updatedNodes = nodes.map((node, index) => {
      if (index === nodes.length - 1) {
        const currentData = node.data as Datum;
        return {
          ...node,
          data: {
            ...currentData,
            status: currentData.status === 'success' ? 'warning' : 'success',
          } as Datum,
        };
      }
      return node;
    });

    updateOptions({
      ...options.value,
      data: {
        ...options.value.data!,
        nodes: updatedNodes,
      },
    });

    nextTick(() => {
      graphRef.value?.draw();
    });

    message.success('Updated last node status');

  } catch (error) {
    console.error('Error updating node:', error);
    message.error('Failed to update node');
  }
};

const handleRemoveNode = () => {
  try {
    const nodes = options.value.data?.nodes || [];

    if (nodes.length === 0) {
      message.warning('No nodes to remove');
      return;
    }

    const filteredNodes = nodes.filter((_, index) => index !== nodes.length - 1);

    updateOptions({
      ...options.value,
      data: {
        ...options.value.data!,
        nodes: filteredNodes,
      },
    });

    message.success('Removed last node');

  } catch (error) {
    console.error('Error removing node:', error);
    message.error('Failed to remove node');
  }
};

const updateOptions = (newOptions: GraphOptions) => {
  options.value = newOptions;
};

// 生命周期
onMounted(() => {
  register(ExtensionCategory.NODE, 'vue', VueNodeExtension);
});
</script>

<style scoped>
.ant-layout {
  background: #fff;
}

.ant-layout-footer {
  background: #f5f5f5;
  border-top: 1px solid #d9d9d9;
}

.ant-btn-group {
  width: 100%;
}

.ant-btn-group .ant-btn {
  flex: 1;
}
</style>
