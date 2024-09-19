<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  items: Array,
  label: String,
})

const selected = ref([])
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
