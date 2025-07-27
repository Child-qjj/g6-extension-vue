<template>
  <Graph
    :options="graphOptions"
    :on-render="onRender"
    :on-destroy="onDestroy"
  />
</template>

<script>
import Graph from './graph-component.vue';

export default {
  name: 'GraphExample',
  components: {
    Graph
  },
  data() {
    return {
      graphOptions: {
        data: {
          nodes: [
            { id: 'node-1', style: { x: 100, y: 100, labelText: 'Hello' } },
            { id: 'node-2', style: { x: 300, y: 100, labelText: 'World' } },
          ],
          edges: [{ source: 'node-1', target: 'node-2' }],
        },
        behaviors: ['drag-element'],
      }
    };
  },
  methods: {
    onRender() {
      console.log('render');
    },
    onDestroy() {
      console.log('destroy');
    }
  }
};
</script>
