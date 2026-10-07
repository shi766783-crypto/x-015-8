<script setup>
import { computed } from 'vue'
import { splitByQuery } from '../utils/search'

const props = defineProps({
  text: { type: [String, Number], default: '' },
  query: { type: String, default: '' },
  fallback: { type: String, default: '未填写' }
})

const segments = computed(() => splitByQuery(props.text, props.query))
</script>

<template>
  <template v-if="segments.length"><mark v-for="(seg, index) in segments" :key="index" :class="{ hit: seg.hit }">{{ seg.text }}</mark></template>
  <template v-else>{{ fallback }}</template>
</template>
