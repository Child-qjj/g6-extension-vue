<template>
  <div :style="{
    width: '100%',
    height: '100%',
    background: (props.data.states?.includes('active') ? ACTIVE_COLOR : COLOR_MAP[(props.data.data as any).type]),
    border: '3px solid ' + (props.data.states?.includes('selected') ? '#000' : (props.data.states?.includes('active') ? ACTIVE_COLOR : COLOR_MAP[(props.data.data as any).type])),
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }">
    <div class="content">
      <BugOutlined v-if="(props.data.data as any).type === 'problem'" :style="{ color: '#fff', fontSize: '24px', marginBottom: '8px' }" />
      <span :style="{ color: '#fff', fontWeight: 600, fontSize: '16px' }">{{ (props.data.data as any).text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BugOutlined } from '@ant-design/icons-vue';
import type { NodeData } from '@antv/g6';

const ACTIVE_COLOR = '#f6c523';
const COLOR_MAP: Record<string, string> = {
  'pre-inspection': '#3fc1c9',
  problem: '#8983f3',
  inspection: '#f48db4',
  solution: '#ffaa64',
};

const props = defineProps<{
  data: NodeData;
}>();
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
