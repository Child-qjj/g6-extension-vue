<template>
  <Graph
    :options="{
      data: {
        nodes: [
          { id: 'node-1', style: { x: 100, y: 100, labelText: 'Hello' } },
          { id: 'node-2', style: { x: 300, y: 100, labelText: 'World' } },
        ],
        edges: [{ source: 'node-1', target: 'node-2' }],
      },
      behaviors: ['drag-element'],
    }"
    :on-render="() => console.log('render')"
    :on-destroy="() => console.log('destroy')"
  />
</template>

<script setup lang="ts">
import Graph from '@/components/graph-component.vue';
</script>
