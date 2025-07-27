<template>
  <Graph key="EuroCup" :options="options" style="height: 500px;"/>
</template>

<script>
import { ExtensionCategory, register } from '@antv/g6';
import { VueNode } from 'g6-extension-vue';
import data from '../euro-cup.json';
import Graph from './graph-component.vue';
import PlayerNode from './playerNode.vue';


export default {
  name: 'EuroCup',
  components: {
    Graph
  },
  data() {
    return {
      options: {
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
            x: (d) => d.x * 3.5,
            y: (d) => d.y * 3.5,
            fill: 'transparent',
            component: (data) => {
              return Vue.extend({
                render(h) {
                  return h(PlayerNode, { props: { playerInfo: data } });
                }
              });
            },
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
      }
    };
  },
  mounted() {
    register(ExtensionCategory.NODE, 'vue', VueNode);
  }
};
</script>
