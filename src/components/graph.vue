<template>
  <div ref="containerRef" style="width: 100%; height: 100%" />
</template>

<script setup lang="ts">
import type { GraphOptions } from '@antv/g6';
import { Graph as G6Graph } from '@antv/g6';
import { onBeforeMount, onMounted, ref, watch } from 'vue-demi';

export interface GraphProps {
  options: GraphOptions;
  onRender?: (graph: G6Graph) => void;
  onDestroy?: () => void;
}

interface Props {
  options?: GraphOptions;
  onRender?: (graph: G6Graph) => void;
  onDestroy?: () => void;
}

const props = defineProps<Props>();

let graph: null | G6Graph = null;
const containerRef = ref<HTMLDivElement | null>(null);

onBeforeMount(() => {
  if (graph) {
    graph.destroy();
    props.onDestroy?.();
  }
});

onMounted(() => {
  graph = new G6Graph({ container: containerRef.value! });
  if (props.options) {
    graph.setOptions(props.options);
    graph
      .render()
      .then(() => props.onRender?.(graph))
      // eslint-disable-next-line no-console
      .catch((error) => console.debug(error));
  }
});

watch(
  () => props.options,
  (options) => {
    if (!options || !graph || graph?.destroyed) return;
    graph.setOptions(options);
    graph
      .render()
      .then(() => props.onRender?.(graph))
      // eslint-disable-next-line no-console
      .catch((error) => console.debug(error));
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>