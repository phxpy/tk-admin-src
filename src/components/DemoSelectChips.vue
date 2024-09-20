<script setup>
import { defineProps, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  label: String,
  selectedItems: {
    type: Array,
    default: () => [],
  },
})

const selected = ref([...props.selectedItems])

onMounted(() => {
  selected.value = [...props.selectedItems]
})
</script>

<template>
  <AppSelect
    v-model="selected"
    :items="items"
    placeholder="Select Item(s)"
    :label="label"
    chips
    multiple
    closable-chips
  />
</template>
