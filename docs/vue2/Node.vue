<template>
  <a-flex :style="{ width: '100%', height: '100%', background: '#fff', padding: '10px', borderRadius: '5px' }" vertical>
    <a-flex align="center" justify="space-between">
      <a-typography-text>
        <database-filled />
        Server
        <a-tag>{{ localData.type }}</a-tag>
      </a-typography-text>
      <a-badge :status="localData.status" />
    </a-flex>
    <a-typography-text type="secondary">{{ data.id }}</a-typography-text>
    <a-flex align="center">
      <span style="flex-shrink: 0">
        <a-typography-text>
          <a-typography-text type="danger">*</a-typography-text>
          URL:
        </a-typography-text>
      </span>
      <a-input
        :style="{ borderRadius: 0, borderBottom: '1px solid #d9d9d9' }"
        :bordered="false"
        :value="data.url"
        @change="onChange"
      />
    </a-flex>
  </a-flex>
</template>

<script>
import { DatabaseFilled } from '@ant-design/icons-vue';
import { Badge, Flex, Input, Tag, Typography } from 'ant-design-vue';

export default {
  name: 'Node',
  components: {
    DatabaseFilled,
    'a-badge': Badge,
    'a-flex': Flex,
    'a-input': Input,
    'a-tag': Tag,
    'a-typography-text': Typography.Text,
  },
  props: {
    data: {
      type: Object,
      required: true,
      validator: function(value) {
        return value && typeof value.status === 'string' && typeof value.type === 'string';
      }
    }
  },
  data() {
    return {
      localData: this.data
    };
  },
  watch: {
    data: {
      handler(newData) {
        if (newData) {
          this.localData = newData;
        }
      },
      immediate: true
    }
  },
  methods: {
    onChange(event) {
      const url = event.target.value;
      this.$emit('change', url);
    }
  }
};
</script>
