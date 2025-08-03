<template>
  <div :class="containerClass" :style="containerStyle">
    <div class="content">
      <BugOutlined
        v-if="nodeType === 'problem'"
        class="icon"
      />
      <span class="text">{{ nodeText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed ,onMounted,onUnmounted} from 'vue';
import { BugOutlined } from '@ant-design/icons-vue';
import type { NodeData } from '@antv/g6';

// 类型定义
interface NodeDataType {
  type: 'pre-inspection' | 'problem' | 'inspection' | 'solution';
  text: string;
}

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

// 计算属性 - 提取和缓存数据
const nodeData = computed(() => props.data.data as unknown as NodeDataType);
const isActive = computed(() => (props.data.states||[]).includes('active'));
const isSelected = computed(() => {
  return (props.data.states||[]).includes('selected')
});
const nodeType = computed(() => nodeData.value.type);
const nodeText = computed(() => nodeData.value.text);


// 计算属性 - 样式相关
const backgroundColor = computed(() =>
  isActive.value ? ACTIVE_COLOR : COLOR_MAP[nodeType.value]
);

const borderColor = computed(() => {
  if (isSelected.value) return '#000';
  return isActive.value ? ACTIVE_COLOR : COLOR_MAP[nodeType.value];
});

const containerClass = computed(() => ({
  'node-container': true,
  'node-active': isActive.value,
  'node-selected': isSelected.value,
}));

const containerStyle = computed(() => ({
  background: backgroundColor.value,
  borderColor: borderColor.value,
}));
</script>

<style scoped>
.node-container {
  width: 100%;
  height: 100%;
  border: 3px solid;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}

.node-container:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.content {
  padding: 8px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.icon {
  color: #fff;
  font-size: 24px;
  margin-bottom: 8px;
}

.text {
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.2;
}

/* 状态样式 */
.node-active {
  box-shadow: 0 0 0 2px rgba(246, 197, 35, 0.3);
}

.node-selected {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
}
</style>
