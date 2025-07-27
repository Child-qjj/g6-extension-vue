<template>
  <Graph :options="options" key="PerformanceDiagnosis" />
</template>

<script>
import { ExtensionCategory, HoverActivate, idOf, register } from '@antv/g6';
import { VueNode } from 'g6-extension-vue';
import Graph from './graph-component.vue';
import PerformanceNode from './performance-node.vue';


const ACTIVE_COLOR = '#f6c523';

class HoverElement extends HoverActivate {
  getActiveIds(event) {
    const { model, graph } = this.context;
    const elementId = event.target.id;
    const { targetType: elementType } = event;

    const ids = [elementId];
    if (elementType === 'edge') {
      const edge = model.getEdgeDatum(elementId);
      ids.push(edge.source, edge.target);
    } else if (elementType === 'node') {
      ids.push(...model.getRelatedEdgesData(elementId).map(idOf));
    }

    graph.frontElement(ids);
    return ids;
  }
}

register(ExtensionCategory.BEHAVIOR, 'hover-element', HoverElement);
register(ExtensionCategory.NODE, 'vue', VueNode);

export default {
  name: 'PerformanceDiagnosis',
  components: {
    Graph
  },
  data() {
    return {
      data: null
    };
  },
  computed: {
    options() {
      return {
        data: this.data,
        animation: false,
        width: 800,
        height: 600,
        autoFit: 'view',
        node: {
          type: 'vue',
          style: (d) => {
            const style = {
              component: Vue.extend({
                render(h) {
                  return h(PerformanceNode, { props: { data: d } });
                }
              }),
              ports: [{ placement: 'top' }, { placement: 'bottom' }],
            };

            const size = {
              'pre-inspection': [240, 120],
              problem: [200, 120],
              inspection: [330, 100],
              solution: [200, 120],
            }[d.data.type] || [200, 80];

            Object.assign(style, {
              size,
              dx: -size[0] / 2,
              dy: -size[1] / 2,
            });
            return style;
          },
          state: {
            active: {
              halo: false,
            },
            selected: {
              halo: false,
            },
          },
        },
        edge: {
          type: 'polyline',
          style: {
            lineWidth: 3,
            radius: 20,
            stroke: '#8b9baf',
            endArrow: true,
            labelText: (d) => d.data.text,
            labelFill: '#8b9baf',
            labelFontWeight: 600,
            labelBackground: true,
            labelBackgroundFill: '#f8f8f8',
            labelBackgroundOpacity: 1,
            labelBackgroundLineWidth: 3,
            labelBackgroundStroke: '#8b9baf',
            labelPadding: [1, 10],
            labelBackgroundRadius: 4,
            router: {
              type: 'orth',
            },
          },
          state: {
            active: {
              stroke: ACTIVE_COLOR,
              labelBackgroundStroke: ACTIVE_COLOR,
              halo: false,
            },
          },
        },
        layout: {
          type: 'antv-dagre',
        },
        behaviors: ['zoom-canvas', 'drag-canvas', 'hover-element', 'click-select'],
      };
    }
  },
  mounted() {
    fetch('https://assets.antv.antgroup.com/g6/performance-diagnosis.json')
      .then((res) => res.json())
      .then((json) => {
        this.data = json;
      });
  },
  methods: {
    setData(json) {
      this.data = json;
    }
  }
};
</script>
