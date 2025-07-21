<script setup lang="ts">
import { DatabaseFilled } from '@ant-design/icons-vue';
import { Badge, Flex, Input, Tag, Typography } from 'ant-design-vue';
import { ref, watch } from 'vue-demi';

type Datum = {
  id?: string;
  name?: string;
  status: 'success' | 'error' | 'warning';
  type: 'local' | 'remote';
  url?: string;
};

const props = defineProps<{
  data: Datum;
}>();

const emit = defineEmits<{
  change: [url: string];
}>();

const { Text } = Typography;
const localData = ref(props.data);

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      localData.value = newData;
    }
  },
);

const onChange = (event: any) => {
  const url = event.target.value;
  emit('change', url);
};
</script>

<template>
  <Flex :style="{ width: '100%', height: '100%', background: '#fff', padding: '10px', borderRadius: '5px' }" vertical>
    <Flex align="center" justify="space-between">
      <Text>
        <DatabaseFilled />
        Server
        <Tag>{{ localData.type }}</Tag>
      </Text>
      <Badge :status="localData.status" />
    </Flex>
    <Text type="secondary">{{ (data as any)?.id }}</Text>
    <Flex align="center">
      <span style="flex-shrink: 0">
        <Text>
          <Text type="danger">*</Text>
          URL:
        </Text>
      </span>
      <Input :style="{ borderRadius: 0, borderBottom: '1px solid #d9d9d9' }" :bordered="false"
        :value="(data as Datum)?.url as string" @change="onChange" />
    </Flex>
  </Flex>
</template>
