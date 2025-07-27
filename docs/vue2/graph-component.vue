<template>
  <div
    ref="containerRef"
    style="width: 100%; height: 100%"
  />
</template>

<script>
import { Graph as G6Graph } from '@antv/g6';

export default {
  name: 'GraphComponent',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    onRender: {
      type: Function,
      default: null
    },
    onDestroy: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      graph: null
    };
  },
  watch: {
    options: {
      handler(options) {
        if (!options || !this.graph || this.graph.destroyed) return;
        this.graph.setOptions(options);
        this.graph
          .render()
          .then(() => this.onRender && this.onRender(this.graph))
          .catch((error) => console.debug(error));
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.destroy();
      this.onDestroy && this.onDestroy();
    }
  },
  mounted() {
    this.graph = new G6Graph({ container: this.$refs.containerRef });
    if (this.options) {
      this.graph.setOptions(this.options);
      this.graph
        .render()
        .then(() => this.onRender && this.onRender(this.graph))
        .catch((error) => console.debug(error));
    }
  }
};
</script>
