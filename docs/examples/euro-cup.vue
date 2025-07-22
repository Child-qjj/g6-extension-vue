<template>
  <Graph key="EuroCup" :options="options" style="height: 500px;"/>
</template>

<script setup lang="ts">
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode } from 'g6-extension-vue';
import data from '@/dataset/euro-cup.json';
import Graph from '@/components/graph-component.vue';
import PlayerNode from './playerNode.vue';
import { onMounted, ref,h } from 'vue';

const options = ref({
  data,
  animation: false,
  x: 10,
  y: 50,
  width: 480,
  height: 720,
  node: {
    type: 'vue',
    style: {
      size: [100, 60],
      ports: [{ placement: 'center' }],
      x: (d: any) => d.x * 3.5,
      y: (d: any) => d.y * 3.5,
      fill: 'transparent',
      component: (data: any) => h(PlayerNode, { playerInfo: data }),
    },
  },
  plugins: [
    {
      type: 'background',
      width: '480px',
      height: '720px',
      backgroundImage:
        'url(https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EmPXQLrX2xIAAAAAAAAAAAAADmJ7AQ/original)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      opacity: 1,
    },
  ],
})




onMounted(() => {
  register(ExtensionCategory.NODE, 'vue', VueNode);
})
</script>
