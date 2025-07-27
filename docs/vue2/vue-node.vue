<template>
  <a-layout style="width: 100%; height: 800px">
    <a-layout-content style="height: 400px">
      <Graph :options="options" :on-render="onRender" key="vue-node" />
    </a-layout-content>
    <a-layout-footer style="padding-bottom: 0;">
      <a-form>
        <a-form-item label="Server Type" name="serverType">
          <a-select
            :value="modelRef.serverType"
            @change="onServerTypeChange"
            :options="[
              { label: 'Local', value: 'local' },
              { label: 'Remote', value: 'remote' },
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-button-group>
            <a-button style="width: 100%" type="primary" @click="onAddNode">
              Add Node
            </a-button>
            <a-button @click="onUpdateNode">Update Node</a-button>
            <a-button danger @click="onRemoveNode">
              Remove Node
            </a-button>
          </a-button-group>
        </a-form-item>
      </a-form>
      <a-table
        :columns="[
          { title: 'Server', key: 'server', dataIndex: 'server' },
          { title: 'URL', key: 'url', dataIndex: 'url' },
        ]"
        :dataSource="tableData"
        :scroll="{ y: 124 }"
      />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode as VueNodeExtension } from 'g6-extension-vue';
import { Button, Form, Layout, Select, Table } from 'ant-design-vue';
import Graph from './graph-component.vue';
import Node from './Node.vue';


function isValidUrl(url) {
  return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
    url,
  );
}

export default {
  name: 'VueNode',
  components: {
    Graph,
    'a-layout': Layout,
    'a-layout-content': Layout.Content,
    'a-layout-footer': Layout.Footer,
    'a-form': Form,
    'a-form-item': Form.Item,
    'a-select': Select,
    'a-button': Button,
    'a-button-group': Button.Group,
    'a-table': Table,
  },
  data() {
    return {
      graphRef: null,
      modelRef: { serverType: 'local' },
      options: {
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
            component: (data) => {
              return Vue.extend({
                render: (h) => {
                  return h(Node, {
                    props: {
                      data: data.data
                    },
                    on: {
                      change: (url) => {
                        this.handleUrlChange(data.id, url);
                      }
                    }
                  });
                }
              });
            },
          },
        },
        behaviors: ['drag-element', 'zoom-canvas', 'drag-canvas'],
      }
    };
  },
  computed: {
    tableData() {
      return (this.options.data?.nodes || []).map((node) => ({
        key: node.id,
        server: node.id,
        url: node.data?.url || 'Not Configured',
      }));
    }
  },
  mounted() {
    register(ExtensionCategory.NODE, 'vue', VueNodeExtension);
  },
  methods: {
    onRender(graph) {
      this.graphRef = graph;
    },
    onServerTypeChange(value) {
      this.modelRef.serverType = value;
    },
    handleUrlChange(nodeId, url) {
      if (!this.graphRef || this.graphRef.destroyed) return;
      const nodes = this.graphRef.getNodeData();
      const index = nodes.findIndex((node) => node.id === nodeId);
      const node = nodes[index];
      const datum = {
        ...node.data,
        url,
        status: url === '' ? 'warning' : isValidUrl(url) ? 'success' : 'error',
      };
      nodes[index] = { ...node, data: datum };
      this.setOptions({ ...this.options, data: { ...this.options.data, nodes } });
    },
    async onAddNode() {
      if (!this.graphRef || this.graphRef.destroyed) return;
      const type = this.modelRef.serverType;
      const status = 'warning';
      const length = (this.options.data?.nodes || []).filter((node) => node?.data?.type === type).length;
      const newOptions = {
        ...this.options,
        data: {
          ...this.options.data,
          nodes: [
            ...this.graphRef.getNodeData(),
            {
              id: `${type}-server-${length + 1}`,
              data: { type, status },
              style: { x: type === 'local' ? 50 : 350, y: 50 + length * 120 },
            },
          ],
        },
      };
      this.setOptions(newOptions);
    },
    onUpdateNode() {
      const { data } = this.options;
      const nodes = data?.nodes || [];
      const newOptions = {
        ...this.options,
        data: {
          ...this.options.data,
          nodes: nodes.map((node, index) => {
            if (index === nodes.length - 1) {
              return {
                ...node,
                data: {
                  ...node.data,
                  status: node.data.status === 'success' ? 'warning' : 'success',
                },
              };
            }
            return node;
          }),
        },
      };
      this.setOptions(newOptions);
      this.graphRef?.draw();
    },
    onRemoveNode() {
      const { data } = this.options;
      const nodes = data?.nodes || [];
      const newOptions = {
        ...this.options,
        data: {
          ...this.options.data,
          nodes: nodes.filter((node, index) => index !== nodes.length - 1),
        },
      };
      this.setOptions(newOptions);
    },
    setOptions(option) {
      this.options = option;
    }
  }
};
</script>
