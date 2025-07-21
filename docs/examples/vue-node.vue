<template>
  <Layout style="width: 100%; height: 800px">
    <Content style="height: 400px">
      <Graph :options="options" :on-render="(graph) => (graphRef = graph)" key="vue-node" />
    </Content>
    <Footer style="padding-bottom: 0;">
      <Form>
        <Form.Item label="Server Type" name="serverType">
          <Select
            :value="modelRef.serverType"
            @change="(e) => (modelRef.serverType = e as string)"
            :options="[
              { label: 'Local', value: 'local' },
              { label: 'Remote', value: 'remote' },
            ]"
          />
        </Form.Item>
        <Form.Item>
          <Button.Group>
            <Button style="width: 100%" type="primary" @click="onAddNode">
              Add Node
            </Button>
            <Button @click="onUpdateNode">Update Node</Button>
            <Button danger @click="onRemoveNode">
              Remove Node
            </Button>
          </Button.Group>
        </Form.Item>
      </Form>
      <Table
        :columns="[
          { title: 'Server', key: 'server', dataIndex: 'server' },
          { title: 'URL', key: 'url', dataIndex: 'url' },
        ]"
        :dataSource="(options.data?.nodes || []).map((node) => ({
          key: node.id,
          server: node.id,
          url: (node?.data as Datum).url || 'Not Configured',
        }))"
        :scroll="{ y: 124 }"
      />
    </Footer>
  </Layout>
</template>

<script setup lang="ts">
import type { Graph as G6Graph, GraphOptions, NodeData } from '@antv/g6';
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode as VueNodeExtension } from 'g6-extension-vue';
import { Button, Form, Layout, Select, Table } from 'ant-design-vue';
import { onMounted, reactive, ref, h } from 'vue-demi';
import Graph from '@/components/graph.vue';
import Node from './Node.vue';

type Datum = {
  id?: string;
  name?: string;
  status: 'success' | 'error' | 'warning';
  type: 'local' | 'remote';
  url?: string;
};

const isValidUrl = (url: string) => {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    url,
  );
};

const { Content, Footer } = Layout;

const graphRef = ref<G6Graph | null>(null);
const modelRef = reactive({ serverType: 'local' } as GraphOptions);

const options = ref({
  data: {
    nodes: [
      {
        id: 'local-server-1',
        data: { status: 'success', type: 'local', url: 'http://localhost:3000' },
        style: { x: 50, y: 50 },
      },
      {
        id: 'remote-server-1',
        data: { status: 'warning', type: 'remote' },
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
          data: data.data as Datum,
          onChange: (url) => {
            const getOption = (prev) => {
              if (!graphRef.value || graphRef.value.destroyed) return prev;
              const nodes = graphRef.value.getNodeData();
              const index = nodes.findIndex((node) => node.id === data.id);
              const node = nodes[index];
              const datum = {
                ...node.data,
                url,
                status: url === '' ? 'warning' : isValidUrl(url) ? 'success' : 'error',
              } as Datum;
              nodes[index] = { ...node, data: datum };
              return { ...prev, data: { ...prev.data, nodes } };
            };
            setOptions(getOption(options.value));
          },
        });
      },
    },
  },
  behaviors: ['drag-element', 'zoom-canvas', 'drag-canvas'],
});

const onAddNode = async () => {
  if (!graphRef.value || graphRef.value.destroyed) return;
  const type = modelRef.serverType;
  const status = 'warning';
  const length = (options.value.data?.nodes || []).filter((node) => node?.data?.type === type).length;
  const getOptions = (options) => ({
    ...options,
    data: {
      ...options.data,
      nodes: [
        ...graphRef.value!.getNodeData(),
        {
          id: `${type}-server-${length + 1}`,
          data: { type, status },
          style: { x: type === 'local' ? 50 : 350, y: 50 + length * 120 },
        },
      ],
    },
  });
  setOptions(getOptions(options.value));
};

const onUpdateNode = () => {
  const { data } = options.value;
  const nodes = data?.nodes || [];
  const getOption = (options) => ({
    ...options,
    data: {
      ...options.data,
      nodes: nodes.map((node, index) => {
        if (index === nodes.length - 1) {
          return {
            ...node,
            data: {
              ...node.data,
              status: node.data!.status === 'success' ? 'warning' : 'success',
            },
          };
        }
        return node;
      }),
    },
  });
  setOptions(getOption(options.value));
  graphRef.value?.draw();
};

const onRemoveNode = () => {
  const { data } = options.value;
  const nodes = data?.nodes || [];
  const getOption = (options) => ({
    ...options,
    data: {
      ...options.data,
      nodes: nodes.filter((node, index) => index !== nodes.length - 1),
    },
  });
  setOptions(getOption(options.value));
};

function setOptions(option: GraphOptions) {
  options.value = option;
}

onMounted(() => {
  register(ExtensionCategory.NODE, 'vue', VueNodeExtension);
});
</script>
