<template>
  <div :style="{
    width: '100%',
    height: '100%',
    background: (data.states && data.states.includes('active') ? ACTIVE_COLOR : COLOR_MAP[data.data.type]),
    border: '3px solid ' + (data.states && data.states.includes('selected') ? '#000' : (data.states && data.states.includes('active') ? ACTIVE_COLOR : COLOR_MAP[data.data.type])),
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }">
    <div class="content">
      <bug-outlined v-if="data.data.type === 'problem'" :style="{ color: '#fff', fontSize: '24px', marginBottom: '8px' }" />
      <span :style="{ color: '#fff', fontWeight: 600, fontSize: '16px' }">{{ data.data.text }}</span>
    </div>
  </div>
</template>

<script>
import { BugOutlined } from '@ant-design/icons-vue';

const ACTIVE_COLOR = '#f6c523';
const COLOR_MAP = {
  'pre-inspection': '#3fc1c9',
  problem: '#8983f3',
  inspection: '#f48db4',
  solution: '#ffaa64',
};

export default {
  name: 'PerformanceNode',
  components: {
    BugOutlined
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ACTIVE_COLOR,
      COLOR_MAP
    };
  }
};
</script>

<style scoped>
.content {
  padding: 8px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
